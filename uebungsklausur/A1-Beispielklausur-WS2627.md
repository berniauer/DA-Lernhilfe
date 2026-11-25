# Beispielklausur WS26/27 (bereinigte Fassung)

> Originale PDF: [`originale/…/Beispielklausur WS2627.pdf`](../originale/Arbeitsblätter,%20Übungen,%20Daten,%20Sourcecode/Beispielklausur%20WS2627.pdf)
> Diese Fassung ist aus dem PDF abgeschrieben und für das Handy lesbar gemacht. Die Diagramme sind in Worten beschrieben (📈).
> **Musterlösung:** [A2-Musterloesung.md](A2-Musterloesung.md). Versuche aber zuerst, selbst zu antworten.

---

Ein Halbleiterhersteller untersucht Produktionsfehler in einem kritischen Prozessschritt. Ziel ist es, fehlerhafte Einheiten frühzeitig zu erkennen, bevor sie in nachfolgende Produktionsschritte gelangen.

Folgende Daten liegen vor:

| Variable | Bedeutung |
|---|---|
| `defect` | ob eine Einheit fehlerhaft ist (1 = ja, 0 = nein) |
| `pressure` | Prozessdruck im kritischen Prozessschritt (mTorr) |
| `temperature` | Temperatur am kritischen Prozessschritt (°C) |
| `humidity` | relative Luftfeuchtigkeit im relevanten Produktionsbereich (%) |
| `exposure_time` | Belichtungs- bzw. Bearbeitungszeit im Prozessschritt (Sekunden) |
| `line_speed` | Transport-/Liniengeschwindigkeit (mm/s) |
| `machine` | verwendete Produktionsanlage |
| `shift` | Produktionsschicht |

## 1. Übersicht über Datensatz

```
               mean    sd median   min   max na neg0
defect         0.25  0.43   0.00  0.00   1.0  0 2622
pressure      75.47  8.28  75.70 46.60 102.9  0    0
temperature   22.65  1.13  22.60 18.40  27.1  0    0
humidity      44.62  4.59  44.50 30.00  60.0  0    0
exposure_time  1.05  0.07   1.05  0.79   1.3  0    0
line_speed   110.06 15.58 110.20 70.00 160.0  0    0

 machine        shift
 M1: 738     Day: 1768
 M2: 849 Evening: 1143
 M3: 683   Night: 589
 M4: 674
 M5: 556
```

Korrelation:

```
              defect pressure temperature humidity exposure_time line_speed
defect          1.00    0.407       0.238    0.154        -0.331      0.339
pressure        0.41    1.000       0.627    0.068        -0.276      0.316
temperature     0.24    0.627       1.000   -0.357        -0.088      0.056
humidity        0.15    0.068      -0.357    1.000        -0.079      0.050
exposure_time  -0.33   -0.276      -0.088   -0.079         1.000     -0.680
line_speed      0.34    0.316       0.056    0.050        -0.680      1.000
```

**Fragen:**

- **1.1** Welche Informationen über die Entstehung und Auswahl der Daten benötigen Sie, um beurteilen zu können, ob der Datensatz für den Produktionsbetrieb repräsentativ ist?

## 2. Erstes Modell

**Vorfragen:**

- **2.1** Warum könnte ein Modell, das auf diesen Daten gute Ergebnisse erzielt, bei einer neuen Produktionsanlage schlechte Vorhersagen liefern?
- **2.2** Welche Konsequenzen hätte es, wenn eine Variable erst nach dem Vorhersagezeitpunkt gemessen wurde?
- **2.3** Die Daten zeigen einen Zusammenhang zwischen Druck (`pressure`) und Defektrate (`defect`):
  - a) Können wir daraus schließen, dass eine Änderung des Drucks die Defektrate beeinflusst? Begründen Sie.
  - b) Welche Rolle könnten die Variablen `machine` und `shift` bei diesem Zusammenhang spielen?
  - c) Wie könnten Sie untersuchen, ob eine gezielte Änderung des Drucks tatsächlich die Defektrate senkt?

**Fragen zum Modell:**

