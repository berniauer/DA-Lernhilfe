# Kapitel 9: Logistische Regression (Klassifikation)

> Quelle: Arbeitsblätter 07a/07b „Logistische Regression“ · Verständnisaufgaben 25–30 · **Kern der Beispielklausur!**

## Lernziele
- Logit, Odds, Odds-Ratio sicher umrechnen
- Koeffizienten korrekt interpretieren (auf Logit- und Odds-Skala)
- Güte: Brier, LogLoss, Skill, AUC/ROC, Kalibrierung
- Cutoff wählen (Raten, Kosten), Confusion Matrix
- Separation, Hinkley-Test

## 1. Von Wahrscheinlichkeit zu Logit
| Skala | Formel | Bereich | Beispiel p = 0.2 |
|---|---|---|---|
| Wahrscheinlichkeit p | | 0 … 1 | 0.2 |
| **Odds** | p / (1 − p) | 0 … ∞ | 0.25 („1 zu 4“) |
| **Logit** | log(odds) | −∞ … +∞ | −1.39 |

Rückwärts: **p = e^logit / (1 + e^logit) = 1 / (1 + e^−logit)** → R: `plogis(x)`; logit: `qlogis(p)`.
daatools: `odds(p)`, `inv_odds(o)`.

Merkwerte: logit 0 → p = 0.5 · logit ±1 → 0.73/0.27 · logit ±2 → 0.88/0.12 · logit ±3 → 0.95/0.05.

## 2. Modell
```r
m = stan_glm(defect ~ x1 + x2 + gruppe, data=df, family=binomial, refresh=0)
info(m)
exp(coef(m))     # Odds-Ratios
```
logit(p) = α + β₁x₁ + … → die Koeffizienten sind **additiv auf der Logit-Skala**, **multiplikativ auf der Odds-Skala**.

## 3. Interpretation
- **Intercept** α: Logit im Basisfall → p = plogis(α).
- **Metrischer Koeffizient** β: „+1 Einheit x → Odds × **e^β** (bei sonst gleichen Werten)“.
  - β = 0.08 → e^0.08 = 1.083 → **+8.3 % Odds**.
  - Schrittweite k: e^(k·β) (z. B. 10 Einheiten: e^0.8 = 2.23).
- **Gruppenkoeffizient**: Odds in Gruppe G = e^β × Odds der Referenz.
- **Faustregel „durch 4“**: Bei p ≈ 0.5 ändert sich p pro Einheit um maximal ≈ **β/4** (steilster Punkt der S-Kurve).

### ⚠️ Odds-Ratio ≠ Wahrscheinlichkeits-Verhältnis (Verständnisaufgabe 26/27)
OR = 2 bei p₀ = 0.01 → p₁ ≈ 0.02 (fast Verdopplung). OR = 2 bei p₀ = 0.5 → p₁ = 0.67 (+17 Prozentpunkte). Je höher p₀, desto weniger verdoppelt sich p. **Effekt in Prozentpunkten hängt vom Ausgangsrisiko ab** → immer mit konkreten Szenarien rechnen:
```r
nd = data.frame(shift=c("Day","Night"), machine="M1", pressure=75, ...)
posterior_epred(m, newdata=nd)   # Wahrscheinlichkeiten mit Unsicherheit
```

## 4. Güte

| Maß | Formel | Interpretation | Nullmodell |
|---|---|---|---|
| **Brier** | mean((y − p)²) | 0 = perfekt; misst Genauigkeit + Kalibrierung | p̄·(1−p̄), z. B. 0.25·0.75 = 0.1875 |
| **LogLoss** | −mean(y·log p + (1−y)·log(1−p)) | bestraft sichere Fehlprognosen extrem | ≈ 0.56 bei p̄ = 0.25 |
| **Skill** | 1 − Brier/Brier_Null | Anteil Verbesserung ggü. „immer p̄“ | 0 |
| **AUC** | Fläche unter ROC | P(zufälliger Positiver bekommt höheres p als zufälliger Negativer); 0.5 = Zufall, 1 = perfekt | 0.5 |
| **Bayes-R²** | | Erklärungskraft (bei logistisch meist niedriger) | |

```r
prediction_metrics(m, df_test)   # Brier, LogLoss, Skill für Training & neue Daten
brier(m, df_test)
ROC(m, newdata=df_test)          # ROC-Kurve + AUC
```
**Richtwerte AUC:** 0.7 akzeptabel, 0.8 gut, 0.9 sehr gut (Daumenregel).

