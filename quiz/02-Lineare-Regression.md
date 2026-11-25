# Quiz 02: Lineare Regression (stan_glm)

> Zugehöriges Kapitel: [kapitel/02-Lineare-Regression-Bayes.md](../kapitel/02-Lineare-Regression-Bayes.md)

## Teil 1: Karteikarten (Begriffe)

<details><summary><b>Basisfall (Intercept)</b></summary>

Vorhersage, wenn alle metrischen Variablen = 0 (bzw. Zentrierwert) und alle Faktoren auf ihrer Referenzgruppe (erstes Level) sind.

</details>

<details><summary><b>Referenzgruppe</b></summary>

Erstes Faktorlevel (meist alphabetisch); bekommt keinen eigenen Koeffizienten. Ändern mit relevel(x, ref=…).

</details>

<details><summary><b>Metrischer Koeffizient</b></summary>

Unterschied in y bei +1 Einheit x, bei sonst gleichen Werten der anderen Variablen (Vergleich, keine Intervention).

</details>

<details><summary><b>Gruppenkoeffizient</b></summary>

Unterschied der Gruppe zur Referenzgruppe bei sonst gleichen Werten; verschiebt die Gerade parallel.

</details>

<details><summary><b>MAD_SD</b></summary>

Robuste Streuung der Posterior-Verteilung eines Koeffizienten; entspricht etwa dem Standardfehler.

</details>

<details><summary><b>HDI</b></summary>

Highest Density Interval: kürzestes Intervall, das 95 % der Posterior-Wahrscheinlichkeit enthält (daatools hdi(), lwr/upr in info()).

</details>

<details><summary><b>sigma</b></summary>

Standardabweichung der Residuen: typische Abweichung einzelner Beobachtungen von der Modellvorhersage (≈95 % in ±2σ).

</details>

<details><summary><b>log(y)-Modell</b></summary>

Koeffizienten wirken multiplikativ: +1 x → y × e^β; ≈ 100·(e^β−1) % Unterschied. exp(Intercept) = Median im Basisfall.

</details>

<details><summary><b>Omitted Variable Bias</b></summary>

Verzerrung eines Koeffizienten, weil eine relevante, mit x korrelierte Variable fehlt (z. B. streams ohne year).

</details>

<details><summary><b>Extrapolation</b></summary>

Vorhersage außerhalb des Datenbereichs; der Zusammenhang muss dort nicht mehr gelten.

</details>

<details><summary><b>4000 Samples</b></summary>

Default rstanarm: 4 Chains × 1000 Samples nach Warmup → jede Größe hat eine Verteilung aus 4000 Werten.

</details>

<details><summary><b>prior_summary()</b></summary>

Zeigt die verwendeten Priors (specified auf z-Skala, adjusted auf Originalskala).

</details>

## Teil 2: Multiple Choice

**1. Modell: Weight ~ Height + Age + Gender (nicht zentriert). Was ist der Basisfall?**

- A) Durchschnittliche Person
- B) Frau, 0 cm, 0 Jahre
- C) Mann, 170 cm, 30 Jahre
- D) Frau mit mittlerer Größe

<details><summary>Lösung</summary>

**B) Frau, 0 cm, 0 Jahre**: Alle metrischen = 0, Gender auf Referenz (Female). Sinnlos → zentrieren.

</details>

**2. Koeffizient Height170 = 0.73. Welche Interpretation ist korrekt?**

- A) Wer 1 cm wächst, nimmt 0.73 kg zu
- B) Personen, die bei gleichem Alter und Geschlecht 1 cm größer sind, wiegen im Mittel 0.73 kg mehr
- C) 73 % des Gewichts erklärt die Größe
- D) Jede Person wiegt 0.73 kg pro cm

<details><summary>Lösung</summary>

**B) Personen, die bei gleichem Alter und Geschlecht 1 cm größer sind, wiegen im Mittel 0.73 kg mehr**: Vergleich zwischen Personen, bei sonst gleichen Werten, im Mittel – keine Intervention.

</details>

**3. 95 %-HDI für den m²-Koeffizienten: [1.20; 1.80] €/m². Was ist korrekt?**

