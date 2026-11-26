import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  Compass,
  Check,
  X,
  Cloud,
} from 'lucide-react';
import { BASICS_MODULES, BasicsModule } from '../data/basicsData';
import { BasicsVisual } from './labs/BasicsVisuals';
import { useFirebaseProgress } from '../contexts/FirebaseProgressContext';
import { countCompletedBasicsModules } from '../lib/basicsHelpers';

interface BasicsViewProps {
  completedChecks: Record<string, boolean>;
  onMarkCheckPassed: (checkId: string) => void;
  onJumpToJourneyStage: (stageIndex: number) => void;
}

export const BasicsView: React.FC<BasicsViewProps> = ({
  completedChecks,
  onMarkCheckPassed,
  onJumpToJourneyStage,
}) => {
  const { user, authBusy, signInWithGoogle } = useFirebaseProgress();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  const mod: BasicsModule = BASICS_MODULES[activeIndex] ?? BASICS_MODULES[0];

  useEffect(() => {
    setSelectedAnswers({});
  }, [mod.id]);

  const isModuleCompleted = (m: BasicsModule) =>
    m.checks.every((c) => Boolean(completedChecks[c.id]));

  const completedCount = countCompletedBasicsModules(completedChecks);
  const modDone = isModuleCompleted(mod);

  const handleSelectModule = (idx: number) => {
    const safe = Math.max(0, Math.min(BASICS_MODULES.length - 1, idx));
    setActiveIndex(safe);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswer = (checkId: string, optionIdx: number, correctIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [checkId]: optionIdx }));
    if (optionIdx === correctIdx) {
      onMarkCheckPassed(checkId);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Mobile module selector */}
      <div className="lg:hidden mb-5">
        <label
          htmlFor="mobile-basics-select"
          className="block text-xs font-medium text-[#526771] dark:text-[#93AAB5] mb-1.5"
        >
          Grundbegriffe-Modul wählen ({completedCount} / {BASICS_MODULES.length} verstanden)
        </label>
        <select
          id="mobile-basics-select"
          value={activeIndex}
          onChange={(e) => handleSelectModule(Number(e.target.value))}
          className="w-full px-3 py-2.5 text-sm font-medium rounded-lg border border-[#CBD7DD] dark:border-[#2A3E48] bg-white dark:bg-[#131F26] text-[#111E24] dark:text-[#E6EFF3]"
        >
          {BASICS_MODULES.map((m, idx) => (
            <option key={m.id} value={idx}>
              {isModuleCompleted(m) ? '✓ ' : ''}
              {m.number}. {m.shortTitle}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar: 8 Zero-Prerequisite Modules */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-20 space-y-5">
          <div>
            <div className="text-xs font-medium text-[#526771] dark:text-[#93AAB5]">
              Bei Null starten · Ohne Vorwissen
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-display font-bold text-sm text-[#0E1E25] dark:text-white">
                Grundbegriffe
              </span>
              <span className="font-mono text-xs text-[#0F6B75] dark:text-[#5DC2CC] font-semibold tabular-nums">
                {completedCount} / {BASICS_MODULES.length}
              </span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-[#DCE4E8] dark:bg-[#22333D] overflow-hidden">
              <div
                className="h-full bg-[#0F6B75] dark:bg-[#46B3BE] transition-all duration-300"
                style={{ width: `${(completedCount / BASICS_MODULES.length) * 100}%` }}
              />
            </div>
          </div>

          <nav aria-label="Module der Grundbegriffe" className="space-y-1">
            {BASICS_MODULES.map((m, idx) => {
              const active = idx === activeIndex;
              const done = isModuleCompleted(m);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleSelectModule(idx)}
                  aria-current={active ? 'step' : undefined}
                  className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0F6B75] ${
                    active
                      ? 'bg-[#E6F3F5] dark:bg-[#143037] text-[#0A4E56] dark:text-[#7CD5DF] font-semibold'
                      : 'text-[#314650] dark:text-[#A9BFC9] hover:bg-[#EDF3F5] dark:hover:bg-[#15232B]'
                  }`}
                >
                  {done ? (
                    <CheckCircle2
                      className="w-4 h-4 text-[#0F7B4D] dark:text-[#5DD49B] shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <Circle
                      className={`w-4 h-4 shrink-0 ${
                        active ? 'text-[#0F6B75] dark:text-[#5DC2CC]' : 'text-[#9CB0BA] dark:text-[#475E6B]'
                      }`}
                      aria-hidden="true"
                    />
                  )}
                  <span className="font-mono text-xs opacity-70 tabular-nums shrink-0">{m.number}</span>
                  <span className="text-sm truncate">{m.shortTitle}</span>
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-[#DCE4E8] dark:border-[#22323B] space-y-3">
            <div className="rounded-xl bg-white dark:bg-[#131F26] border border-[#DCE4E8] dark:border-[#24343E] p-3 text-xs space-y-2">
              {user ? (
                <div className="flex items-start gap-2 text-[#0F7B4D] dark:text-[#5DD49B]">
                  <Cloud className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="leading-relaxed text-[#253B45] dark:text-[#BFD1DA]">
                    <strong className="font-semibold text-[#0E1E25] dark:text-white">
                      Cloud-Sync aktiv:
                    </strong>{' '}
                    Auch deine abgehakten Grundbegriffe sind auf allen Geräten synchron.
                  </span>
                </div>
              ) : (
                <>
                  <p className="text-[#4E626C] dark:text-[#96AEB9] leading-relaxed">
                    Fortschritt am Handy & PC sichern? Melde dich einfach mit Google an.
                  </p>
                  <button
                    type="button"
                    disabled={authBusy}
                    onClick={() => void signInWithGoogle()}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-[#0F6B75] hover:bg-[#0B565E] text-white font-semibold text-xs transition-colors cursor-pointer disabled:opacity-60"
                  >
                    Mit Google anmelden
                  </button>
                </>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-9 space-y-8 min-w-0">
          {/* Header & Everyday Story */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#526771] dark:text-[#93AAB5]">
              <span className="font-mono font-semibold text-[#0F6B75] dark:text-[#5DC2CC]">
                Modul {mod.number} von {BASICS_MODULES.length}
              </span>
              <span aria-hidden="true">·</span>
              <span>Bei Null starten (ohne Vorkenntnisse)</span>
              <span aria-hidden="true">·</span>
              <span>{mod.duration}</span>
              {modDone && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-[#0F7B4D] dark:text-[#5DD49B]">
                    ✓ Verstanden
                  </span>
                </>
              )}
            </div>

            <h1
              className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-[#0D1E26] dark:text-white leading-tight max-w-3xl"
              style={{ textWrap: 'balance' }}
            >
              {mod.title}
            </h1>

            <p className="text-sm sm:text-base text-[#4E626C] dark:text-[#9CB3BE] max-w-[70ch]">
              {mod.subtitle}
            </p>

            <div className="rounded-xl bg-white dark:bg-[#131F26] border border-[#DCE4E8] dark:border-[#24343E] p-4 sm:p-5 text-[15.5px] leading-[1.7] text-[#1E333D] dark:text-[#D1E1E8]">
              <strong className="font-semibold text-[#0F6B75] dark:text-[#5DC2CC]">
                Alltagsbild:{' '}
              </strong>
              {mod.everydayStory}
            </div>
          </section>

          {/* Section 1: Interactive Everyday Visual */}
          <section className="space-y-3">
            <div>
              <h2 className="font-display font-bold text-lg text-[#0E1E25] dark:text-white">
                {mod.visualTitle}
              </h2>
              <p className="text-sm text-[#4E626C] dark:text-[#96AEB9] mt-0.5">{mod.visualHint}</p>
            </div>
            <div className="rounded-2xl bg-white dark:bg-[#131F26] border border-[#DCE4E8] dark:border-[#24343E] p-4 sm:p-6">
              <BasicsVisual visualId={mod.visualId} />
            </div>
          </section>

          <hr className="border-[#DCE4E8] dark:border-[#22323B]" />

          {/* Section 2: Zero-Jargon Term Deck */}
          <section className="space-y-4">
            <div>
              <h2 className="font-display font-bold text-lg text-[#0E1E25] dark:text-white">
                Die Begriffe dieses Moduls – Schritt für Schritt erklärt
              </h2>
              <p className="text-sm text-[#4E626C] dark:text-[#96AEB9] mt-0.5">
                Lies erst den einfachen Satz und das Alltagsbild – dann ergibt der Fachbegriff im Kurs sofort Sinn.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mod.terms.map((item) => (
                <article
                  key={item.term}
                  className="rounded-xl bg-white dark:bg-[#131F26] border border-[#DCE4E8] dark:border-[#24343E] p-4 sm:p-5 flex flex-col justify-between gap-3.5"
                >
                  <div className="space-y-2.5">
                    <h3 className="font-display font-bold text-base text-[#0F6B75] dark:text-[#5DC2CC]">
                      {item.term}
                    </h3>
                    <p className="text-sm font-medium text-[#0E1E25] dark:text-white leading-relaxed">
                      {item.oneLiner}
                    </p>
                    <p className="text-[13.5px] text-[#354B55] dark:text-[#B9CDD6] leading-relaxed">
                      <span className="font-semibold text-[#1E333D] dark:text-[#DDEAEF]">
                        Im Alltag:{' '}
                      </span>
                      {item.everydayExample}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-[#E6EEF1] dark:border-[#22323B] text-xs text-[#4E626C] dark:text-[#96AEB9] leading-relaxed">
                    <span className="font-semibold text-[#2A3F49] dark:text-[#C5D8E0]">
                      Im Kurs:{' '}
                    </span>
                    {item.courseConnection}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <hr className="border-[#DCE4E8] dark:border-[#22323B]" />

          {/* Section 3: Everyday Intuition Check */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h2 className="font-display font-bold text-lg text-[#0E1E25] dark:text-white">
                  Kurz-Check: Hast du das Gefühl dafür bekommen?
                </h2>
                <p className="text-sm text-[#4E626C] dark:text-[#96AEB9] mt-0.5">
                  Beide Alltagsfragen lösen, um Modul {mod.number} als verstanden abzuhaken.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onJumpToJourneyStage(mod.targetJourneyStageIndex)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F6B75] dark:text-[#5DC2CC] hover:underline cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" aria-hidden="true" />
                {mod.targetJourneyLabel} →
              </button>
            </div>

            <div className="space-y-4">
              {mod.checks.map((check, cIdx) => {
                const picked = selectedAnswers[check.id];
                const alreadyPassed = Boolean(completedChecks[check.id]);
                const answered = picked !== undefined;
                const isRight = picked === check.correctIndex;

                return (
                  <div
                    key={check.id}
                    className="rounded-xl bg-white dark:bg-[#131F26] border border-[#DCE4E8] dark:border-[#24343E] p-4 sm:p-5 space-y-3.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium text-[15px] text-[#0E1E25] dark:text-white leading-snug">
                        <span className="font-mono text-xs text-[#0F6B75] dark:text-[#5DC2CC] mr-2">
                          Frage {cIdx + 1}
                        </span>
                        {check.prompt}
                      </p>
                      {alreadyPassed && (
                        <span className="font-mono text-xs font-semibold text-[#0F7B4D] dark:text-[#5DD49B] whitespace-nowrap shrink-0">
                          ✓ Verstanden
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {check.options.map((opt, oIdx) => {
                        const isPicked = picked === oIdx;
                        const isCorrectOpt = oIdx === check.correctIndex;
                        let optClass =
                          'bg-[#F7F9FA] dark:bg-[#192830] border-[#DCE4E8] dark:border-[#273A44] text-[#1D303A] dark:text-[#D5E3EA] hover:border-[#0F6B75]';
                        if (answered) {
                          if (isCorrectOpt) {
                            optClass =
                              'bg-[#E3F4EC] dark:bg-[#143025] border-[#0F7B4D] text-[#0C5534] dark:text-[#7CE0AD] font-medium';
                          } else if (isPicked && !isCorrectOpt) {
                            optClass =
                              'bg-[#FBEAE8] dark:bg-[#381B18] border-[#C0392B] text-[#8E241A] dark:text-[#F49388]';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => handleAnswer(check.id, oIdx, check.correctIndex)}
                            className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-sm flex items-start gap-2.5 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0F6B75] ${optClass}`}
                          >
                            <span className="font-mono text-xs font-bold mt-0.5 shrink-0">
                              {'ABCD'[oIdx]}
                            </span>
                            <span className="leading-snug">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {answered && (
                      <div
                        className={`rounded-lg p-3 text-sm leading-relaxed flex items-start gap-2 ${
                          isRight
                            ? 'bg-[#E6F4EE] dark:bg-[#132C22] text-[#0E5736] dark:text-[#8BE0B5]'
                            : 'bg-[#FBECEB] dark:bg-[#331A17] text-[#8C241A] dark:text-[#F4A298]'
                        }`}
                      >
                        {isRight ? (
                          <Check className="w-4 h-4 shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-4 h-4 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <strong className="font-semibold">
                            {isRight ? 'Genau richtig! ' : 'Kein Problem – '}
                          </strong>
                          {check.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Bottom Navigation */}
          <div className="pt-4 border-t border-[#DCE4E8] dark:border-[#22323B] flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              disabled={activeIndex === 0}
              onClick={() => handleSelectModule(activeIndex - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-lg border border-[#CBD7DD] dark:border-[#2A3E48] bg-white dark:bg-[#131F26] text-[#1F333D] dark:text-[#D5E3EA] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#0F6B75] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Vorheriges Modul
            </button>

            {activeIndex < BASICS_MODULES.length - 1 ? (
              <button
                type="button"
                onClick={() => handleSelectModule(activeIndex + 1)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-lg bg-[#0F6B75] hover:bg-[#0B565E] text-white transition-colors cursor-pointer"
              >
                Weiter zu Modul {BASICS_MODULES[activeIndex + 1].number}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onJumpToJourneyStage(0)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-lg bg-[#0F7B4D] hover:bg-[#0B5D3A] text-white transition-colors cursor-pointer"
              >
                Jetzt bereit für die NovaChip-Lernreise
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