- **2.4** Basisfall?
- **2.5** Interpretieren Sie 2 metrische Koeffizienten.
- **2.6** Maschinen: Ist M1 die Maschine mit der geringsten und M5 die Maschine mit größter Defektrate?
- **2.7** Interpretieren Sie den Koeffizienten für die Nachtschicht. Welche Aussagen lassen sich treffen?
- **2.8** Was können Sie zur Güte des Modells sagen?
- **2.9** Warum könnte eine zufällige Aufteilung der Training- und Testdaten zu einer zu optimistischen Einschätzung der zukünftigen Vorhersagegüte führen?
- **2.10** Welche andere Aufteilung würden Sie empfehlen, wenn das Modell Defekte in zukünftigen Produktionswochen vorhersagen soll?
- **2.11** Wie würden Sie überprüfen, ob das Modell für alle Produktionsanlagen und Schichten ähnlich zuverlässig funktioniert?

```r
# Sampling funktioniert gut
m1 = stan_glm(defect ~ pressure + temperature + humidity + exposure_time +
                       line_speed + machine + shift,
              data=df_train, family=binomial, refresh=0)
info(m1)
```

```
                median  mad      lwr      upr mcse n_eff Rhat
(Intercept)     -24.05 2.22   -28.41   -19.83 0.04  3255    1
pressure          0.08 0.01     0.06     0.10 0.00  3303    1
temperature       0.46 0.07     0.34     0.60 0.00  2954    1
humidity          0.11 0.01     0.08     0.13 0.00  3821    1
exposure_time    -5.20 0.98    -7.14    -3.30 0.02  3983    1
line_speed        0.05 0.00     0.04     0.06 0.00  3371    1
machineM2         0.09 0.17    -0.27     0.40 0.00  2366    1
machineM3         0.89 0.16     0.56     1.23 0.00  2411    1
machineM4         1.43 0.17     1.08     1.75 0.00  2432    1
machineM5         1.59 0.18     1.24     1.96 0.00  2756    1
shiftEvening      0.80 0.11     0.58     1.03 0.00  4452    1
shiftNight        1.41 0.14     1.14     1.69 0.00  4307    1
mean_PPD          0.25 0.01     0.24     0.27 0.00  4757    1
log-posterior -1341.57 2.35 -1347.07 -1337.96 0.06  1639    1
```

```r
print(mean(bayes_R2(m1)), digits=2)
## [1] 0.37
ROC(m1)
```

📈 **ROC-Kurve (Trainingsdaten):** Kurve steigt steil an (bei FPR 0.1 schon TPR ≈ 0.65, bei FPR 0.2 TPR ≈ 0.77) und läuft dann flach gegen (1,1). Farbskala = Schwellwert. **AUC: 0.86**

```r
prediction_metrics(m1, newdata=df_test)
```

```
   Dataset    n     Brier   LogLoss     Skill
1 Training 3500 0.1145429 0.3780214 0.3904951
2 New data 1500 0.1094334 0.3792729 0.4090285
```

```r
ROC(m1, newdata=df_test, main="ROC für Testdaten")
```

📈 **ROC für Testdaten:** sehr ähnlicher Verlauf. **AUC: 0.86**

```r
effectsize(m1)
```

```
Effect size by term (incl. interactions)

Model:
defect ~ pressure + temperature + humidity + exposure_time +
    line_speed + machine + shift

              Df Deviance    AIC
<none>             2647.1 2671.1
exposure_time  1   2674.4 2696.4
temperature    1   2695.0 2717.0
humidity       1   2716.6 2738.6
pressure       1   2726.1 2748.1
line_speed     1   2754.6 2776.6
shift          2   2766.1 2786.1
machine        4   2815.6 2831.6
```

## 3. Defektrate abhängig von Variablen

Im Test-Datensatz sehen wir folgenden Zusammenhang einzelner Variablen mit der Defektrate:

📈 **Vier geglättete Kurven (Defektrate gegen jeweils eine Variable):**

| Variable | Verlauf |
|---|---|
| `temperature` (19–26 °C) | **U-Form**: ≈ 0.48 bei 19 °C, fällt auf ein Minimum ≈ 0.18 bei 22 °C, steigt dann steil auf ≈ 1.0 bei 26 °C |
| `humidity` (30–60 %) | flach ≈ 0.20 bis etwa 44 %, dann starker Anstieg auf ≈ 1.0 bei 58 % (leichte U-/J-Form) |
| `exposure_time` (0.8–1.35 s) | **U-Form**: ≈ 1.0 bei 0.8 s, Minimum ≈ 0.08 bei 1.13 s, wieder ≈ 1.0 bei 1.35 s |
| `pressure` (48–102 mTorr) | **U-Form**: ≈ 0.5 bei 48, Minimum ≈ 0.08 bei 65–70, steigt auf ≈ 1.0 bei 100 |

