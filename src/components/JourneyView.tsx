import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  ChevronLeft,
  Terminal,
  BookOpenCheck,
  Sparkles,
  Check,
  X,
  Cloud,
} from 'lucide-react';
import { JOURNEY_STAGES, JourneyStage, LabId } from '../data/journeyData';
import { RichText } from './GlossaryTooltip';
import { useFirebaseProgress } from '../contexts/FirebaseProgressContext';
import {
  BayesLab,
  DiagnosticsLab,
  LinearCenteringLab,
  PredictionCostLab,
  SimpsonCausalLab,
} from './labs/FoundationLabs';
import {
  EffectSizeLab,
  InteractionNonlinearLab,
  LogisticCutoffLab,
  LooCompareLab,
  SplitDriftLab,
} from './labs/AdvancedLabs';

function renderLab(labId: LabId) {
  switch (labId) {
    case 'bayes':
      return <BayesLab />;
    case 'linear-centering':
      return <LinearCenteringLab />;
    case 'diagnostics':
      return <DiagnosticsLab />;
    case 'prediction-cost':
      return <PredictionCostLab />;
    case 'simpson-causal':
      return <SimpsonCausalLab />;
    case 'effectsize':
      return <EffectSizeLab />;
    case 'interaction-nonlinear':
      return <InteractionNonlinearLab />;
    case 'loo-compare':
      return <LooCompareLab />;
    case 'logistic-cutoff':
      return <LogisticCutoffLab />;
    case 'split-drift':
      return <SplitDriftLab />;
  }
}

interface JourneyViewProps {
  activeStageIndex: number;
  onSelectStage: (index: number) => void;
  completedChecks: Record<string, boolean>;
  onMarkCheckPassed: (checkId: string) => void;
  onOpenQuizDeck: (deckId: string) => void;
}

