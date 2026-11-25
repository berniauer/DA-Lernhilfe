# Coding 3: Vorhersagen mit Samples & Entscheidungen

> Datensatz: `daten/body-dimensions.csv`, Modell m1 aus Coding 1

## Aufgabe 3.1: epred vs. predict
Für eine 171 cm große, 36-jährige Frau und einen 196 cm großen, 48-jährigen Mann: Berechne Punktvorhersage, 95 %-Intervall für den **Mittelwert** und für eine **Einzelperson**.

<details><summary>Lösung</summary>

```r
nd = data.frame(Height170=c(1, 26), Age30=c(6, 18), Gender=c("Female", "Male"))
predict(m1, newdata=nd)
ep = posterior_epred(m1, newdata=nd);   hdi(ep, add=median)
pp = posterior_predict(m1, newdata=nd); hdi(pp, add=median)
dim(pp)   # 4000 x 2
```
Das predict-Intervall ist um ca. ±2σ breiter.
</details>

## Aufgabe 3.2: Wahrscheinlichkeiten aus Samples
a) P(Frau wiegt zwischen 55 und 60 kg)? b) P(Mann > 90 kg)? c) P(Frau schwerer als Mann)?

<details><summary>Lösung</summary>

```r
mean(pp[,1] >= 55 & pp[,1] < 60)
mean(pp[,2] > 90)
mean(pp[,1] > pp[,2])          # zeilenweise!
```
</details>

## Aufgabe 3.3: Flugzeug-Entscheidung
150 Passagiere (zufällig aus `body` gezogen). Zu wenig eingeplantes Gewicht kostet 15 €/kg, zu viel 5 €/kg. Welches Gesamtgewicht planst du ein?

<details><summary>Lösung</summary>

```r
set.seed(7)
pass = body[sample(nrow(body), 150), ]
pp = posterior_predict(m1, newdata=pass)
gesamt = rowSums(pp)
kosten = function(e) mean(ifelse(gesamt > e, 15*(gesamt - e), 5*(e - gesamt)))
kand = seq(quantile(gesamt, .01), quantile(gesamt, .99), length.out=300)
best = kand[which.min(sapply(kand, kosten))]
best; quantile(gesamt, 0.75)   # ≈ gleich: Quantil 15/(15+5)
```
</details>

## Aufgabe 3.4: Von Hand
Fehlende Portionen kosten 4 €, überzählige 1 €. Welches Quantil der Nachfrage-Verteilung bereitest du vor?

<details><summary>Lösung</summary>

4/(4+1) = **0.8** → 80 %-Quantil von `posterior_predict`.
</details>

## Aufgabe 3.5: Code erklären
```r
d = s[, "machineM5"] - s[, "machineM4"]
hdi(d); mean(d > 0)
```

<details><summary>Lösung</summary>

`s = as.matrix(modell)`. Für jedes der 4000 Samples wird die Differenz der Koeffizienten M5 − M4 gebildet (**zeilenweise**, gemeinsame Posterior). `hdi(d)` gibt das 95 %-Intervall der Differenz, `mean(d > 0)` die Posterior-Wahrscheinlichkeit, dass M5 höhere Defekt-Odds hat als M4. Das ist der korrekte Weg statt „überlappen die Intervalle?“.
</details>