**AUC vs. Brier (Verständnisaufgabe 28):** AUC misst nur die **Rangordnung** (Diskriminierung). Ein Modell, das alle p halbiert, hat dieselbe AUC, aber schlechteren Brier. → Für Entscheidungen mit Kosten braucht man **kalibrierte** Wahrscheinlichkeiten.

### Kalibrierung
Gruppiere nach Prognose (z. B. 0–0.1, 0.1–0.2 …) und vergleiche **mittlere Prognose** mit **beobachteter Rate**. Gut kalibriert = auf der Diagonale.
```r
library(rms); val.prob(predict(m, newdata=df_test, type="response"), df_test$defect)
```

## 5. Cutoff & Confusion Matrix
Klassifikation: „1“ vorhersagen, wenn p > Cutoff.

| | tatsächlich 1 | tatsächlich 0 |
|---|---|---|
| **vorhergesagt 1** | TP | FP (Fehlalarm) |
| **vorhergesagt 0** | FN (übersehen) | TN |

- **TPR** (Sensitivität, Recall) = TP/(TP+FN) · **FNR** = 1 − TPR
- **FPR** = FP/(FP+TN) · **TNR** (Spezifität) = 1 − FPR
- **Precision** = TP/(TP+FP)
- **Accuracy** = (TP+TN)/n ⚠️ bei unausgeglichenen Klassen irreführend (Verständnisaufgabe 29)

```r
logistic_rates(m, newdata=df_test)              # Tabelle TPR/FPR/... je Cutoff
plotlogrates(m, newdata=df_test)                # Raten vs. Cutoff (OHNE newdata = Training!)
plotlogrates(m, newdata=df_test, count=TRUE)    # Anzahlen statt Raten
```

**Cutoff wählen:**
- Nach Vorgabe: „max. 1 von 4 Defekten übersehen“ → FNR ≤ 0.25 → TPR ≥ 0.75 → Cutoff dort ablesen.
- Nach **Kosten**: Gesamtkosten = c_FP·FP + c_FN·FN (+ ggf. c_TP·TP) für jeden Cutoff berechnen und Minimum wählen.
  - Bei gut kalibriertem Modell: optimal markieren, wenn **p > c_FP / (c_FP + c_FN)**.
- Niedriger Cutoff → mehr erkannt (TPR↑), mehr Fehlalarme (FPR↑). Hoher Cutoff umgekehrt.
- ROC-Kurve = TPR gegen FPR für alle Cutoffs.

## 6. Separation & Hinkley
- **(Quasi-)Separation**: Eine Variable trennt 0 und 1 (fast) perfekt → Koeffizient läuft gegen ∞ (bei klassischem glm). Bayes-Priors halten ihn endlich, aber das Ergebnis ist prior-abhängig und mit Vorsicht zu interpretieren. Häufig Zeichen für **Leakage**!
- **Hinkley-Test** `hinkley(m)`: prüft, ob die Link-Funktion passt (ob ein quadrierter Logit-Term signifikant beiträgt). Ist er auffällig → Nichtlinearität bzw. fehlende Terme.

## 7. Leakage (Verständnisaufgabe 25)
Nur Variablen verwenden, die **zum Vorhersagezeitpunkt bekannt** sind. Eine nachträglich gemessene Variable (Nacharbeitszeit, Kündigungsgespräch, Rückruf) → unrealistisch gute Testwerte, im Betrieb unbrauchbar.

## 8. Basisrate & Oversampling (Verständnisaufgabe 30)
Wurde die Klasse 1 im Training überrepräsentiert (z. B. 50 % Defekte statt real 5 %), sind die vorhergesagten p **zu hoch** (Intercept verschoben). AUC bleibt ähnlich, aber Kalibrierung und Kostenentscheidungen sind falsch → korrigieren oder auf repräsentativen Daten kalibrieren.

## ⚠️ Typische Fallen
- „Odds × 4“ als „4-mal so wahrscheinlich“.
- Logit-Koeffizienten wie lineare Prozentpunkte interpretieren.
- Accuracy als Gütemaß bei 25 % Positiven.
- `plotlogrates`/`ROC` ohne `newdata` → Trainingsdaten.
- Cutoff 0.5 als Standard annehmen.
- AUC = Kalibrierung.

➡️ Quiz: [quiz/09-Logistische-Regression.md](../quiz/09-Logistische-Regression.md) · Rechnen: [coding-uebungen/05-Logistisch-von-Hand.md](../coding-uebungen/05-Logistisch-von-Hand.md)
