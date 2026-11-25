# Kapitel 0: Statistische Grundlagen (Wiederholung)

> Quelle: Arbeitsblätter 00a „Wiederholung Basiswissen“ und 00b „Wahrscheinlichkeitsverteilungen“ (Ordner `quellen-md/Wiederholung, Downloads und Kurzreferenzen/Voraussetzung (statistisches Basiswissen)/`).
> Dieses Kapitel ist Voraussetzung. Wenn du das kannst, ist alles Weitere leichter.

## Lernziele
- Prozent vs. Prozentpunkte, Logarithmus und e^x sicher anwenden
- bedingte Wahrscheinlichkeit, Randverteilung
- Mittelwert/Median/SD/Quantile, z-Transformation, zentraler Grenzwertsatz
- lineare Regression mit `lm()` lesen
- Verteilungsfunktionen in R: `r…`, `d…`, `p…`, `q…`

## 1. Rechnen
- **Prozent vs. Prozentpunkte:** 10 % → 15 % = **+5 Prozentpunkte** = **+50 %**.
- **Logarithmus:** `log()` in R ist der natürliche Log (Basis e). `exp(log(x)) = x`.
  - log macht aus Multiplikation Addition: log(a·b) = log a + log b. Darum werden multiplikative Effekte (Gehälter, Odds) nach `log` additiv modellierbar.
  - Kleine β: e^β ≈ 1 + β (z. B. e^0.05 ≈ 1.051 → ≈ +5 %).

## 2. Wahrscheinlichkeit
- Unabhängig: p(A ∩ B) = p(A)·p(B).
- Bedingt: **p(A|B) = p(A ∩ B) / p(B)**. „Wahrscheinlichkeit von A, *wenn* B“.
- **p(A|B) ≠ p(B|A)!** (Klassiker: Test-Sensitivität vs. Wahrscheinlichkeit krank bei positivem Test → Kapitel 1.)
- **Randverteilung (marginal):** in einer Kreuztabelle die Zeilen- bzw. Spaltensummen. Summiert man über eine Variable, erhält man die Verteilung der anderen.

## 3. Lage- und Streuungsmaße
| Maß | Bedeutung | Ausreißer-empfindlich? |
|---|---|---|
| Mittelwert | Schwerpunkt | ja |
| Median | 50 %-Quantil | nein (robust) |
| Modus | häufigster Wert | — |
| SD / Varianz | Streuung (Varianz = SD²) | ja |
| MAD | Median der absoluten Abweichung (×1.48 ≈ SD bei Normalverteilung) | nein |
| Quantile | z. B. 25 %/75 % (Quartile) | nein |

- **z-Transformation:** z = (x − Mittelwert)/SD → Mittelwert 0, SD 1. Macht Variablen vergleichbar (gleiche Skala) → relevant für **Effektgrößen** und **Priors** (rstanarm skaliert intern).
- **Zentrieren:** nur den Mittelwert (oder einen sinnvollen Referenzwert) abziehen → **Basisfall wird interpretierbar**, Korrelation Intercept–Koeffizient sinkt.
- **Zentraler Grenzwertsatz:** Mittelwerte vieler Stichproben sind (annähernd) normalverteilt, egal wie die Ausgangsverteilung aussieht. Die SD der Mittelwerte (Standardfehler) = SD/√n.

## 4. Verteilungen in R
| Präfix | Bedeutung | Beispiel |
|---|---|---|
| `r` | Zufallszahlen | `rnorm(100, 170, 7)` |
| `d` | Dichte (density) | `dnorm(180, 170, 7)` |
| `p` | Verteilungsfunktion P(X ≤ x) | `pnorm(180, 170, 7)` ≈ 0.92 |
| `q` | Quantil (Umkehrung von p) | `qnorm(0.975)` ≈ 1.96 |

Wichtige Verteilungen: `unif`, `norm`, `binom` (Ja/Nein-Zählungen, Basis der logistischen Regression), `beta` (Werte zwischen 0 und 1, typischer Prior für Anteile), `gamma`/`exp` (positive Werte), `pois` (Zählungen).

**Faustregel Normalverteilung:** ±1 SD ≈ 68 %, **±2 SD ≈ 95 %**, ±3 SD ≈ 99.7 %.

## 5. Lineare Regression (klassisch mit `lm`)
```r
body = read.csv('daten/body-dimensions.csv', stringsAsFactors=TRUE)
m = lm(Weight ~ Height + Gender, data=body)
summary(m)        # Koeffizienten, Standardfehler, p-Werte, R²
predict(m, newdata=data.frame(Height=180, Gender="Male"), interval="prediction")
```
- y = α + β·x + ε; die Residuen ε sind die Abstände zur Geraden. Die Regression minimiert die Summe der quadrierten Residuen.
- **p-Wert (frequentistisch):** Wahrscheinlichkeit, solche (oder extremere) **Daten** zu sehen, *wenn* β = 0 wäre. Er ist **nicht** die Wahrscheinlichkeit, dass die Hypothese stimmt. Genau deshalb wechselt die LV zu Bayes (Kapitel 2).

## ⚠️ Typische Fallen
- Prozent und Prozentpunkte verwechseln.
- p(A|B) und p(B|A) verwechseln.
- Mittelwert bei schiefen Verteilungen (Gehälter) als „typischen Wert“ nehmen → Median.

➡️ Quiz: [quiz/01-Grundlagen-Bayes.md](../quiz/01-Grundlagen-Bayes.md)
