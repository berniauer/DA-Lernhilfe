# Coding 4: Simpson, Kontrollvariablen & Interaktionen

> Datensätze: `daten/operationen.csv`, `daten/wohnungspreise.csv`, `daten/body-dimensions.csv`

## Aufgabe 4.1: Simpsons Paradox nachrechnen
Berechne die Komplikationsraten je Team gesamt und je Schwierigkeit.

<details><summary>Lösung</summary>

```r
op = read.csv("daten/operationen.csv", stringsAsFactors=TRUE)
op$kompl = as.integer(op$Resultat == "Komplikationen")
aggregate(kompl ~ Team, data=op, mean)
aggregate(kompl ~ Team + Schwierigkeit, data=op, mean)
table(op$Team, op$Schwierigkeit)       # Fallmischung!
```
Gesamt ist B besser, je Schwierigkeit A. Grund: A operiert hauptsächlich schwere Fälle.
</details>

## Aufgabe 4.2: Vorzeichenwechsel
Fitte `preis ~ zimmer` und `preis ~ wohnflaeche + zimmer`. Erkläre den Wechsel.

<details><summary>Lösung</summary>

```r
w = read.csv("daten/wohnungspreise.csv")
w$zimmer4 = w$zimmer - 4; w$wohnflaeche90 = w$wohnflaeche - 90
cor(w$zimmer, w$wohnflaeche)
f1 = stan_glm(preis ~ zimmer4, data=w, refresh=0)
f2 = stan_glm(preis ~ wohnflaeche90 + zimmer4, data=w, refresh=0)
info(f1); info(f2)
```
f1: mehr Zimmer ↔ größere Wohnung → teurer. f2: **bei gleicher Fläche** bedeuten mehr Zimmer kleinere Räume → billiger. Verschiedene Fragen, beide korrekt.
</details>

## Aufgabe 4.3: Interaktion
Hängt der Zusammenhang Größe → Gewicht vom Geschlecht ab? Fitte `Weight ~ Height170 * Gender` und berechne die Steigung für Männer.

<details><summary>Lösung</summary>

```r
mi = stan_glm(Weight ~ Height170 * Gender, data=body, refresh=0)
info(mi)
s = as.matrix(mi)
steig_m = s[, "Height170"] + s[, "Height170:GenderMale"]
hdi(steig_m, add=median)
loo_compare(loo(m1), loo(mi))   # lohnt sich die Interaktion?
```
- `Height170` = Steigung der Frauen. `GenderMale` = Unterschied bei 170 cm. `Height170:GenderMale` = Differenz der Steigungen.
- Steigung Männer = Summe (aus Samples berechnet, mit Unsicherheit).
</details>

## Aufgabe 4.4: Von Hand rechnen
Modell: `y = 20 + 2·x + 5·G − 1.5·x·G` (G = 1 für Gruppe B, x zentriert auf 10).
a) Steigung in B? b) Unterschied B − A bei x_original = 10, 14, 6?

<details><summary>Lösung</summary>

a) 2 − 1.5 = **0.5**. b) x_zentriert = 0, 4, −4 → 5 − 1.5·0 = **5**; 5 − 6 = **−1**; 5 + 6 = **11**. Der Gruppenunterschied hängt vom x-Wert ab.
</details>

## Aufgabe 4.5: Quadratischer Term & Scheitelpunkt
Logit-Modell: `0.13·humidity + 0.02·(humidity − 45)²`. Wo liegt das Minimum?

<details><summary>Lösung</summary>

x* = 45 − 0.13/(2·0.02) = 45 − 3.25 = **41.75 %**.
</details>
