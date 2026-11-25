import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import { JOURNEY_STAGES } from '../data/journeyData';
import {
  ItemProgress,
  JourneyState,
  classifyAuthError,
  completedIdsToMap,
  fromFirestoreQuizItemId,
  mergeJourneyState,
  mergeQuizStores,
  sanitizeCompletedCheckIds,
  sanitizeDisplayName,
  sanitizeQuizCounts,
  sanitizeStageIndex,
  toFirestoreQuizItemId,
} from '../lib/progressSync';

export const JOURNEY_STORAGE_KEY = 'da-journey-v1';
export const QUIZ_STORAGE_KEY = 'da-quiz-v1';

export type SyncStatus = 'local' | 'syncing' | 'synced' | 'error';

interface FirebaseProgressContextValue {
  user: User | null;
  authReady: boolean;
  authBusy: boolean;
  authError: string | null;
  clearAuthError: () => void;
  syncStatus: SyncStatus;
  journey: JourneyState;
  quizStore: Record<string, ItemProgress>;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  selectStage: (index: number) => void;
  markCheckPassed: (checkId: string) => void;
  markQuizItem: (localItemId: string, ok: boolean) => void;
  resetQuizProgress: () => Promise<void>;
}

const FirebaseProgressContext = createContext<FirebaseProgressContextValue | null>(null);

function loadLocalJourney(): JourneyState {
  try {
    const parsed = JSON.parse(localStorage.getItem(JOURNEY_STORAGE_KEY) || '{}');
    return {
      stageIndex: sanitizeStageIndex(
        typeof parsed.stageIndex === 'number' ? parsed.stageIndex : 0,
        JOURNEY_STAGES.length
      ),
      completedChecks:
        parsed && typeof parsed.completedChecks === 'object' && parsed.completedChecks !== null
          ? completedIdsToMap(
              Object.keys(parsed.completedChecks).filter((k) => parsed.completedChecks[k] === true)
            )
          : {},
    };
  } catch {
    return { stageIndex: 0, completedChecks: {} };
  }
}

