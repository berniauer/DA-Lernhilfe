# R-Output lesen 5: `prediction_metrics`, `brier`, `ROC`, `logistic_rates`/`plotlogrates`

## `prediction_metrics()`, metrisch
```
   Dataset    n  RMSE   MAE Skill
1 Training 1000 4.619 3.733 0.829
2 New data  400 4.681 3.814 0.808
```
- RMSE/MAE in der **Einheit von y** (hier kWh). Skill = 1 − MSE/MSE(Mittelwert des Trainings).
- Training ≈ Test → kein Overfitting.

## `prediction_metrics()`, logistisch
```
   Dataset    n  Brier LogLoss  Skill
1 Training 3500 0.1150  0.3783 0.3866
2 New data 1500 0.1093  0.3790 0.4117
```
- **Brier** kleiner = besser; Nullmodell = p̄(1 − p̄) = 0.25·0.75 = 0.1875.
- **Skill** = 1 − Brier/Brier_Null ≈ 0.41 → 41 % besser als „immer 25 % vorhersagen“.
- **LogLoss**: Nullmodell bei p̄ = 0.25 ≈ 0.562.

## `brier(m, newdata)`
Gibt den Brier-Score (und je nach Version die Zerlegung) für die angegebenen Daten aus.

## `ROC(m, newdata=df_test)`
Zeichnet TPR (y-Achse) gegen FPR (x-Achse) für alle Cutoffs und gibt die **AUC** aus.
- Diagonale = Zufall (AUC 0.5). Je weiter nach links oben, desto besser.
- AUC = P(Positiver bekommt höheres p als Negativer).

## `logistic_rates(m, newdata=df_test)`
```
 cutoff   TPR   FPR   TNR   FNR  ...
   0.10 0.939 0.603 0.397 0.061
   0.30 0.668 0.209 0.791 0.332
   0.50 0.291 0.045 0.955 0.709
```
## `plotlogrates(m, newdata=df_test)`
x-Achse = Cutoff, Linien für die Raten (TP, FP, TN, FN). Mit `count=TRUE` Anzahlen statt Raten.
**Ohne `newdata` → Trainingsdaten!**

### So liest du den Klausurplot
1. Vorgabe übersetzen (z. B. „max. 1 von 4 Defekten übersehen“ → FN-Rate ≤ 0.25 bzw. TP-Rate ≥ 0.75).
2. Auf der passenden Linie den Wert suchen → Cutoff auf der x-Achse ablesen (≈ 0.3).
3. Beim selben Cutoff die FP-Rate ablesen (≈ 0.13).
4. In Anzahlen umrechnen: TPR × #Positive, FPR × #Negative.

## Übung
Test: 200 Positive, 800 Negative. Bei Cutoff 0.25: TPR 0.80, FPR 0.20. Wie viele Alarme gibt es, und wie viele davon sind echt?

<details><summary>Lösung</summary>

TP = 160, FP = 160 → 320 Alarme, davon 50 % echt (Precision 0.5). 40 Positive werden übersehen.
</details>
