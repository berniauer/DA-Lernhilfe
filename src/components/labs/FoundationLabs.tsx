import React, { useState } from 'react';
import { Check, AlertTriangle, X, RotateCcw } from 'lucide-react';
import { computeBayesTest, computeOptimalQuantile, normQuantile } from '../../lib/stats';
import { RichText } from '../GlossaryTooltip';

/* -------------------------------------------------------------------------- */
/* 1. BAYES & BASISRATE LAB                                                   */
/* -------------------------------------------------------------------------- */
export const BayesLab: React.FC = () => {
  const [baseRatePct, setBaseRatePct] = useState(1);
  const [sensPct, setSensPct] = useState(90);
  const [fprPct, setFprPct] = useState(5);

  const res = computeBayesTest(baseRatePct / 100, sensPct / 100, fprPct / 100, 1000);
  const totalAlarms = res.tp + res.fp;

  // Build 100-cell visual proxy (each cell = 10 wafers)
  const cells = Array.from({ length: 100 }, (_, i) => {
    const tpCells = Math.max(res.tp > 0 ? 1 : 0, Math.round(res.tp / 10));
    const fpCells = Math.round(res.fp / 10);
    const fnCells = Math.round(res.fn / 10);
    if (i < tpCells) return 'tp';
    if (i < tpCells + fpCells) return 'fp';
    if (i < tpCells + fpCells + fnCells) return 'fn';
    return 'tn';
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left: Visual 100-Wafer Grid */}
      <div className="lg:col-span-7 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#4E626C] dark:text-[#96AEB9]">
          <span className="font-medium text-[#111E24] dark:text-[#E6EFF3]">
            100 Wafer-Pakete (je 10 Stück = 1 000 Wafer)
          </span>
          <span className="font-mono tabular-nums">
            Alarme gesamt: {totalAlarms} ({res.tp} echt · {res.fp} Fehlalarm)
          </span>
        </div>

        <div
          className="grid grid-cols-10 gap-1.5 p-3 rounded-xl bg-[#F3F6F8] dark:bg-[#0F191F] border border-[#DCE4E8] dark:border-[#24343E]"
          aria-label="Raster aus 100 Wafer-Paketen zur Veranschaulichung von echten Treffern und Fehlalarmen"
        >
          {cells.map((status, idx) => {
            const styles =
              status === 'tp'
                ? 'bg-[#0F7B4D] text-white border-[#0B5D3A]'
                : status === 'fp'
                  ? 'bg-[#D97706] text-white border-[#B45309]'
                  : status === 'fn'
                    ? 'bg-[#C0392B] text-white border-[#962D22]'
                    : 'bg-[#FFFFFF] dark:bg-[#1B2B34] text-[#8396A0] border-[#D5DFE4] dark:border-[#2C3F4A]';
            const symbol =
              status === 'tp' ? '✓' : status === 'fp' ? '!' : status === 'fn' ? '✕' : '·';
            return (
              <div
                key={idx}
                className={`aspect-square rounded-md border flex items-center justify-center text-[11px] font-mono font-semibold select-none transition-colors ${styles}`}
              >
                {symbol}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-[#0F7B4D] text-white font-mono text-[10px] flex items-center justify-center shrink-0">✓</span>
            <span className="text-[#273B45] dark:text-[#C5D6DF] tabular-nums">Echt defekt (TP): {res.tp}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-[#D97706] text-white font-mono text-[10px] flex items-center justify-center shrink-0">!</span>
            <span className="text-[#273B45] dark:text-[#C5D6DF] tabular-nums">Fehlalarm (FP): {res.fp}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-[#C0392B] text-white font-mono text-[10px] flex items-center justify-center shrink-0">✕</span>
            <span className="text-[#273B45] dark:text-[#C5D6DF] tabular-nums">Übersehen (FN): {res.fn}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded bg-[#FFFFFF] dark:bg-[#1B2B34] border border-[#CBD7DD] dark:border-[#2C3F4A] text-[#8396A0] font-mono text-[10px] flex items-center justify-center shrink-0">·</span>
            <span className="text-[#273B45] dark:text-[#C5D6DF] tabular-nums">Ok (TN): {res.tn}</span>
          </div>
        </div>
      </div>

      {/* Right: Controls & Live Posterior Readout */}
      <div className="lg:col-span-5 space-y-5">
        <div className="rounded-xl bg-[#EEF5F6] dark:bg-[#13262C] border border-[#C4DEE1] dark:border-[#22454D] p-4">
          <div className="text-xs font-medium text-[#395760] dark:text-[#8FC6CE]">
            Posterior: P(wirklich defekt | Scanner piept)
          </div>
          <div className="font-mono font-bold text-3xl text-[#0F6B75] dark:text-[#5DC2CC] tabular-nums mt-1">
            {(res.posterior * 100).toFixed(1)} %
          </div>
          <p className="text-xs text-[#314A53] dark:text-[#B5CDD4] mt-1.5 leading-relaxed">
            {res.posterior < 0.35
              ? 'Trotz starkem Scanner sind die meisten Alarme Fehlalarme – weil die Basisrate so niedrig ist!'
              : res.posterior < 0.7
                ? 'Steigende Basisrate: Jetzt ist schon rund jeder zweite Alarm ein echter Treffer.'
                : 'Bei hoher Basisrate oder sehr geringer Fehlalarmrate ist ein positiver Alarm sehr verlässlich.'}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <label htmlFor="bayes-base" className="text-[#1F333D] dark:text-[#D5E3EA]">
                Basisrate (echte Defekte)
              </label>
              <span className="font-mono tabular-nums text-[#0F6B75] dark:text-[#5DC2CC]">{baseRatePct} %</span>
            </div>
            <input
              id="bayes-base"
              type="range"
              min={1}
              max={40}
              step={1}
              value={baseRatePct}
              onChange={(e) => setBaseRatePct(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <label htmlFor="bayes-sens" className="text-[#1F333D] dark:text-[#D5E3EA]">
                Sensitivität (erkannte Defekte)
              </label>
              <span className="font-mono tabular-nums text-[#0F6B75] dark:text-[#5DC2CC]">{sensPct} %</span>
            </div>
            <input
              id="bayes-sens"
              type="range"
              min={60}
              max={99}
              step={1}
              value={sensPct}
              onChange={(e) => setSensPct(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <label htmlFor="bayes-fpr" className="text-[#1F333D] dark:text-[#D5E3EA]">
                Fehlalarmrate bei guten Wafern (FPR)
              </label>
              <span className="font-mono tabular-nums text-[#0F6B75] dark:text-[#5DC2CC]">{fprPct} %</span>
            </div>
            <input
              id="bayes-fpr"
              type="range"
              min={1}
              max={25}
              step={1}
              value={fprPct}
              onChange={(e) => setFprPct(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setBaseRatePct(1);
                setSensPct(90);
                setFprPct(5);
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#CBD7DD] dark:border-[#2C404B] hover:bg-[#EDF3F5] dark:hover:bg-[#1B2B34] transition-colors cursor-pointer"
            >
              Klausur-Beispiel (1 %)
            </button>
            <button
              type="button"
              onClick={() => {
                setBaseRatePct(25);
                setSensPct(90);
                setFprPct(5);
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#CBD7DD] dark:border-[#2C404B] hover:bg-[#EDF3F5] dark:hover:bg-[#1B2B34] transition-colors cursor-pointer"
            >
              NovaChip-Defektrate (25 %)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. LINEAR REGRESSION: CENTERING & CLICKABLE info() X-RAY                   */
/* -------------------------------------------------------------------------- */
const INFO_ROWS = [
  {
    key: '(Intercept)',
    median: '38.99',
    mad: '0.32',
    hdi: '[38.36 ; 39.61]',
    rhat: '1.00',
    plain:
      'Basisfall: Ein Haus mit alter Dämmung, 130 m², ohne Smart-Thermostat bei 5 °C verbraucht im Mittel 38.99 kWh/Tag.',
  },
  {
    key: 'temp5',
    median: '-1.06',
    mad: '0.03',
    hdi: '[-1.12 ; -1.00]',
    rhat: '1.00',
    plain:
      'Metrischer Koeffizient: Ist ein Tag 1 °C wärmer, liegt der Verbrauch bei sonst gleichen Werten im Mittel 1.06 kWh niedriger (95%-HDI schließt 0 klar aus).',
  },
  {
    key: 'daemmungneu',
    median: '-17.23',
    mad: '0.48',
    hdi: '[-18.16 ; -16.29]',
    rhat: '1.00',
    plain:
      'Gruppenkoeffizient: Neue Dämmung verbraucht bei gleicher Temperatur & Fläche im Mittel 17.23 kWh weniger als die Referenzgruppe „alt“.',
  },
  {
    key: 'sigma',
    median: '5.18',
    mad: '0.12',
    hdi: '[4.95 ; 5.41]',
    rhat: '1.00',
    plain:
      'Residuenstreuung: Einzelne echte Tage schwanken typischerweise ±5.18 kWh um die Vorhersage (~95 % innerhalb ±10.4 kWh).',
  },
];

const SCATTER_POINTS: [number, number][] = [
  [-8, 52], [-5, 49], [-2, 47], [0, 44], [2, 43], [4, 41], [5, 38.5],
  [7, 36.5], [9, 34], [11, 33], [13, 30.5], [15, 29], [1, 45], [6, 37.5],
];

export const LinearCenteringLab: React.FC = () => {
  const [centered, setCentered] = useState(true);
  const [selectedRow, setSelectedRow] = useState<string>('(Intercept)');

  // Model: kwh = 38.99 - 1.06 * (temp - 5) = 44.29 - 1.06 * temp
  const interceptVal = centered ? 38.99 : 44.29;
  const refTemp = centered ? 5 : 0;

  // Map temp in [-10, 18] to x in [45, 390], kwh in [22, 58] to y in [185, 20]
  const toX = (t: number) => 45 + ((t + 10) / 28) * 345;
  const toY = (kwh: number) => 185 - ((kwh - 22) / 36) * 165;

  const activeInfo = INFO_ROWS.find((r) => r.key === selectedRow) ?? INFO_ROWS[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left: Interactive SVG Regression Plot with Centering Toggle */}
      <div className="lg:col-span-6 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs font-medium text-[#111E24] dark:text-[#E6EFF3]">
            Nullpunkt der x-Achse (Intercept-Position)
          </span>
          <div className="inline-flex rounded-lg bg-[#EDF2F4] dark:bg-[#192830] p-1 border border-[#DCE4E8] dark:border-[#263943]">
            <button
              type="button"
              onClick={() => setCentered(false)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                !centered
                  ? 'bg-white dark:bg-[#0F6B75] text-[#0E1E25] dark:text-white shadow-xs'
                  : 'text-[#526771] dark:text-[#96AEB9]'
              }`}
            >
              Roh (0 °C)
            </button>
            <button
              type="button"
              onClick={() => setCentered(true)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                centered
                  ? 'bg-white dark:bg-[#0F6B75] text-[#0E1E25] dark:text-white shadow-xs'
                  : 'text-[#526771] dark:text-[#96AEB9]'
              }`}
            >
              Zentriert (5 °C)
            </button>
          </div>
        </div>

        <svg
          viewBox="0 0 420 215"
          className="w-full h-auto rounded-xl bg-[#F3F6F8] dark:bg-[#0F191F] border border-[#DCE4E8] dark:border-[#24343E]"
          role="img"
          aria-label="Streudiagramm Stromverbrauch gegen Außentemperatur mit markiertem Intercept"
        >
          {/* Grid lines */}
          {[25, 35, 45, 55].map((kwh) => (
            <g key={kwh}>
              <line
                x1={45}
                y1={toY(kwh)}
                x2={395}
                y2={toY(kwh)}
                stroke="currentColor"
                className="text-[#DCE4E8] dark:text-[#22333D]"
                strokeDasharray="3 3"
              />
              <text
                x={38}
                y={toY(kwh) + 4}
                textAnchor="end"
                className="fill-[#5E737D] dark:fill-[#8DA5B0] font-mono text-[10px]"
              >
                {kwh}
              </text>
            </g>
          ))}

          {/* Vertical reference axis x=0 or x=5 */}
          <line
            x1={toX(refTemp)}
            y1={16}
            x2={toX(refTemp)}
            y2={185}
            stroke="#D97706"
            strokeWidth={1.75}
            strokeDasharray="4 3"
          />

          {/* Data points */}
          {SCATTER_POINTS.map(([t, k], i) => (
            <circle
              key={i}
              cx={toX(t)}
              cy={toY(k)}
              r={4}
              className="fill-[#64828E]/65 dark:fill-[#7BA7B5]/70"
            />
          ))}

          {/* Regression line (IDENTICAL regardless of centering!) */}
          <line
            x1={toX(-9)}
            y1={toY(44.29 - 1.06 * -9)}
            x2={toX(16)}
            y2={toY(44.29 - 1.06 * 16)}
            stroke="#0F6B75"
            strokeWidth={2.5}
          />

          {/* Highlighted Intercept Dot */}
          <circle
            cx={toX(refTemp)}
            cy={toY(interceptVal)}
            r={6.5}
            fill="#D97706"
            stroke="#FFFFFF"
            strokeWidth={2}
          />
          <text
            x={toX(refTemp) + 10}
            y={toY(interceptVal) - 8}
            className="fill-[#9A4E04] dark:fill-[#F6BE68] font-mono text-[11px] font-semibold"
          >
            Intercept = {interceptVal.toFixed(2)} kWh
          </text>

          {/* Axis labels */}
          <line x1={45} y1={185} x2={395} y2={185} stroke="currentColor" className="text-[#8CA0AA]" />
          {[-10, 0, 5, 10, 15].map((t) => (
            <text
              key={t}
              x={toX(t)}
              y={202}
              textAnchor="middle"
              className="fill-[#5E737D] dark:fill-[#8DA5B0] font-mono text-[10px]"
            >
              {t}°C
            </text>
          ))}
        </svg>

        <p className="text-xs text-[#435963] dark:text-[#9DB4BF] leading-relaxed">
          <strong className="text-[#111E24] dark:text-[#E6EFF3]">Aha-Effekt:</strong> Die petrolfarbene
          Regressionsgerade (Steigung <code className="font-mono">−1.06 kWh/°C</code>) bewegt sich
          beim Zentrieren <strong>keinen Millimeter</strong>! Nur der gelbe Referenzpunkt rutscht an
          eine sinnvolle Stelle ({refTemp} °C).
        </p>
      </div>

      {/* Right: Clickable info(m2) X-Ray */}
      <div className="lg:col-span-6 space-y-3">
        <div className="text-xs font-medium text-[#111E24] dark:text-[#E6EFF3]">
          Klicke eine Zeile in <code className="font-mono">info(m2)</code> an:
        </div>
        <div className="overflow-x-auto rounded-xl border border-[#DCE4E8] dark:border-[#24343E] bg-white dark:bg-[#131F26]">
          <table className="w-full text-left font-mono text-xs tabular-nums">
            <thead>
              <tr className="border-b border-[#E3EAEE] dark:border-[#24343E] text-[#5B707A] dark:text-[#8FA7B3] bg-[#F5F8F9] dark:bg-[#101B21]">
                <th className="py-2 px-3">Parameter</th>
                <th className="py-2 px-2 text-right">median</th>
                <th className="py-2 px-2 text-right">95%-HDI</th>
                <th className="py-2 px-3 text-right">Rhat</th>
              </tr>
            </thead>
            <tbody>
              {INFO_ROWS.map((row) => {
                const active = row.key === selectedRow;
                return (
                  <tr
                    key={row.key}
                    onClick={() => setSelectedRow(row.key)}
                    className={`border-b last:border-b-0 border-[#EDF2F4] dark:border-[#1E2E37] cursor-pointer transition-colors ${
                      active
                        ? 'bg-[#E6F3F5] dark:bg-[#15353B] text-[#0B4F57] dark:text-[#7CD5DF] font-semibold'
                        : 'hover:bg-[#F7FAFB] dark:hover:bg-[#17262E] text-[#1D303A] dark:text-[#CFE0E8]'
                    }`}
                  >
                    <td className="py-2.5 px-3">{row.key}</td>
                    <td className="py-2.5 px-2 text-right">{row.median}</td>
                    <td className="py-2.5 px-2 text-right">{row.hdi}</td>
                    <td className="py-2.5 px-3 text-right">{row.rhat}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl bg-[#EEF5F6] dark:bg-[#13262C] border border-[#C4DEE1] dark:border-[#22454D] p-3.5 text-sm leading-relaxed text-[#1A313A] dark:text-[#D3E5EB]">
          <div className="font-mono text-xs font-semibold text-[#0F6B75] dark:text-[#5DC2CC] mb-1">
            Übersetzung für {activeInfo.key}
          </div>
          <RichText text={activeInfo.plain} />
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. MODEL DIAGNOSTICS LAB (MCMC TRACE + RESIDUALS)                          */
/* -------------------------------------------------------------------------- */
type DiagMode = 'healthy' | 'bad-mcmc' | 'banana' | 'funnel';

const DIAG_SCENARIOS: Record<
  DiagMode,
  {
    label: string;
    status: 'OK' | 'RECHENPROBLEM' | 'MODELLPROBLEM';
    rhat: string;
    neff: string;
    mcse: string;
    diagnosis: string;
    action: string;
  }
> = {
  healthy: {
    label: '1. Alles gesund',
    status: 'OK',
    rhat: '1.00',
    neff: '3 620',
    mcse: '0.01 (1 % mad)',
    diagnosis:
      'Alle 4 Chains überlappen wie „haariges Rauschen“ (Rhat ≈ 1) und die Residuen bilden eine gleichmäßige Wolke um 0.',
    action: 'Grünes Licht: Dieses Modell darfst du interpretieren und auf Testdaten prüfen.',
  },
  'bad-mcmc': {
    label: '2. Kaputtes Sampling',
    status: 'RECHENPROBLEM',
    rhat: '1.18',
    neff: '85',
    mcse: '0.24 (31 % mad)',
    diagnosis:
      'Die Chains driften auseinander und haben sich nicht geeinigt (Rhat > 1.1, n_eff < 400). Ergebnisse sind NICHT vertrauenswürdig!',
    action: 'Erst Sampling reparieren (zentrieren, mehr Iterationen, Modell vereinfachen) – Zahlen nicht interpretieren!',
  },
  banana: {
    label: '3. Banane (Kurve)',
    status: 'MODELLPROBLEM',
    rhat: '1.00',
    neff: '3 410',
    mcse: '0.01 (1 % mad)',
    diagnosis:
      'Sampling ist perfekt, ABER die Residuen biegen sich U-förmig: Das lineare Modell überschätzt die Mitte und unterschätzt die Ränder.',
    action: 'Nichtlinearität einbauen – z. B. einen quadratischen Term (x − Ziel)² oder Splines! Mehr Samples helfen hier NICHT.',
  },
  funnel: {
    label: '4. Trichter (Fächer)',
    status: 'MODELLPROBLEM',
    rhat: '1.00',
    neff: '3 280',
    mcse: '0.01 (1 % mad)',
    diagnosis:
      'Heteroskedastizität: Bei großen Vorhersagen streuen die Fehler viel stärker als bei kleinen. Konstantes sigma stimmt nicht.',
    action: 'Vorhersageintervalle sind rechts zu eng und links zu breit. Eventuell log(y) testen – 40 000 Samples beheben das NICHT.',
  },
};

export const DiagnosticsLab: React.FC = () => {
  const [mode, setMode] = useState<DiagMode>('healthy');
  const info = DIAG_SCENARIOS[mode];

  // Deterministic pseudo-random trace chains
  const makeChain = (offset: number, drift: number, phase: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 40; i++) {
      const x = 20 + i * 8.5;
      const noise = Math.sin(i * 1.9 + phase) * 11 + Math.cos(i * 3.1 + phase) * 6;
      const y = 62 + offset + drift * (i / 40) + noise;
      pts.push(`${x.toFixed(1)},${Math.max(12, Math.min(112, y)).toFixed(1)}`);
    }
    return pts.join(' ');
  };

  // Deterministic residual scatter points
  const residuals: [number, number][] = Array.from({ length: 34 }, (_, i) => {
    const t = i / 33; // 0..1
    const baseNoise = Math.sin(i * 2.7) * 0.65 + Math.cos(i * 4.3) * 0.35;
    let r = baseNoise * 16;
    if (mode === 'banana') {
      r = (Math.pow(t - 0.5, 2) * 4 - 0.38) * 58 + baseNoise * 8;
    } else if (mode === 'funnel') {
      r = baseNoise * (6 + t * 38);
    }
    return [24 + t * 332, 62 - r];
  });

  const statusTone =
    info.status === 'OK'
      ? 'bg-[#E3F4EC] dark:bg-[#143025] text-[#0E643E] dark:text-[#6CD6A1] border-[#B7E1CD] dark:border-[#245740]'
      : info.status === 'RECHENPROBLEM'
        ? 'bg-[#FBEAE8] dark:bg-[#381B18] text-[#A82E22] dark:text-[#F49388] border-[#EFC3BE] dark:border-[#632D28]'
        : 'bg-[#FDF4E4] dark:bg-[#332613] text-[#9A4E04] dark:text-[#F6C26B] border-[#EED2A1] dark:border-[#5D441D]';

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Diagnose-Szenario wählen">
        {(Object.keys(DIAG_SCENARIOS) as DiagMode[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setMode(k)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              mode === k
                ? 'bg-[#0F6B75] text-white border-[#0F6B75]'
                : 'bg-white dark:bg-[#14222A] text-[#273B45] dark:text-[#C5D6DF] border-[#CBD7DD] dark:border-[#2A3E48] hover:border-[#0F6B75]'
            }`}
          >
            {DIAG_SCENARIOS[k].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Traceplot */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-[#4E626C] dark:text-[#96AEB9]">
            <span className="font-medium text-[#111E24] dark:text-[#E6EFF3]">Prüffrage 1: MCMC-Traceplot</span>
            <span className="font-mono tabular-nums">Rhat = {info.rhat} · n_eff = {info.neff}</span>
          </div>
          <svg
            viewBox="0 0 380 124"
            className="w-full h-auto rounded-xl bg-[#F3F6F8] dark:bg-[#0F191F] border border-[#DCE4E8] dark:border-[#24343E]"
            role="img"
            aria-label="MCMC Traceplot der 4 Chains"
          >
            <polyline
              fill="none"
              stroke="#0F6B75"
              strokeWidth={1.6}
              points={makeChain(mode === 'bad-mcmc' ? -24 : 0, mode === 'bad-mcmc' ? -18 : 0, 0.2)}
            />
            <polyline
              fill="none"
              stroke="#D97706"
              strokeWidth={1.6}
              points={makeChain(mode === 'bad-mcmc' ? 20 : 2, mode === 'bad-mcmc' ? 22 : 0, 2.1)}
            />
            <polyline
              fill="none"
              stroke="#3B82F6"
              strokeWidth={1.4}
              opacity={0.75}
              points={makeChain(mode === 'bad-mcmc' ? -6 : -1, mode === 'bad-mcmc' ? 14 : 0, 4.4)}
            />
          </svg>
        </div>

        {/* Residualplot */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-[#4E626C] dark:text-[#96AEB9]">
            <span className="font-medium text-[#111E24] dark:text-[#E6EFF3]">Prüffrage 3: Residuen vs. Vorhersage</span>
            <span className="font-mono tabular-nums">mcse = {info.mcse}</span>
          </div>
          <svg
            viewBox="0 0 380 124"
            className="w-full h-auto rounded-xl bg-[#F3F6F8] dark:bg-[#0F191F] border border-[#DCE4E8] dark:border-[#24343E]"
            role="img"
            aria-label="Residuenplot gegen vorhergesagte Werte"
          >
            <line x1={18} y1={62} x2={364} y2={62} stroke="#8CA0AA" strokeDasharray="4 3" />
            {mode === 'banana' && (
              <path
                d="M 24 30 Q 190 98 356 26"
                fill="none"
                stroke="#D97706"
                strokeWidth={2}
                strokeDasharray="5 3"
              />
            )}
            {mode === 'funnel' && (
              <>
                <line x1={24} y1={54} x2={356} y2={16} stroke="#D97706" strokeWidth={1.6} strokeDasharray="5 3" />
                <line x1={24} y1={70} x2={356} y2={108} stroke="#D97706" strokeWidth={1.6} strokeDasharray="5 3" />
              </>
            )}
            {residuals.map(([x, y], i) => (
              <circle
                key={i}
                cx={x}
                cy={Math.max(10, Math.min(114, y))}
                r={3.5}
                className="fill-[#0F6B75]/80 dark:fill-[#5DC2CC]/80"
              />
            ))}
          </svg>
        </div>
      </div>

      <div className={`rounded-xl border p-4 text-sm space-y-1.5 ${statusTone}`}>
        <div className="font-mono text-xs font-bold tracking-wide">
          {info.status === 'OK' ? '✓ STATUS: OK' : info.status === 'RECHENPROBLEM' ? '✕ STATUS: RECHENPROBLEM (MCMC)' : '▲ STATUS: MODELLPROBLEM (RESIDUEN)'}
        </div>
        <p className="leading-relaxed">
          <RichText text={info.diagnosis} />
        </p>
        <p className="text-xs font-medium opacity-95">Empfehlung: {info.action}</p>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. PREDICTION & COST QUANTILE LAB (epred vs predict)                       */
/* -------------------------------------------------------------------------- */
export const PredictionCostLab: React.FC = () => {
  const [costUnder, setCostUnder] = useState(3);
  const [costOver, setCostOver] = useState(1);

  const median = 43.0;
  const sdPredict = 4.65;
  const sdEpred = 0.45;

  const optQ = computeOptimalQuantile(costUnder, costOver);
  const optKwh = median + normQuantile(optQ) * sdPredict;

  // Build SVG Gaussian curves on [28, 58] -> x in [30, 390]
  const toX = (kwh: number) => 30 + ((kwh - 28) / 30) * 360;
  const buildNormalPath = (sd: number, maxHeight: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 80; i++) {
      const xVal = 28 + (i / 80) * 30;
      const z = (xVal - median) / sd;
      const yVal = Math.exp(-0.5 * z * z);
      const sx = toX(xVal);
      const sy = 165 - yVal * maxHeight;
      pts.push(`${i === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`);
    }
    return pts.join(' ');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-7 space-y-3">
        <svg
          viewBox="0 0 420 196"
          className="w-full h-auto rounded-xl bg-[#F3F6F8] dark:bg-[#0F191F] border border-[#DCE4E8] dark:border-[#24343E]"
          role="img"
          aria-label="Vergleich der Verteilungen von posterior_epred und posterior_predict mit optimalem Kostenquantil"
        >
          {/* 95% HDI bar for predict */}
          <rect
            x={toX(33.8)}
            y={159}
            width={toX(52.1) - toX(33.8)}
            height={6}
            rx={3}
            fill="#0F6B75"
            opacity={0.3}
          />
          {/* 95% HDI bar for epred */}
          <rect
            x={toX(42.1)}
            y={159}
            width={toX(43.8) - toX(42.1)}
            height={6}
            rx={3}
            fill="#0F7B4D"
          />

          {/* Wide posterior_predict curve */}
          <path
            d={`${buildNormalPath(sdPredict, 72)} L ${toX(58)} 165 L ${toX(28)} 165 Z`}
            fill="#0F6B75"
            opacity={0.14}
          />
          <path d={buildNormalPath(sdPredict, 72)} fill="none" stroke="#0F6B75" strokeWidth={2.2} />

          {/* Narrow posterior_epred curve */}
          <path d={buildNormalPath(sdEpred, 138)} fill="none" stroke="#0F7B4D" strokeWidth={2.2} />

          {/* Optimal order quantile vertical line */}
          <line
            x1={toX(optKwh)}
            y1={20}
            x2={toX(optKwh)}
            y2={165}
            stroke="#D97706"
            strokeWidth={2.2}
            strokeDasharray="4 3"
          />
          <circle cx={toX(optKwh)} cy={165} r={4.5} fill="#D97706" />

          <text
            x={Math.min(315, Math.max(40, toX(optKwh) + 6))}
            y={34}
            className="fill-[#9A4E04] dark:fill-[#F6C26B] font-mono text-[11px] font-semibold"
          >
            Bestellmenge: {optKwh.toFixed(1)} kWh ({Math.round(optQ * 100)}%)
          </text>

          {/* Legend inside SVG */}
          <text x={32} y={24} className="fill-[#0F7B4D] dark:fill-[#5DD49B] font-mono text-[10px] font-semibold">
            ― posterior_epred [42.1 ; 43.8]
          </text>
          <text x={32} y={39} className="fill-[#0F6B75] dark:fill-[#5DC2CC] font-mono text-[10px] font-semibold">
            ― posterior_predict [33.8 ; 52.1]
          </text>

          {/* X Axis */}
          <line x1={30} y1={165} x2={390} y2={165} stroke="#8CA0AA" />
          {[30, 35, 40, 43, 48, 55].map((v) => (
            <text
              key={v}
              x={toX(v)}
              y={183}
              textAnchor="middle"
              className="fill-[#5E737D] dark:fill-[#8DA5B0] font-mono text-[10px]"
            >
              {v}
            </text>
          ))}
        </svg>
      </div>

      <div className="lg:col-span-5 space-y-4">
        <div className="rounded-xl bg-[#EEF5F6] dark:bg-[#13262C] border border-[#C4DEE1] dark:border-[#22454D] p-4">
          <div className="text-xs font-medium text-[#395760] dark:text-[#8FC6CE]">
            Kostenoptimales Quantil q* = c_unter / (c_unter + c_über)
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="font-mono font-bold text-2xl text-[#0F6B75] dark:text-[#5DC2CC] tabular-nums">
              {(optQ * 100).toFixed(0)} %
            </span>
            <span className="font-mono text-sm text-[#1F333D] dark:text-[#D5E3EA] tabular-nums">
              → {optKwh.toFixed(1)} kWh einplanen
            </span>
          </div>
          <p className="text-xs text-[#314A53] dark:text-[#B5CDD4] mt-1.5">
            {optQ > 0.55
              ? 'Weil Nachkaufen teurer ist, bestellen wir bewusst MEHR als den Median (43.0 kWh).'
              : optQ < 0.45
                ? 'Weil Überschuss teurer ist, bestellen wir bewusst WENIGER als den Median.'
                : 'Bei symmetrischen Kosten ist der Median (50 % = 43.0 kWh) optimal.'}
          </p>
        </div>

        <div>
          <div className="flex justify-between text-xs font-medium mb-1">
            <label htmlFor="cost-under" className="text-[#1F333D] dark:text-[#D5E3EA]">
              Kosten bei Zu-wenig (c_unter)
            </label>
            <span className="font-mono tabular-nums text-[#0F6B75] dark:text-[#5DC2CC]">{costUnder} €/kWh</span>
          </div>
          <input
            id="cost-under"
            type="range"
            min={1}
            max={9}
            step={1}
            value={costUnder}
            onChange={(e) => setCostUnder(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-medium mb-1">
            <label htmlFor="cost-over" className="text-[#1F333D] dark:text-[#D5E3EA]">
              Kosten bei Zu-viel (c_über)
            </label>
            <span className="font-mono tabular-nums text-[#0F6B75] dark:text-[#5DC2CC]">{costOver} €/kWh</span>
          </div>
          <input
            id="cost-over"
            type="range"
            min={1}
            max={9}
            step={1}
            value={costOver}
            onChange={(e) => setCostOver(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 5. SIMPSON'S PARADOX & CAUSAL ROLES LAB                                    */
/* -------------------------------------------------------------------------- */
type CausalRole = 'confounder' | 'mediator' | 'collider';

const CAUSAL_CARDS: { id: string; label: string; correct: CausalRole; hint: string }[] = [
  {
    id: 'daemmung',
    label: 'Dämmung (beeinflusst Smart-Kauf UND Stromverbrauch)',
    correct: 'confounder',
    hint: 'X ← C → Y: Confounder unbedingt kontrollieren!',
  },
  {
    id: 'wissen',
    label: 'Erlerntes Wissen (Kurs → Wissen → Klausurnote)',
    correct: 'mediator',
    hint: 'X → M → Y: Mediator für die Gesamtwirkung NICHT kontrollieren!',
  },
  {
    id: 'projekt',
    label: 'Projektgruppe (Zutritt durch Kurs ODER hohe Motivation)',
    correct: 'collider',
    hint: 'X → C ← Y: Collider niemals filtern/kontrollieren (erzeugt Scheinzusammenhang)!',
  },
];

export const SimpsonCausalLab: React.FC = () => {
  const [controlled, setControlled] = useState(false);
  const [picks, setPicks] = useState<Record<string, CausalRole>>({});

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left: Visual Simpson Switch */}
      <div className="lg:col-span-6 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs font-medium text-[#111E24] dark:text-[#E6EFF3]">
            Smart-Thermostat-Effekt auf Stromverbrauch
          </span>
          <button
            type="button"
            onClick={() => setControlled((v) => !v)}
            aria-pressed={controlled}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
              controlled
                ? 'bg-[#0F6B75] text-white border-[#0F6B75]'
                : 'bg-white dark:bg-[#14222A] text-[#0F6B75] dark:text-[#5DC2CC] border-[#0F6B75]'
            }`}
          >
            {controlled ? '✓ Nach Dämmung kontrolliert' : 'Nach Dämmung aufsplitten'}
          </button>
        </div>

        <svg
          viewBox="0 0 400 185"
          className="w-full h-auto rounded-xl bg-[#F3F6F8] dark:bg-[#0F191F] border border-[#DCE4E8] dark:border-[#24343E]"
          role="img"
          aria-label="Vergleich des Smart-Thermostat-Effekts ohne und mit Kontrolle der Dämmung"
        >
          {/* X labels */}
          <text x={115} y={172} textAnchor="middle" className="fill-[#5E737D] dark:fill-[#8DA5B0] font-mono text-[11px]">
            smart = 0 (nein)
          </text>
          <text x={285} y={172} textAnchor="middle" className="fill-[#5E737D] dark:fill-[#8DA5B0] font-mono text-[11px]">
            smart = 1 (ja)
          </text>

          {!controlled ? (
            <>
              <line x1={115} y1={52} x2={285} y2={114} stroke="#C0392B" strokeWidth={3} />
              <circle cx={115} cy={52} r={8} fill="#C0392B" />
              <circle cx={285} cy={114} r={8} fill="#C0392B" />
              <text x={115} y={36} textAnchor="middle" className="fill-[#111E24] dark:fill-[#E6EFF3] font-mono text-[11px] font-semibold">
                34.8 kWh
              </text>
              <text x={285} y={98} textAnchor="middle" className="fill-[#111E24] dark:fill-[#E6EFF3] font-mono text-[11px] font-semibold">
                25.9 kWh
              </text>
              <text x={200} y={145} textAnchor="middle" className="fill-[#C0392B] dark:fill-[#F49388] font-mono text-[12px] font-bold">
                Scheinbar −8.62 kWh (vermischt mit Neubauten!)
              </text>
            </>
          ) : (
            <>
              {/* Altbau */}
              <line x1={115} y1={35} x2={285} y2={52} stroke="#B45309" strokeWidth={2.5} />
              <circle cx={115} cy={35} r={5.5} fill="#B45309" />
              <circle cx={285} cy={52} r={5.5} fill="#B45309" />
              <text x={300} y={55} className="fill-[#9A4E04] dark:fill-[#F6C26B] font-mono text-[10px]">Altbau (−2.6)</text>

              {/* Mittel */}
              <line x1={115} y1={78} x2={285} y2={95} stroke="#0F6B75" strokeWidth={2.5} />
              <circle cx={115} cy={78} r={5.5} fill="#0F6B75" />
              <circle cx={285} cy={95} r={5.5} fill="#0F6B75" />
              <text x={300} y={98} className="fill-[#0F6B75] dark:fill-[#5DC2CC] font-mono text-[10px]">Mittel (−2.6)</text>

              {/* Neubau */}
              <line x1={115} y1={118} x2={285} y2={135} stroke="#0F7B4D" strokeWidth={2.5} />
              <circle cx={115} cy={118} r={5.5} fill="#0F7B4D" />
              <circle cx={285} cy={135} r={5.5} fill="#0F7B4D" />
              <text x={300} y={138} className="fill-[#0F7B4D] dark:fill-[#6CD6A1] font-mono text-[10px]">Neubau (−2.6)</text>
            </>
          )}
        </svg>
      </div>

      {/* Right: Interactive Confounder / Mediator / Collider Sorter */}
      <div className="lg:col-span-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-[#111E24] dark:text-[#E6EFF3]">
            Übung: Ordne jede Variable ihrer kausalen Rolle zu
          </span>
          {Object.keys(picks).length > 0 && (
            <button
              type="button"
              onClick={() => setPicks({})}
              className="text-xs text-[#0F6B75] dark:text-[#5DC2CC] flex items-center gap-1 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>

        <div className="space-y-2.5">
          {CAUSAL_CARDS.map((card) => {
            const pick = picks[card.id];
            const isCorrect = pick === card.correct;
            return (
              <div
                key={card.id}
                className="rounded-xl border border-[#DCE4E8] dark:border-[#24343E] bg-white dark:bg-[#131F26] p-3 space-y-2"
              >
                <div className="text-xs font-medium text-[#111E24] dark:text-[#E6EFF3]">{card.label}</div>
                <div className="flex flex-wrap gap-1.5">
                  {(['confounder', 'mediator', 'collider'] as CausalRole[]).map((role) => {
                    const selected = pick === role;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setPicks((prev) => ({ ...prev, [card.id]: role }))}
                        className={`px-2.5 py-1 text-xs font-medium rounded-md border capitalize cursor-pointer transition-colors ${
                          selected
                            ? role === card.correct
                              ? 'bg-[#0F7B4D] text-white border-[#0F7B4D]'
                              : 'bg-[#C0392B] text-white border-[#C0392B]'
                            : 'bg-[#F5F8F9] dark:bg-[#1B2B34] text-[#273B45] dark:text-[#C5D6DF] border-[#CBD7DD] dark:border-[#2A3E48] hover:border-[#0F6B75]'
                        }`}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
                {pick && (
                  <div
                    className={`text-xs flex items-start gap-1.5 ${
                      isCorrect
                        ? 'text-[#0E643E] dark:text-[#6CD6A1]'
                        : 'text-[#A82E22] dark:text-[#F49388]'
                    }`}
                  >
                    {isCorrect ? (
                      <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    )}
                    <span>
                      {isCorrect ? 'Richtig! ' : 'Noch nicht ganz. '}
                      {card.hint}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Re-export AlertTriangle usage helper if needed
export { AlertTriangle };
