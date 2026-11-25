# Coding 1: Setup & erstes Bayes-Modell

> Datensatz: `daten/body-dimensions.csv` (507 Personen; u. a. `Weight` kg, `Height` cm, `Age`, `Gender`)
> Ziel: ein `stan_glm`-Modell fitten, zentrieren, Ausgabe interpretieren.

## Setup (einmalig)
```r
install.packages(c("rstanarm", "bayesplot", "loo", "ggplot2", "rms"))
install.packages("daten/daatools_0.8.tar.gz", repos=NULL, type="source")
library(rstanarm); library(daatools)
options(mc.cores = parallel::detectCores())
```

## Aufgabe 1.1: Daten ansehen
Lies die Daten ein und verschaffe dir mit `info()` einen Überblick. Welches Level von `Gender` ist die Referenz?

<details><summary>Lösung</summary>

```r
body = read.csv("daten/body-dimensions.csv", stringsAsFactors=TRUE)
info(body)
levels(body$Gender)   # "Female" "Male" → Referenz: Female (alphabetisch erstes Level)
```
</details>

## Aufgabe 1.2: Modell ohne Zentrierung
Fitte `Weight ~ Height + Gender`. Was bedeutet der Intercept? Warum ist er sinnlos?

<details><summary>Lösung</summary>

```r
m0 = stan_glm(Weight ~ Height + Gender, data=body, seed=1, refresh=0)
info(m0)
```
Der Intercept ist das Gewicht einer **Frau mit 0 cm**, also stark negativ und physikalisch sinnlos (Extrapolation).
</details>

## Aufgabe 1.3: Zentrieren
Zentriere `Height` auf 170 cm und `Age` auf 30 Jahre, fitte `Weight ~ Height170 + Age30 + Gender`. Interpretiere alle Koeffizienten und σ.

<details><summary>Lösung</summary>

```r
body$Height170 = body$Height - 170
body$Age30 = body$Age - 30
m1 = stan_glm(Weight ~ Height170 + Age30 + Gender, data=body, seed=1, refresh=0)
info(m1)
```
- Intercept: Frau, 170 cm, 30 Jahre → erwartetes Gewicht ≈ Intercept kg.
- Height170: +1 cm bei gleichem Alter/Geschlecht → +β kg im Mittel.
- Age30: +1 Jahr bei gleicher Größe/Geschlecht → +β kg.
- GenderMale: Männer vs. Frauen bei gleicher Größe/Alter.
- sigma: typische Abweichung einer einzelnen Person (±2σ für 95 %).
- Die Steigungen sind **identisch** mit dem unzentrierten Modell, nur der Intercept ändert sich.
</details>

## Aufgabe 1.4: Intervalle & Wahrscheinlichkeiten
a) 95 %-HDI aller Koeffizienten. b) Wie wahrscheinlich ist es (laut Posterior), dass Männer bei gleicher Größe und gleichem Alter mehr als 5 kg schwerer sind?

<details><summary>Lösung</summary>

```r
hdi(m1)
plotcoef(m1, "beta")
s = as.matrix(m1)
mean(s[, "GenderMale"] > 5)
plothist(m1, "GenderMale", compVal=5)
```
</details>

## Aufgabe 1.5: log-Modell
Fitte `log(Weight) ~ Height170 + Gender`. Wie interpretiert man jetzt `GenderMale`?

<details><summary>Lösung</summary>

```r
m2 = stan_glm(log(Weight) ~ Height170 + Gender, data=body, seed=1, refresh=0)
b = coef(m2)["GenderMale"]; exp(b); 100*(exp(b)-1)
```
Männer wiegen bei gleicher Größe im Mittel ca. 100·(e^β − 1) % mehr (multiplikativ). `exp(Intercept)` ist das **Median**-Gewicht einer 170 cm großen Frau.
</details>

## Aufgabe 1.6: Code erklären
Was macht dieser Code Zeile für Zeile?
```r
prior_summary(m1)
m1b = update(m1, prior = normal(0, 0.1))
info(m1b)
```

<details><summary>Lösung</summary>

1. Zeigt die (Default-)Priors von m1: specified auf z-Skala, adjusted auf Originalskala.
2. Refit mit einem **sehr engen** Prior normal(0, 0.1) für alle Koeffizienten, also der starken Annahme „Effekte nahe 0“.
3. Die Koeffizienten werden Richtung 0 gezogen (vor allem GenderMale). Das zeigt, wie ein unbegründet enger Prior das Ergebnis dominiert (Sensitivitätsanalyse).
</details>
