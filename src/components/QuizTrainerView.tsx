import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { QUIZ_DECKS } from '../data/quizData';
import { RichText } from './GlossaryTooltip';
import {
  QUIZ_STORAGE_KEY,
  useFirebaseProgress,
} from '../contexts/FirebaseProgressContext';
import { ItemProgress } from '../lib/progressSync';

type QuizMode = 'mc' | 'card' | 'wrong';

interface QuizItemBase {
  id: string;
  deck: string;
  deckTitel: string;
}

interface McItem extends QuizItemBase {
  type: 'mc';
  q: string;
  o: string[];
  a: number;
  e: string;
}

interface CardItem extends QuizItemBase {
  type: 'card';
  term: string;
  def: string;
}

type QuizItem = McItem | CardItem;

const STORAGE_KEY = QUIZ_STORAGE_KEY;

function shuffle<T>(arr: T[]): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const ALL_ITEMS: QuizItem[] = [];
QUIZ_DECKS.forEach((d) => {
  d.fragen.forEach((f, i) =>
    ALL_ITEMS.push({ type: 'mc', deck: d.id, deckTitel: d.titel, id: `${d.id}:q${i}`, ...f })
  );
  d.karten.forEach((k, i) =>
    ALL_ITEMS.push({
      type: 'card',
      deck: d.id,
      deckTitel: d.titel,
      id: `${d.id}:k${i}`,
      term: k[0],
      def: k[1],
    })
  );
});

interface QuizTrainerViewProps {
  initialDeckId?: string;
}

