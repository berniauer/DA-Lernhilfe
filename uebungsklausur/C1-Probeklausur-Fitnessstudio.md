# Probeklausur C: Kündigungen im Fitnessstudio (logistische Regression, Cutoff, Kosten)

> **Selbst erstellt** im Stil der Beispielklausur. Die Zahlen kommen aus einer echten Simulation mit logistischer Regression und sind konsistent.
> Schwerpunkte: Odds/Odds-Ratio ↔ Wahrscheinlichkeit, Brier/Skill/AUC, Kalibrierung, Leakage, **Cutoff mit Kostenfunktion**, Accuracy-Falle.
> Zeit: ca. 60 Minuten. Lösung: [C2-Loesung-Fitnessstudio.md](C2-Loesung-Fitnessstudio.md)

---

Eine Fitnessstudio-Kette möchte vorhersagen, welche Mitglieder in den **nächsten 3 Monaten kündigen**, um ihnen rechtzeitig ein Halteangebot zu machen. Daten von 3000 Mitgliedern (Stichtag 1. März):

| Variable | Bedeutung |
|---|---|
| `kuendigung` | Kündigung in den 3 Monaten nach dem Stichtag (1/0) |
| `besuche` | durchschnittliche Studio-Besuche pro Monat im letzten Quartal **vor** dem Stichtag |
| `alter36` | Alter − 36 Jahre |
| `jahresvertrag` | 1 = Jahresvertrag, 0 = Monatsvertrag |
| `entfernung` | Entfernung Wohnort ↔ Studio (km) |
| `preiserhoehung` | 1 = Mitglied war von einer Preiserhöhung im Jänner betroffen |

Training 2200, Test 800 (zufällige Aufteilung).

## 1. Übersicht

```
                mean   sd median   min   max na neg0
kuendigung      0.24 0.43   0.00  0.00  1.00  0 2285
besuche         4.88 3.92   4.00  0.00 25.00  0  222
alter          35.96 10.28 36.00 18.00 71.00  0    0
jahresvertrag   0.44 0.50   0.00  0.00  1.00  0 1677
entfernung      4.93 3.44   4.10  0.30 24.90  0    0
preiserhoehung  0.31 0.46   0.00  0.00  1.00  0 2070
```

- **1.1** Die Marketingabteilung möchte zusätzlich die Variable `kuendigungsgespraech` (ob ein Mitglied im März/April ein Gespräch an der Rezeption zum Thema Kündigung geführt hat) ins Modell aufnehmen, weil sie „extrem gut vorhersagt“. Was halten Sie davon?

## 2. Modell

```r
c2 = stan_glm(kuendigung ~ besuche + alter36 + jahresvertrag + entfernung + preiserhoehung,
              data=df_train, family=binomial, refresh=0)
info(c2)
```
```
               median  mad   lwr   upr mcse n_eff Rhat
(Intercept)     -0.43 0.14 -0.69 -0.16 0.00  3654    1
besuche         -0.32 0.02 -0.36 -0.27 0.00  3266    1
alter36         -0.01 0.01 -0.02  0.00 0.00  3120    1
jahresvertrag   -0.92 0.12 -1.15 -0.69 0.00  4429    1
entfernung       0.11 0.02  0.08  0.14 0.00  3171    1
preiserhoehung   0.73 0.12  0.51  0.96 0.00  2929    1
mean_PPD         0.24 ...
bayes_R2: 0.18
```
```r
round(exp(coef(c2)), 3)
```
```
(Intercept)  besuche  alter36  jahresvertrag  entfernung  preiserhoehung
      0.653    0.729    0.990          0.398       1.117           2.085
```

- **2.1** Beschreiben Sie den Basisfall und berechnen Sie seine Kündigungswahrscheinlichkeit.
- **2.2** Interpretieren Sie `besuche` und `jahresvertrag`.
- **2.3** Die Geschäftsführung liest: „Eine Preiserhöhung verdoppelt das Kündigungsrisiko.“ Nehmen Sie Stellung. Rechnen Sie die Wirkung der Preiserhöhung für zwei Mitglieder in Wahrscheinlichkeiten um:
  - Mitglied A: Basisfall (p ≈ 0.39)
  - Mitglied B: p ≈ 0.019 (10 Besuche, Jahresvertrag, 5 km)
