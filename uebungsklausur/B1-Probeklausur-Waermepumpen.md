# Probeklausur B: Wärmepumpen (lineare Regression, Interaktion, Vorhersage)

> **Selbst erstellt** im Stil der Beispielklausur. Die Zahlen stammen aus einer echten Simulation mit Modellrechnung (OLS ≈ Bayes mit schwachen Priors), sind also in sich konsistent.
> Schwerpunkte: Basisfall, Gruppen-Koeffizienten, **Confounding/Simpson**, **Interaktion**, Effektgröße f², Modellvergleich, **epred vs. predict**, Entscheidung mit Kosten.
> Zeit: ca. 60–75 Minuten. Lösung: [B2-Loesung-Waermepumpen.md](B2-Loesung-Waermepumpen.md)

---

Ein Energieversorger möchte den **täglichen Stromverbrauch von Wärmepumpen** in Einfamilienhäusern vorhersagen, um Strom besser einkaufen zu können. Für 1400 Haus-Tage (aus einem Winterhalbjahr) liegen vor:

| Variable | Bedeutung |
|---|---|
| `kwh` | Stromverbrauch der Wärmepumpe an diesem Tag (kWh) |
| `temp` | Tagesmitteltemperatur außen (°C) |
| `flaeche` | beheizte Wohnfläche (m²) |
| `daemmung` | Dämmstandard des Hauses: `alt`, `mittel`, `neu` (Referenz: `alt`) |
| `smart` | smartes Thermostat installiert (1 = ja, 0 = nein); **freiwillig** von den Hausbesitzer\*innen installiert |

Training: 1000 zufällig gewählte Haus-Tage, Test: 400.

## 1. Übersicht

```
         mean    sd median    min    max na neg0
kwh     31.54 11.03  30.70   4.30  72.00  0    0
temp     2.94  5.50   3.00 -12.00  18.00  0  433
flaeche 128.26 29.61 128.00 60.00 222.00  0    0
smart    0.37  0.48   0.00   0.00   1.00  0  887

 daemmung
 alt: 399
 mittel: 590
 neu: 411
```

Zusätzlich: Anteil `smart = 1` je Dämmstandard: alt **10 %**, mittel **34 %**, neu **67 %**.
Mittlerer Verbrauch: ohne smart **34.8 kWh**, mit smart **25.9 kWh**.

- **1.1** Bei `temp` zeigt `neg0` den Wert 433. Ist das ein Datenproblem?
- **1.2** Eine Kollegin sagt nach Blick auf die Mittelwerte: „Smarte Thermostate sparen fast 9 kWh pro Tag.“ Welche Information in der Übersicht spricht gegen diese einfache Schlussfolgerung?

## 2. Erstes Modell

```r
m1 = stan_glm(kwh ~ temp + flaeche + smart, data=df_train, refresh=0)
info(m1)
```
```
               median  mad   lwr   upr mcse n_eff Rhat
(Intercept)     26.92 1.14 24.68 29.15 0.02  2607    1
temp            -1.09 0.05 -1.18 -1.00 0.00  2595    1
flaeche          0.08 0.01  0.07  0.10 0.00  4133    1
smart           -8.62 0.51 -9.63 -7.61 0.01  3448    1
sigma            7.87 0.18  7.52  8.21 0.00  3657    1
mean_PPD        31.43 ...
bayes_R2: 0.50
```

- **2.1** Was ist der Basisfall? Ist er sinnvoll interpretierbar? Wie könnte man das verbessern?
- **2.2** Interpretieren Sie die Koeffizienten `temp` und `smart` (mit Einheit).
- **2.3** Was sagt `sigma = 7.87` aus?

## 3. Zweites Modell (zentriert, mit Dämmung)

```r
df$temp5 = df$temp - 5
df$flaeche130 = df$flaeche - 130
m2 = stan_glm(kwh ~ temp5 + flaeche130 + daemmung + smart, data=df_train, refresh=0)
info(m2)
```
```
                median  mad    lwr    upr mcse n_eff Rhat
(Intercept)      38.99 0.32  38.36  39.61 0.01  3826    1
temp5            -1.06 0.03  -1.12  -1.00 0.00  2790    1
flaeche130        0.08 0.01   0.07   0.09 0.00  2765    1
daemmungmittel   -8.49 0.41  -9.29  -7.69 0.01  2652    1
daemmungneu     -17.23 0.48 -18.16 -16.29 0.01  4471    1
smart            -2.60 0.38  -3.34  -1.86 0.01  3827    1
sigma             5.18 0.12   4.95   5.41 0.00  3103    1
bayes_R2: 0.79
```

- **3.1** Beschreiben Sie den Basisfall von m2.
- **3.2** Der Koeffizient für `smart` ist von −8.62 (m1) auf −2.60 (m2) geschrumpft. Erklären Sie warum. Welcher Vergleich wird jeweils angestellt? Ist einer der beiden Werte „falsch“?
- **3.3** Kann der Energieversorger aus m2 schließen, dass ein Smart-Thermostat den Verbrauch eines Hauses um 2.6 kWh/Tag senkt? Wie könnte man das untersuchen?

