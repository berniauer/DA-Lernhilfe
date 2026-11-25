# Coding 7: Code lesen & erklären (Klausurtyp „Was macht dieser Code?“)

Erkläre jeweils, was der Code tut und was das Ergebnis bedeutet. Erst selbst überlegen!

---

### 7.1
```r
df$pressure2 = (df$pressure - 75)^2
m2 = stan_glm(defect ~ pressure + pressure2 + machine, data=df, family=binomial, refresh=0)
```
<details><summary>Lösung</summary>

Erzeugt die quadratische Abweichung vom Zielwert 75 mTorr und fittet ein logistisches Modell mit linearem und quadratischem Druckterm. So kann das Modell ein Optimum (U-Form im Logit) abbilden. Koeffizient von pressure2 > 0 → steigendes Defektrisiko bei Abweichung in beide Richtungen.
</details>

### 7.2
```r
s = as.matrix(m)
mean(s[, "shiftNight"] > s[, "shiftEvening"])
```
<details><summary>Lösung</summary>

Anteil der Posterior-Samples, in denen der Nachtschicht-Koeffizient größer ist als der Abendschicht-Koeffizient = Posterior-Wahrscheinlichkeit, dass die Nachtschicht (bei sonst gleichen Werten) höhere Defekt-Odds hat als die Abendschicht.
</details>

### 7.3
```r
nd = data.frame(humidity=30:60, machine="M5", shift="Night", pressure=75, temperature=22.5,
                exposure_time=1.05, line_speed=110)
nd$p = colMeans(posterior_epred(m2, newdata=nd))
plot(nd$humidity, nd$p, type="l")
```
<details><summary>Lösung</summary>

Erzeugt Szenarien für M5 in der Nachtschicht mit Prozesswerten am Zielwert, variiert nur die Luftfeuchtigkeit von 30–60 %, berechnet die mittlere vorhergesagte Defektwahrscheinlichkeit (Mittel über die 4000 Samples) und zeichnet die Kurve (wie Abschnitt 5 der Klausur). Für die Unsicherheit besser zusätzlich `apply(ep, 2, hdi)`. Ggf. müssen die quadratischen Spalten in nd zusätzlich berechnet werden.
</details>

### 7.4
```r
split_random(df, 3500, "df_train", "df_test")
m = stan_glm(defect ~ ., data=df_train, family=binomial)
prediction_metrics(m, df_test)
```
<details><summary>Lösung</summary>

Zufälliger Split 3500/Rest, logistisches Modell mit **allen** übrigen Spalten als Prädiktoren (`.`), Brier/LogLoss/Skill für Training und Test. Gefahr bei `~ .`: Es kommen eventuell Leakage-Variablen oder IDs ins Modell. Ein zufälliger Split ist bei Zeitstruktur zu optimistisch.
</details>

### 7.5
```r
ll = loo(m1); ll2 = loo(m2)
loo_compare(ll, ll2)
```
<details><summary>Lösung</summary>

PSIS-LOO-Kreuzvalidierung für beide Modelle und Vergleich: Das beste Modell steht oben (0). Für die anderen werden elpd_diff und se_diff ausgegeben. Relevanter Unterschied, wenn |diff| > 2·se. Zusätzlich die Pareto-k-Warnungen von `ll` prüfen.
</details>

### 7.6
```r
pp = posterior_predict(m, newdata=nd)
quantile(pp[, 1], 0.75)
```
<details><summary>Lösung</summary>

4000 Einzelvorhersagen (inkl. ε) für den ersten Fall in nd; das 75 %-Quantil davon. Das ist die kostenoptimale Planungsmenge, wenn Unterschätzen 3× so teuer ist wie Überschätzen (3/(3+1) = 0.75).
</details>

### 7.7
```r
df$machine = relevel(df$machine, ref="M3")
```
<details><summary>Lösung</summary>

Setzt M3 als Referenzgruppe. Danach sind alle Maschinenkoeffizienten Unterschiede **zu M3**, und der Intercept beschreibt M3. Vorhersagen ändern sich nicht.
</details>

### 7.8
```r
plotlogrates(m2)
```
<details><summary>Lösung</summary>

Zeigt TP/FP/TN/FN-Raten in Abhängigkeit vom Cutoff, und zwar **auf den Trainingsdaten**, weil kein `newdata` angegeben ist. Für eine faire Cutoff-Wahl `newdata=df_test` verwenden.
</details>
