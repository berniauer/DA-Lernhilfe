# R-Output lesen 1: `print()` und `info()` eines `stan_glm`-Modells

> In der Klausur bekommst du fast immer eine solche Ausgabe. Lerne, **jede Zeile** in 1–2 Sätzen zu erklären.

## `print(modell)`
```
stan_glm
 family:       gaussian [identity]        ← (1)
 formula:      Weight ~ Height170 + Age30 + Gender
 observations: 507                         ← (2)
 predictors:   4                           ← (3)
------
            Median MAD_SD                  ← (4)
(Intercept) 64.6    0.6                    ← (5)
Height170    0.73   0.12                   ← (6)
Age30        0.18   0.08
GenderMale   7.65   2.10                   ← (7)

Auxiliary parameter(s):
      Median MAD_SD
sigma 8.0    0.3                           ← (8)
```
1. **family**: `gaussian [identity]` = normale lineare Regression; `binomial [logit]` = logistische Regression.
2. **observations**: Anzahl der Zeilen, mit denen das Modell geschätzt wurde (Trainingsdaten!).
3. **predictors**: Anzahl Koeffizienten **inklusive** Intercept (ein Faktor mit k Levels zählt k−1).
4. **Median / MAD_SD**: Punktschätzer und Unsicherheit (≈ Standardfehler) der Posterior-Verteilung.
5. **Intercept** = Basisfall: 170 cm, 30 Jahre, Frau (Referenz) → 64.6 kg.
6. Metrisch: +1 cm (bei gleichem Alter und Geschlecht) → +0.73 kg im Mittel. Grobes 95 %-Intervall: 0.73 ± 2·0.12 = [0.49; 0.97].
7. Gruppe: Männer bei gleicher Größe und gleichem Alter +7.65 kg ggü. Frauen.
8. **sigma**: typische Abweichung einer **einzelnen** Person von der Vorhersage (±2σ ≈ ±16 kg).

## `info(modell)` (daatools)
```
              median   mad    lwr    upr  mcse n_eff Rhat
(Intercept)    64.60  0.63  63.38  65.84  0.01  3912    1
Height170       0.73  0.12   0.50   0.97  0.00  2843    1
Age30           0.18  0.08   0.03   0.34  0.00  4102    1
GenderMale      7.65  2.10   3.52  11.70  0.04  2711    1
sigma           8.00  0.25   7.52   8.49  0.00  3605    1
mean_PPD       69.15  0.50  68.18  70.12  0.01  3940    1
log-posterior -1795   1.6   ...                 1639    1
bayes_R2: 0.62
```
| Spalte | Bedeutung | Prüfen |
|---|---|---|
| median, mad | wie bei print | |
| **lwr, upr** | 95 %-HDI | Schließt es 0 ein? → Richtung unklar |
| **mcse** | Monte-Carlo-Fehler | < 5 % von mad |
| **n_eff** | effektive Samples | > 2000 gut, < 400 schlecht |
| **Rhat** | Konvergenz | ≈ 1, > 1.1 schlecht |
| **mean_PPD** | Mittelwert der vorhergesagten Daten | ≈ mean(y) |
| log-posterior | Diagnosezeile für die gesamte Posterior | n_eff etwas niedriger ist normal |
| **bayes_R2** | erklärte Varianz (Bayes-Version) | 0.62 = gut, aber nicht alles erklärt |

## Logistisch: `info(m1)` der Beispielklausur (Auszug)
```
                median  mad    lwr    upr
(Intercept)     -24.05 2.95 -29.79 -18.40
machineM2         0.09 0.17  -0.27   0.40     ← HDI schließt 0 ein!
shiftNight        1.41 0.14   1.14   1.69
pressure          0.08 0.01   0.06   0.10
exposure_time    -5.20 0.98  -7.14  -3.30
mean_PPD          0.25 ...                    ← = Defektrate
bayes_R2: 0.37
```
- Alles auf der **Logit-Skala**. Umrechnung: `exp(1.41)` ≈ 4.1 = Odds-Ratio.
- Intercept −24 → p = plogis(−24) ≈ 0, aber Basisfall „alle Prozesswerte = 0“ ist sinnlos.
- `machineM2` ≈ 0 mit HDI über 0 → nicht von M1 unterscheidbar.

## Übung
Erkläre ohne nachzusehen: Was ist der Unterschied zwischen `mad` von `GenderMale` (2.10) und `sigma` (8.0)?

<details><summary>Lösung</summary>

`mad` = Unsicherheit über den **mittleren** Gruppenunterschied (wird mit mehr Daten kleiner). `sigma` = Streuung **einzelner** Personen um die Vorhersage (bleibt auch bei unendlich vielen Daten).
</details>