## 4. Drittes Modell mit Interaktion

```r
m3 = stan_glm(kwh ~ temp5 * daemmung + flaeche130 + smart, data=df_train, refresh=0)
info(m3)
```
```
                      median  mad    lwr    upr mcse n_eff Rhat
(Intercept)            37.84 0.30  37.26  38.42 0.00  3990    1
temp5                  -1.58 0.05  -1.67  -1.48 0.00  2951    1
daemmungmittel         -7.43 0.40  -8.20  -6.65 0.01  3118    1
daemmungneu           -15.25 0.45 -16.13 -14.38 0.01  4393    1
flaeche130              0.08 0.00   0.07   0.09 0.00  2542    1
smart                  -2.54 0.34  -3.21  -1.88 0.01  4184    1
temp5:daemmungmittel    0.49 0.07   0.36   0.62 0.00  4176    1
temp5:daemmungneu       1.05 0.07   0.92   1.18 0.00  2972    1
sigma                   4.64 0.10   4.43   4.84 0.00  3458    1
bayes_R2: 0.83
```

- **4.1** Interpretieren Sie `temp5`, `daemmungneu` und `temp5:daemmungneu`.
- **4.2** Wie stark steigt der Verbrauch je Grad *kälter* in Häusern mit neuer Dämmung?
- **4.3** Wie groß ist der Verbrauchsunterschied zwischen neuer und alter Dämmung bei **0 °C** und bei **15 °C** (sonst gleiche Häuser)?
- **4.4** Ein Kollege sagt: „In m2 war `daemmungneu` −17.2, in m3 nur −15.3. Die Dämmung wirkt also schwächer als gedacht.“ Stimmt das?

## 5. Effektgröße

```r
effectsize(m3)
```
```
               Df   RSS    AIC    R2    f2
<none>             21336 3078.4 0.829
smart           1  22546 3131.5 0.819 0.057
temp5:daemmung  2  26671 3297.6 0.786 0.250
flaeche130      1  27524 3331.0 0.779 0.290
temp5           3  60487 4114.4 0.514 1.835
daemmung        4  61618 4130.9 0.505 1.888
```

- **5.1** Warum hat `temp5` 3 Df und `daemmung` 4 Df?
- **5.2** Beurteilen Sie: „Das Smart-Thermostat erklärt 5.7 % des Stromverbrauchs.“
- **5.3** Welche Variablen haben nach Cohen einen großen Effekt? Ist `smart` deshalb für den Energieversorger unwichtig?

## 6. Modellvergleich

```
prediction_metrics(m1, df_test):  Training RMSE 7.85 MAE 6.27 Skill 0.505 | New data RMSE 7.78 MAE 6.24 Skill 0.471
prediction_metrics(m2, df_test):  Training RMSE 5.16 MAE 4.13 Skill 0.786 | New data RMSE 5.23 MAE 4.29 Skill 0.761
prediction_metrics(m3, df_test):  Training RMSE 4.62 MAE 3.73 Skill 0.829 | New data RMSE 4.68 MAE 3.81 Skill 0.808

loo_compare(loo1, loo2, loo3)
   elpd_diff se_diff
m3     0.0     0.0
m2  -109.6    15.4
m1  -526.3    26.0
```

- **6.1** Welches Modell würden Sie wählen? Begründen Sie mit mindestens drei Kennzahlen.
- **6.2** Gibt es Hinweise auf Overfitting?
- **6.3** Darf man `loo_compare` hier verwenden? Was müsste gegeben sein?

## 7. Vorhersage und Entscheidung

Für ein Haus mit **mittlerer** Dämmung, **150 m²**, ohne Smart-Thermostat, an einem Tag mit **−5 °C**:

```
posterior_epred:   Median 43.0  95%-HDI [42.1; 43.8]
posterior_predict: Median 43.0  95%-HDI [33.8; 52.1]
Quantile posterior_predict: 50%: 43.0  75%: 46.1  90%: 48.9
```

- **7.1** Welches Intervall beantwortet die Frage „Wie viel wird **dieses** Haus morgen verbrauchen?“, welches „Wie viel verbrauchen solche Häuser **im Mittel**?“ Warum ist das eine Intervall so viel breiter?
- **7.2** Der Versorger muss Strom am Vortag einkaufen. Zu wenig eingekaufter Strom kostet (Nachkauf an der Börse) **dreimal** so viel pro kWh wie zu viel eingekaufter. Welche Menge sollte er für dieses Haus einplanen? Begründen Sie.
- **7.3** Im Jänner sind −20 °C angekündigt. Kann der Versorger m3 dafür verwenden?

## 8. Modelldiagnose

`diagnose_residual(m3)` zeigt: Die Residuen liegen um 0, aber ihre Streuung wird für große vorhergesagte Werte (kalte Tage, alte Häuser) deutlich **breiter** (Trichter-/Fächerform).

- **8.1** Welche Modellannahme ist verletzt? Welche Folgen hat das für die Intervalle aus 7.1?
- **8.2** Ändert sich daran etwas, wenn man statt 4000 nun 40 000 Posterior-Samples zieht?
