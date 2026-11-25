# Kapitel 8: Modellvergleich: LOO, elpd, Pareto-k, AIC

> Quelle: Arbeitsblatt 06 „Modellvergleich“ · Verständnisaufgaben 23–24

## Lernziele
- Overfitting erklären; warum R² allein nicht reicht
- `loo()` und `loo_compare()` lesen; Faustregel 2·se
- Pareto-k-Diagnose
- Voraussetzungen und Grenzen des Vergleichs

## 1. Warum nicht einfach R²?
- R² steigt (fast) **immer**, wenn man Variablen hinzufügt, auch bei reinem Rauschen → **Overfitting**: Das Modell merkt sich Zufälligkeiten der Trainingsdaten.
- Gefragt ist: **Wie gut sagt das Modell neue Daten vorher?** → Testdaten oder **Kreuzvalidierung**.

## 2. Leave-One-Out (LOO)
- Idee: Für jede Beobachtung i das Modell **ohne i** fitten und i vorhersagen. Exakt wäre das n-mal rechnen. `loo()` approximiert es effizient mit **PSIS** (Pareto Smoothed Importance Sampling) aus den vorhandenen Samples.
- **elpd** (expected log pointwise predictive density): Summe der log-Vorhersagedichten für ausgelassene Punkte. **Größer = besser** (weniger negativ).
- **looic = −2·elpd** (kleiner = besser, wie AIC).
- **p_loo** ≈ effektive Anzahl Parameter.

```r
loo1 = loo(m1); loo2 = loo(m2)
loo1                       # elpd_loo, p_loo, looic + Pareto-k-Tabelle
loo_compare(loo1, loo2)
```
```
   elpd_diff se_diff
m2     0.0     0.0
m1  -222.8    24.0
```
- Das **beste Modell steht oben** mit 0. Die anderen zeigen, wie viel elpd sie **schlechter** sind.
- **Faustregel:** |elpd_diff| > **2·se_diff** → relevanter Unterschied. Hier 222.8 > 48 → m2 klar besser.
- |elpd_diff| < 2·se → Daten können nicht klar unterscheiden → **einfacheres** Modell ist vertretbar (zeigt aber nicht, dass beide gleich gut sind!).

## 3. Pareto-k-Diagnose
Für jede Beobachtung ein k-Wert: Wie stark hängt die Posterior von diesem einen Punkt ab?

| k | Bewertung |
|---|---|
| < 0.7 | ok, LOO-Approximation verlässlich |
| 0.7 – 1 | problematisch (Graubereich) |
| > 1 | sehr schlecht: einflussreiche Ausreißer, LOO unzuverlässig |

Bei vielen hohen k: Ausreißer prüfen, `loo(m, k_threshold=0.7)` (exakte Refits) oder K-fold (`kfold(m, K=10)`). Kann auch auf ein **fehlspezifiziertes Modell** hinweisen.

## 4. Voraussetzungen (Verständnisaufgabe 23/24)
- **Gleiche y-Variable** auf gleicher Skala: `y` vs. `log(y)` ist **nicht** direkt vergleichbar.
- **Gleiche Datenzeilen**: Hat ein Modell durch NAs weniger Zeilen, ist der Vergleich ungültig.
- Prädiktoren dürfen unterschiedlich sein.
- LOO setzt (annähernd) **unabhängige** Beobachtungen voraus. Bei Zeitreihen/Gruppen ist es zu optimistisch → zeitliche/gruppierte Validierung.

## 5. AIC (in der LV über `effectsize`)
- AIC = Deviance + 2·(Anzahl Parameter). Kleiner = besser. Bestraft Komplexität.
- Für große n gilt grob: ΔAIC/2 ≈ elpd-Differenz (Beispielklausur: 444/2 ≈ 222 ✓).

## 6. Gesamtbild beim Modellvergleich
Nie nur eine Zahl! Kombiniere:
1. Sampling ok?
2. R² (Erklärung)
3. **Testdaten**: RMSE/MAE/Skill bzw. Brier/LogLoss/Skill/AUC
4. **LOO** mit 2·se-Regel
5. Residuen/Diagnoseplots (systematische Fehler?)
6. **Fachliche Plausibilität** und Interpretierbarkeit
7. Kosten/Komplexität (Datenerhebung für mehr Variablen)

## ⚠️ Typische Fallen
- Höheres R² ⇒ besseres Modell.
- elpd_diff ohne se interpretieren.
- Modelle mit verschiedenem y oder verschiedenen Zeilen vergleichen.
- „Kein signifikanter Unterschied“ = „gleich gut“.
- Pareto-k-Warnungen ignorieren.

➡️ Quiz: [quiz/08-Modellvergleich.md](../quiz/08-Modellvergleich.md) · R-Output: [r-output-lesen/04-loo-compare.md](../r-output-lesen/04-loo-compare.md)