- **2.4** Was können Sie zum Alter sagen?

## 3. Güte und Vergleich

Zum Vergleich ein einfacheres Modell `c1` (nur besuche, alter36, jahresvertrag).

```
prediction_metrics(c1, df_test)
   Dataset    n  Brier LogLoss  Skill
1 Training 2200 0.1556  0.4708 0.1370
2 New data  800 0.1525  0.4631 0.1757

prediction_metrics(c2, df_test)
   Dataset    n  Brier LogLoss  Skill
1 Training 2200 0.1477  0.4505 0.1807
2 New data  800 0.1440  0.4434 0.2218

AUC (ROC auf Testdaten):  c1: 0.776   c2: 0.798

loo_compare(loo1, loo2)
   elpd_diff se_diff
c2     0.0     0.0
c1   -42.6     9.3

effectsize(c2)
               Df Deviance    AIC
<none>             1982.3  1994.3
alter36         1   1986.0  1996.0
preiserhoehung  1   2021.9  2031.9
entfernung      1   2032.8  2042.8
jahresvertrag   1   2047.6  2057.6
besuche         1   2268.9  2278.9
```

- **3.1** Was bedeutet ein Brier-Skill von 0.22? Wie groß wäre der Brier-Score des Nullmodells ungefähr?
- **3.2** Interpretieren Sie AUC = 0.798 in einem Satz.
- **3.3** Welches Modell ist besser? Ist der Unterschied überzeugend?
- **3.4** Welche Variable ist laut `effectsize` am wichtigsten, welche am unwichtigsten?

## 4. Kalibrierung

Kalibrierung von c2 auf den Testdaten (Mitglieder nach Prognose gruppiert):

```
Prognose-Bereich  mittlere Prognose  beobachtete Kündigungsrate    n
[0.0, 0.1)              0.050                0.048               252
[0.1, 0.2)              0.148                0.191               173
[0.2, 0.3)              0.248                0.169               118
[0.3, 0.5)              0.398                0.428               173
[0.5, 1.0)              0.606                0.679                84
```

- **4.1** Ist das Modell gut kalibriert? Wo über- bzw. unterschätzt es?
- **4.2** Warum können zwei Modelle die gleiche AUC, aber sehr unterschiedliche Brier-Scores haben?

## 5. Cutoff und Kosten

Testdaten: **196 Kündigungen** von 800 Mitgliedern.

```
cutoff   TPR    FPR  |  TP  FN  FP  TN
 0.10  0.939  0.603  | 184  12 364 240
 0.15  0.852  0.475  | 167  29 287 317
 0.20  0.770  0.371  | 151  45 224 380
 0.25  0.740  0.280  | 145  51 169 435
 0.30  0.668  0.209  | 131  65 126 478
 0.40  0.495  0.114  |  97  99  69 535
 0.50  0.291  0.045  |  57 139  27 577
 0.60  0.148  0.013  |  29 167   8 596
```

Jedes markierte Mitglied erhält einen Gutschein im Wert von **30 €**. Vereinfachend nehmen wir an, dass markierte Kündiger dadurch bleiben. Jedes **nicht** markierte Mitglied, das kündigt, kostet **300 €** entgangenen Umsatz.

- **5.1** Ein Analyst empfiehlt den Cutoff 0.5, „weil dort 79 % der Mitglieder richtig klassifiziert werden“. Prüfen Sie die Zahl und bewerten Sie das Argument. (Tipp: Wie viel Prozent richtig hätte die Regel „niemand kündigt“?)
- **5.2** Berechnen Sie die Kosten für die Cutoffs 0.1, 0.3 und 0.5 sowie für die Strategien „niemandem einen Gutschein geben“ und „allen einen Gutschein geben“. Welchen Cutoff empfehlen Sie?
- **5.3** Wäre die Wahl dieselbe, wenn der Gutschein 150 € kosten würde? (Qualitativ begründen.)

## 6. Einsatz

- **6.1** Die Kette eröffnet ein neues Studio in einer anderen Stadt mit hauptsächlich Student\*innen. Darf sie das Modell dort einsetzen?
- **6.2** Warum ist der zufällige Train/Test-Split hier möglicherweise zu optimistisch, und wie würden Sie stattdessen aufteilen?