- **3.1** Interpretieren Sie die Diagramme. Was bedeutet das im Zusammenhang mit den Koeffizienten des Modells? Was schließen Sie daraus? Kann man diesen Schluss verlässlich ziehen?

## 4. Zweites Modell mit „Referenzpunkt“

In der Halbleiterfertigung sind nicht nur hohe oder niedrige Werte relevant, sondern vor allem Abweichungen von einem stabilen Prozessfenster. Folgende Zielwerte sind festgelegt:

- pressure = 75
- temperature = 22.5
- humidity = 45
- exposure_time = 1.05
- line_speed = 110

Das zweite Modell berücksichtigt quadratische Abweichungen von diesen Zielwerten.

- **4.1** Vergleichen Sie das Modell mit dem Modell aus Schritt 1.
- **4.2** Ist das zweite Modell besser geeignet?
- **4.3** Welche Abweichung scheint besonders stark mit Produktionsfehlern verbunden zu sein?
- **4.4** Was sollten wir bei der Effektgröße berücksichtigen?
- **4.5** Welche Annahme treffen beide Modelle hinsichtlich des Einflusses der Luftfeuchtigkeit auf die verschiedenen Maschinen?

```r
df$pressure2      = (df$pressure - 75)^2
df$temperature2   = (df$temperature - 22.5)^2
df$humidity2      = (df$humidity - 45)^2
df$exposure_time2 = (df$exposure_time - 1.05)^2
df$line_speed2    = (df$line_speed - 110)^2

m2 = update(m1, ~ . + pressure2 + temperature2 + humidity2 + exposure_time2 + line_speed2)
info(m2)
```

```
                median  mad      lwr      upr mcse n_eff Rhat
(Intercept)     -25.94 2.29   -30.41   -21.44 0.04  3233    1
pressure          0.07 0.01     0.05     0.09 0.00  3363    1
temperature       0.45 0.07     0.31     0.59 0.00  3009    1
humidity          0.13 0.01     0.10     0.15 0.00  3888    1
exposure_time    -5.48 1.03    -7.52    -3.57 0.02  4364    1
line_speed        0.05 0.00     0.04     0.06 0.00  3811    1
machineM2         0.18 0.19    -0.21     0.56 0.00  2950    1
machineM3         1.13 0.19     0.75     1.50 0.00  2708    1
machineM4         1.65 0.19     1.26     2.03 0.00  2775    1
machineM5         1.70 0.22     1.27     2.11 0.00  2818    1
shiftEvening      0.90 0.13     0.65     1.15 0.00  4734    1
shiftNight        1.49 0.16     1.19     1.79 0.00  4811    1
pressure2         0.01 0.00     0.00     0.01 0.00  5811    1
temperature2      0.18 0.03     0.11     0.24 0.00  5422    1
humidity2         0.02 0.00     0.01     0.02 0.00  5875    1
exposure_time2   42.00 8.11    27.06    58.96 0.11  5744    1
line_speed2       0.00 0.00     0.00     0.00 0.00  5331    1
mean_PPD          0.25 0.01     0.24     0.27 0.00  4778    1
log-posterior -1121.55 2.84 -1127.87 -1116.53 0.07  1617    1
```

```r
print(mean(bayes_R2(m2)), digits=2)
## [1] 0.49
ROC(m2)
```

📈 **ROC (Training):** deutlich „bauchiger“ als bei m1. **AUC: 0.905**

```r
prediction_metrics(m2, newdata=df_test)
```

```
   Dataset    n      Brier   LogLoss     Skill
1 Training 3500 0.09527998 0.3132871 0.4929970
2 New data 1500 0.08910198 0.2936031 0.5188239
```

📈 **ROC für Testdaten (m2):** **AUC: 0.917**

`effectsize(m2)` entfernt immer beide Teile derselben Variable: den einfachen (linearen) Teil *und* den quadratischen Teil.

```
              Df Deviance    AIC
<none>             2192.6 2226.6
exposure_time  2   2249.8 2279.8
temperature    2   2278.0 2308.0
shift          2   2301.7 2331.7
pressure       2   2336.4 2366.4
machine        4   2347.8 2373.8
humidity       2   2356.0 2386.0
line_speed     2   2448.0 2478.0
```

LOO:

```r
loo1 = loo(m1)
loo2 = loo(m2)
loo_compare(loo1, loo2)
```

