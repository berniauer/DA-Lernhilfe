# Lösung Probeklausur B: Wärmepumpen

## 1. Übersicht

**1.1** **Nein.** `neg0` zählt Werte ≤ 0. Bei der Außentemperatur sind 433 Tage mit ≤ 0 °C im Winter völlig plausibel. `neg0` ist nur ein Warnhinweis bei Variablen, die nicht ≤ 0 sein *dürfen* (z. B. Gehalt, Fläche, kWh).

**1.2** Smart-Thermostate sind **nicht zufällig verteilt**: In neuen (gut gedämmten) Häusern haben 67 % eines, in alten nur 10 %. Neue Häuser verbrauchen aber ohnehin weniger. Der rohe Unterschied von 8.9 kWh **vermischt** den Effekt des Thermostats mit dem der Dämmung → **Confounder** `daemmung`. Außerdem: freiwillige Installation, also Selbstselektion (umweltbewusste, technikaffine Haushalte heizen vielleicht ohnehin sparsamer).

## 2. Erstes Modell

**2.1** Basisfall: `temp = 0 °C`, `flaeche = 0 m²`, `smart = 0`. Ein Haus mit **0 m²** gibt es nicht → der Intercept 26.92 kWh ist nicht sinnvoll interpretierbar (Extrapolation weit außerhalb der Daten, min. 60 m²). Verbesserung: **Zentrieren**, z. B. `flaeche - 130`, `temp - 5` (wie in m2).

**2.2**
- `temp` = −1.09 kWh/°C: Bei sonst gleichen Häusern (gleiche Fläche, gleicher Smart-Status) ist der Verbrauch an einem um 1 °C **wärmeren** Tag im Mittel um 1.09 kWh **niedriger** (95 %-HDI −1.18 bis −1.00).
- `smart` = −8.62 kWh: Häuser **mit** Smart-Thermostat verbrauchen bei gleicher Temperatur und Fläche im Mittel 8.62 kWh/Tag weniger als Häuser **ohne**. (Achtung: nicht für gleiche Dämmung, die ist in m1 nicht drin. Siehe 3.2.)

**2.3** `sigma` = Standardabweichung der Residuen: Einzelne Tage weichen im Mittel um ca. 7.9 kWh von der Modellvorhersage ab. Rund 95 % der Einzelwerte liegen in ± 2σ ≈ ± 16 kWh um die Vorhersage. Für Einzelvorhersagen ist das ziemlich ungenau.

## 3. Zweites Modell

**3.1** Haus mit **alter** Dämmung (Referenz), **130 m²**, **kein** Smart-Thermostat, an einem Tag mit **5 °C** → erwarteter Verbrauch **38.99 kWh**. Diesmal ein realistischer Fall innerhalb der Daten.

**3.2** **Confounding (Simpson-artiger Effekt).**
- m1 vergleicht Häuser mit/ohne Smart-Thermostat **ohne** Berücksichtigung der Dämmung. Weil Smart-Häuser überwiegend **neu gedämmt** sind, steckt der Dämmeffekt im Smart-Koeffizienten mit drin.
- m2 vergleicht Häuser **mit gleichem Dämmstandard** (und gleicher Fläche und Temperatur). Dann bleiben nur noch −2.6 kWh übrig.
- **Keiner ist „falsch“**: Sie beantworten verschiedene Fragen (Arbeitsblatt 03). m1: „Wie unterscheiden sich Smart- und Nicht-Smart-Häuser insgesamt?“ m2: „Wie unterscheiden sie sich bei vergleichbarer Dämmung?“ Für die Frage nach der Thermostat-Wirkung ist m2 die bessere Annäherung, weil die Dämmung **vor** der Thermostat-Entscheidung feststeht (Confounder, kein Mediator).

**3.3** **Nein, nicht sicher kausal.** Es bleiben unbeobachtete Unterschiede (Selbstselektion: sparsame Haushalte installieren eher Thermostate, Heizgewohnheiten, Personen im Haushalt, Warmwasserbedarf). Belastbar wäre ein **randomisiertes Experiment**: zufällig ausgewählten Haushalten ein Thermostat einbauen, Kontrollgruppe ohne, Verbrauch vergleichen. Alternativ Vorher/Nachher-Messung bei denselben Häusern **mit** Kontrollgruppe.

## 4. Interaktion

**4.1**
- `temp5` = −1.58: Steigung für die **Referenzgruppe (alte Dämmung)**. Je Grad wärmer sinkt dort der Verbrauch um 1.58 kWh/Tag (bei gleicher Fläche und gleichem Smart-Status).
- `daemmungneu` = −15.25: Unterschied neu − alt **beim Basisfall der Temperatur, also bei 5 °C**: Neu gedämmte Häuser verbrauchen dort 15.25 kWh weniger.
- `temp5:daemmungneu` = +1.05: Die Temperatur-Steigung ist bei neuer Dämmung um 1.05 kWh/°C **flacher** (weniger negativ) als bei alter Dämmung.

**4.2** Steigung neu = −1.58 + 1.05 = **−0.53 kWh/°C**. Je Grad kälter steigt der Verbrauch bei neuer Dämmung also nur um ca. 0.5 kWh (alte Dämmung: 1.6 kWh, mittel: −1.58 + 0.49 = −1.09).

**4.3** Unterschied neu − alt = −15.25 + 1.05 · (temp − 5):
- bei **0 °C** (temp5 = −5): −15.25 + 1.05·(−5) = **−20.5 kWh**
- bei **15 °C** (temp5 = +10): −15.25 + 1.05·10 = **−4.75 kWh**

→ Die Dämmung spart umso mehr, je kälter es ist. Plausibel!

