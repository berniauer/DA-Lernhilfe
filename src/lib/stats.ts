/**
 * Pure statistical calculations aligned with the Datenanalyse curriculum
 * (rstanarm / daatools / Beispielklausur WS26/27 & Probeklausur B/C).
 */

export interface BayesResult {
  posterior: number;
  tp: number;
  fp: number;
  fn: number;
  tn: number;
}

/**
 * Computes P(Defect | Positive Test) and expected counts out of 1000 units.
 */
export function computeBayesTest(
  baseRate: number,
  sensitivity: number,
  falsePositiveRate: number,
  population = 1000
): BayesResult {
  const p = Math.min(1, Math.max(0, baseRate));
  const sens = Math.min(1, Math.max(0, sensitivity));
  const fpr = Math.min(1, Math.max(0, falsePositiveRate));

  const tpProb = p * sens;
  const fpProb = (1 - p) * fpr;
  const fnProb = p * (1 - sens);
  const tnProb = (1 - p) * (1 - fpr);
  const denom = tpProb + fpProb;
  const posterior = denom > 0 ? tpProb / denom : 0;

  return {
    posterior,
    tp: Math.round(tpProb * population),
    fp: Math.round(fpProb * population),
    fn: Math.round(fnProb * population),
    tn: Math.round(tnProb * population),
  };
}

/**
 * Converts probability p in (0, 1) to Odds = p / (1 - p).
 */
export function probToOdds(p: number): number {
  const clamped = Math.min(0.9999, Math.max(0.0001, p));
  return clamped / (1 - clamped);
}

/**
 * Converts Odds >= 0 back to probability p = o / (1 + o).
 */
export function oddsToProb(odds: number): number {
  const safe = Math.max(0, odds);
  return safe / (1 + safe);
}

/**
 * Logistic inverse-logit (plogis): p = 1 / (1 + exp(-eta)).
 */
export function invLogit(eta: number): number {
  return 1 / (1 + Math.exp(-eta));
}

/**
 * Logit link: log(p / (1 - p)).
 */
export function logit(p: number): number {
  return Math.log(probToOdds(p));
}

/**
 * Applies an Odds Ratio multiplier to a baseline probability p0.
 * Demonstrates why OR != probability ratio (e.g. p=10% with OR=4.1 -> 31%, not 41%).
 */
export function applyOddsRatio(baseProb: number, oddsRatio: number): number {
  const baseOdds = probToOdds(baseProb);
  return oddsToProb(baseOdds * Math.max(0.0001, oddsRatio));
}

/**
 * Computes Cohen's f^2 = (R2_full - R2_reduced) / (1 - R2_full).
 */
export function computeCohenF2(r2Full: number, r2Reduced: number): number {
  const full = Math.min(0.999, Math.max(0, r2Full));
  const reduced = Math.min(full, Math.max(0, r2Reduced));
  return (full - reduced) / (1 - full);
}

export function classifyCohenF2(f2: number): 'vernachlässigbar' | 'klein' | 'mittel' | 'groß' {
  if (f2 >= 0.35) return 'groß';
  if (f2 >= 0.15) return 'mittel';
  if (f2 >= 0.02) return 'klein';
  return 'vernachlässigbar';
}

/**
 * Vertex x* of a centered quadratic curve: b1 * x + b2 * (x - c)^2.
 * x* = c - b1 / (2 * b2).
 */
export function computeQuadraticVertex(targetC: number, b1: number, b2: number): number {
  if (Math.abs(b2) < 1e-9) return targetC;
  return targetC - b1 / (2 * b2);
}

/**
 * Computes group slope and group difference at x = c in an interaction model:
 * y = b0 + bX * (x - xRef) + bG * G + bInt * (x - xRef) * G
 */
export function computeInteractionEffect(
  bX: number,
  bG: number,
  bInt: number,
  xValue: number,
  xRef: number
): { groupSlope: number; groupDiffAtX: number } {
  const centeredX = xValue - xRef;
  return {
    groupSlope: bX + bInt,
    groupDiffAtX: bG + bInt * centeredX,
  };
}

/**
 * Cost-optimal quantile for asymmetric continuous prediction losses:
 * q* = c_under / (c_under + c_over).
 */
export function computeOptimalQuantile(costUnder: number, costOver: number): number {
  const u = Math.max(0, costUnder);
  const o = Math.max(0, costOver);
  if (u + o === 0) return 0.5;
  return u / (u + o);
}

/**
 * Cost-optimal probability cutoff for calibrated binary classification:
 * cutoff* = c_FP / (c_FP + c_FN).
 */
export function computeOptimalCutoff(costFP: number, costFN: number): number {
  const fp = Math.max(0, costFP);
  const fn = Math.max(0, costFN);
  if (fp + fn === 0) return 0.5;
  return fp / (fp + fn);
}

/**
 * Standard normal inverse CDF approximation (Acklam's rational approximation)
 * for computing normal quantiles on the posterior_predict curve.
 */