```
   elpd_diff se_diff
m2    0.0       0.0
m1 -222.8      24.0
```

## 5. Zusammenhang mit Luftfeuchtigkeit

Modellvorhersagen für mittlere Werte von Druck, Temperatur, Belichtungsdauer, Transportgeschwindigkeit:

📈 **Vier Panels: Defektrate (y) gegen Luftfeuchtigkeit 30–60 % (x), je eine Linie pro Schicht (Day < Evening < Night):**

| Panel | Verlauf |
|---|---|
| Modell 1, Maschine 1 | monoton steigend (S-Kurven-Anfang): Day ≈ 0.01 → 0.20, Night ≈ 0.04 → 0.52 |
| Modell 1, Maschine 5 | monoton steigend, höher: Day ≈ 0.05 → 0.56, Night ≈ 0.17 → 0.84 |
| Modell 2, Maschine 1 | **U-/J-Form**: bei 30 % leicht erhöht (Night ≈ 0.16), flach nahe 0 zwischen ca. 35 und 50 %, ab 50 % steiler Anstieg auf 0.65 (Day) bis 0.88 (Night) bei 60 % |
| Modell 2, Maschine 5 | **U-Form**, deutlich höher: bei 30 % Day ≈ 0.19, Night ≈ 0.50; Minimum bei ca. 40 % (Day ≈ 0.04, Night ≈ 0.14); bei 60 % alle Schichten ≈ 0.9–0.95 |

- **5.1** Wie interpretieren Sie den Unterschied zwischen Modell 1 und Modell 2?
- **5.2** Wie interpretieren Sie den Unterschied zwischen Maschine 1 und Maschine 5?
- **5.3** Welche Empfehlung für die Luftfeuchtigkeit würden Sie für den Produktionsbetrieb abgeben?

## 6. Cutoff

Wenn wir maximal einen von vier tatsächlichen Defekten falsch vorhersagen wollen:

- **6.1** Welchen Cutoff-Wert sollten wir dann verwenden?
- **6.2** Wie viele tatsächliche Defekte sagen wir dann vorher?
- **6.3** Wie viele fehlerfreie Stücke sagen wir im Schnitt als Defekt vorher?

```r
plotlogrates(m2)
```

📈 **Vier Panels, x-Achse = Schwellwert 0…1, y-Achse = Rate:**

| Panel | Verlauf (abgelesen) |
|---|---|
| true positive | fällt von 1.0 (Schwelle 0) fast linear: ≈ 0.78 bei 0.25, ≈ 0.62 bei 0.5, ≈ 0.43 bei 0.75, → 0 bei 1.0 |
| false negative | Spiegelbild: steigt von 0: ≈ 0.22 bei 0.25, ≈ 0.38 bei 0.5, ≈ 0.57 bei 0.75, → 1.0 |
| false positive | fällt sehr schnell: 1.0 bei 0, ≈ 0.35 bei 0.1, ≈ 0.17 bei 0.25, ≈ 0.06 bei 0.5, ≈ 0.01 bei 0.75 |
| true negative | Spiegelbild: ≈ 0.83 bei 0.25, ≈ 0.94 bei 0.5, ≈ 0.99 bei 0.75 |

## 7. Zukunft

### 7a. Neukalibrierung

Der Hersteller hat Modell 2 ausgewählt und möchte es dauerhaft einsetzen. Nach einigen Monaten werden die Maschinen neu kalibriert, wodurch sich die typischen Prozesswerte verändern.

- **7.1** Warum könnte das Modell nun schlechtere Vorhersagen liefern?
- **7.2** Welche Auswertungen würden Sie regelmäßig durchführen, um eine Verschlechterung der Modellgüte zu erkennen?

### 7b. Veränderung

Angenommen, die Belichtungszeit und die Transportgeschwindigkeit verändern sich im laufenden Produktionsbetrieb deutlich gegenüber den Trainingsdaten. Die beobachtete Gesamtdefektrate bleibt aber unverändert!

- **7.3** Bei welcher der beiden Veränderungen wäre aufgrund der AIC-Tabelle größere Vorsicht angebracht? Begründen Sie.
- **7.4** Ist die unveränderte Gesamtdefektrate ein Beleg dafür, dass Modell 2 weiterhin zuverlässig vorhersagt?
- **7.5** Wie würden Sie überprüfen, ob Modell 2 nach diesen Veränderungen weiterhin geeignet ist?
