import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { BasicsVisualId } from '../../data/basicsData';
import {
  EVERYDAY_BAYES_SCENARIOS,
  computeEverydayBayes,
  translateProbability,
} from '../../lib/basicsHelpers';

/* 1. Modul 01 — Everyday Bayes Story Stepper */
const BayesStoryVisual: React.FC = () => {
  const [scenarioId, setScenarioId] = useState<'smoke' | 'fever' | 'rain'>('smoke');
  const scenario =
    EVERYDAY_BAYES_SCENARIOS.find((s) => s.id === scenarioId) ?? EVERYDAY_BAYES_SCENARIOS[0];
  const result = computeEverydayBayes(scenario);

  return (
    <div className="space-y-5">
      <div
        className="inline-flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#EAF0F2] dark:bg-[#16232B] border border-[#DCE4E8] dark:border-[#24343E]"
        role="group"
        aria-label="Alltagsbeispiel wählen"
      >
        {EVERYDAY_BAYES_SCENARIOS.map((s) => {
          const active = s.id === scenario.id;
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={active}
              onClick={() => setScenarioId(s.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                active
                  ? 'bg-[#0F6B75] text-white'
                  : 'bg-transparent text-[#354B55] dark:text-[#A4BBC5] hover:bg-white/60 dark:hover:bg-[#1F313B]'
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* 3-Step Visual Equation: Prior + Likelihood -> Posterior */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        <div className="rounded-xl bg-[#F7F9FA] dark:bg-[#192830] border border-[#DCE4E8] dark:border-[#263842] p-4 flex flex-col justify-between gap-3">
          <div>
            <div className="text-xs font-mono font-semibold text-[#0F6B75] dark:text-[#5DC2CC]">
              1. Prior (Vorwissen)
            </div>
            <div className="font-display font-bold text-2xl text-[#0E1E25] dark:text-white mt-1 tabular-nums">
              {scenario.baseRatePct} %
            </div>
            <p className="text-xs text-[#4E626C] dark:text-[#96AEB9] mt-1 leading-relaxed">
              So oft tritt „{scenario.eventLabel}“ ganz allgemein auf (Basisrate).
            </p>
          </div>
          <div className="h-2 rounded-full bg-[#DCE4E8] dark:bg-[#243742] overflow-hidden">
            <div
              className="h-full bg-[#0F6B75] dark:bg-[#46B3BE] transition-all duration-300"
              style={{ width: `${Math.max(4, scenario.baseRatePct)}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl bg-[#F7F9FA] dark:bg-[#192830] border border-[#DCE4E8] dark:border-[#263842] p-4 flex flex-col justify-between gap-3">
          <div>
            <div className="text-xs font-mono font-semibold text-[#0F6B75] dark:text-[#5DC2CC]">
              2. Likelihood (Hinweis)
            </div>
            <div className="font-display font-bold text-base text-[#0E1E25] dark:text-white mt-1.5">
              „{scenario.signalLabel}“
            </div>
            <p className="text-xs text-[#4E626C] dark:text-[#96AEB9] mt-1 leading-relaxed tabular-nums">
              Bei echtem Fall: <strong>{scenario.sensitivityPct} %</strong> · Fehlalarm im Normalfall:{' '}
              <strong>{scenario.falseAlarmPct} %</strong>
            </p>
          </div>
          <div className="text-xs font-mono text-[#354B55] dark:text-[#BFD1DA] tabular-nums">
            Auf 1.000 Tage: {result.trueAlarmsPer1000} echte · {result.falseAlarmsPer1000} falsche Alarme
          </div>
        </div>

        <div className="rounded-xl bg-[#E8F4F6] dark:bg-[#132E35] border border-[#BBDCE0] dark:border-[#234C55] p-4 flex flex-col justify-between gap-3">
          <div>
            <div className="text-xs font-mono font-semibold text-[#0B5A63] dark:text-[#66C7D1]">
              3. Posterior (Neues Urteil)
            </div>
            <div className="font-display font-bold text-2xl text-[#0A4E56] dark:text-[#7CD5DF] mt-1 tabular-nums">
              {result.posteriorPct.toFixed(1)} %
            </div>
            <p className="text-xs text-[#1E3B42] dark:text-[#CEE6EC] mt-1 leading-relaxed">
              Chance für „{scenario.eventLabel}“, <em>nachdem</em> „{scenario.signalLabel}“ eintritt.
            </p>
          </div>
          <div className="h-2 rounded-full bg-[#CCE2E6] dark:bg-[#1D3E47] overflow-hidden">
            <div
              className="h-full bg-[#0F7B4D] dark:bg-[#5DD49B] transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(4, result.posteriorPct))}%` }}
            />
          </div>
        </div>
      </div>

      <p className="text-sm text-[#243842] dark:text-[#CEE0E7] bg-[#FDF6EA] dark:bg-[#271F12] border border-[#ECD6AC] dark:border-[#4D3B1D] rounded-xl p-3.5 leading-relaxed">
        <strong className="font-semibold text-[#5C3A06] dark:text-[#F4D9A6]">Merke: </strong>
        {scenario.takeaway}
      </p>
    </div>
  );
};

/* 2. Modul 02 — Regression & Centering Rent Explorer */
const RegressionRentVisual: React.FC = () => {
  const [centered, setCentered] = useState(false);
  const [isNewBuild, setIsNewBuild] = useState(false);
  const [sqm, setSqm] = useState(60);

  // Rent model: 250 + 12 * sqm + (180 if Neubau)
  // Centered at 50 m²: 850 + 12 * (sqm - 50) + (180 if Neubau)
  const intercept = centered ? 850 : 250;
  const predicted = 250 + 12 * sqm + (isNewBuild ? 180 : 0);
  const xZeroLabel = centered ? '50 m² (zentrierter Nullpunkt)' : '0 m² (unzentrierter Nullpunkt)';

  const toX = (m2: number) => 44 + (m2 / 100) * 320;
  const toY = (eur: number) => 176 - ((eur - 200) / 1500) * 146;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
      <div className="md:col-span-7">
        <svg
          viewBox="0 0 400 210"
          className="w-full h-auto rounded-xl bg-[#F7F9FA] dark:bg-[#101A20] border border-[#DCE4E8] dark:border-[#24343E]"
          role="img"
          aria-label="Mietspiegel-Gerade mit Altbau und Neubau sowie verschiebbarem Nullpunkt"
        >
          {/* Axes */}
          <line x1="44" y1="176" x2="372" y2="176" stroke="currentColor" className="text-[#9CB0BA] dark:text-[#445A66]" />
          <line x1="44" y1="22" x2="44" y2="176" stroke="currentColor" className="text-[#9CB0BA] dark:text-[#445A66]" />

          {/* Reference vertical line at intercept x */}
          <line
            x1={toX(centered ? 50 : 0)}
            y1="24"
            x2={toX(centered ? 50 : 0)}
            y2="176"
            stroke="#D97706"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Altbau line (Referenzgruppe) */}
          <line
            x1={toX(0)}
            y1={toY(250)}
            x2={toX(100)}
            y2={toY(1450)}
            stroke="#0F6B75"
            strokeWidth="2.5"
          />
          {/* Neubau line (+180€) */}
          <line
            x1={toX(0)}
            y1={toY(430)}
            x2={toX(100)}
            y2={toY(1630)}
            stroke="#0F7B4D"
            strokeWidth="2.5"
            strokeDasharray="6 3"
          />

          {/* Sigma scatter band visual dots around Altbau/Neubau */}
          {[30, 42, 55, 68, 82].map((m, idx) => {
            const offset = [45, -55, 60, -40, 50][idx];
            const yVal = 250 + 12 * m + (isNewBuild ? 180 : 0) + offset;
            return (
              <circle
                key={m}
                cx={toX(m)}
                cy={toY(yVal)}
                r="3.5"
                className="fill-[#647D88]/65 dark:fill-[#8DA8B5]/65"
              />
            );
          })}

          {/* Intercept dot */}
          <circle
            cx={toX(centered ? 50 : 0)}
            cy={toY(intercept)}
            r="5.5"
            fill="#D97706"
          />
          <text
            x={centered ? toX(50) + 8 : toX(0) + 8}
            y={toY(intercept) - 8}
            className="text-[10px] font-mono font-bold fill-[#B45309] dark:fill-[#FBBF24]"
          >
            Intercept: {intercept} €
          </text>

          {/* Current chosen apartment */}
          <circle cx={toX(sqm)} cy={toY(predicted)} r="6" fill={isNewBuild ? '#0F7B4D' : '#0F6B75'} />

          {/* Labels */}
          <text x="290" y={toY(1630) + 12} className="text-[10px] font-semibold fill-[#0F7B4D] dark:fill-[#5DD49B]">
            Neubau (+180 €)
          </text>
          <text x="290" y={toY(1450) + 16} className="text-[10px] font-semibold fill-[#0F6B75] dark:fill-[#5DC2CC]">
            Altbau (Referenz)
          </text>
          <text x="44" y="194" className="text-[10px] font-mono fill-[#526771] dark:fill-[#93AAB5]">0 m²</text>
          <text x="190" y="194" className="text-[10px] font-mono fill-[#526771] dark:fill-[#93AAB5]">50 m²</text>
          <text x="345" y="194" className="text-[10px] font-mono fill-[#526771] dark:fill-[#93AAB5]">100 m²</text>
        </svg>
      </div>

      <div className="md:col-span-5 space-y-4">
        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-[#526771] dark:text-[#93AAB5]">
            1. Nullpunkt (Zentrierung)
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              aria-pressed={!centered}
              onClick={() => setCentered(false)}
              className={`px-2.5 py-2 text-xs font-medium rounded-lg border cursor-pointer transition-colors ${
                !centered
                  ? 'bg-[#0F6B75] text-white border-[#0F6B75]'
                  : 'bg-[#F7F9FA] dark:bg-[#192830] border-[#DCE4E8] dark:border-[#263842] text-[#354B55] dark:text-[#BFD1DA]'
              }`}
            >
              Unzentriert (0 m²)
            </button>
            <button
              type="button"
              aria-pressed={centered}
              onClick={() => setCentered(true)}
              className={`px-2.5 py-2 text-xs font-medium rounded-lg border cursor-pointer transition-colors ${
                centered
                  ? 'bg-[#0F6B75] text-white border-[#0F6B75]'
                  : 'bg-[#F7F9FA] dark:bg-[#192830] border-[#DCE4E8] dark:border-[#263842] text-[#354B55] dark:text-[#BFD1DA]'
              }`}
            >
              Zentriert (50 m²)
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="text-xs font-semibold text-[#526771] dark:text-[#93AAB5]">
            2. Gruppe (Referenz vs. Aufpreis)
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              aria-pressed={!isNewBuild}
              onClick={() => setIsNewBuild(false)}
              className={`px-2.5 py-2 text-xs font-medium rounded-lg border cursor-pointer transition-colors ${
                !isNewBuild
                  ? 'bg-[#0F6B75] text-white border-[#0F6B75]'
                  : 'bg-[#F7F9FA] dark:bg-[#192830] border-[#DCE4E8] dark:border-[#263842] text-[#354B55] dark:text-[#BFD1DA]'
              }`}
            >
              Altbau (Referenz)
            </button>
            <button
              type="button"
              aria-pressed={isNewBuild}
              onClick={() => setIsNewBuild(true)}
              className={`px-2.5 py-2 text-xs font-medium rounded-lg border cursor-pointer transition-colors ${
                isNewBuild
                  ? 'bg-[#0F7B4D] text-white border-[#0F7B4D]'
                  : 'bg-[#F7F9FA] dark:bg-[#192830] border-[#DCE4E8] dark:border-[#263842] text-[#354B55] dark:text-[#BFD1DA]'
              }`}
            >
              Neubau (+180 €)
            </button>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <label htmlFor="rent-sqm-slider" className="font-medium text-[#314650] dark:text-[#BFD1DA]">
              Wohnfläche
            </label>
            <span className="font-mono font-bold text-[#0F6B75] dark:text-[#5DC2CC] tabular-nums">
              {sqm} m² → {predicted} €
            </span>
          </div>
          <input
            id="rent-sqm-slider"
            type="range"
            min={25}
            max={95}
            step={5}
            value={sqm}
            onChange={(e) => setSqm(Number(e.target.value))}
            className="w-full accent-[#0F6B75]"
          />
        </div>

        <p className="text-xs text-[#4E626C] dark:text-[#96AEB9] leading-relaxed">
          Basisfall aktuell: <strong>{xZeroLabel}</strong>, Altbau → Intercept ={' '}
          <strong className="font-mono tabular-nums">{intercept} €</strong>. Beachte: Die Miete für{' '}
          {sqm} m² ({predicted} €) bleibt beim Zentrieren exakt gleich!
        </p>
      </div>
    </div>
  );
};

/* 3. Modul 03 — 4 Hikers in Fog (MCMC & Rhat) */
const McmcHikersVisual: React.FC = () => {
  const [healthy, setHealthy] = useState(true);

  const chainsHealthy = [
    'M 20 82 Q 70 42, 120 60 T 220 52 T 320 58 T 380 54',
    'M 20 44 Q 70 68, 120 50 T 220 62 T 320 48 T 380 56',
    'M 20 66 Q 70 50, 120 58 T 220 48 T 320 55 T 380 51',
    'M 20 52 Q 70 60, 120 46 T 220 59 T 320 50 T 380 58',
  ];
  const chainsBroken = [
    'M 20 58 Q 80 48, 140 54 T 260 50 T 380 54',
    'M 20 52 Q 80 62, 140 48 T 260 56 T 380 51',
    'M 20 62 Q 80 52, 140 58 T 260 48 T 380 57',
    // 4th hiker stuck in wrong valley!
    'M 20 128 Q 90 134, 160 125 T 280 132 T 380 129',
  ];
  const colors = ['#0F6B75', '#0F7B4D', '#D97706', '#C0392B'];
  const paths = healthy ? chainsHealthy : chainsBroken;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-pressed={healthy}
          onClick={() => setHealthy(true)}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg border cursor-pointer transition-colors ${
            healthy
              ? 'bg-[#0F7B4D] text-white border-[#0F7B4D]'
              : 'bg-[#F7F9FA] dark:bg-[#192830] border-[#DCE4E8] dark:border-[#263842] text-[#354B55] dark:text-[#BFD1DA]'
          }`}
        >
          ✓ Alle 4 Wanderer einig (Rhat = 1.00)
        </button>
        <button
          type="button"
          aria-pressed={!healthy}
          onClick={() => setHealthy(false)}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg border cursor-pointer transition-colors ${
            !healthy
              ? 'bg-[#C0392B] text-white border-[#C0392B]'
              : 'bg-[#F7F9FA] dark:bg-[#192830] border-[#DCE4E8] dark:border-[#263842] text-[#354B55] dark:text-[#BFD1DA]'
          }`}
        >
          ! Ein Wanderer verirrt sich (Rhat = 1.38)
        </button>
      </div>

      <svg
        viewBox="0 0 400 160"
        className="w-full h-auto rounded-xl bg-[#F7F9FA] dark:bg-[#101A20] border border-[#DCE4E8] dark:border-[#24343E]"
        role="img"
        aria-label={healthy ? 'Vier konvergierte MCMC-Chains auf demselben Niveau' : 'Eine abweichende MCMC-Chain im falschen Bereich'}
      >
        <line x1="20" y1="54" x2="380" y2="54" stroke="#9CB0BA" strokeDasharray="3 4" strokeWidth="1" />
        {paths.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={colors[i]} strokeWidth="2.2" opacity="0.9" />
        ))}
        <text x="20" y="20" className="text-[10px] font-mono fill-[#526771] dark:fill-[#93AAB5]">
          Schritte der 4 Chains (Traceplot) →
        </text>
        {!healthy && (
          <text x="150" y="149" className="text-[10px] font-semibold fill-[#C0392B] dark:fill-[#F49388]">
            Chain 4 hängt im falschen Tal fest → Rhat-Alarm!
          </text>
        )}
      </svg>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-[#F7F9FA] dark:bg-[#192830] border border-[#DCE4E8] dark:border-[#263842] p-2.5">
          <div className="text-[11px] text-[#526771] dark:text-[#93AAB5]">Rhat</div>
          <div
            className={`font-mono font-bold text-base tabular-nums ${
              healthy ? 'text-[#0F7B4D] dark:text-[#5DD49B]' : 'text-[#C0392B] dark:text-[#F49388]'
            }`}
          >
            {healthy ? '1.00 ✓' : '1.38 !'}
          </div>
        </div>
        <div className="rounded-lg bg-[#F7F9FA] dark:bg-[#192830] border border-[#DCE4E8] dark:border-[#263842] p-2.5">
          <div className="text-[11px] text-[#526771] dark:text-[#93AAB5]">n_eff</div>
          <div
            className={`font-mono font-bold text-base tabular-nums ${
              healthy ? 'text-[#0F7B4D] dark:text-[#5DD49B]' : 'text-[#C0392B] dark:text-[#F49388]'
            }`}
          >
            {healthy ? '3.640 ✓' : '120 !'}
          </div>
        </div>
        <div className="rounded-lg bg-[#F7F9FA] dark:bg-[#192830] border border-[#DCE4E8] dark:border-[#263842] p-2.5">
          <div className="text-[11px] text-[#526771] dark:text-[#93AAB5]">Urteil</div>
          <div className="text-xs font-semibold text-[#0E1E25] dark:text-white mt-0.5">
            {healthy ? 'Sauber gerechnet' : 'Nicht vertrauen!'}
          </div>
        </div>
      </div>
    </div>
  );
};

/* 4. Modul 04 — Average (epred) vs Single Evening (predict) + Cost Quantile */
const EpredPredictVisual: React.FC = () => {
  const [costUnder, setCostUnder] = useState(3);
  const costOver = 1;
  const qStar = costUnder / (costUnder + costOver);
  // Pizza pieces for 1 guest tonight ~ Normal(mean=3.0, sd=1.1), average ~ [2.7, 3.3]
  // Simple smooth quantile approx for visualization
  const zApprox =
    qStar <= 0.5 ? (qStar - 0.5) * 3.0 : (qStar - 0.5) * 3.4;
  const recommended = Math.max(1.5, Math.min(5.5, 3.0 + zApprox * 1.1));
  const posPct = ((recommended - 0.5) / 5.5) * 100;

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-semibold text-[#0F6B75] dark:text-[#5DC2CC]">
              posterior_epred (Durchschnitt über 100 Partys)
            </span>
            <span className="font-mono tabular-nums text-[#4E626C] dark:text-[#96AEB9]">
              2,7 – 3,3 Stücke (sehr schmal)
            </span>
          </div>
          <div className="relative h-7 rounded-lg bg-[#F0F5F7] dark:bg-[#17242C] border border-[#DCE4E8] dark:border-[#24343E]">
            <div
              className="absolute top-1 bottom-1 rounded bg-[#0F6B75]/80 dark:bg-[#46B3BE]/80"
              style={{ left: '40%', width: '11%' }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-semibold text-[#B45309] dark:text-[#FBBF24]">
              posterior_predict (GENAU Lukas heute Abend)
            </span>
            <span className="font-mono tabular-nums text-[#4E626C] dark:text-[#96AEB9]">
              1,0 – 5,2 Stücke (breit wegen Zufall σ!)
            </span>
          </div>
          <div className="relative h-9 rounded-lg bg-[#F0F5F7] dark:bg-[#17242C] border border-[#DCE4E8] dark:border-[#24343E]">
            <div
              className="absolute top-1.5 bottom-1.5 rounded bg-[#D97706]/35 dark:bg-[#F59E0B]/35 border border-[#D97706]/60"
              style={{ left: '10%', width: '75%' }}
            />
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-[#0F7B4D] dark:bg-[#5DD49B] transition-all duration-200"
              style={{ left: `${Math.min(92, Math.max(8, posPct))}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-[#526771] dark:text-[#93AAB5] mt-1 tabular-nums">
            <span>1 Stück</span>
            <span>3 Stücke (Mitte)</span>
            <span>6 Stücke</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-[#F7F9FA] dark:bg-[#192830] border border-[#DCE4E8] dark:border-[#263842] p-4 space-y-2.5">
        <div className="flex flex-wrap justify-between items-center gap-2 text-xs">
          <label htmlFor="pizza-cost-slider" className="font-semibold text-[#0E1E25] dark:text-white">
            Wie viel schlimmer ist „zu wenig Pizza“ als „Reste“?
          </label>
          <span className="font-mono font-bold text-[#0F6B75] dark:text-[#5DC2CC] tabular-nums">
            {costUnder}× schlimmer → Ziel-Quantil {Math.round(qStar * 100)} %
          </span>
        </div>
        <input
          id="pizza-cost-slider"
          type="range"
          min={1}
          max={9}
          step={1}
          value={costUnder}
          onChange={(e) => setCostUnder(Number(e.target.value))}
          className="w-full accent-[#0F6B75]"
        />
        <p className="text-xs text-[#4E626C] dark:text-[#96AEB9] leading-relaxed">
          Formel <span className="font-mono">q* = {costUnder} / ({costUnder} + 1) = {Math.round(qStar * 100)} %</span>:
          Du planst etwa <strong className="font-mono tabular-nums">{recommended.toFixed(1)} Stücke</strong> pro Person ein.
        </p>
      </div>
    </div>
  );
};

/* 5. Modul 05 — 3 Causal Triangles Selector */
const CausalArrowsVisual: React.FC = () => {
  const [pattern, setPattern] = useState<'confounder' | 'mediator' | 'collider'>('confounder');

  const details = {
    confounder: {
      title: 'Confounder (gemeinsame Ursache)',
      topLabel: 'Hitze (C)',
      leftLabel: 'Eisverkauf (X)',
      rightLabel: 'Sonnenbrand (Y)',
      verdictOk: true,
      verdict: 'REIN ins Modell (kontrollieren!)',
      explain:
        'Hitze treibt BEIDES an (X ← C → Y). Erst wenn du „Hitze“ mit ins Modell nimmst, verschwindet der falsche Zusammenhang zwischen Eis und Sonnenbrand.',
    },
    mediator: {
      title: 'Mediator (Zwischenschritt)',
      topLabel: 'Wissen (M)',
      leftLabel: 'Lernzeit (X)',
      rightLabel: 'Note (Y)',
      verdictOk: false,
      verdict: 'FINGER WEG (wenn Gesamteffekt von X gesucht)',
      explain:
        'Lernzeit wirkt ÜBER Wissen auf die Note (X → M → Y). Hältst du Wissen künstlich konstant, sieht es falsch so aus, als würde Lernen nichts bringen!',
    },
    collider: {
      title: 'Collider (gemeinsame Folge)',
      topLabel: 'Berühmt (C)',
      leftLabel: 'Talent (X)',
      rightLabel: 'Aussehen (Y)',
      verdictOk: false,
      verdict: 'FINGER WEG (weder filtern noch kontrollieren!)',
      explain:
        'Beide Pfeile zeigen auf C (X → C ← Y). Wenn du nur auf „Berühmte“ schaust, entsteht künstlich der Schein, dass hübsche Stars weniger Talent hätten.',
    },
  }[pattern];

  return (
    <div className="space-y-4">
      <div className="inline-flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#EAF0F2] dark:bg-[#16232B] border border-[#DCE4E8] dark:border-[#24343E]">
        {(
          [
            { id: 'confounder', label: '1. Confounder' },
            { id: 'mediator', label: '2. Mediator' },
            { id: 'collider', label: '3. Collider' },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={pattern === item.id}
            onClick={() => setPattern(item.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-colors ${
              pattern === item.id
                ? 'bg-[#0F6B75] text-white'
                : 'bg-transparent text-[#354B55] dark:text-[#A4BBC5] hover:bg-white/60 dark:hover:bg-[#1F313B]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        <div className="md:col-span-6">
          <svg
            viewBox="0 0 340 165"
            className="w-full h-auto rounded-xl bg-[#F7F9FA] dark:bg-[#101A20] border border-[#DCE4E8] dark:border-[#24343E]"
            role="img"
            aria-label={details.title}
          >
            <defs>
              <marker id="arrow-teal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="#0F6B75" />
              </marker>
            </defs>

            {/* Nodes */}
            <rect x="108" y="14" width="124" height="34" rx="8" className="fill-[#E6F3F5] dark:fill-[#153037] stroke-[#0F6B75]" strokeWidth="1.5" />
            <text x="170" y="35" textAnchor="middle" className="text-[11px] font-semibold fill-[#0A4E56] dark:fill-[#7CD5DF]">
              {details.topLabel}
            </text>

            <rect x="16" y="114" width="118" height="34" rx="8" className="fill-white dark:fill-[#192830] stroke-[#9CB0BA] dark:stroke-[#38505C]" strokeWidth="1.5" />
            <text x="75" y="135" textAnchor="middle" className="text-[11px] font-semibold fill-[#0E1E25] dark:fill-[#E6EFF3]">
              {details.leftLabel}
            </text>

            <rect x="206" y="114" width="118" height="34" rx="8" className="fill-white dark:fill-[#192830] stroke-[#9CB0BA] dark:stroke-[#38505C]" strokeWidth="1.5" />
            <text x="265" y="135" textAnchor="middle" className="text-[11px] font-semibold fill-[#0E1E25] dark:fill-[#E6EFF3]">
              {details.rightLabel}
            </text>

            {/* Arrows depending on pattern */}
            {pattern === 'confounder' && (
              <>
                <line x1="145" y1="50" x2="88" y2="110" stroke="#0F6B75" strokeWidth="2.2" markerEnd="url(#arrow-teal)" />
                <line x1="195" y1="50" x2="252" y2="110" stroke="#0F6B75" strokeWidth="2.2" markerEnd="url(#arrow-teal)" />
              </>
            )}
            {pattern === 'mediator' && (
              <>
                <line x1="88" y1="110" x2="145" y2="50" stroke="#0F6B75" strokeWidth="2.2" markerEnd="url(#arrow-teal)" />
                <line x1="195" y1="50" x2="252" y2="110" stroke="#0F6B75" strokeWidth="2.2" markerEnd="url(#arrow-teal)" />
              </>
            )}
            {pattern === 'collider' && (
              <>
                <line x1="88" y1="110" x2="145" y2="50" stroke="#0F6B75" strokeWidth="2.2" markerEnd="url(#arrow-teal)" />
                <line x1="252" y1="110" x2="195" y2="50" stroke="#0F6B75" strokeWidth="2.2" markerEnd="url(#arrow-teal)" />
              </>
            )}
          </svg>
        </div>

        <div className="md:col-span-6 space-y-3">
          <div className="font-display font-bold text-base text-[#0E1E25] dark:text-white">
            {details.title}
          </div>
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              details.verdictOk
                ? 'bg-[#E3F4EC] dark:bg-[#143025] text-[#0C5534] dark:text-[#7CE0AD]'
                : 'bg-[#FBEAE8] dark:bg-[#381B18] text-[#8E241A] dark:text-[#F49388]'
            }`}
          >
            {details.verdictOk ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{details.verdict}</span>
          </div>
          <p className="text-sm text-[#314650] dark:text-[#BFD1DA] leading-relaxed">
            {details.explain}
          </p>
        </div>
      </div>
    </div>
  );
};

/* 6. Modul 06 — Parallel vs Interaction vs U-Curve */
const CurvesInteractionVisual: React.FC = () => {
  const [shape, setShape] = useState<'parallel' | 'interaction' | 'curve'>('interaction');

  const copy = {
    parallel: {
      headline: 'Keine Interaktion: Beide Linien steigen gleich steil',
      text: 'Jede Stunde Lernen bringt ausgeschlafen UND müde denselben Gewinn (+5 Punkte). Der Abstand bleibt überall gleich.',
    },
    interaction: {
      headline: 'Interaktion: Die Linien öffnen sich wie eine Schere',
      text: 'Ausgeschlafen bringt jede Stunde Lernen doppelt so viel wie übermüdet! „Wie stark X wirkt, hängt von der Gruppe ab.“',
    },
    curve: {
      headline: 'Quadratischer Term: Eine Kurve mit Optimum (Scheitelpunkt)',
      text: '0 Tassen Kaffee = müde, 2–3 Tassen = top konzentriert (Scheitelpunkt x*), 7 Tassen = zittrig und wieder schlechter!',
    },
  }[shape];

  return (
    <div className="space-y-4">
      <div className="inline-flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#EAF0F2] dark:bg-[#16232B] border border-[#DCE4E8] dark:border-[#24343E]">
        {(
          [
            { id: 'parallel', label: 'Parallel (keine Interaktion)' },
            { id: 'interaction', label: 'Schere (Interaktion)' },
            { id: 'curve', label: 'Bogen (Scheitelpunkt)' },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={shape === item.id}
            onClick={() => setShape(item.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-colors ${
              shape === item.id
                ? 'bg-[#0F6B75] text-white'
                : 'bg-transparent text-[#354B55] dark:text-[#A4BBC5] hover:bg-white/60 dark:hover:bg-[#1F313B]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        <div className="md:col-span-6">
          <svg
            viewBox="0 0 340 165"
            className="w-full h-auto rounded-xl bg-[#F7F9FA] dark:bg-[#101A20] border border-[#DCE4E8] dark:border-[#24343E]"
            role="img"
            aria-label={copy.headline}
          >
            <line x1="36" y1="140" x2="316" y2="140" stroke="currentColor" className="text-[#9CB0BA] dark:text-[#445A66]" />
            <line x1="36" y1="20" x2="36" y2="140" stroke="currentColor" className="text-[#9CB0BA] dark:text-[#445A66]" />

            {shape === 'parallel' && (
              <>
                <line x1="50" y1="100" x2="300" y2="42" stroke="#0F6B75" strokeWidth="3" />
                <line x1="50" y1="126" x2="300" y2="68" stroke="#D97706" strokeWidth="3" strokeDasharray="6 3" />
                <text x="220" y="38" className="text-[10px] font-semibold fill-[#0F6B75] dark:fill-[#5DC2CC]">Ausgeschlafen</text>
                <text x="235" y="92" className="text-[10px] font-semibold fill-[#B45309] dark:fill-[#FBBF24]">Müde</text>
              </>
            )}

            {shape === 'interaction' && (
              <>
                <line x1="50" y1="122" x2="300" y2="30" stroke="#0F6B75" strokeWidth="3" />
                <line x1="50" y1="122" x2="300" y2="96" stroke="#D97706" strokeWidth="3" strokeDasharray="6 3" />
                <text x="200" y="34" className="text-[10px] font-semibold fill-[#0F6B75] dark:fill-[#5DC2CC]">Ausgeschlafen (steil!)</text>
                <text x="215" y="114" className="text-[10px] font-semibold fill-[#B45309] dark:fill-[#FBBF24]">Müde (flach)</text>
              </>
            )}

            {shape === 'curve' && (
              <>
                <path d="M 50 124 Q 175 10, 300 124" fill="none" stroke="#0F6B75" strokeWidth="3" />
                <circle cx="175" cy="67" r="5.5" fill="#0F7B4D" />
                <line x1="175" y1="67" x2="175" y2="140" stroke="#0F7B4D" strokeDasharray="4 3" strokeWidth="1.5" />
                <text x="175" y="54" textAnchor="middle" className="text-[10px] font-bold fill-[#0F7B4D] dark:fill-[#5DD49B]">
                  Optimum x* (Scheitelpunkt)
                </text>
              </>
            )}
          </svg>
        </div>

        <div className="md:col-span-6 space-y-2">
          <div className="font-display font-bold text-base text-[#0E1E25] dark:text-white">
            {copy.headline}
          </div>
          <p className="text-sm text-[#314650] dark:text-[#BFD1DA] leading-relaxed">{copy.text}</p>
        </div>
      </div>
    </div>
  );
};

/* 7. Modul 07 — LOO 2·SE Scale */
const LooScaleVisual: React.FC = () => {
  const [elpdDiff, setElpdDiff] = useState(12);
  const [seDiff, setSeDiff] = useState(4);
  const ratio = seDiff > 0 ? elpdDiff / seDiff : 99;
  const clearWinner = elpdDiff > 2 * seDiff;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <label htmlFor="loo-diff-slider" className="font-medium text-[#314650] dark:text-[#BFD1DA]">
              Vorsprung |elpd_diff|
            </label>
            <span className="font-mono font-bold text-[#0F6B75] dark:text-[#5DC2CC] tabular-nums">
              {elpdDiff.toFixed(1)}
            </span>
          </div>
          <input
            id="loo-diff-slider"
            type="range"
            min={0}
            max={30}
            step={1}
            value={elpdDiff}
            onChange={(e) => setElpdDiff(Number(e.target.value))}
            className="w-full accent-[#0F6B75]"
          />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <label htmlFor="loo-se-slider" className="font-medium text-[#314650] dark:text-[#BFD1DA]">
              Unsicherheit se_diff
            </label>
            <span className="font-mono font-bold text-[#B45309] dark:text-[#FBBF24] tabular-nums">
              ±{seDiff.toFixed(1)} (2·SE = {(2 * seDiff).toFixed(1)})
            </span>
          </div>
          <input
            id="loo-se-slider"
            type="range"
            min={1}
            max={12}
            step={1}
            value={seDiff}
            onChange={(e) => setSeDiff(Number(e.target.value))}
            className="w-full accent-[#D97706]"
          />
        </div>
      </div>

      <div
        className={`rounded-xl p-4 border flex items-start gap-3 ${
          clearWinner
            ? 'bg-[#E3F4EC] dark:bg-[#143025] border-[#A7DFC3] dark:border-[#23543E] text-[#0C5534] dark:text-[#8BE0B5]'
            : 'bg-[#FDF6EA] dark:bg-[#271F12] border-[#ECD6AC] dark:border-[#4D3B1D] text-[#5C3A06] dark:text-[#F4D9A6]'
        }`}
      >
        {clearWinner ? (
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
        )}
        <div className="space-y-1 text-sm">
          <div className="font-display font-bold">
            {clearWinner
              ? `Klarer Sieger! (${ratio.toFixed(1)}× größer als SE)`
              : `Zu knapp! (${ratio.toFixed(1)}× SE < 2,0) → Nimm das einfachere Modell`}
          </div>
          <p className="text-xs leading-relaxed opacity-90">
            {clearWinner
              ? `Der Vorsprung (${elpdDiff}) ist größer als 2 × ${seDiff} (= ${2 * seDiff}). Das bessere Modell lohnt sich wirklich.`
              : `Der Vorsprung (${elpdDiff}) liegt innerhalb der 2·SE-Unsicherheit (${2 * seDiff}). Ein komplexeres Modell wäre hier unnötiger Ballast.`}
          </p>
        </div>
      </div>
    </div>
  );
};

/* 8. Modul 08 — Probability <-> Odds <-> Logit Translator */
const OddsTranslatorVisual: React.FC = () => {
  const [probPct, setProbPct] = useState(20);
  const [doubleOdds, setDoubleOdds] = useState(false);

  const t = translateProbability(probPct, doubleOdds ? 2 : 1);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex-1 min-w-[220px]">
          <div className="flex justify-between text-xs mb-1">
            <label htmlFor="odds-prob-slider" className="font-semibold text-[#314650] dark:text-[#BFD1DA]">
              Ausgangs-Wahrscheinlichkeit p
            </label>
            <span className="font-mono font-bold text-[#0F6B75] dark:text-[#5DC2CC] tabular-nums">
              {probPct} %
            </span>
          </div>
          <input
            id="odds-prob-slider"
            type="range"
            min={5}
            max={90}
            step={5}
            value={probPct}
            onChange={(e) => setProbPct(Number(e.target.value))}
            className="w-full accent-[#0F6B75]"
          />
        </div>

        <button
          type="button"
          aria-pressed={doubleOdds}
          onClick={() => setDoubleOdds((v) => !v)}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg border cursor-pointer transition-colors ${
            doubleOdds
              ? 'bg-[#0F6B75] text-white border-[#0F6B75]'
              : 'bg-[#F7F9FA] dark:bg-[#192830] border-[#CBD7DD] dark:border-[#2A3E48] text-[#1F333D] dark:text-[#D5E3EA] hover:border-[#0F6B75]'
          }`}
        >
          {doubleOdds ? '✓ Odds verdoppelt (OR = 2)' : 'Odds verdoppeln testen (OR = 2)'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl bg-[#F7F9FA] dark:bg-[#192830] border border-[#DCE4E8] dark:border-[#263842] p-3.5">
          <div className="text-[11px] font-medium text-[#526771] dark:text-[#93AAB5]">
            1. Wahrscheinlichkeit p
          </div>
          <div className="font-mono font-bold text-xl text-[#0E1E25] dark:text-white mt-1 tabular-nums">
            {probPct} %
          </div>
          <div className="text-[11px] text-[#526771] dark:text-[#93AAB5] mt-0.5">
            Immer zwischen 0 % und 100 %
          </div>
        </div>

        <div className="rounded-xl bg-[#F7F9FA] dark:bg-[#192830] border border-[#DCE4E8] dark:border-[#263842] p-3.5">
          <div className="text-[11px] font-medium text-[#526771] dark:text-[#93AAB5]">
            2. Odds = p / (1 − p)
          </div>
          <div className="font-mono font-bold text-xl text-[#0F6B75] dark:text-[#5DC2CC] mt-1 tabular-nums">
            {t.odds.toFixed(2)}
          </div>
          <div className="text-[11px] text-[#526771] dark:text-[#93AAB5] mt-0.5 tabular-nums">
            Verhältnis {probPct} zu {100 - probPct}
          </div>
        </div>

        <div className="rounded-xl bg-[#F7F9FA] dark:bg-[#192830] border border-[#DCE4E8] dark:border-[#263842] p-3.5">
          <div className="text-[11px] font-medium text-[#526771] dark:text-[#93AAB5]">
            3. Logit = ln(Odds)
          </div>
          <div className="font-mono font-bold text-xl text-[#0E1E25] dark:text-white mt-1 tabular-nums">
            {t.logit >= 0 ? `+${t.logit.toFixed(2)}` : t.logit.toFixed(2)}
          </div>
          <div className="text-[11px] text-[#526771] dark:text-[#93AAB5] mt-0.5">
            {probPct === 50 ? 'Exakt 0 bei 50 %!' : probPct < 50 ? 'Negativ unter 50 %' : 'Positiv über 50 %'}
          </div>
        </div>
      </div>

      {doubleOdds && (
        <div className="rounded-xl bg-[#E8F4F6] dark:bg-[#132E35] border border-[#BBDCE0] dark:border-[#234C55] p-4 text-sm text-[#12363D] dark:text-[#D1E8EE] space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 font-semibold">
            <span className="font-mono tabular-nums">Odds: {t.odds.toFixed(2)}</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
            <span className="font-mono tabular-nums">{t.shiftedOdds.toFixed(2)}</span>
            <span>ergibt neue Wahrscheinlichkeit:</span>
            <span className="font-mono text-base font-bold text-[#0A4E56] dark:text-[#7CD5DF] tabular-nums">
              {(t.shiftedP * 100).toFixed(1)} %
            </span>
          </div>
          <p className="text-xs opacity-90 leading-relaxed">
            Siehst du den Trick? Wer fälschlich „2 × {probPct} % = {(t.naiveWrongP * 100).toFixed(0)} %“
            rechnet, liegt daneben{t.naiveWrongP > 1 ? ' (und schießt sogar über unmögliche 100 % hinaus!)' : '!'}{' '}
            Odds-Ratios verdoppeln immer die <strong>Odds</strong>, niemals direkt die Prozente.
          </p>
        </div>
      )}
    </div>
  );
};

export const BasicsVisual: React.FC<{ visualId: BasicsVisualId }> = ({ visualId }) => {
  switch (visualId) {
    case 'bayes-story':
      return <BayesStoryVisual />;
    case 'regression-rent':
      return <RegressionRentVisual />;
    case 'mcmc-hikers':
      return <McmcHikersVisual />;
    case 'epred-vs-predict':
      return <EpredPredictVisual />;
    case 'causal-arrows':
      return <CausalArrowsVisual />;
    case 'curves-interaction':
      return <CurvesInteractionVisual />;
    case 'loo-scale':
      return <LooScaleVisual />;
    case 'odds-translator':
      return <OddsTranslatorVisual />;
  }
};