export function normQuantile(p: number): number {
  const clamped = Math.min(0.9999, Math.max(0.0001, p));
  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2,
    1.38357751867269e2, -3.066479806614716e1, 2.506628277459239,
  ];
  const b = [
    -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2,
    6.680131188771972e1, -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838,
    -2.549732539343734, 4.374664141464968, 2.938163982698783,
  ];
  const d = [
    7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996,
    3.754408661907416,
  ];
  const pLow = 0.02425;
  const pHigh = 1 - pLow;

  if (clamped < pLow) {
    const q = Math.sqrt(-2 * Math.log(clamped));
    return (
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
    );
  }
  if (clamped <= pHigh) {
    const q = clamped - 0.5;
    const r = q * q;
    return (
      ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
    );
  }
  const q = Math.sqrt(-2 * Math.log(1 - clamped));
  return -(
    (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
    ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
  );
}

/**
 * Evaluates Brier Null baseline and Brier Skill score.
 */
export function computeBrierSkill(brierModel: number, baseRate: number): {
  brierNull: number;
  skill: number;
} {
  const p = Math.min(0.999, Math.max(0.001, baseRate));
  const brierNull = p * (1 - p);
  const skill = 1 - brierModel / brierNull;
  return { brierNull, skill };
}

/**
 * Evaluates LOO 2*se rule: |elpdDiff| > 2 * seDiff indicates a convincing difference.
 */
export function evaluateLooDifference(elpdDiff: number, seDiff: number): {
  zRatio: number;
  isConvincing: boolean;
} {
  const absDiff = Math.abs(elpdDiff);
  const se = Math.max(0.0001, Math.abs(seDiff));
  const zRatio = absDiff / se;
  return {
    zRatio,
    isConvincing: absDiff > 2 * se,
  };
}

export interface CutoffMetrics {
  cutoff: number;
  tp: number;
  fn: number;
  fp: number;
  tn: number;
  tpr: number;
  fnr: number;
  fpr: number;
  tnr: number;
  precision: number;
  accuracy: number;
  totalCost: number;
}

/**
 * Deterministic 100-wafer synthetic calibrated dataset mirroring Beispielklausur WS26/27 m2
 * (25% defect rate, AUC ~ 0.91, TPR ~ 0.76 at cutoff 0.30, FPR ~ 0.13 at cutoff 0.30).
 */
export const EXAM_WAFER_SAMPLE: ReadonlyArray<{ prob: number; actual: 0 | 1 }> = [
  // 25 defective wafers (actual = 1), sorted by predicted probability
  ...[
    0.09, 0.14, 0.18, 0.22, 0.25, 0.28, 0.33, 0.37, 0.42, 0.46, 0.51, 0.56,
    0.61, 0.65, 0.70, 0.74, 0.78, 0.81, 0.84, 0.87, 0.89, 0.92, 0.94, 0.96, 0.98,
  ].map((prob) => ({ prob, actual: 1 as const })),
  // 75 good wafers (actual = 0)
  ...[
    0.01, 0.01, 0.02, 0.02, 0.02, 0.03, 0.03, 0.03, 0.04, 0.04, 0.04, 0.05,
    0.05, 0.05, 0.06, 0.06, 0.06, 0.07, 0.07, 0.07, 0.08, 0.08, 0.08, 0.09,
    0.09, 0.10, 0.10, 0.10, 0.11, 0.11, 0.12, 0.12, 0.12, 0.13, 0.13, 0.14,
    0.14, 0.15, 0.15, 0.16, 0.16, 0.17, 0.17, 0.18, 0.18, 0.19, 0.19, 0.20,
    0.20, 0.21, 0.21, 0.22, 0.22, 0.23, 0.24, 0.24, 0.25, 0.26, 0.26, 0.27,
    0.28, 0.28, 0.29, 0.29, 0.30, 0.32, 0.34, 0.37, 0.40, 0.44, 0.49, 0.54,
    0.60, 0.68, 0.76,
  ].map((prob) => ({ prob, actual: 0 as const })),
];

/**
 * Evaluates confusion matrix, classification rates, and total cost at a given cutoff.
 */
export function evaluateCutoff(
  cutoff: number,
  costFP = 30,
  costFN = 300,
  sample: ReadonlyArray<{ prob: number; actual: 0 | 1 }> = EXAM_WAFER_SAMPLE
): CutoffMetrics {
  let tp = 0;
  let fn = 0;
  let fp = 0;
  let tn = 0;

  for (const item of sample) {
    const predictedPositive = item.prob >= cutoff;
    if (item.actual === 1 && predictedPositive) tp++;
    else if (item.actual === 1 && !predictedPositive) fn++;
    else if (item.actual === 0 && predictedPositive) fp++;
    else tn++;
  }

  const pos = tp + fn;
  const neg = fp + tn;
  const predPos = tp + fp;
  const total = pos + neg;

  return {
    cutoff,
    tp,
    fn,
    fp,
    tn,
    tpr: pos > 0 ? tp / pos : 0,
    fnr: pos > 0 ? fn / pos : 0,
    fpr: neg > 0 ? fp / neg : 0,
    tnr: neg > 0 ? tn / neg : 0,
    precision: predPos > 0 ? tp / predPos : 1,
    accuracy: total > 0 ? (tp + tn) / total : 0,
    totalCost: fp * costFP + fn * costFN,
  };
}