export const QuizTrainerView: React.FC<QuizTrainerViewProps> = ({ initialDeckId }) => {
  const {
    user,
    authBusy,
    signInWithGoogle,
    quizStore: store,
    markQuizItem,
    resetQuizProgress,
  } = useFirebaseProgress();

  const [deck, setDeck] = useState<string>(() => {
    if (initialDeckId) return initialDeckId;
    try {
      const ui = JSON.parse(localStorage.getItem(`${STORAGE_KEY}-ui`) || '{}');
      return ui.deck || 'all';
    } catch {
      return 'all';
    }
  });

  const [mode, setMode] = useState<QuizMode>(() => {
    try {
      const ui = JSON.parse(localStorage.getItem(`${STORAGE_KEY}-ui`) || '{}');
      return ui.mode || 'mc';
    } catch {
      return 'mc';
    }
  });

  useEffect(() => {
    if (initialDeckId) {
      setDeck(initialDeckId);
    }
  }, [initialDeckId]);

  const [queue, setQueue] = useState<QuizItem[]>([]);
  const [pos, setPos] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [cardRevealed, setCardRevealed] = useState(false);
  const [mcPicked, setMcPicked] = useState<number | null>(null);
  const [mcOrder, setMcOrder] = useState<number[]>([0, 1, 2, 3]);
  const [resetArmed, setResetArmed] = useState(false);

  const rebuildQueue = useCallback(
    (targetDeck: string, targetMode: QuizMode, currentStore: Record<string, ItemProgress>) => {
      let pool = ALL_ITEMS.filter((i) => targetDeck === 'all' || i.deck === targetDeck);
      if (targetMode === 'mc') pool = pool.filter((i) => i.type === 'mc');
      else if (targetMode === 'card') pool = pool.filter((i) => i.type === 'card');
      else pool = pool.filter((i) => currentStore[i.id]?.last === 0);

      setQueue(shuffle(pool));
      setPos(0);
      setScore(0);
      setAnswered(0);
      setCardRevealed(false);
      setMcPicked(null);

      try {
        localStorage.setItem(`${STORAGE_KEY}-ui`, JSON.stringify({ deck: targetDeck, mode: targetMode }));
      } catch {
        // ignore storage quota errors
      }
    },
    []
  );

  useEffect(() => {
    rebuildQueue(deck, mode, store);
    // Intentionally rebuild when deck or mode changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deck, mode]);

  const currentItem = queue[pos];

  useEffect(() => {
    if (currentItem && currentItem.type === 'mc') {
      setMcOrder(shuffle(currentItem.o.map((_, i) => i)));
      setMcPicked(null);
    }
    setCardRevealed(false);
  }, [pos, currentItem]);

  const markItem = (id: string, ok: boolean) => {
    markQuizItem(id, ok);
  };

  const overallStats = useMemo(() => {
    const mcs = ALL_ITEMS.filter((i) => i.type === 'mc');
    const seen = mcs.filter((i) => Boolean(store[i.id])).length;
    const good = mcs.filter((i) => store[i.id]?.last === 1).length;
    return { total: mcs.length, seen, good };
  }, [store]);

  const handleReset = () => {
    if (resetArmed) {
      setResetArmed(false);
      void resetQuizProgress();
      rebuildQueue(deck, mode, {});
    } else {
      setResetArmed(true);
      window.setTimeout(() => setResetArmed(false), 4000);
    }
  };

  const progressPct = queue.length ? (100 * pos) / queue.length : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#0E1E25] dark:text-white">
            Karten & Quiz-Trainer
          </h1>
          <p className="text-sm text-[#526771] dark:text-[#93AAB5] mt-0.5">
            Alle 99 Multiple-Choice-Fragen & 111 Karteikarten · mit aktivem Hover-Glossar
          </p>
        </div>
        <div className="font-mono text-xs text-[#4E626C] dark:text-[#96AEB9] tabular-nums">
          {overallStats.good}/{overallStats.total} Fragen zuletzt richtig · {overallStats.seen} gesehen
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-3">
        <div>
          <label
            htmlFor="quiz-deck-select"
            className="block text-xs font-semibold text-[#526771] dark:text-[#93AAB5] mb-1.5"
          >
            Thema
          </label>
          <select
            id="quiz-deck-select"
            value={deck}
            onChange={(e) => setDeck(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#CBD7DD] dark:border-[#2A3E48] bg-white dark:bg-[#131F26] text-[#111E24] dark:text-[#E6EFF3]"
          >
            <option value="all">Alle Themen gemischt</option>
            {QUIZ_DECKS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.id.slice(0, 2)} · {d.titel}
              </option>
            ))}
          </select>
        </div>

        <div
          className="inline-flex w-full sm:w-auto p-1 rounded-xl bg-[#EAF0F2] dark:bg-[#16232B] border border-[#DCE4E8] dark:border-[#24343E] gap-1"
          role="group"
          aria-label="Übungsmodus"
        >
          {(
            [
              { id: 'mc', label: 'Multiple Choice' },
              { id: 'card', label: 'Karteikarten' },
              { id: 'wrong', label: 'Fehler wiederholen' },
            ] as { id: QuizMode; label: string }[]
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={mode === m.id}
              onClick={() => setMode(m.id)}
              className={`flex-1 sm:flex-none px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                mode === m.id
                  ? 'bg-[#0F6B75] text-white shadow-xs'
                  : 'bg-transparent text-[#374E58] dark:text-[#A4BBC5] hover:bg-white/60 dark:hover:bg-[#1F313B] hover:text-[#0E1E25] dark:hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 rounded-full bg-[#DCE4E8] dark:bg-[#22333D] overflow-hidden" aria-hidden="true">
        <div
          className="h-full bg-[#0F6B75] dark:bg-[#46B3BE] transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Main Quiz Card */}
      <section
        aria-live="polite"
        className="rounded-2xl bg-white dark:bg-[#131F26] border border-[#DCE4E8] dark:border-[#24343E] p-5 sm:p-7 min-h-[280px] flex flex-col justify-between gap-5"
      >
        {!queue.length ? (
          <div className="my-auto text-center space-y-2 py-8">
            <p className="font-display font-semibold text-lg text-[#0E1E25] dark:text-white">
              {mode === 'wrong'
                ? 'Keine offenen Fehler in diesem Thema.'
                : 'Für dieses Thema gibt es hier keine Einträge.'}
            </p>
            {mode === 'wrong' && (
              <p className="text-sm text-[#526771] dark:text-[#93AAB5]">
                Beantworte erst Fragen im Modus „Multiple Choice“. Falsch beantwortete landen automatisch hier.
              </p>
            )}
          </div>
        ) : pos >= queue.length ? (
          <div className="my-auto text-center space-y-4 py-6">
            <div className="font-display font-bold text-4xl text-[#0F6B75] dark:text-[#5DC2CC] tabular-nums">
              {score} / {answered}
            </div>
            <p className="text-sm text-[#314650] dark:text-[#BFD1DA]">
              {answered && Math.round((100 * score) / answered) >= 80
                ? 'Sehr gut, das sitzt!'
                : answered && Math.round((100 * score) / answered) >= 50
                  ? 'Solide Basis. Wiederhole jetzt gezielt die Fehler.'
                  : 'Schau dir die passende Etappe in der Lernreise nochmal an und wiederhole die Fehler.'}
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => rebuildQueue(deck, mode, store)}
                className="px-4 py-2.5 text-sm font-semibold rounded-lg bg-[#0F6B75] text-white hover:bg-[#0B565E] cursor-pointer"
              >
                Nochmal mischen
              </button>
              <button
                type="button"
                onClick={() => setMode('wrong')}
                className="px-4 py-2.5 text-sm font-medium rounded-lg border border-[#CBD7DD] dark:border-[#2A3E48] hover:border-[#0F6B75] cursor-pointer"
              >
                Fehler wiederholen
              </button>
            </div>
          </div>
        ) : currentItem.type === 'card' ? (
          <>
            <div className="space-y-4">
              <div className="flex justify-between font-mono text-xs text-[#526771] dark:text-[#93AAB5] tabular-nums">
                <span>{currentItem.deckTitel}</span>
                <span>
                  {pos + 1} / {queue.length}
                </span>
              </div>

              <h2 className="font-display font-bold text-2xl text-[#0E1E25] dark:text-white">
                {currentItem.term}
              </h2>

              {cardRevealed && (
                <div className="pt-4 border-t border-dashed border-[#CBD7DD] dark:border-[#2A3E48] text-base leading-relaxed text-[#1F333D] dark:text-[#D5E3EA]">
                  <RichText text={currentItem.def} />
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {!cardRevealed ? (
                <button
                  type="button"
                  onClick={() => setCardRevealed(true)}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#0F6B75] hover:bg-[#0B565E] text-white font-semibold text-sm cursor-pointer"
                >
                  Antwort zeigen
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      markItem(currentItem.id, false);
                      setAnswered((a) => a + 1);
                      setQueue((q) => [...q, currentItem]);
                      setPos((p) => p + 1);
                    }}
                    className="flex-1 py-3 px-4 rounded-xl border border-[#C0392B] text-[#A82E22] dark:text-[#F49388] font-semibold text-sm hover:bg-[#FBEAE8] dark:hover:bg-[#351B18] cursor-pointer"
                  >
                    Nochmal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      markItem(currentItem.id, true);
                      setScore((s) => s + 1);
                      setAnswered((a) => a + 1);
                      setPos((p) => p + 1);
                    }}
                    className="flex-1 py-3 px-4 rounded-xl border border-[#0F7B4D] text-[#0E643E] dark:text-[#6CD6A1] font-semibold text-sm hover:bg-[#E3F4EC] dark:hover:bg-[#143025] cursor-pointer"
                  >
                    Gewusst
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div className="flex justify-between font-mono text-xs text-[#526771] dark:text-[#93AAB5] tabular-nums">
                <span>{currentItem.deckTitel}</span>
                <span>
                  {pos + 1} / {queue.length}
                </span>
              </div>

              <p className="font-semibold text-lg text-[#0E1E25] dark:text-white leading-snug">
                <RichText text={currentItem.q} />
              </p>

              <div className="grid gap-2.5">
                {mcOrder.map((origIdx, letterIdx) => {
                  const isPicked = mcPicked === origIdx;
                  const isRight = origIdx === currentItem.a;
                  let cls =
                    'bg-[#F7F9FA] dark:bg-[#192830] border-[#DCE4E8] dark:border-[#273A44] hover:border-[#0F6B75]';
                  if (mcPicked !== null) {
                    if (isRight) {
                      cls = 'bg-[#E3F4EC] dark:bg-[#143025] border-[#0F7B4D] text-[#0C5534] dark:text-[#7CE0AD]';
                    } else if (isPicked) {
                      cls = 'bg-[#FBEAE8] dark:bg-[#381B18] border-[#C0392B] text-[#8E241A] dark:text-[#F49388]';
                    }
                  }

                  return (
                    <button
                      key={origIdx}
                      type="button"
                      disabled={mcPicked !== null}
                      onClick={() => {
                        const ok = origIdx === currentItem.a;
                        setMcPicked(origIdx);
                        markItem(currentItem.id, ok);
                        setAnswered((a) => a + 1);
                        if (ok) setScore((s) => s + 1);
                      }}
                      className={`text-left px-4 py-3 rounded-xl border text-sm flex items-start gap-3 transition-colors disabled:cursor-default cursor-pointer ${cls}`}
                    >
                      <span className="font-mono font-bold text-[#0F6B75] dark:text-[#5DC2CC] shrink-0">
                        {'ABCD'[letterIdx]}
                      </span>
                      <span className="leading-snug">{currentItem.o[origIdx]}</span>
                    </button>
                  );
                })}
              </div>

              {mcPicked !== null && (
                <div className="space-y-3 pt-1">
                  <div className="rounded-xl bg-[#E8F3F5] dark:bg-[#152E34] border border-[#C4DEE1] dark:border-[#244A52] p-3.5 text-sm leading-relaxed text-[#143139] dark:text-[#D1E6EC]">
                    <strong className="font-display font-bold">
                      {mcPicked === currentItem.a ? 'Richtig. ' : 'Falsch. '}
                    </strong>
                    <RichText text={currentItem.e} />
                  </div>
                  <button
                    type="button"
                    onClick={() => setPos((p) => p + 1)}
                    className="w-full py-3 px-4 rounded-xl bg-[#0F6B75] hover:bg-[#0B565E] text-white font-semibold text-sm cursor-pointer"
                  >
                    Weiter
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#526771] dark:text-[#93AAB5]">
        <span>
          {user ? (
            'Cloud-Sync aktiv · Dein Quiz-Fortschritt wird automatisch zwischen Handy & Computer abgeglichen.'
          ) : (
            <>
              Lokal im Browser gespeichert.{' '}
              <button
                type="button"
                disabled={authBusy}
                onClick={() => void signInWithGoogle()}
                className="text-[#0F6B75] dark:text-[#5DC2CC] font-semibold underline hover:no-underline cursor-pointer disabled:opacity-60"
              >
                Mit Google anmelden
              </button>{' '}
              für Synchronisierung zwischen Geräten.
            </>
          )}
        </span>
        <button
          type="button"
          onClick={handleReset}
          className="text-[#0F6B75] dark:text-[#5DC2CC] underline hover:no-underline cursor-pointer"
        >
          {resetArmed ? 'Wirklich löschen? Nochmal tippen' : 'Quiz-Fortschritt zurücksetzen'}
        </button>
      </div>
    </div>
  );
};
