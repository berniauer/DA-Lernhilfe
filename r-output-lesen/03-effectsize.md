# R-Output lesen 3: `effectsize()`, linear und logistisch

## A) Lineares Modell
```r
effectsize(m3)    # kwh ~ temp5 * daemmung + flaeche130 + smart
```
```
               Df   RSS    AIC    R2    f2
<none>             21336 3078.4 0.829          ← volles Modell
smart           1  22546 3131.5 0.819 0.057    ← klein (zw. 0.02 und 0.15)
temp5:daemmung  2  26671 3297.6 0.786 0.250    ← mittel–groß
flaeche130      1  27524 3331.0 0.779 0.290
temp5           3  60487 4114.4 0.514 1.835    ← groß; Df 3 = temp5 + 2 Interaktionen
daemmung        4  61618 4130.9 0.505 1.888    ← groß; Df 4 = 2 Dummies + 2 Interaktionen
```
**So liest du eine Zeile:** „Entfernt man `smart`, steigt die Residuenquadratsumme von 21 336 auf 22 546 und R² sinkt von 0.829 auf 0.819. f² = (0.829 − 0.819)/(1 − 0.829) ≈ 0.057 → kleiner Effekt.“

## B) Logistisches Modell (Beispielklausur, Modell 1)
```
               Df Deviance    AIC
<none>             2647.1  2671.1
exposure_time   1  2674.4  2696.4      ΔAIC +25.3   ← am wenigsten wichtig
temperature     1  2695.0  2717.0      +45.9
humidity        1  2716.6  2738.6      +67.5
pressure        1  2726.1  2748.1      +77.0
line_speed      1  2754.6  2776.6      +105.5
shift           2  2766.1  2786.1      +115.0
machine         4  2815.6  2831.6      +160.5      ← am wichtigsten
```
- **Deviance** = Maß für die Abweichung des Modells von den Daten (−2·log-Likelihood); kleiner = besser.
- **AIC** = Deviance + 2·Parameter. Die **Differenz zur `<none>`-Zeile** ist entscheidend.
- Sortiert **aufsteigend nach AIC** → die wichtigste Variable steht **unten**.

## C) Mit quadratischen Termen (Beispielklausur, Modell 2)
```
               Df Deviance    AIC
<none>             2192.6  2226.6
exposure_time   2  2249.8  2279.8   +53.2
temperature     2  2278.0  2308.0   +81.4
shift           2  2301.7  2331.7   +105.1
pressure        2  2336.4  2366.4   +139.8
machine         4  2347.8  2373.8   +147.2
humidity        2  2356.0  2386.0   +159.4
line_speed      2  2448.0  2478.0   +251.4   ← wichtigste
```
Df = 2: linearer **und** quadratischer Term werden gemeinsam entfernt.

## Stolperfallen beim Interpretieren
1. Logistisch gibt es **kein f²**, du argumentierst mit ΔAIC.
2. Korrelierte Variablen (exposure_time ↔ line_speed, r = −0.68) teilen sich die Erklärung.
3. Wichtigkeit ≠ Größe des Rohkoeffizienten ≠ Kausalität ≠ praktische Steuerbarkeit.

## Übung
Warum rückt `line_speed` von Platz 3 (m1) auf Platz 1 (m2)?

<details><summary>Lösung</summary>

Der Zusammenhang ist U-förmig. Modell 1 kann nur eine lineare Durchschnittssteigung abbilden und erfasst damit nur einen Teil. Mit dem quadratischen Term erklärt line_speed viel mehr (zu langsam **und** zu schnell erhöhen das Defektrisiko).
</details>
