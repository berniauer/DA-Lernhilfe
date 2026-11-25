import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import {
  applyOddsRatio,
  classifyCohenF2,
  computeCohenF2,
  computeInteractionEffect,
  computeOptimalCutoff,
  computeQuadraticVertex,
  evaluateCutoff,
  evaluateLooDifference,
  EXAM_WAFER_SAMPLE,
  invLogit,
  logit,
  probToOdds,
} from '../../lib/stats';

/* -------------------------------------------------------------------------- */
/* 6. EFFECT SIZE (UNIT TRAP & COHEN f^2)                                     */
/* -------------------------------------------------------------------------- */
export const EffectSizeLab: React.FC = () => {
  const [r2Full, setR2Full] = useState(0.83);
  const [r2Without, setR2Without] = useState(0.78);
  const [scaleView, setScaleView] = useState<'raw' | 'aic'>('raw');

  const safeWithout = Math.min(r2Full - 0.01, r2Without);
  const f2 = computeCohenF2(r2Full, safeWithout);
  const label = classifyCohenF2(f2);

  const rawBars = [
    { name: 'exposure_time (s)', val: 5.2, display: '|−5.20|', max: 5.5, note: 'Winzige Spannweite (SD = 0.07 s)!' },
    { name: 'machine M5 (vs M1)', val: 1.59, display: '+1.59', max: 5.5, note: 'Große Wirkung im ganzen Werk' },
    { name: 'pressure (mTorr)', val: 0.08, display: '+0.08', max: 5.5, note: 'Große Spannweite (SD = 8.28 mTorr)' },
  ];

  const aicBars = [
    { name: 'machine (Df = 4)', val: 160.5, display: '+160.5 AIC', max: 170, note: 'Wichtigste Variable in m1!' },
    { name: 'pressure (Df = 1)', val: 77.0, display: '+77.0 AIC', max: 170, note: 'Deutlich wichtiger als exposure_time' },
    { name: 'exposure_time (Df = 1)', val: 25.3, display: '+25.3 AIC', max: 170, note: 'Trotz −5.20 kleinster Beitrag in m1!' },
  ];

  const bars = scaleView === 'raw' ? rawBars : aicBars;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left: Unit Trap Comparator */}
      <div className="lg:col-span-6 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs font-medium text-[#111E24] dark:text-[#E6EFF3]">
            Einheiten-Falle (Beispielklausur m1)
          </span>
          <div className="inline-flex rounded-lg bg-[#EDF2F4] dark:bg-[#192830] p-1 border border-[#DCE4E8] dark:border-[#263943]">
            <button
              type="button"
              onClick={() => setScaleView('raw')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer ${
                scaleView === 'raw'
                  ? 'bg-white dark:bg-[#0F6B75] text-[#0E1E25] dark:text-white shadow-xs'
                  : 'text-[#526771] dark:text-[#96AEB9]'
              }`}
            >
              Roh-Koeffizient (täuscht!)
            </button>
            <button
              type="button"
              onClick={() => setScaleView('aic')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md cursor-pointer ${
                scaleView === 'aic'
                  ? 'bg-white dark:bg-[#0F6B75] text-[#0E1E25] dark:text-white shadow-xs'
                  : 'text-[#526771] dark:text-[#96AEB9]'
              }`}
            >
              effectsize ΔAIC (fair!)
            </button>
          </div>
        </div>

        <div className="space-y-3 rounded-xl bg-[#F3F6F8] dark:bg-[#0F191F] border border-[#DCE4E8] dark:border-[#24343E] p-4">
          {bars.map((b) => (
            <div key={b.name} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-mono font-medium text-[#111E24] dark:text-[#E6EFF3]">{b.name}</span>
                <span className="font-mono font-semibold text-[#0F6B75] dark:text-[#5DC2CC] tabular-nums">
                  {b.display}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-[#DCE4E8] dark:bg-[#22333D] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    scaleView === 'raw' ? 'bg-[#D97706]' : 'bg-[#0F6B75]'
                  }`}
                  style={{ width: `${Math.max(4, (b.val / b.max) * 100)}%` }}
                />
              </div>
              <div className="text-[11px] text-[#526771] dark:text-[#93AAB5]">{b.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Interactive f2 Calculator */}
      <div className="lg:col-span-6 space-y-4">
        <div className="rounded-xl bg-[#EEF5F6] dark:bg-[#13262C] border border-[#C4DEE1] dark:border-[#22454D] p-4">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xs font-medium text-[#395760] dark:text-[#8FC6CE]">
              Cohens f² = (R²_mit − R²_ohne) / (1 − R²_mit)
            </span>
            <span className="font-mono text-xs font-semibold text-[#0F6B75] dark:text-[#5DC2CC]">
              Effekt: {label}
            </span>
          </div>
          <div className="font-mono font-bold text-3xl text-[#0F6B75] dark:text-[#5DC2CC] tabular-nums mt-1">
            f² = {f2.toFixed(3)}
          </div>

          {/* Stacked Variance Bar */}
          <div className="mt-3 h-4 rounded-md overflow-hidden flex border border-[#C4DEE1] dark:border-[#264B53]">
            <div
              style={{ width: `${safeWithout * 100}%` }}
              className="bg-[#94AEB8] dark:bg-[#3A5662]"
              title="R² ohne Variable"
            />
            <div
              style={{ width: `${(r2Full - safeWithout) * 100}%` }}
              className="bg-[#0F6B75] dark:bg-[#49B9C4]"
              title="Zusätzlich erklärt"
            />
            <div
              style={{ width: `${(1 - r2Full) * 100}%` }}
              className="bg-[#FFFFFF] dark:bg-[#0F191F]"
              title="Unerklärte Restvarianz"
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-[#435963] dark:text-[#9BB3BE] mt-1.5 tabular-nums">
            <span>Basis: {(safeWithout * 100).toFixed(0)} %</span>
            <span>+ΔR²: {((r2Full - safeWithout) * 100).toFixed(0)} Pp.</span>
            <span>Rest: {((1 - r2Full) * 100).toFixed(0)} %</span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <label htmlFor="f2-full">R² mit Variable</label>
              <span className="font-mono tabular-nums">{r2Full.toFixed(2)}</span>
            </div>
            <input
              id="f2-full"
              type="range"
              min={0.2}
              max={0.95}
              step={0.01}
              value={r2Full}
              onChange={(e) => {
                const next = Number(e.target.value);
                setR2Full(next);
                if (r2Without >= next) setR2Without(Math.max(0.05, Number((next - 0.05).toFixed(2))));
              }}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <label htmlFor="f2-without">R² ohne Variable</label>
              <span className="font-mono tabular-nums">{safeWithout.toFixed(2)}</span>
            </div>
            <input
              id="f2-without"
              type="range"
              min={0.05}
              max={Math.max(0.1, Number((r2Full - 0.01).toFixed(2)))}
              step={0.01}
              value={safeWithout}
              onChange={(e) => setR2Without(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 7. INTERACTION & QUADRATIC U-CURVE LAB                                     */
/* -------------------------------------------------------------------------- */
export const InteractionNonlinearLab: React.FC = () => {
  const [tab, setTab] = useState<'interaction' | 'quadratic'>('interaction');
  const [probeTemp, setProbeTemp] = useState(0);
  const [b2Quad, setB2Quad] = useState(0.02);

  // Interaction: Altbau = 37.84 - 1.58*(T-5); Neubau = (37.84 - 15.25) + (-1.58 + 1.05)*(T-5)
  const intRes = computeInteractionEffect(-1.58, -15.25, 1.05, probeTemp, 5);
  const yAlt = 37.84 - 1.58 * (probeTemp - 5);
  const yNeu = yAlt + intRes.groupDiffAtX;

  // Quadratic humidity defect curve: logit = -2.0 + 0.13*(h - 45) + b2Quad*(h - 45)^2
  const vertex = computeQuadraticVertex(45, 0.13, b2Quad);

  const mapTempX = (t: number) => 45 + ((t + 10) / 25) * 340;
  const mapKwhY = (k: number) => 180 - ((k - 10) / 58) * 155;

  const mapHumX = (h: number) => 45 + ((h - 30) / 30) * 340;
  const mapProbY = (p: number) => 180 - p * 150;

  const buildCurve = (quadratic: boolean) => {
    const pts: string[] = [];
    for (let h = 30; h <= 60; h += 1) {
      const dh = h - 45;
      const eta = -2.1 + 0.13 * dh + (quadratic ? b2Quad * dh * dh : 0);
      const p = invLogit(eta);
      pts.push(`${h === 30 ? 'M' : 'L'} ${mapHumX(h).toFixed(1)} ${mapProbY(p).toFixed(1)}`);
    }
    return pts.join(' ');
  };

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-lg bg-[#EDF2F4] dark:bg-[#192830] p-1 border border-[#DCE4E8] dark:border-[#263943]">
        <button
          type="button"
          onClick={() => setTab('interaction')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
            tab === 'interaction'
              ? 'bg-white dark:bg-[#0F6B75] text-[#0E1E25] dark:text-white shadow-xs'
              : 'text-[#526771] dark:text-[#96AEB9]'
          }`}
        >
          1. Interaktion (verschiedene Steigungen)
        </button>
        <button
          type="button"
          onClick={() => setTab('quadratic')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
            tab === 'quadratic'
              ? 'bg-white dark:bg-[#0F6B75] text-[#0E1E25] dark:text-white shadow-xs'
              : 'text-[#526771] dark:text-[#96AEB9]'
          }`}
        >
          2. Quadratische U-Form (m1 vs. m2)
        </button>
      </div>

      {tab === 'interaction' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <svg
              viewBox="0 0 415 205"
              className="w-full h-auto rounded-xl bg-[#F3F6F8] dark:bg-[#0F191F] border border-[#DCE4E8] dark:border-[#24343E]"
              role="img"
              aria-label="Interaktionsdiagramm: Stromverbrauch bei alter vs neuer Dämmung über Temperatur"
            >
              {/* Reference line 5°C */}
              <line x1={mapTempX(5)} y1={20} x2={mapTempX(5)} y2={180} stroke="#94A3B8" strokeDasharray="3 3" />
              <text x={mapTempX(5) + 4} y={32} className="fill-[#64748B] font-mono text-[10px]">
                Referenz 5°C
              </text>

              {/* Altbau line */}
              <line
                x1={mapTempX(-10)}
                y1={mapKwhY(37.84 - 1.58 * -15)}
                x2={mapTempX(15)}
                y2={mapKwhY(37.84 - 1.58 * 10)}
                stroke="#C0392B"
                strokeWidth={2.5}
              />
              {/* Neubau line */}
              <line
                x1={mapTempX(-10)}
                y1={mapKwhY(22.59 - 0.53 * -15)}
                x2={mapTempX(15)}
                y2={mapKwhY(22.59 - 0.53 * 10)}
                stroke="#0F6B75"
                strokeWidth={2.5}
              />

              {/* Vertical gap marker at probeTemp */}
              <line
                x1={mapTempX(probeTemp)}
                y1={mapKwhY(yAlt)}
                x2={mapTempX(probeTemp)}
                y2={mapKwhY(yNeu)}
                stroke="#D97706"
                strokeWidth={2.5}
              />
              <circle cx={mapTempX(probeTemp)} cy={mapKwhY(yAlt)} r={4.5} fill="#C0392B" />
              <circle cx={mapTempX(probeTemp)} cy={mapKwhY(yNeu)} r={4.5} fill="#0F6B75" />

              <text x={52} y={44} className="fill-[#C0392B] dark:fill-[#F49388] font-mono text-[10px] font-semibold">
                Altbau (Steigung −1.58/°C)
              </text>
              <text x={52} y={136} className="fill-[#0F6B75] dark:fill-[#5DC2CC] font-mono text-[10px] font-semibold">
                Neubau (Steigung −0.53/°C)
              </text>

              <line x1={45} y1={180} x2={385} y2={180} stroke="#8CA0AA" />
              {[-10, -5, 0, 5, 10, 15].map((t) => (
                <text key={t} x={mapTempX(t)} y={196} textAnchor="middle" className="fill-[#5E737D] dark:fill-[#8DA5B0] font-mono text-[10px]">
                  {t}°C
                </text>
              ))}
            </svg>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-xl bg-[#EEF5F6] dark:bg-[#13262C] border border-[#C4DEE1] dark:border-[#22454D] p-4 space-y-1.5">
              <div className="text-xs text-[#395760] dark:text-[#8FC6CE]">
                Unterschied Neubau − Altbau bei <strong>{probeTemp} °C</strong>
              </div>
              <div className="font-mono font-bold text-2xl text-[#0F6B75] dark:text-[#5DC2CC] tabular-nums">
                {intRes.groupDiffAtX.toFixed(1)} kWh/Tag
              </div>
              <div className="font-mono text-xs text-[#435963] dark:text-[#A4BBC5] tabular-nums">
                −15.25 + 1.05 · ({probeTemp} − 5) = {intRes.groupDiffAtX.toFixed(2)}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <label htmlFor="int-temp">Außentemperatur testen</label>
                <span className="font-mono tabular-nums text-[#0F6B75] dark:text-[#5DC2CC]">{probeTemp} °C</span>
              </div>
              <input
                id="int-temp"
                type="range"
                min={-10}
                max={15}
                step={1}
                value={probeTemp}
                onChange={(e) => setProbeTemp(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-[#4E626C] dark:text-[#96AEB9] mt-2">
                Je kälter es wird, desto größer ist die Ersparnis durch neue Dämmung! Bei 5 °C siehst du
                exakt den Haupteffekt <code className="font-mono">−15.25</code>.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <svg
              viewBox="0 0 415 205"
              className="w-full h-auto rounded-xl bg-[#F3F6F8] dark:bg-[#0F191F] border border-[#DCE4E8] dark:border-[#24343E]"
              role="img"
              aria-label="Vergleich lineares Modell m1 vs quadratisches Modell m2 für Luftfeuchtigkeit"
            >
              {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                <g key={p}>
                  <line x1={45} y1={mapProbY(p)} x2={385} y2={mapProbY(p)} stroke="currentColor" className="text-[#DCE4E8] dark:text-[#22333D]" strokeDasharray="3 3" />
                  <text x={38} y={mapProbY(p) + 4} textAnchor="end" className="fill-[#5E737D] dark:fill-[#8DA5B0] font-mono text-[10px]">
                    {Math.round(p * 100)}%
                  </text>
                </g>
              ))}

              {/* m1 linear-on-logit */}
              <path d={buildCurve(false)} fill="none" stroke="#94A3B8" strokeWidth={2} strokeDasharray="5 4" />
              {/* m2 quadratic */}
              <path d={buildCurve(true)} fill="none" stroke="#0F6B75" strokeWidth={2.7} />

              {/* Vertex marker */}
              {vertex >= 30 && vertex <= 60 && (
                <>
                  <line x1={mapHumX(vertex)} y1={25} x2={mapHumX(vertex)} y2={180} stroke="#0F7B4D" strokeWidth={1.8} strokeDasharray="4 3" />
                  <text x={mapHumX(vertex) + 6} y={40} className="fill-[#0F7B4D] dark:fill-[#6CD6A1] font-mono text-[10px] font-semibold">
                    Optimum x* ≈ {vertex.toFixed(1)} %
                  </text>
                </>
              )}

              <text x={54} y={24} className="fill-[#64748B] font-mono text-[10px]">-- m1 (nur linear)</text>
              <text x={180} y={24} className="fill-[#0F6B75] dark:fill-[#5DC2CC] font-mono text-[10px] font-semibold">― m2 (mit (x−45)²)</text>

              {[30, 35, 40, 45, 50, 55, 60].map((h) => (
                <text key={h} x={mapHumX(h)} y={196} textAnchor="middle" className="fill-[#5E737D] dark:fill-[#8DA5B0] font-mono text-[10px]">
                  {h}%
                </text>
              ))}
            </svg>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-xl bg-[#EEF5F6] dark:bg-[#13262C] border border-[#C4DEE1] dark:border-[#22454D] p-4">
              <div className="text-xs text-[#395760] dark:text-[#8FC6CE]">
                Scheitelpunkt x* = c − β₁ / (2 · β₂)
              </div>
              <div className="font-mono font-bold text-2xl text-[#0F6B75] dark:text-[#5DC2CC] tabular-nums mt-1">
                {vertex.toFixed(1)} % Luftfeuchtigkeit
              </div>
              <p className="text-xs text-[#314A53] dark:text-[#B5CDD4] mt-1.5">
                Ohne den quadratischen Term (m1, gestrichelt) glaubt das Modell, 30 % sei am besten. Erst
                m2 erkennt das echte Prozessfenster um ~40–45 %!
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <label htmlFor="quad-b2">Krümmung β₂ für (humidity − 45)²</label>
                <span className="font-mono tabular-nums text-[#0F6B75] dark:text-[#5DC2CC]">{b2Quad.toFixed(3)}</span>
              </div>
              <input
                id="quad-b2"
                type="range"
                min={0}
                max={0.04}
                step={0.002}
                value={b2Quad}
                onChange={(e) => setB2Quad(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 8. LOO COMPARE & PARETO K LAB                                              */
/* -------------------------------------------------------------------------- */
export const LooCompareLab: React.FC = () => {
  const [elpdDiff, setElpdDiff] = useState(-222.8);
  const [seDiff, setSeDiff] = useState(24.0);
  const [paretoK, setParetoK] = useState(0.42);

  const loo = evaluateLooDifference(elpdDiff, seDiff);
  const paretoStatus =
    paretoK < 0.7
      ? { label: '✓ OK (< 0.7)', tone: 'text-[#0E643E] dark:text-[#6CD6A1]', desc: 'LOO-Approximation ist zuverlässig.' }
      : paretoK <= 1.0
        ? { label: '▲ PROBLEMATISCH (0.7–1.0)', tone: 'text-[#9A4E04] dark:text-[#F6C26B]', desc: 'Einzelne einflussreiche Beobachtungen prüfen.' }
        : { label: '✕ SCHLECHT (> 1.0)', tone: 'text-[#A82E22] dark:text-[#F49388]', desc: 'LOO unzuverlässig – kfold() oder Modell prüfen!' };

  // Visual bar positioning for [elpdDiff - 2*se, elpdDiff + 2*se] relative to 0
  const maxAbs = Math.max(Math.abs(elpdDiff) + 2.5 * seDiff, 20);
  const mapX = (v: number) => 350 + (v / maxAbs) * 310;
  const lowX = Math.max(20, mapX(elpdDiff - 2 * seDiff));
  const highX = Math.min(395, mapX(elpdDiff + 2 * seDiff));
  const midX = Math.max(20, Math.min(395, mapX(elpdDiff)));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-7 space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => { setElpdDiff(-222.8); setSeDiff(24.0); }}
            className="px-2.5 py-1 text-xs font-medium rounded-lg border border-[#CBD7DD] dark:border-[#2C404B] hover:border-[#0F6B75] cursor-pointer"
          >
            Beispielklausur (−222.8 ± 24)
          </button>
          <button
            type="button"
            onClick={() => { setElpdDiff(-3.1); setSeDiff(2.5); }}
            className="px-2.5 py-1 text-xs font-medium rounded-lg border border-[#CBD7DD] dark:border-[#2C404B] hover:border-[#0F6B75] cursor-pointer"
          >
            Knappes Duell (−3.1 ± 2.5)
          </button>
          <button
            type="button"
            onClick={() => { setElpdDiff(-109.6); setSeDiff(15.4); }}
            className="px-2.5 py-1 text-xs font-medium rounded-lg border border-[#CBD7DD] dark:border-[#2C404B] hover:border-[#0F6B75] cursor-pointer"
          >
            Wärmepumpen (−109.6 ± 15.4)
          </button>
        </div>

        <svg
          viewBox="0 0 410 120"
          className="w-full h-auto rounded-xl bg-[#F3F6F8] dark:bg-[#0F191F] border border-[#DCE4E8] dark:border-[#24343E]"
          role="img"
          aria-label="Visualisierung der 2-mal-SE-Regel bei loo_compare"
        >
          {/* Zero reference line (Best model) */}
          <line x1={350} y1={16} x2={350} y2={92} stroke="#0F7B4D" strokeWidth={2} strokeDasharray="4 3" />
          <text x={350} y={108} textAnchor="middle" className="fill-[#0F7B4D] dark:fill-[#6CD6A1] font-mono text-[10px] font-semibold">
            0 (Bestes Modell)
          </text>

          {/* 2*se interval bar */}
          <line
            x1={lowX}
            y1={56}
            x2={highX}
            y2={56}
            stroke={loo.isConvincing ? '#0F6B75' : '#D97706'}
            strokeWidth={5}
            strokeLinecap="round"
          />
          <circle cx={midX} cy={56} r={6} fill={loo.isConvincing ? '#0F6B75' : '#D97706'} />
          <text x={Math.max(40, Math.min(280, midX))} y={36} textAnchor="middle" className="fill-[#111E24] dark:fill-[#E6EFF3] font-mono text-[11px] font-semibold">
            elpd_diff = {elpdDiff.toFixed(1)} (±2·se = ±{(2 * seDiff).toFixed(1)})
          </text>
        </svg>

        <div className="rounded-xl bg-[#EEF5F6] dark:bg-[#13262C] border border-[#C4DEE1] dark:border-[#22454D] p-3.5 text-xs leading-relaxed">
          <div className="font-mono font-bold text-[#0F6B75] dark:text-[#5DC2CC] mb-1 tabular-nums">
            |elpd_diff| / se_diff = {loo.zRatio.toFixed(1)} · {loo.isConvincing ? '✓ KLARER UNTERSCHIED (> 2·se)' : '▲ KEIN KLARER UNTERSCHIED (≤ 2·se)'}
          </div>
          {loo.isConvincing
            ? 'Das 2·se-Intervall berührt die 0 nicht – das obere Modell prognostiziert überzeugend besser.'
            : 'Das 2·se-Intervall überlappt mit 0 – das einfachere Modell ist fachlich gut vertretbar.'}
        </div>
      </div>

      <div className="lg:col-span-5 space-y-4">
        <div>
          <div className="flex justify-between text-xs font-medium mb-1">
            <label htmlFor="loo-diff">elpd_diff (schlechteres Modell)</label>
            <span className="font-mono tabular-nums">{elpdDiff.toFixed(1)}</span>
          </div>
          <input
            id="loo-diff"
            type="range"
            min={-250}
            max={-1}
            step={0.5}
            value={elpdDiff}
            onChange={(e) => setElpdDiff(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-medium mb-1">
            <label htmlFor="loo-se">Unsicherheit se_diff</label>
            <span className="font-mono tabular-nums">{seDiff.toFixed(1)}</span>
          </div>
          <input
            id="loo-se"
            type="range"
            min={1}
            max={35}
            step={0.5}
            value={seDiff}
            onChange={(e) => setSeDiff(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="pt-3 border-t border-[#DCE4E8] dark:border-[#24343E] space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <label htmlFor="pareto-k">Maximaler Pareto k prüfen</label>
            <span className="font-mono tabular-nums">{paretoK.toFixed(2)}</span>
          </div>
          <input
            id="pareto-k"
            type="range"
            min={0.1}
            max={1.4}
            step={0.02}
            value={paretoK}
            onChange={(e) => setParetoK(Number(e.target.value))}
            className="w-full"
          />
          <div className={`font-mono text-xs font-bold ${paretoStatus.tone}`}>
            {paretoStatus.label}
          </div>
          <div className="text-xs text-[#4E626C] dark:text-[#96AEB9]">{paretoStatus.desc}</div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 9. LOGISTIC REGRESSION: LOGIT/OR + CUTOFF COCKPIT (EXAM CORE!)             */
/* -------------------------------------------------------------------------- */
export const LogisticCutoffLab: React.FC = () => {
  const [subTab, setSubTab] = useState<'odds' | 'cutoff'>('cutoff');

  // Tab 1: Odds Ratio state
  const [baseP, setBaseP] = useState(10);
  const [beta, setBeta] = useState(1.41); // shiftNight in Beispielklausur!
  const or = Math.exp(beta);
  const newP = applyOddsRatio(baseP / 100, or);
  const naiveTrap = Math.min(100, baseP * or);

  // Tab 2: Cutoff state
  const [cutoff, setCutoff] = useState(0.3);
  const [costFP, setCostFP] = useState(30);
  const [costFN, setCostFN] = useState(300);

  const metrics = evaluateCutoff(cutoff, costFP, costFN);
  const optCutoff = computeOptimalCutoff(costFP, costFN);

  // Build ROC points across cutoffs
  const rocPath = (() => {
    const pts: string[] = [];
    for (let c = 1.0; c >= 0.0; c -= 0.04) {
      const m = evaluateCutoff(Number(c.toFixed(2)), costFP, costFN);
      const x = 34 + m.fpr * 140;
      const y = 152 - m.tpr * 130;
      pts.push(`${pts.length === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return pts.join(' ');
  })();

  // Build S-curve points for Tab 1
  const sCurvePath = (() => {
    const pts: string[] = [];
    for (let eta = -5; eta <= 5; eta += 0.25) {
      const x = 42 + ((eta + 5) / 10) * 330;
      const y = 170 - invLogit(eta) * 140;
      pts.push(`${pts.length === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return pts.join(' ');
  })();

  const eta0 = logit(baseP / 100);
  const eta1 = eta0 + beta;
  const mapEtaX = (e: number) => 42 + ((Math.max(-5, Math.min(5, e)) + 5) / 10) * 330;
  const mapPY = (p: number) => 170 - p * 140;

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-lg bg-[#EDF2F4] dark:bg-[#192830] p-1 border border-[#DCE4E8] dark:border-[#263943]">
        <button
          type="button"
          onClick={() => setSubTab('cutoff')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
            subTab === 'cutoff'
              ? 'bg-white dark:bg-[#0F6B75] text-[#0E1E25] dark:text-white shadow-xs'
              : 'text-[#526771] dark:text-[#96AEB9]'
          }`}
        >
          1. Cutoff- & Kosten-Cockpit (100 Wafer)
        </button>
        <button
          type="button"
          onClick={() => setSubTab('odds')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
            subTab === 'odds'
              ? 'bg-white dark:bg-[#0F6B75] text-[#0E1E25] dark:text-white shadow-xs'
              : 'text-[#526771] dark:text-[#96AEB9]'
          }`}
        >
          2. Logit & Odds-Ratio (OR-Falle verstehen)
        </button>
      </div>

      {subTab === 'cutoff' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: 100-Wafer Confusion Grid + Mini ROC */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-7">
                <div className="text-xs font-medium text-[#111E24] dark:text-[#E6EFF3] mb-1.5">
                  100 Test-Wafer (25 echte Defekte, 75 gute)
                </div>
                <div className="grid grid-cols-10 gap-1 p-2.5 rounded-xl bg-[#F3F6F8] dark:bg-[#0F191F] border border-[#DCE4E8] dark:border-[#24343E]">
                  {EXAM_WAFER_SAMPLE.map((w, idx) => {
                    const pred = w.prob >= cutoff;
                    const kind =
                      w.actual === 1 && pred
                        ? 'tp'
                        : w.actual === 1 && !pred
                          ? 'fn'
                          : w.actual === 0 && pred
                            ? 'fp'
                            : 'tn';
                    const cls =
                      kind === 'tp'
                        ? 'bg-[#0F7B4D] text-white'
                        : kind === 'fn'
                          ? 'bg-[#C0392B] text-white'
                          : kind === 'fp'
                            ? 'bg-[#D97706] text-white'
                            : 'bg-white dark:bg-[#1B2B34] text-[#8FA3AE] border border-[#D4DFE4] dark:border-[#2A3D47]';
                    const sym = kind === 'tp' ? '✓' : kind === 'fn' ? '✕' : kind === 'fp' ? '!' : '·';
                    return (
                      <div
                        key={idx}
                        title={`p=${w.prob.toFixed(2)} · echt=${w.actual}`}
                        className={`aspect-square rounded text-[10px] font-mono font-bold flex items-center justify-center select-none ${cls}`}
                      >
                        {sym}
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[11px] font-mono text-[#4E626C] dark:text-[#96AEB9]">
                  <span><strong className="text-[#0F7B4D] dark:text-[#6CD6A1]">✓</strong> TP</span>
                  <span><strong className="text-[#C0392B] dark:text-[#F49388]">✕</strong> FN (übersehen)</span>
                  <span><strong className="text-[#B45309] dark:text-[#F6C26B]">!</strong> FP (Fehlalarm)</span>
                  <span><strong>·</strong> TN (ok)</span>
                </div>
              </div>

              {/* Mini ROC Curve */}
              <div className="sm:col-span-5">
                <div className="text-xs font-medium text-[#111E24] dark:text-[#E6EFF3] mb-1.5">
                  ROC-Kurve (AUC ≈ 0.91)
                </div>
                <svg
                  viewBox="0 0 190 175"
                  className="w-full h-auto rounded-xl bg-[#F3F6F8] dark:bg-[#0F191F] border border-[#DCE4E8] dark:border-[#24343E]"
                  role="img"
                  aria-label="ROC-Kurve mit aktuellem Cutoff-Punkt"
                >
                  <line x1={34} y1={152} x2={174} y2={22} stroke="#94A3B8" strokeDasharray="3 3" />
                  <path d={rocPath} fill="none" stroke="#0F6B75" strokeWidth={2.5} />
                  <circle
                    cx={34 + metrics.fpr * 140}
                    cy={152 - metrics.tpr * 130}
                    r={5.5}
                    fill="#D97706"
                    stroke="#FFFFFF"
                    strokeWidth={1.8}
                  />
                  <line x1={34} y1={152} x2={174} y2={152} stroke="#8CA0AA" />
                  <line x1={34} y1={22} x2={34} y2={152} stroke="#8CA0AA" />
                  <text x={104} y={168} textAnchor="middle" className="fill-[#5E737D] dark:fill-[#8DA5B0] font-mono text-[10px]">
                    FPR (Fehlalarm)
                  </text>
                  <text x={14} y={88} textAnchor="middle" transform="rotate(-90 14 88)" className="fill-[#5E737D] dark:fill-[#8DA5B0] font-mono text-[10px]">
                    TPR
                  </text>
                </svg>
              </div>
            </div>

            {/* 4 Key Rates */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs tabular-nums">
              <div className="rounded-lg border border-[#DCE4E8] dark:border-[#24343E] bg-white dark:bg-[#131F26] p-2.5">
                <div className="text-[#526771] dark:text-[#93AAB5]">TPR (erkannt)</div>
                <div className="text-base font-bold text-[#0F7B4D] dark:text-[#6CD6A1]">
                  {(metrics.tpr * 100).toFixed(0)} %
                </div>
                <div className="text-[10px] text-[#647B86]">{metrics.tp} / 25 Defekte</div>
              </div>
              <div className="rounded-lg border border-[#DCE4E8] dark:border-[#24343E] bg-white dark:bg-[#131F26] p-2.5">
                <div className="text-[#526771] dark:text-[#93AAB5]">FNR (übersehen)</div>
                <div className="text-base font-bold text-[#C0392B] dark:text-[#F49388]">
                  {(metrics.fnr * 100).toFixed(0)} %
                </div>
                <div className="text-[10px] text-[#647B86]">{metrics.fn} / 25 Defekte</div>
              </div>
              <div className="rounded-lg border border-[#DCE4E8] dark:border-[#24343E] bg-white dark:bg-[#131F26] p-2.5">
                <div className="text-[#526771] dark:text-[#93AAB5]">FPR (Fehlalarm)</div>
                <div className="text-base font-bold text-[#B45309] dark:text-[#F6C26B]">
                  {(metrics.fpr * 100).toFixed(0)} %
                </div>
                <div className="text-[10px] text-[#647B86]">{metrics.fp} / 75 Gute</div>
              </div>
              <div className="rounded-lg border border-[#DCE4E8] dark:border-[#24343E] bg-white dark:bg-[#131F26] p-2.5">
                <div className="text-[#526771] dark:text-[#93AAB5]">Gesamtkosten</div>
                <div className="text-base font-bold text-[#0F6B75] dark:text-[#5DC2CC]">
                  {metrics.totalCost.toLocaleString('de-DE')} €
                </div>
                <div className="text-[10px] text-[#647B86]">pro 100 Wafer</div>
              </div>
            </div>
          </div>

          {/* Right: Cutoff & Cost Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-xl bg-[#EEF5F6] dark:bg-[#13262C] border border-[#C4DEE1] dark:border-[#22454D] p-4 space-y-2">
              <div className="flex justify-between items-baseline">
                <label htmlFor="cutoff-slider" className="text-xs font-semibold text-[#111E24] dark:text-[#E6EFF3]">
                  Alarm-Cutoff (Schwellenwert p)
                </label>
                <span className="font-mono font-bold text-xl text-[#0F6B75] dark:text-[#5DC2CC] tabular-nums">
                  {cutoff.toFixed(2)}
                </span>
              </div>
              <input
                id="cutoff-slider"
                type="range"
                min={0.05}
                max={0.95}
                step={0.01}
                value={cutoff}
                onChange={(e) => setCutoff(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setCutoff(0.3)}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-white dark:bg-[#1A3138] border border-[#BBD7DB] dark:border-[#2B525B] cursor-pointer"
                >
                  Klausur-Ziel (0.30 · TPR ≥ 75%)
                </button>
                <button
                  type="button"
                  onClick={() => setCutoff(Number(optCutoff.toFixed(2)))}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-white dark:bg-[#1A3138] border border-[#BBD7DB] dark:border-[#2B525B] cursor-pointer"
                >
                  Kostenoptimum ({optCutoff.toFixed(2)})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <label htmlFor="cost-fp">Fehlalarm (c_FP)</label>
                  <span className="font-mono tabular-nums">{costFP} €</span>
                </div>
                <input
                  id="cost-fp"
                  type="range"
                  min={10}
                  max={150}
                  step={10}
                  value={costFP}
                  onChange={(e) => setCostFP(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <label htmlFor="cost-fn">Übersehen (c_FN)</label>
                  <span className="font-mono tabular-nums">{costFN} €</span>
                </div>
                <input
                  id="cost-fn"
                  type="range"
                  min={50}
                  max={600}
                  step={50}
                  value={costFN}
                  onChange={(e) => setCostFN(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="text-xs text-[#435963] dark:text-[#9DB4BF] leading-relaxed">
              Klausur-Check: Bei Cutoff <code className="font-mono">{cutoff.toFixed(2)}</code> gilt{' '}
              {metrics.fnr <= 0.25 ? (
                <strong className="text-[#0E643E] dark:text-[#6CD6A1]">✓ Maximal 1 von 4 Defekten übersehen erfüllt!</strong>
              ) : (
                <strong className="text-[#A82E22] dark:text-[#F49388]">✕ Mehr als 25 % Defekte übersehen – Cutoff senken!</strong>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <svg
              viewBox="0 0 400 195"
              className="w-full h-auto rounded-xl bg-[#F3F6F8] dark:bg-[#0F191F] border border-[#DCE4E8] dark:border-[#24343E]"
              role="img"
              aria-label="Logistische S-Kurve: Auswirkung einer Odds-Ratio auf die Wahrscheinlichkeit"
            >
              {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                <g key={p}>
                  <line x1={42} y1={mapPY(p)} x2={372} y2={mapPY(p)} stroke="currentColor" className="text-[#DCE4E8] dark:text-[#22333D]" strokeDasharray="3 3" />
                  <text x={36} y={mapPY(p) + 4} textAnchor="end" className="fill-[#5E737D] dark:fill-[#8DA5B0] font-mono text-[10px]">
                    {Math.round(p * 100)}%
                  </text>
                </g>
              ))}
              <line x1={mapEtaX(0)} y1={24} x2={mapEtaX(0)} y2={170} stroke="#94A3B8" strokeDasharray="3 3" />
              <path d={sCurvePath} fill="none" stroke="#0F6B75" strokeWidth={2.5} />

              {/* Baseline point */}
              <circle cx={mapEtaX(eta0)} cy={mapPY(baseP / 100)} r={5.5} fill="#526771" />
              {/* Shifted point */}
              <circle cx={mapEtaX(eta1)} cy={mapPY(newP)} r={6.5} fill="#D97706" stroke="#FFFFFF" strokeWidth={2} />

              <text x={207} y={188} textAnchor="middle" className="fill-[#5E737D] dark:fill-[#8DA5B0] font-mono text-[10px]">
                Logit-Skala (Logit 0 ↔ 50 %)
              </text>
            </svg>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-xl bg-[#EEF5F6] dark:bg-[#13262C] border border-[#C4DEE1] dark:border-[#22454D] p-4 space-y-2">
              <div className="font-mono text-xs text-[#395760] dark:text-[#8FC6CE] tabular-nums">
                β = {beta.toFixed(2)} → Odds-Ratio e^β = <strong>{or.toFixed(2)}</strong>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono tabular-nums">
                <div className="rounded-lg bg-white dark:bg-[#101C22] p-2.5 border border-[#C4DEE1] dark:border-[#25454D]">
                  <div className="text-[11px] text-[#0E643E] dark:text-[#6CD6A1]">✓ Richtig (über Odds)</div>
                  <div className="text-lg font-bold text-[#0F6B75] dark:text-[#5DC2CC]">
                    {(newP * 100).toFixed(1)} %
                  </div>
                </div>
                <div className="rounded-lg bg-[#FBEAE8] dark:bg-[#351B18] p-2.5 border border-[#EFC3BE] dark:border-[#5D2A25]">
                  <div className="text-[11px] text-[#A82E22] dark:text-[#F49388]">✕ Falle (p × OR)</div>
                  <div className="text-lg font-bold text-[#A82E22] dark:text-[#F49388] line-through">
                    {naiveTrap.toFixed(1)} %
                  </div>
                </div>
              </div>
              <div className="font-mono text-[11px] text-[#435963] dark:text-[#A4BBC5] tabular-nums">
                Basis-Odds {probToOdds(baseP / 100).toFixed(2)} × {or.toFixed(2)} = {(probToOdds(baseP / 100) * or).toFixed(2)} → p = {(newP * 100).toFixed(1)} %
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <label htmlFor="or-base">Ausgangs-Wahrscheinlichkeit (z. B. Tag)</label>
                <span className="font-mono tabular-nums">{baseP} %</span>
              </div>
              <input
                id="or-base"
                type="range"
                min={2}
                max={60}
                step={1}
                value={baseP}
                onChange={(e) => setBaseP(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <label htmlFor="or-beta">Logit-Koeffizient β (Nacht = 1.41)</label>
                <span className="font-mono tabular-nums">{beta.toFixed(2)} (OR {or.toFixed(2)})</span>
              </div>
              <input
                id="or-beta"
                type="range"
                min={-1.5}
                max={2.2}
                step={0.05}
                value={beta}
                onChange={(e) => setBeta(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 10. SPLIT STRATEGY & LIVE DRIFT SIMULATOR                                  */
/* -------------------------------------------------------------------------- */
const SPLIT_CHALLENGES = [
  {
    id: 'future',
    question: 'Ziel: Defekte in den NÄCHSTEN Produktionswochen vorhersagen.',
    options: ['Zufälliger Split', 'Zeitlicher Split', 'Leave-one-machine-out'],
    correct: 1,
    reason: 'Nur ein zeitlicher Split (früher trainieren, später testen) prüft realistisch gegen Zeittrends und Drift.',
  },
  {
    id: 'machine',
    question: 'Ziel: Funktionieren die Vorhersagen auf der nagelneuen Maschine M6?',
    options: ['Zufälliger Split', 'Zeitlicher Split', 'Leave-one-machine-out'],
    correct: 2,
    reason: 'Gruppierter Split (ganze Maschine zurückhalten) prüft Übertragbarkeit auf unbekannte Anlagen.',
  },
];

export const SplitDriftLab: React.FC = () => {
  const [driftLevel, setDriftLevel] = useState(0); // 0..100% recalibration drift
  const [splitPicks, setSplitPicks] = useState<Record<string, number>>({});

  // Overall rate stays deceptively fixed at 25.0%, while AUC & subgroup calibration degrade!
  const auc = Math.max(0.62, 0.917 - (driftLevel / 100) * 0.26);
  const brier = 0.089 + (driftLevel / 100) * 0.082;
  const m1Actual = 11 + Math.round((driftLevel / 100) * 18); // M1 worsens
  const m5Actual = 44 - Math.round((driftLevel / 100) * 18); // M5 shifts opposite -> overall stays 25%!

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left: Live Drift Simulator */}
      <div className="lg:col-span-6 space-y-4">
        <div className="rounded-xl bg-[#F3F6F8] dark:bg-[#0F191F] border border-[#DCE4E8] dark:border-[#24343E] p-4 space-y-3">
          <div className="flex justify-between text-xs font-medium">
            <label htmlFor="drift-slider" className="text-[#111E24] dark:text-[#E6EFF3]">
              Stärke von Drift / Neukalibrierung nach Go-Live
            </label>
            <span className="font-mono font-bold text-[#0F6B75] dark:text-[#5DC2CC] tabular-nums">
              {driftLevel} %
            </span>
          </div>
          <input
            id="drift-slider"
            type="range"
            min={0}
            max={100}
            step={5}
            value={driftLevel}
            onChange={(e) => setDriftLevel(Number(e.target.value))}
            className="w-full"
          />

          <div className="grid grid-cols-3 gap-2 font-mono text-xs tabular-nums pt-1">
            <div className="rounded-lg bg-white dark:bg-[#14222A] p-2.5 border border-[#DCE4E8] dark:border-[#263943]">
              <div className="text-[#526771] dark:text-[#93AAB5]">Gesamtrate</div>
              <div className="text-base font-bold text-[#111E24] dark:text-white">25.0 %</div>
              <div className="text-[10px] text-[#647B86]">unverändert!</div>
            </div>
            <div className="rounded-lg bg-white dark:bg-[#14222A] p-2.5 border border-[#DCE4E8] dark:border-[#263943]">
              <div className="text-[#526771] dark:text-[#93AAB5]">Live-AUC</div>
              <div
                className={`text-base font-bold ${
                  auc >= 0.85
                    ? 'text-[#0F7B4D] dark:text-[#6CD6A1]'
                    : auc >= 0.75
                      ? 'text-[#B45309] dark:text-[#F6C26B]'
                      : 'text-[#C0392B] dark:text-[#F49388]'
                }`}
              >
                {auc.toFixed(3)}
              </div>
              <div className="text-[10px] text-[#647B86]">Start: 0.917</div>
            </div>
            <div className="rounded-lg bg-white dark:bg-[#14222A] p-2.5 border border-[#DCE4E8] dark:border-[#263943]">
              <div className="text-[#526771] dark:text-[#93AAB5]">Live-Brier</div>
              <div
                className={`text-base font-bold ${
                  brier <= 0.105
                    ? 'text-[#0F7B4D] dark:text-[#6CD6A1]'
                    : brier <= 0.135
                      ? 'text-[#B45309] dark:text-[#F6C26B]'
                      : 'text-[#C0392B] dark:text-[#F49388]'
                }`}
              >
                {brier.toFixed(3)}
              </div>
              <div className="text-[10px] text-[#647B86]">Null: 0.188</div>
            </div>
          </div>

          <div className="text-xs text-[#314A53] dark:text-[#B5CDD4] pt-1 leading-relaxed">
            Untergruppen-Check: Maschine M1 hat real <strong className="font-mono">{m1Actual} %</strong>{' '}
            (Modell erwartet 11 %), M5 hat real <strong className="font-mono">{m5Actual} %</strong> (Modell
            erwartet 44 %).{' '}
            {driftLevel >= 40
              ? 'Die Fehler heben sich im Gesamtschnitt auf – deshalb ist Monitoring je Maschine Pflicht!'
              : 'Schiebe den Drift-Regler nach rechts, um die Klausur-Falle 7.4 live zu erleben.'}
          </div>
        </div>
      </div>

      {/* Right: Interactive Split Chooser */}
      <div className="lg:col-span-6 space-y-3">
        <div className="text-xs font-medium text-[#111E24] dark:text-[#E6EFF3]">
          Welcher Train/Test-Split passt?
        </div>
        {SPLIT_CHALLENGES.map((ch) => {
          const pick = splitPicks[ch.id];
          const ok = pick === ch.correct;
          return (
            <div
              key={ch.id}
              className="rounded-xl border border-[#DCE4E8] dark:border-[#24343E] bg-white dark:bg-[#131F26] p-3.5 space-y-2"
            >
              <div className="text-xs font-medium text-[#111E24] dark:text-[#E6EFF3]">{ch.question}</div>
              <div className="flex flex-wrap gap-1.5">
                {ch.options.map((opt, idx) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSplitPicks((p) => ({ ...p, [ch.id]: idx }))}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md border cursor-pointer transition-colors ${
                      pick === idx
                        ? idx === ch.correct
                          ? 'bg-[#0F7B4D] text-white border-[#0F7B4D]'
                          : 'bg-[#C0392B] text-white border-[#C0392B]'
                        : 'bg-[#F5F8F9] dark:bg-[#1B2B34] text-[#273B45] dark:text-[#C5D6DF] border-[#CBD7DD] dark:border-[#2A3E48] hover:border-[#0F6B75]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {pick !== undefined && (
                <div className={`text-xs flex items-start gap-1.5 ${ok ? 'text-[#0E643E] dark:text-[#6CD6A1]' : 'text-[#A82E22] dark:text-[#F49388]'}`}>
                  {ok ? <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : <X className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                  <span>{ch.reason}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
