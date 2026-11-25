// Schema constraints synchronized verbatim with firebase-blueprint.json & firestore.rules
export const ID_PATTERN = /^[a-zA-Z0-9_\-]+$/;
export const MAX_ID_LENGTH = 128;
export const MAX_DISPLAY_NAME_LENGTH = 100;
export const MAX_STAGE_INDEX = 20;
export const MAX_COMPLETED_CHECKS = 50;
export const MAX_CHECK_ID_LENGTH = 64;
export const MAX_QUIZ_COUNT = 10000;

export interface JourneyState {
  stageIndex: number;
  completedChecks: Record<string, boolean>;
}

export interface ItemProgress {
  r: number;
  w: number;
  last?: 0 | 1;
}

export interface QuizItemDocPayload {
  userId: string;
  itemId: string;
  rightCount: number;
  wrongCount: number;
  lastResult: 0 | 1;
}

/**
 * Converts a local quiz item ID (e.g., "01-Bayes:q0") into a Firestore-safe
 * document ID matching ^[a-zA-Z0-9_\-]+$ (max 128 chars).
 */
export function toFirestoreQuizItemId(localId: string): string {
  const converted = localId
    .replace(/:/g, '__')
    .replace(/[^a-zA-Z0-9_\-]/g, '_')
    .slice(0, MAX_ID_LENGTH);
  return converted.length > 0 ? converted : 'item';
}

/**
 * Reverses a Firestore quiz document ID (e.g., "01-Bayes__q0") back into
 * the local QuizTrainerView item ID ("01-Bayes:q0").
 */
export function fromFirestoreQuizItemId(docId: string): string {
  return docId.replace(/__/g, ':');
}

export function isValidFirestoreId(id: string): boolean {
  return id.length >= 1 && id.length <= MAX_ID_LENGTH && ID_PATTERN.test(id);
}

export function sanitizeDisplayName(name: string | null | undefined): string {
  const cleaned = (name ?? '').trim();
  return cleaned.slice(0, MAX_DISPLAY_NAME_LENGTH);
}

export function sanitizeStageIndex(stageIndex: number, stageCount: number): number {
  const upper = Math.min(Math.max(0, stageCount - 1), MAX_STAGE_INDEX);
  if (!Number.isFinite(stageIndex)) return 0;
  return Math.max(0, Math.min(upper, Math.trunc(stageIndex)));
}

export function sanitizeCompletedCheckIds(checks: Record<string, boolean>): string[] {
  const valid = Object.entries(checks)
    .filter(([, passed]) => passed === true)
    .map(([id]) => id.trim())
    .filter((id) => id.length >= 1 && id.length <= MAX_CHECK_ID_LENGTH && ID_PATTERN.test(id));
  return Array.from(new Set(valid)).sort().slice(0, MAX_COMPLETED_CHECKS);
}

export function completedIdsToMap(ids: unknown): Record<string, boolean> {
  if (!Array.isArray(ids)) return {};
  const map: Record<string, boolean> = {};
  for (const raw of ids) {
    if (
      typeof raw === 'string' &&
      raw.length >= 1 &&
      raw.length <= MAX_CHECK_ID_LENGTH &&
      ID_PATTERN.test(raw)
    ) {
      map[raw] = true;
    }
  }
  return map;
}

export function sanitizeQuizCounts(entry: ItemProgress): {
  rightCount: number;
  wrongCount: number;
  lastResult: 0 | 1;
} {
  const r = Number.isFinite(entry.r) ? Math.max(0, Math.min(MAX_QUIZ_COUNT, Math.trunc(entry.r))) : 0;
  const w = Number.isFinite(entry.w) ? Math.max(0, Math.min(MAX_QUIZ_COUNT, Math.trunc(entry.w))) : 0;
  const lastResult: 0 | 1 = entry.last === 0 ? 0 : 1;
  return { rightCount: r, wrongCount: w, lastResult };
}

/**
 * Merges local guest Lernreise progress with remote cloud progress on sign-in.
 * Preserves all passed checks from both devices and keeps the furthest stage reached.
 */