- A) 95 % der Wohnungen kosten 1.20–1.80 € pro m² mehr
- B) Der mittlere Zusammenhang liegt mit 95 % posteriorer Wahrscheinlichkeit in diesem Bereich
- C) Vergrößert man eine Wohnung um 10 m², steigen die Kosten sicher um 12–18 €
- D) Das Intervall enthält 95 % der Daten

<details><summary>Lösung</summary>

**B) Der mittlere Zusammenhang liegt mit 95 % posteriorer Wahrscheinlichkeit in diesem Bereich**: Intervall über den Parameter (mittlerer Zusammenhang), nicht über Einzelfälle.

</details>

**4. Was bedeutet sigma = 8 kg?**

- A) Der Koeffizient ist auf 8 kg genau
- B) Einzelne Gewichte weichen typischerweise ±8 kg von der Vorhersage ab
- C) Das Modell erklärt 8 % der Varianz
- D) Der Intercept ist 8

<details><summary>Lösung</summary>

**B) Einzelne Gewichte weichen typischerweise ±8 kg von der Vorhersage ab**: σ = Residuenstreuung.

</details>

**5. Im Modell log(salary) ~ … ist der Koeffizient spaces = 0.11. Wie interpretiert man das?**

- A) +0.11 €
- B) +11 Prozentpunkte
- C) Gehalt ca. × e^0.11 ≈ 1.12, also ≈ +12 % (bei sonst gleichen Werten)
- D) +110 %

<details><summary>Lösung</summary>

**C) Gehalt ca. × e^0.11 ≈ 1.12, also ≈ +12 % (bei sonst gleichen Werten)**: Log-Modell → multiplikativ.

</details>

**6. Ein Koeffizient für Bezirk 2 ist +150 € (bei gleicher Fläche). Folgt daraus, dass die rohen Durchschnittsmieten in Bezirk 2 150 € höher sind?**

- A) Ja, immer
- B) Nein – der Koeffizient ist ein bedingter Vergleich; rohe Mittelwerte vermischen Unterschiede in der Fläche
- C) Nur wenn R² > 0.5
- D) Nur bei Bayes

<details><summary>Lösung</summary>

**B) Nein – der Koeffizient ist ein bedingter Vergleich; rohe Mittelwerte vermischen Unterschiede in der Fläche**: Verständnisaufgabe 04.

</details>

**7. Daten zu Arbeitsstunden reichen von 20 bis 40 h, enges Intervall für die Steigung. Was gilt für eine Vorhersage bei 70 h?**

- A) Genauso sicher
- B) Extrapolation – der lineare Zusammenhang muss dort nicht gelten
- C) Unmöglich zu berechnen
- D) Sicherer, weil weiter weg

<details><summary>Lösung</summary>

**B) Extrapolation – der lineare Zusammenhang muss dort nicht gelten**: Verständnisaufgabe 06.

</details>

**8. Was ändert sich durch Zentrieren einer Variable?**

- A) Die Vorhersagen
- B) Steigung und R²
- C) Bedeutung (und Wert) des Intercepts; Steigungen bleiben gleich
- D) Nichts

<details><summary>Lösung</summary>

**C) Bedeutung (und Wert) des Intercepts; Steigungen bleiben gleich**: Nur der Referenzpunkt verschiebt sich (ohne Interaktion bleiben Steigungen identisch).

</details>

**9. Welche Funktion zeigt median, mad, HDI, mcse, n_eff und Rhat auf einen Blick?**

- A) summary()
- B) info() aus daatools
- C) plot()
- D) loo()

<details><summary>Lösung</summary>

**B) info() aus daatools**: info(modell).

</details>

**10. Warum ändert sich der Koeffizient von streams, wenn year ins Modell kommt?**

- A) Sampling-Fehler
- B) Weil der Koeffizient immer bedingt auf die anderen Variablen ist – ohne year steckte der Zeittrend teilweise in streams
- C) Weil R² sinkt
- D) Weil sich die Daten ändern

<details><summary>Lösung</summary>

**B) Weil der Koeffizient immer bedingt auf die anderen Variablen ist – ohne year steckte der Zeittrend teilweise in streams**: Omitted Variable Bias.

</details>