export const JourneyView: React.FC<JourneyViewProps> = ({
  activeStageIndex,
  onSelectStage,
  completedChecks,
  onMarkCheckPassed,
  onOpenQuizDeck,
}) => {
  const { user, authBusy, signInWithGoogle } = useFirebaseProgress();
  const stage: JourneyStage = JOURNEY_STAGES[activeStageIndex] ?? JOURNEY_STAGES[0];
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    setSelectedAnswers({});
  }, [stage.id]);

  const isStageCompleted = (s: JourneyStage) =>
    s.checks.every((c) => Boolean(completedChecks[c.id]));

  const completedCount = JOURNEY_STAGES.filter(isStageCompleted).length;
  const stageDone = isStageCompleted(stage);

  const handleAnswer = (checkId: string, optionIdx: number, correctIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [checkId]: optionIdx }));
    if (optionIdx === correctIdx) {
      onMarkCheckPassed(checkId);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Mobile stage selector */}
      <div className="lg:hidden mb-5">
        <label
          htmlFor="mobile-stage-select"
          className="block text-xs font-medium text-[#526771] dark:text-[#93AAB5] mb-1.5"
        >
          Etappe wählen ({completedCount} / {JOURNEY_STAGES.length} abgeschlossen)
        </label>
        <select
          id="mobile-stage-select"
          value={activeStageIndex}
          onChange={(e) => onSelectStage(Number(e.target.value))}
          className="w-full px-3 py-2.5 text-sm font-medium rounded-lg border border-[#CBD7DD] dark:border-[#2A3E48] bg-white dark:bg-[#131F26] text-[#111E24] dark:text-[#E6EFF3]"
        >
          {JOURNEY_STAGES.map((s, idx) => (
            <option key={s.id} value={idx}>
              {isStageCompleted(s) ? '✓ ' : ''}
              {s.number}. {s.shortTitle}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar: 10-Stage Journey Map (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-20 space-y-5">
          <div>
            <div className="text-xs font-medium text-[#526771] dark:text-[#93AAB5]">
              Fallbeispiel NovaChip · Von Null zur Klausur
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-display font-bold text-sm text-[#0E1E25] dark:text-white">
                Dein Fortschritt
              </span>
              <span className="font-mono text-xs text-[#0F6B75] dark:text-[#5DC2CC] font-semibold tabular-nums">
                {completedCount} / {JOURNEY_STAGES.length}
              </span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-[#DCE4E8] dark:bg-[#22333D] overflow-hidden">
              <div
                className="h-full bg-[#0F6B75] dark:bg-[#46B3BE] transition-all duration-300"
                style={{ width: `${(completedCount / JOURNEY_STAGES.length) * 100}%` }}
              />
            </div>
          </div>

          <nav aria-label="Etappen der Lernreise" className="space-y-1">
            {JOURNEY_STAGES.map((s, idx) => {
              const active = idx === activeStageIndex;
              const done = isStageCompleted(s);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSelectStage(idx)}
                  aria-current={active ? 'step' : undefined}
                  className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0F6B75] ${
                    active
                      ? 'bg-[#E6F3F5] dark:bg-[#143037] text-[#0A4E56] dark:text-[#7CD5DF] font-semibold'
                      : 'text-[#314650] dark:text-[#A9BFC9] hover:bg-[#EDF3F5] dark:hover:bg-[#15232B]'
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="w-4 h-4 text-[#0F7B4D] dark:text-[#5DD49B] shrink-0" aria-hidden="true" />
                  ) : (
                    <Circle
                      className={`w-4 h-4 shrink-0 ${
                        active ? 'text-[#0F6B75] dark:text-[#5DC2CC]' : 'text-[#9CB0BA] dark:text-[#475E6B]'
                      }`}
                      aria-hidden="true"
                    />
                  )}
                  <span className="font-mono text-xs opacity-70 tabular-nums shrink-0">{s.number}</span>
                  <span className="text-sm truncate">{s.shortTitle}</span>
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
                    Dein Fortschritt bleibt auf Handy & Computer synchron.
                  </span>
                </div>
              ) : (
                <>
                  <p className="text-[#4E626C] dark:text-[#96AEB9] leading-relaxed">
                    Am Handy & Computer weiterlernen? Melde dich mit Google an, um deinen Fortschritt
                    dauerhaft zu sichern.
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

            <div className="text-xs text-[#526771] dark:text-[#93AAB5] leading-relaxed">
              Tipp für Einsteiger: Fahre mit der Maus (oder tippe mobil) auf{' '}
              <span className="border-b border-dotted border-[#0F6B75] text-[#0B5A63] dark:text-[#66C7D1] font-medium">
                gepunktete Fachbegriffe
              </span>
              , um sofort die einfache Erklärung zu sehen.
            </div>
          </div>
        </aside>

        {/* Main Content Stage */}
        <main className="lg:col-span-9 space-y-8 min-w-0">
          {/* Header & Narrative Lead */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#526771] dark:text-[#93AAB5]">
              <span className="font-mono font-semibold text-[#0F6B75] dark:text-[#5DC2CC]">
                Etappe {stage.number} von {JOURNEY_STAGES.length}
              </span>
              <span aria-hidden="true">·</span>
              <span>{stage.chapterRef}</span>
              <span aria-hidden="true">·</span>
              <span>{stage.examWeight}</span>
              <span aria-hidden="true">·</span>
              <span>{stage.duration}</span>
              {stageDone && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-[#0F7B4D] dark:text-[#5DD49B]">
                    ✓ Abgeschlossen
                  </span>
                </>
              )}
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-[#0D1E26] dark:text-white leading-tight">
              {stage.title}
            </h1>

            <p className="text-base text-[#1E333D] dark:text-[#D1E1E8] leading-relaxed bg-white dark:bg-[#131F26] border border-[#DCE4E8] dark:border-[#24343E] rounded-xl p-4 sm:p-5">
              <strong className="font-semibold text-[#0F6B75] dark:text-[#5DC2CC]">Fallbeispiel NovaChip: </strong>
              <RichText text={stage.storyLead} />
            </p>
          </section>

          {/* Section 1: Plain-German Greenhorn Explanation */}
          <section className="space-y-4">
            <h2 className="font-display font-bold text-lg text-[#0E1E25] dark:text-white">
              Einfach erklärt – ohne Statistik-Chinesisch
            </h2>
            <div className="space-y-3 text-[15.5px] leading-[1.7] text-[#22343D] dark:text-[#CEE0E7] max-w-[74ch]">
              {stage.plainExplanation.map((para, i) => (
                <p key={i}>
                  <RichText text={para} />
                </p>
              ))}
            </div>

            <div className="pt-2">
              <div className="text-xs font-semibold text-[#526771] dark:text-[#93AAB5] mb-2">
                Das Wichtigste zum Mitnehmen
              </div>
              <ul className="space-y-2 text-sm text-[#1F333D] dark:text-[#D5E3EA]">
                {stage.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="font-mono text-xs font-bold text-[#0F6B75] dark:text-[#5DC2CC] mt-0.5 shrink-0">
                      0{idx + 1}
                    </span>
                    <span className="leading-relaxed">
                      <RichText text={point} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <hr className="border-[#DCE4E8] dark:border-[#22323B]" />

          {/* Section 2: Interactive Hands-On Laboratory */}
          <section className="space-y-4">
            <div>
              <h2 className="font-display font-bold text-lg text-[#0E1E25] dark:text-white">
                Selber ausprobieren: {stage.labTitle}
              </h2>
              <p className="text-sm text-[#4E626C] dark:text-[#96AEB9] mt-1">
                <RichText text={stage.labInstruction} />
              </p>
            </div>

            <div className="rounded-2xl bg-white dark:bg-[#131F26] border border-[#DCE4E8] dark:border-[#24343E] p-4 sm:p-6">
              {renderLab(stage.labId)}
            </div>
          </section>

          <hr className="border-[#DCE4E8] dark:border-[#22323B]" />

          {/* Section 3: R Output & Exam Phrasing Rules */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-display font-bold text-[#0E1E25] dark:text-white">
                <Terminal className="w-4 h-4 text-[#0F6B75] dark:text-[#5DC2CC]" aria-hidden="true" />
                <span>{stage.rOutputTitle}</span>
              </div>
              <div className="rounded-xl overflow-hidden border border-[#24343E] bg-[#0F181D] text-[#E2EEF3]">
                <pre className="p-3.5 text-xs font-mono text-[#7DD3DC] border-b border-[#203039] overflow-x-auto leading-relaxed">
                  {stage.rCode}
                </pre>
                <pre className="p-3.5 text-xs font-mono text-[#D5E4EB] overflow-x-auto leading-relaxed tabular-nums">
                  {stage.rOutput}
                </pre>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-display font-bold text-[#0E1E25] dark:text-white">
                <BookOpenCheck className="w-4 h-4 text-[#0F6B75] dark:text-[#5DC2CC]" aria-hidden="true" />
                <span>Klausur-Formulierungs-Pflicht</span>
              </div>
              <div className="rounded-xl bg-[#FDF6EA] dark:bg-[#271F12] border border-[#ECD6AC] dark:border-[#4D3B1D] p-4 space-y-2.5 text-sm text-[#4F3208] dark:text-[#F4D9A6]">
                {stage.examPhrasing.map((rule, i) => (
                  <p key={i} className="leading-relaxed text-[13.5px]">
                    • <RichText text={rule} />
                  </p>
                ))}
              </div>
            </div>
          </section>

          <hr className="border-[#DCE4E8] dark:border-[#22323B]" />

          {/* Section 4: Hands-On Mini-Check */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h2 className="font-display font-bold text-lg text-[#0E1E25] dark:text-white">
                  Etappen-Check: Sitzt das Konzept?
                </h2>
                <p className="text-sm text-[#4E626C] dark:text-[#96AEB9] mt-0.5">
                  Löse die Aufgaben direkt hier, um Etappe {stage.number} abzuhaken.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenQuizDeck(stage.quizDeckId)}
                className="text-xs font-semibold text-[#0F6B75] dark:text-[#5DC2CC] hover:underline cursor-pointer"
              >
                Alle Karteikarten zu diesem Thema üben →
              </button>
            </div>

            <div className="space-y-4">
              {stage.checks.map((check, cIdx) => {
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
                        <RichText text={check.prompt} />
                      </p>
                      {alreadyPassed && (
                        <span className="font-mono text-xs font-semibold text-[#0F7B4D] dark:text-[#5DD49B] whitespace-nowrap shrink-0">
                          ✓ Gelöst
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
                            {isRight ? 'Genau richtig! ' : 'Knapp daneben – '}
                          </strong>
                          <RichText text={check.explanation} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Bottom Stage Navigation */}
          <div className="pt-4 border-t border-[#DCE4E8] dark:border-[#22323B] flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              disabled={activeStageIndex === 0}
              onClick={() => onSelectStage(activeStageIndex - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-lg border border-[#CBD7DD] dark:border-[#2A3E48] bg-white dark:bg-[#131F26] text-[#1F333D] dark:text-[#D5E3EA] disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#0F6B75] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Vorherige Etappe
            </button>

            {activeStageIndex < JOURNEY_STAGES.length - 1 ? (
              <button
                type="button"
                onClick={() => onSelectStage(activeStageIndex + 1)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-lg bg-[#0F6B75] hover:bg-[#0B565E] text-white transition-colors cursor-pointer"
              >
                Weiter zu Etappe {JOURNEY_STAGES[activeStageIndex + 1].number}
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onOpenQuizDeck('11-Beispielklausur')}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-lg bg-[#0F7B4D] hover:bg-[#0B5D3A] text-white transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Ab ins Beispielklausur-Training
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