function loadLocalQuizStore(): Record<string, ItemProgress> {
  try {
    const parsed = JSON.parse(localStorage.getItem(QUIZ_STORAGE_KEY) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveLocalJourney(state: JourneyState) {
  try {
    localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage quota issues
  }
}

function saveLocalQuizStore(store: Record<string, ItemProgress>) {
  try {
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore storage quota issues
  }
}

export const FirebaseProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('local');
  const [fatalError, setFatalError] = useState<Error | null>(null);

  const [journey, setJourney] = useState<JourneyState>(loadLocalJourney);
  const [quizStore, setQuizStore] = useState<Record<string, ItemProgress>>(loadLocalQuizStore);

  const journeyRef = useRef<JourneyState>(journey);
  const quizStoreRef = useRef<Record<string, ItemProgress>>(quizStore);
  const profileReadyUidRef = useRef<string | null>(null);
  const journeyDocExistsRef = useRef<boolean>(false);
  const knownQuizDocIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    journeyRef.current = journey;
    saveLocalJourney(journey);
  }, [journey]);

  useEffect(() => {
    quizStoreRef.current = quizStore;
    saveLocalQuizStore(quizStore);
  }, [quizStore]);

  // Surface critical Firestore errors to the React ErrorBoundary
  if (fatalError) {
    throw fatalError;
  }

  const surfaceFirestoreFailure = useCallback((err: unknown) => {
    setSyncStatus('error');
    const errObj = err instanceof Error ? err : new Error(String(err));
    if (errObj.message.includes('Quota exceeded')) {
      setFatalError(errObj);
    } else {
      setAuthError(
        'Cloud-Synchronisierung aktuell nicht erreichbar. Dein Fortschritt wird solange lokal gespeichert.'
      );
    }
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthReady(true);
      if (!nextUser) {
        profileReadyUidRef.current = null;
        journeyDocExistsRef.current = false;
        knownQuizDocIdsRef.current = new Set();
        setSyncStatus('local');
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Attach Firestore sync & real-time listeners only when authenticated
  useEffect(() => {
    if (!authReady || !user) return;

    let cancelled = false;
    let unsubJourney: (() => void) | null = null;
    let unsubQuiz: (() => void) | null = null;

    const uid = user.uid;
    const userPath = `users/${uid}`;
    const journeyPath = `users/${uid}/progress/journey`;
    const quizCollectionPath = `users/${uid}/quizItems`;

    const bootstrapAndListen = async () => {
      setSyncStatus('syncing');
      try {
        // 1. Ensure parent user profile exists (satisfies Master Gate)
        const userRef = doc(db, 'users', uid);
        let userSnap;
        try {
          userSnap = await getDoc(userRef);
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, userPath);
        }

        const safeName = sanitizeDisplayName(user.displayName);
        if (!userSnap.exists()) {
          try {
            await setDoc(userRef, {
              uid,
              displayName: safeName,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          } catch (error) {
            handleFirestoreError(error, OperationType.CREATE, userPath);
          }
        } else if (userSnap.data().displayName !== safeName) {
          try {
            await updateDoc(userRef, {
              displayName: safeName,
              updatedAt: serverTimestamp(),
            });
          } catch (error) {
            handleFirestoreError(error, OperationType.UPDATE, userPath);
          }
        }

        if (cancelled) return;
        profileReadyUidRef.current = uid;

        // 2. Initial read & merge for Journey progress
        const journeyRefDoc = doc(db, 'users', uid, 'progress', 'journey');
        let journeySnap;
        try {
          journeySnap = await getDoc(journeyRefDoc);
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, journeyPath);
        }

        if (cancelled) return;

        const remoteJourney: JourneyState | null = journeySnap.exists()
          ? {
              stageIndex: sanitizeStageIndex(
                Number(journeySnap.data().stageIndex ?? 0),
                JOURNEY_STAGES.length
              ),
              completedChecks: completedIdsToMap(journeySnap.data().completedCheckIds),
            }
          : null;

        journeyDocExistsRef.current = journeySnap.exists();

        const { merged: mergedJourney, needsRemoteWrite } = mergeJourneyState(
          journeyRef.current,
          remoteJourney,
          JOURNEY_STAGES.length
        );
        setJourney(mergedJourney);

        if (needsRemoteWrite) {
          const checkIds = sanitizeCompletedCheckIds(mergedJourney.completedChecks);
          if (!journeySnap.exists()) {
            try {
              await setDoc(journeyRefDoc, {
                userId: uid,
                stageIndex: mergedJourney.stageIndex,
                completedCheckIds: checkIds,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              });
              journeyDocExistsRef.current = true;
            } catch (error) {
              handleFirestoreError(error, OperationType.CREATE, journeyPath);
            }
          } else {
            try {
              await updateDoc(journeyRefDoc, {
                stageIndex: mergedJourney.stageIndex,
                completedCheckIds: checkIds,
                updatedAt: serverTimestamp(),
              });
            } catch (error) {
              handleFirestoreError(error, OperationType.UPDATE, journeyPath);
            }
          }
        }

        if (cancelled) return;

        // 3. Initial read & merge for Quiz items (strict Pillar 8 query)
        const quizQuery = query(
          collection(db, 'users', uid, 'quizItems'),
          where('userId', '==', uid)
        );
        let quizSnaps;
        try {
          quizSnaps = await getDocs(quizQuery);
        } catch (error) {
          handleFirestoreError(error, OperationType.LIST, quizCollectionPath);
        }

        if (cancelled) return;

        const remoteQuiz: Record<string, ItemProgress> = {};
        const knownIds = new Set<string>();
        quizSnaps.forEach((docSnap) => {
          knownIds.add(docSnap.id);
          const data = docSnap.data();
          const localId = fromFirestoreQuizItemId(docSnap.id);
          remoteQuiz[localId] = {
            r: Number(data.rightCount ?? 0),
            w: Number(data.wrongCount ?? 0),
            last: data.lastResult === 0 ? 0 : 1,
          };
        });
        knownQuizDocIdsRef.current = knownIds;

        const { merged: mergedQuiz, itemsToUpload } = mergeQuizStores(
          quizStoreRef.current,
          remoteQuiz
        );
        setQuizStore(mergedQuiz);

        // Upload any local-only or newer guest quiz items in batches of 400
        if (itemsToUpload.length > 0) {
          const chunkSize = 400;
          for (let i = 0; i < itemsToUpload.length; i += chunkSize) {
            const chunk = itemsToUpload.slice(i, i + chunkSize);
            const batch = writeBatch(db);
            for (const localId of chunk) {
              const docId = toFirestoreQuizItemId(localId);
              const itemRef = doc(db, 'users', uid, 'quizItems', docId);
              const counts = sanitizeQuizCounts(mergedQuiz[localId]);
              if (knownIds.has(docId)) {
                batch.update(itemRef, {
                  rightCount: counts.rightCount,
                  wrongCount: counts.wrongCount,
                  lastResult: counts.lastResult,
                  updatedAt: serverTimestamp(),
                });
              } else {
                batch.set(itemRef, {
                  userId: uid,
                  itemId: docId,
                  rightCount: counts.rightCount,
                  wrongCount: counts.wrongCount,
                  lastResult: counts.lastResult,
                  createdAt: serverTimestamp(),
                  updatedAt: serverTimestamp(),
                });
                knownIds.add(docId);
              }
            }
            try {
              await batch.commit();
            } catch (error) {
              handleFirestoreError(error, OperationType.WRITE, quizCollectionPath);
            }
          }
          knownQuizDocIdsRef.current = knownIds;
        }

        if (cancelled) return;

        // 4. Attach real-time listeners for live multi-device sync (phone <-> PC)
        unsubJourney = onSnapshot(
          journeyRefDoc,
          (snap) => {
            if (!snap.exists()) {
              journeyDocExistsRef.current = false;
              return;
            }
            journeyDocExistsRef.current = true;
            const data = snap.data();
            const nextState: JourneyState = {
              stageIndex: sanitizeStageIndex(
                Number(data.stageIndex ?? 0),
                JOURNEY_STAGES.length
              ),
              completedChecks: completedIdsToMap(data.completedCheckIds),
            };
            setJourney((prev) => {
              const prevIds = sanitizeCompletedCheckIds(prev.completedChecks).join(',');
              const nextIds = sanitizeCompletedCheckIds(nextState.completedChecks).join(',');
              if (prev.stageIndex === nextState.stageIndex && prevIds === nextIds) {
                return prev;
              }
              return nextState;
            });
            setSyncStatus('synced');
          },
          (error) => {
            try {
              handleFirestoreError(error, OperationType.GET, journeyPath);
            } catch (wrapped) {
              surfaceFirestoreFailure(wrapped);
            }
          }
        );

        unsubQuiz = onSnapshot(
          quizQuery,
          (snap) => {
            const nextStore: Record<string, ItemProgress> = {};
            const nextIds = new Set<string>();
            snap.forEach((docSnap) => {
              nextIds.add(docSnap.id);
              const data = docSnap.data();
              const localId = fromFirestoreQuizItemId(docSnap.id);
              nextStore[localId] = {
                r: Number(data.rightCount ?? 0),
                w: Number(data.wrongCount ?? 0),
                last: data.lastResult === 0 ? 0 : 1,
              };
            });
            knownQuizDocIdsRef.current = nextIds;
            setQuizStore(nextStore);
            setSyncStatus('synced');
          },
          (error) => {
            try {
              handleFirestoreError(error, OperationType.LIST, quizCollectionPath);
            } catch (wrapped) {
              surfaceFirestoreFailure(wrapped);
            }
          }
        );

        setSyncStatus('synced');
      } catch (err) {
        if (!cancelled) {
          surfaceFirestoreFailure(err);
        }
      }
    };

    void bootstrapAndListen();

    return () => {
      cancelled = true;
      if (unsubJourney) unsubJourney();
      if (unsubQuiz) unsubQuiz();
    };
  }, [authReady, user, surfaceFirestoreFailure]);

  const signInWithGoogle = useCallback(async () => {
    setAuthBusy(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      setAuthError(classifyAuthError(error));
    } finally {
      setAuthBusy(false);
    }
  }, []);

  const signOutUser = useCallback(async () => {
    setAuthBusy(true);
    setAuthError(null);
    try {
      await signOut(auth);
    } catch (error) {
      setAuthError(classifyAuthError(error));
    } finally {
      setAuthBusy(false);
    }
  }, []);

  const persistJourneyUpdate = useCallback(
    async (
      nextState: JourneyState,
      changedFields: 'stageIndex' | 'completedCheckIds'
    ) => {
      const currentUser = auth.currentUser;
      if (!currentUser || profileReadyUidRef.current !== currentUser.uid) return;

      const uid = currentUser.uid;
      const journeyPath = `users/${uid}/progress/journey`;
      const journeyRefDoc = doc(db, 'users', uid, 'progress', 'journey');
      const safeStage = sanitizeStageIndex(nextState.stageIndex, JOURNEY_STAGES.length);
      const safeChecks = sanitizeCompletedCheckIds(nextState.completedChecks);

      setSyncStatus('syncing');
      try {
        if (!journeyDocExistsRef.current) {
          try {
            await setDoc(journeyRefDoc, {
              userId: uid,
              stageIndex: safeStage,
              completedCheckIds: safeChecks,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
            journeyDocExistsRef.current = true;
          } catch (error) {
            handleFirestoreError(error, OperationType.CREATE, journeyPath);
          }
        } else if (changedFields === 'stageIndex') {
          try {
            await updateDoc(journeyRefDoc, {
              stageIndex: safeStage,
              updatedAt: serverTimestamp(),
            });
          } catch (error) {
            handleFirestoreError(error, OperationType.UPDATE, journeyPath);
          }
        } else {
          try {
            await updateDoc(journeyRefDoc, {
              completedCheckIds: safeChecks,
              updatedAt: serverTimestamp(),
            });
          } catch (error) {
            handleFirestoreError(error, OperationType.UPDATE, journeyPath);
          }
        }
        setSyncStatus('synced');
      } catch (err) {
        surfaceFirestoreFailure(err);
      }
    },
    [surfaceFirestoreFailure]
  );

  const selectStage = useCallback(
    (index: number) => {
      const safeIdx = sanitizeStageIndex(index, JOURNEY_STAGES.length);
      const nextState: JourneyState = {
        ...journeyRef.current,
        stageIndex: safeIdx,
      };
      setJourney(nextState);
      void persistJourneyUpdate(nextState, 'stageIndex');
    },
    [persistJourneyUpdate]
  );

  const markCheckPassed = useCallback(
    (checkId: string) => {
      const nextState: JourneyState = {
        ...journeyRef.current,
        completedChecks: {
          ...journeyRef.current.completedChecks,
          [checkId]: true,
        },
      };
      setJourney(nextState);
      void persistJourneyUpdate(nextState, 'completedCheckIds');
    },
    [persistJourneyUpdate]
  );

  const markQuizItem = useCallback(
    (localItemId: string, ok: boolean) => {
      const prevEntry = quizStoreRef.current[localItemId] || { r: 0, w: 0 };
      const nextEntry: ItemProgress = {
        r: ok ? prevEntry.r + 1 : prevEntry.r,
        w: ok ? prevEntry.w : prevEntry.w + 1,
        last: ok ? 1 : 0,
      };
      const sanitized = sanitizeQuizCounts(nextEntry);
      const cleanEntry: ItemProgress = {
        r: sanitized.rightCount,
        w: sanitized.wrongCount,
        last: sanitized.lastResult,
      };

      setQuizStore((prev) => ({
        ...prev,
        [localItemId]: cleanEntry,
      }));

      const currentUser = auth.currentUser;
      if (!currentUser || profileReadyUidRef.current !== currentUser.uid) return;

      const uid = currentUser.uid;
      const docId = toFirestoreQuizItemId(localItemId);
      const itemPath = `users/${uid}/quizItems/${docId}`;
      const itemRef = doc(db, 'users', uid, 'quizItems', docId);

      setSyncStatus('syncing');
      const writeOp = async () => {
        try {
          if (knownQuizDocIdsRef.current.has(docId)) {
            try {
              await updateDoc(itemRef, {
                rightCount: sanitized.rightCount,
                wrongCount: sanitized.wrongCount,
                lastResult: sanitized.lastResult,
                updatedAt: serverTimestamp(),
              });
            } catch (error) {
              handleFirestoreError(error, OperationType.UPDATE, itemPath);
            }
          } else {
            try {
              await setDoc(itemRef, {
                userId: uid,
                itemId: docId,
                rightCount: sanitized.rightCount,
                wrongCount: sanitized.wrongCount,
                lastResult: sanitized.lastResult,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              });
              knownQuizDocIdsRef.current.add(docId);
            } catch (error) {
              handleFirestoreError(error, OperationType.CREATE, itemPath);
            }
          }
          setSyncStatus('synced');
        } catch (err) {
          surfaceFirestoreFailure(err);
        }
      };

      void writeOp();
    },
    [surfaceFirestoreFailure]
  );

  const resetQuizProgress = useCallback(async () => {
    setQuizStore({});
    saveLocalQuizStore({});

    const currentUser = auth.currentUser;
    if (!currentUser || profileReadyUidRef.current !== currentUser.uid) return;

    const uid = currentUser.uid;
    const quizCollectionPath = `users/${uid}/quizItems`;
    const docIds = Array.from(knownQuizDocIdsRef.current);
    if (docIds.length === 0) return;

    setSyncStatus('syncing');
    try {
      const chunkSize = 400;
      for (let i = 0; i < docIds.length; i += chunkSize) {
        const chunk = docIds.slice(i, i + chunkSize);
        const batch = writeBatch(db);
        for (const docId of chunk) {
          batch.delete(doc(db, 'users', uid, 'quizItems', docId));
        }
        try {
          await batch.commit();
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, quizCollectionPath);
        }
      }
      knownQuizDocIdsRef.current = new Set();
      setSyncStatus('synced');
    } catch (err) {
      surfaceFirestoreFailure(err);
    }
  }, [surfaceFirestoreFailure]);

  const clearAuthError = useCallback(() => setAuthError(null), []);

  return (
    <FirebaseProgressContext.Provider
      value={{
        user,
        authReady,
        authBusy,
        authError,
        clearAuthError,
        syncStatus,
        journey,
        quizStore,
        signInWithGoogle,
        signOutUser,
        selectStage,
        markCheckPassed,
        markQuizItem,
        resetQuizProgress,
      }}
    >
      {children}
    </FirebaseProgressContext.Provider>
  );
};

export function useFirebaseProgress(): FirebaseProgressContextValue {
  const ctx = useContext(FirebaseProgressContext);
  if (!ctx) {
    throw new Error('useFirebaseProgress must be used within FirebaseProgressProvider');
  }
  return ctx;
}