**4.4** **Nein.** Mit Interaktion bedeutet `daemmungneu` etwas anderes: den Unterschied **bei 5 °C** (Referenzpunkt) und nicht mehr den durchschnittlichen Unterschied über alle Temperaturen. Bei kälteren Tagen ist der Unterschied sogar größer (−20.5 bei 0 °C). Haupteffekte bei Interaktionen nie isoliert interpretieren. Ihr Wert hängt vom Referenzpunkt ab (Arbeitsblatt 05).

## 5. Effektgröße

**5.1** `effectsize()` entfernt eine Variable **zusammen mit ihren Interaktionen**: `temp5` → temp5 + 2 Interaktionsterme = 3 Df; `daemmung` → 2 Dummy-Variablen + 2 Interaktionsterme = 4 Df.

**5.2** **Falsch.** f² = (R²_voll − R²_ohne) / (1 − R²_voll) = (0.829 − 0.819) / (1 − 0.829) ≈ 0.01/0.171 ≈ 0.057. Das Smart-Thermostat erklärt **zusätzlich ca. 1 Prozentpunkt** der Varianz (nach Berücksichtigung aller anderen Variablen). Das entspricht 5.7 % der im vollständigen Modell noch **unerklärten** Varianz, nicht 5.7 % des Verbrauchs und nicht 5.7 % der Gesamtvarianz.

**5.3** Groß (f² ≥ 0.35): `daemmung` (1.89) und `temp5` (1.84). Mittel bis groß: `flaeche130` (0.29) und die Interaktion (0.25). `smart` (0.057) liegt zwischen klein (0.02) und mittel (0.15).
**Unwichtig ist es trotzdem nicht**: 2.5 kWh/Tag über einen Winter und viele Kund\*innen sind für einen Energieversorger relevant. Effektgröße (Erklärungsbeitrag) ≠ praktische Bedeutung. Cohen-Werte sind Daumenregeln.

## 6. Modellvergleich

**6.1** **m3**:
- Kleinster Testfehler: RMSE 4.68 (m2: 5.23, m1: 7.78), MAE 3.81.
- Höchster Skill auf neuen Daten: 0.81.
- LOO: m3 bester, m2 liegt 109.6 elpd zurück, das sind **≈ 7 × se_diff (15.4)** → deutlich. m1 ist mit −526 weit abgeschlagen.
- Höchstes R² (0.83), fachlich plausible Interaktion (Dämmung wirkt stärker bei Kälte).
- Alle Kennzahlen zeigen in dieselbe Richtung → konsistentes Bild.

**6.2** **Nein.** Trainings- und Testfehler sind sehr ähnlich (RMSE 4.62 vs. 4.68). Der Skill sinkt nur leicht (0.83 → 0.81).

**6.3** Ja, wenn **alle Modelle dieselbe Zielvariable** (`kwh`, nicht z. B. `log(kwh)`) und **dieselben Datenzeilen** verwenden. Das ist hier der Fall. Die X-Variablen dürfen sich unterscheiden.

## 7. Vorhersage und Entscheidung

**7.1**
- „Dieses Haus morgen“ → **posterior_predict: 33.8 bis 52.1 kWh** (Einzelvorhersage, enthält den Fehlerterm ε).
- „Solche Häuser im Mittel“ → **posterior_epred: 42.1 bis 43.8 kWh** (nur Unsicherheit der Koeffizienten).
- Das predict-Intervall ist viel breiter, weil zusätzlich die **Residuenstreuung σ ≈ 4.64** eingeht: ±1.96·σ ≈ ±9 kWh. Selbst mit perfekt bekannten Koeffizienten bliebe diese Breite, das epred-Intervall würde dagegen auf einen Punkt schrumpfen.

**7.2** Asymmetrische Kosten: Unterschätzen kostet 3, Überschätzen 1 → optimal ist das **Quantil 3/(3+1) = 0.75** der **posterior_predict**-Verteilung → **≈ 46.1 kWh** einplanen. Das ist bewusst mehr als der Median (43.0), weil Unterschätzen teurer ist. Beste Vorhersage (Median) ≠ beste Entscheidung (Arbeitsblatt 02c). (Bei vielen Häusern würde man die Summen-Verteilung verwenden, wie beim Flugzeug-Beispiel mit `rowSums(posterior_predict(...))`.)

**7.3** **Nur mit großer Vorsicht.** Die Daten reichen nur von −12 bis 18 °C. −20 °C ist **Extrapolation**. Wärmepumpen verlieren bei großer Kälte überproportional an Effizienz (Heizstab springt an) → der Zusammenhang ist dort vermutlich **nicht mehr linear**. Ein enges Koeffizientenintervall beweist nicht, dass die Gerade auch außerhalb der Daten gilt (Verständnisaufgabe 06). Besser: Daten von sehr kalten Tagen beschaffen oder Herstellerangaben einbeziehen.

## 8. Modelldiagnose

**8.1** Verletzt ist die Annahme **konstanter Residuenstreuung** (ein gemeinsames σ für alle, *Homoskedastizität*). Folge: Die Vorhersageintervalle (posterior_predict) sind für **kalte Tage / alte Häuser zu eng** (zu optimistisch) und für milde Tage / neue Häuser zu breit. Der mittlere Zusammenhang kann trotzdem in Ordnung sein. Abhilfe: anderes Modell, z. B. log-Transformation von `kwh` (relative Fehler) oder ein Modell mit variabler Streuung.

**8.2** **Nein.** Mehr Samples machen die numerische Näherung genauer (kleinerer MCSE), ändern aber nichts an der **Modellannahme** und auch nicht an der Datenmenge (Verständnisaufgaben 07 und 10).
