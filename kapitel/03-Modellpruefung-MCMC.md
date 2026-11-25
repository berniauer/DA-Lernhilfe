# Kapitel 3: Modell testen: Sampling, Fit, Residuen, Generalisierung

> Quelle: Arbeitsblatt 02b „Bayes & Sampling: Testen des Modells“ · Verständnisaufgaben 07–10 · interaktive Übungen

## Die 4 Fragen (auswendig lernen!)

1. **Hat die Berechnung (das Sampling) funktioniert?**
2. **Reproduziert das Modell die wesentlichen Eigenschaften der Daten?**
3. **Enthält das Modell systematische Fehler?**
4. **Funktioniert es bei unbekannten Daten?** (Generalisierung)

Nur wenn alle vier positiv beantwortet sind, ist das Modell brauchbar. **Gutes Sampling ≠ gutes Modell!**

## 1. Sampling-Diagnostik

```r
info(model)            # mcse, n_eff, Rhat pro Parameter
check_sampling(model)  # daatools: prüft alle Grenzen automatisch
library(bayesplot); mcmc_trace(model)   # Traceplots
```

| Kennzahl | Bedeutung | gut | schlecht |
|---|---|---|---|
| **Rhat** | Kommen die 4 Chains zum selben Ergebnis? | ≈ 1.00 | > 1.1 |
| **n_eff** | effektive Anzahl unabhängiger Samples („wie weit wandert die Kette“) | > 2000 (von 4000) | < 400 |
| **mcse** | Monte-Carlo-Standardfehler (Rechenungenauigkeit) | < 5 % von mad | groß |
| **Traceplot** | Verlauf der Chains | „haariges Rauschen“, alle Chains im selben Bereich | Trends, Wellen, getrennte Chains |

Metapher: 4 Wanderer erkunden eine Wahrscheinlichkeitslandschaft. Sie sollen alles erkunden (n_eff hoch) und am Ende dasselbe Bild haben (Rhat = 1).

**Verständnisaufgabe 07:** 40 000 statt 4 000 Samples ≠ zehnmal so viele **Daten**! Es bleiben z. B. 100 Personen. Mehr Samples machen nur die **numerische Näherung** genauer (kleinerer mcse), das Kredibilitätsintervall wird **nicht** wesentlich schmaler.

**Verständnisaufgabe 08:** Modell A: perfektes Sampling, aber U-förmige Residuen → **Modellproblem**. Modell B: Rhat 1.15, n_eff 80, getrennte Chains → **Berechnungsproblem**. Dann sind auch die „guten“ Residuen von B nicht vertrauenswürdig, weil sie aus fehlerhaften Posterior-Samples berechnet sind.

## 2. Reproduktion der Daten (Posterior Predictive Checks)

- **`mean_PPD`** (in `info`/`print`): Mittelwert der vorhergesagten Daten. Er soll ≈ Mittelwert von y sein. Weicht er ab, kann das Modell nicht einmal den Durchschnitt reproduzieren.
- **`diagnose_density(model)`**: Dichte der Daten (dunkel) vs. 10 simulierte Datensätze (hell). Form, Lage und Streuung sollen grob passen. *Identisch* müssen sie nicht sein.
- **`diagnose_fit(model)`**: Für Min, Max, Mittelwert, Median, Quantile: Histogramm über alle 4000 replizierten Datensätze + grüne Linie = echter Wert. Die Linie soll **innerhalb** der Verteilung liegen.

**Verständnisaufgabe 09:** Der **Gesamtmittelwert passt**, aber Typ A wird überschätzt und Typ B unterschätzt. Die Fehler **gleichen sich aus**! → Untergruppen prüfen, fehlende Variable (Antragstyp) aufnehmen.

## 3. Systematische Fehler

- **`diagnose_y_vs_yhat(model)`**: echte vs. vorhergesagte y. Gut: Wolke entlang der Diagonale. **Banane** → nicht-linearer Zusammenhang fehlt.
- **`diagnose_residual(model)`**: Residuen vs. Vorhersage. Gut: gleichmäßige Wolke um 0 ohne Muster.

| Muster in den Residuen | Bedeutung | Abhilfe |
|---|---|---|
| Banane/U-Form | fehlende Nichtlinearität | quadratischer Term, log, Spline |
| Trichter/Fächer | Streuung nicht konstant (Heteroskedastizität) | log(y), anderes Varianzmodell |
| getrennte Wolken | Gruppen | Gruppenvariable aufnehmen, hierarchisch |
| einzelne Extreme | Ausreißer/einflussreiche Punkte | prüfen (Pareto-k), Sensitivitätsanalyse |

**Verständnisaufgabe 10:** Streuung wächst mit der Entfernung → die Annahme **konstantes σ** ist verletzt, der mittlere Zusammenhang kann trotzdem stimmen. Folge: Vorhersageintervalle für lange Strecken zu **eng**, für kurze zu **breit**.

**Galileo-Beispiel:** linearer Fit auf eine gekrümmte Beziehung → Bananen in y-vs-ŷ und Residuen.

### Korrelation der Parameter
```r
plotcorr(model)   # Korrelation der Koeffizienten-Samples (nicht der Daten!)
```
Stark korrelierte Parameter (z. B. Intercept und Knee.girth, weil der Knieumfang immer ≥ 29 cm ist) sind schwer einzeln interpretierbar → **zentrieren** hilft, und das HDI des Intercepts wird enger.

## 4. Generalisierung: Train/Test

```r
split_random(body, 350, "body_train", "body_test")   # 350 Zeilen Training, Rest Test
model5 = stan_glm(Height ~ Gender + knee, data=body_train, refresh=0)
prediction_metrics(model5, body_test)
diagnose_density(model5, newdata=body_test)
diagnose_residual(model5, newdata=body_test)
```

| Metrik | Formel | Bedeutung |
|---|---|---|
| **RMSE** | √(mean((y − ŷ)²)) | typischer Fehler, bestraft große Fehler stärker |
| **MAE** | mean(\|y − ŷ\|) | mittlerer absoluter Fehler, robuster |
| **Skill** | 1 − MSE_Modell / MSE_Mittelwert | 1 = perfekt, 0 = so gut wie „immer Mittelwert vorhersagen“, < 0 = schlechter |

**Interpretation:** Testfehler ≈ Trainingsfehler → generalisiert gut. Testfehler ≫ Trainingsfehler → **Overfitting**.
⚠️ Ähnliche Fehler zeigen nur Generalisierung auf **ähnliche** Daten, nicht Repräsentativität für eine andere Population (Regressionsdetektiv, „falscher Reisepass“).

## ⚠️ Typische Fallen
- „Rhat ist nicht exakt 1.000 → kaputt“: falsch, ≈ 1 reicht (< 1.1).
- „n_eff muss größer als die Sample-Zahl sein“: falsch.
- Sampling gut ⇒ Modell gut: falsch.
- „PPC-Kurven sind nicht identisch → durchgefallen“: falsch, nur grob passend nötig.
- „Residuen im Mittel 0 → keine systematischen Fehler“: falsch, auf **Muster** achten.

➡️ Quiz: [quiz/03-Modellpruefung.md](../quiz/03-Modellpruefung.md) · R-Output: [r-output-lesen/02-Sampling-und-Diagnose.md](../r-output-lesen/02-Sampling-und-Diagnose.md)
