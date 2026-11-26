import { BASICS_MODULES } from '../data/basicsData';
import { JOURNEY_STAGES } from '../data/journeyData';
import { ID_PATTERN, MAX_CHECK_ID_LENGTH, MAX_COMPLETED_CHECKS } from './progressSync';

export interface EverydayBayesScenario {
  id: 'smoke' | 'fever' | 'rain';
  label: string;
  eventLabel: string;
  signalLabel: string;
  baseRatePct: number;
  sensitivityPct: number;
  falseAlarmPct: number;
  takeaway: string;
}

export const EVERYDAY_BAYES_SCENARIOS: EverydayBayesScenario[] = [
  {
    id: 'smoke',
    label: 'Rauchmelder in der Küche',
    eventLabel: 'Echtes Feuer',
    signalLabel: 'Melder piept',
    baseRatePct: 1,
    sensitivityPct: 95,
    falseAlarmPct: 10,
    takeaway:
      'Weil echtes Feuer extrem selten ist (1 %), ist der Alarm in fast 9 von 10 Fällen nur angebrannter Toast – trotzdem kurz nachsehen!',
  },
  {
    id: 'fever',
    label: 'Seltener Schnelltest',
    eventLabel: 'Wirklich krank',
    signalLabel: 'Test positiv',
    baseRatePct: 2,
    sensitivityPct: 90,
    falseAlarmPct: 5,
    takeaway:
      'Bei nur 2 % Kranken liefert selbst ein guter Test noch mehr Fehlalarme als echte Treffer – ein zweiter Test schafft Klarheit.',
  },
  {
    id: 'rain',
    label: 'Schwarze Wolken im April',
    eventLabel: 'Es regnet gleich',
    signalLabel: 'Dunkle Wolken',
    baseRatePct: 35,
    sensitivityPct: 85,
    falseAlarmPct: 15,
    takeaway:
      'Hier ist die Basisrate hoch (35 %): Jetzt sind dunkle Wolken ein sehr verlässlicher Hinweis – nimm den Schirm mit!',
  },
];

export function computeEverydayBayes(scenario: EverydayBayesScenario): {
  posteriorPct: number;
  trueAlarmsPer1000: number;
  falseAlarmsPer1000: number;
} {
  const base = scenario.baseRatePct / 100;
  const sens = scenario.sensitivityPct / 100;
  const fpr = scenario.falseAlarmPct / 100;
  const trueAlarms = 1000 * base * sens;
  const falseAlarms = 1000 * (1 - base) * fpr;
  const totalAlarms = trueAlarms + falseAlarms;
  return {
    posteriorPct: totalAlarms > 0 ? (trueAlarms / totalAlarms) * 100 : 0,
    trueAlarmsPer1000: Math.round(trueAlarms),
    falseAlarmsPer1000: Math.round(falseAlarms),
  };
}

export function translateProbability(probPct: number, oddsMultiplier = 1): {
  p: number;
  odds: number;
  logit: number;
  shiftedP: number;
  shiftedOdds: number;
  naiveWrongP: number;
} {
  const clampedPct = Math.max(1, Math.min(99, probPct));
  const p = clampedPct / 100;
  const odds = p / (1 - p);
  const logit = Math.log(odds);
  const shiftedOdds = odds * oddsMultiplier;
  const shiftedP = shiftedOdds / (1 + shiftedOdds);
  return {
    p,
    odds,
    logit,
    shiftedP,
    shiftedOdds,
    naiveWrongP: p * oddsMultiplier,
  };
}

export function countCompletedBasicsModules(completedChecks: Record<string, boolean>): number {
  return BASICS_MODULES.filter((m) => m.checks.every((c) => Boolean(completedChecks[c.id]))).length;
}

export function collectAllAppCheckIds(): string[] {
  const journeyIds = JOURNEY_STAGES.flatMap((s) => s.checks.map((c) => c.id));
  const basicsIds = BASICS_MODULES.flatMap((m) => m.checks.map((c) => c.id));
  return [...journeyIds, ...basicsIds];
}

export function verifyFirebaseCheckIdBudget(): {
  total: number;
  uniqueCount: number;
  withinCap: boolean;
  allValidPattern: boolean;
} {
  const all = collectAllAppCheckIds();
  const unique = new Set(all);
  const allValidPattern = all.every(
    (id) => id.length >= 1 && id.length <= MAX_CHECK_ID_LENGTH && ID_PATTERN.test(id)
  );
  return {
    total: all.length,
    uniqueCount: unique.size,
    withinCap: unique.size <= MAX_COMPLETED_CHECKS,
    allValidPattern,
  };
}