export function mergeJourneyState(
  local: JourneyState,
  remote: JourneyState | null,
  stageCount: number
): { merged: JourneyState; needsRemoteWrite: boolean } {
  const localIds = sanitizeCompletedCheckIds(local.completedChecks);
  const localStage = sanitizeStageIndex(local.stageIndex, stageCount);

  if (!remote) {
    return {
      merged: {
        stageIndex: localStage,
        completedChecks: completedIdsToMap(localIds),
      },
      needsRemoteWrite: true,
    };
  }

  const remoteIds = sanitizeCompletedCheckIds(remote.completedChecks);
  const remoteStage = sanitizeStageIndex(remote.stageIndex, stageCount);

  const mergedIds = Array.from(new Set([...remoteIds, ...localIds]))
    .sort()
    .slice(0, MAX_COMPLETED_CHECKS);
  const mergedStage = Math.max(localStage, remoteStage);

  const idsDiffer =
    mergedIds.length !== remoteIds.length ||
    mergedIds.some((id, idx) => id !== remoteIds[idx]);
  const needsRemoteWrite = idsDiffer || mergedStage !== remoteStage;

  return {
    merged: {
      stageIndex: mergedStage,
      completedChecks: completedIdsToMap(mergedIds),
    },
    needsRemoteWrite,
  };
}

/**
 * Merges local guest quiz progress with remote Firestore quiz records.
 * Returns the unified store and the exact list of local item IDs that must be
 * created or updated in Firestore.
 */
export function mergeQuizStores(
  local: Record<string, ItemProgress>,
  remote: Record<string, ItemProgress>
): { merged: Record<string, ItemProgress>; itemsToUpload: string[] } {
  const merged: Record<string, ItemProgress> = {};
  const itemsToUpload: string[] = [];

  const allKeys = new Set([...Object.keys(local), ...Object.keys(remote)]);
  for (const key of allKeys) {
    const l = local[key];
    const r = remote[key];

    if (l && !r) {
      const s = sanitizeQuizCounts(l);
      merged[key] = { r: s.rightCount, w: s.wrongCount, last: s.lastResult };
      itemsToUpload.push(key);
    } else if (!l && r) {
      const s = sanitizeQuizCounts(r);
      merged[key] = { r: s.rightCount, w: s.wrongCount, last: s.lastResult };
    } else if (l && r) {
      const sl = sanitizeQuizCounts(l);
      const sr = sanitizeQuizCounts(r);
      const nextR = Math.max(sl.rightCount, sr.rightCount);
      const nextW = Math.max(sl.wrongCount, sr.wrongCount);
      const nextLast: 0 | 1 =
        sl.rightCount + sl.wrongCount > sr.rightCount + sr.wrongCount
          ? sl.lastResult
          : sr.lastResult;

      merged[key] = { r: nextR, w: nextW, last: nextLast };
      if (nextR !== sr.rightCount || nextW !== sr.wrongCount || nextLast !== sr.lastResult) {
        itemsToUpload.push(key);
      }
    }
  }

  return { merged, itemsToUpload };
}

export function classifyAuthError(error: unknown): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code?: unknown }).code ?? '')
      : '';
  const message = error instanceof Error ? error.message : String(error);

  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
    return 'Anmeldefenster wurde geschlossen. Du kannst jederzeit erneut auf „Mit Google anmelden“ klicken.';
  }
  if (code === 'auth/popup-blocked') {
    return 'Dein Browser hat das Google-Anmeldefenster blockiert. Bitte erlaube Pop-ups für diese Seite und versuche es erneut.';
  }
  if (code === 'auth/unauthorized-domain') {
    return 'Diese Domain ist in Firebase Authentication noch nicht freigegeben. Füge sie in der Firebase Console unter Authentication → Settings → Authorized domains hinzu.';
  }
  if (code === 'auth/network-request-failed') {
    return 'Keine Internetverbindung für die Google-Anmeldung. Dein Fortschritt wird solange lokal gespeichert.';
  }
  if (message.includes('Quota exceeded')) {
    return 'Das tägliche kostenlose Datenbank-Kontingent wurde erreicht und wird morgen zurückgesetzt. Dein Fortschritt bleibt lokal im Browser erhalten.';
  }
  return 'Anmeldung fehlgeschlagen. Bitte versuche es in einem Moment erneut.';
}
