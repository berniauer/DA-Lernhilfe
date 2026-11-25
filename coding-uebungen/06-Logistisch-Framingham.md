# Coding 6: Komplette logistische Analyse (Framingham-Herzstudie)

> Datensatz: `daten/framingham-clean.csv`: `age`, `BMI`, `sex`, `diabetes`, `hypertension`, `TenYearCHD` (koronare Herzkrankheit in 10 Jahren, yes/no), `cigarettes`
> Ziel: der ganze Klausur-Workflow von Daten bis Cutoff, also genau das, was in der Beispielklausur abgefragt wird.

## Schritt 1: Daten vorbereiten
<details><summary>Lösung</summary>

```r
fr = read.csv("daten/framingham-clean.csv", stringsAsFactors=TRUE)
fr$chd = as.integer(fr$TenYearCHD == "yes")
fr$cigarettes = as.numeric(as.character(fr$cigarettes))
fr = na.omit(fr)
fr$age50 = fr$age - 50; fr$BMI25 = fr$BMI - 25
info(fr)                    # mean von chd = Basisrate
set.seed(1)
split_random(fr, round(0.7*nrow(fr)), "fr_train", "fr_test")
```
</details>

## Schritt 2: Modell fitten & prüfen
Fitte `chd ~ age50 + BMI25 + sex + diabetes + hypertension + cigarettes`. Prüfe Sampling und mean_PPD.

<details><summary>Lösung</summary>

```r
fm = stan_glm(chd ~ age50 + BMI25 + sex + diabetes + hypertension + cigarettes,
              data=fr_train, family=binomial, refresh=0)
info(fm); check_sampling(fm)
mean(fr_train$chd)          # vs. mean_PPD
```
</details>

## Schritt 3: Interpretieren
a) Basisfall + Wahrscheinlichkeit. b) Odds-Ratio für 10 Jahre Alter. c) Odds-Ratio für 10 Zigaretten/Tag.

<details><summary>Lösung</summary>

```r
b = coef(fm)
plogis(b["(Intercept)"])         # Frau, 50 J., BMI 25, kein Diabetes/Hypertonie, Nichtraucherin
exp(10*b["age50"]); exp(10*b["cigarettes"])
exp(b)                           # alle Odds-Ratios
```
Formulierung: „Bei sonst gleichen Merkmalen sind die Odds einer KHK bei 10 Jahre älteren Personen um den Faktor … höher.“
</details>

## Schritt 4: Effektgröße
<details><summary>Lösung</summary>

```r
effectsize(fm)    # Df / Deviance / AIC: größter AIC-Anstieg = wichtigste Variable
```
</details>

## Schritt 5: Güte auf Testdaten
<details><summary>Lösung</summary>

```r
prediction_metrics(fm, fr_test)   # Brier, LogLoss, Skill (Training vs. Test)
ROC(fm, newdata=fr_test)          # AUC
p0 = mean(fr_train$chd); p0*(1-p0) # Brier des Nullmodells zum Vergleich
```
</details>

## Schritt 6: Modellvergleich
Vergleiche mit einem Modell ohne `BMI25` und `diabetes`.

<details><summary>Lösung</summary>

```r
fm2 = update(fm, . ~ . - BMI25 - diabetes)
loo_compare(loo(fm), loo(fm2))    # 2·se-Regel
prediction_metrics(fm2, fr_test)
```
</details>

## Schritt 7: Cutoff
Eine Ärztin will mindestens 70 % der künftigen KHK-Fälle zu einer Zusatzuntersuchung schicken. Welcher Cutoff? Wie viele Gesunde werden mitgeschickt?

<details><summary>Lösung</summary>

```r
plotlogrates(fm, newdata=fr_test)            # TP-Rate ≥ 0.7 ablesen
r = logistic_rates(fm, newdata=fr_test); r   # exakter Wert
plotlogrates(fm, newdata=fr_test, count=TRUE)
```
Cutoff = größter Wert mit TPR ≥ 0.70; FPR an dieser Stelle × Anzahl Gesunde = mitgeschickte Gesunde. Die Basisrate ist niedrig (~15 %), deshalb ist der Cutoff deutlich unter 0.5.
</details>

## Schritt 8: Kalibrierung
<details><summary>Lösung</summary>

```r
p = predict(fm, newdata=fr_test, type="response")
rms::val.prob(p, fr_test$chd)
# oder manuell:
g = cut(p, c(0, .1, .2, .3, .5, 1))
aggregate(cbind(prognose=p, beobachtet=fr_test$chd) ~ g, FUN=mean)
```
</details>

## Schritt 9: Kritisch reflektieren
Schreibe 3 Sätze: Kausalität? Repräsentativität (Framingham = eine US-Kleinstadt ab 1948)? Leakage?

<details><summary>Lösung</summary>

- Rauchen/Bluthochdruck sind mit KHK **assoziiert**; kausal ist das hier nicht belegbar (Confounder wie Lebensstil, Einkommen), wird aber durch andere Forschung gestützt.
- Die Population (weiß, US-Kleinstadt, historische Kohorte) ist nicht automatisch repräsentativ für heutige europäische Patient\*innen → Kalibrierung prüfen.
- Alle Prädiktoren wurden bei der Baseline gemessen → kein offensichtliches Leakage. Prüfen, ob „hypertension“ eventuell später diagnostiziert wurde.
</details>
