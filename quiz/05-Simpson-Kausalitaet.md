# Quiz 05: Simpson & Kausalität

> Zugehöriges Kapitel: [kapitel/05-Simpson-Kausalitaet.md](../kapitel/05-Simpson-Kausalitaet.md)

## Teil 1: Karteikarten (Begriffe)

<details><summary><b>Simpsons Paradox</b></summary>

Ein Zusammenhang in jeder Untergruppe kehrt sich in der Gesamtbetrachtung um, weil die Gruppen unterschiedlich zusammengesetzt sind.

</details>

<details><summary><b>Confounder</b></summary>

Variable, die X und Y beeinflusst (X ← C → Y). Sollte kontrolliert werden.

</details>

<details><summary><b>Mediator</b></summary>

Liegt auf dem Wirkungsweg X → M → Y. Nicht kontrollieren, wenn die Gesamtwirkung gefragt ist.

</details>

<details><summary><b>Collider</b></summary>

Wird von X und Y beeinflusst (X → C ← Y). Nicht darauf selektieren/kontrollieren – erzeugt Scheinzusammenhänge.

</details>

<details><summary><b>Kontrollvariable</b></summary>

Variable im Modell, damit Koeffizienten Vergleiche bei gleichen Werten dieser Variable beschreiben.

</details>

<details><summary><b>Randomisiertes Experiment</b></summary>

Zufällige Zuteilung der Behandlung → Confounder im Mittel ausgeglichen → kausale Aussagen möglich.

</details>

<details><summary><b>Assoziation vs. Intervention</b></summary>

Regression aus Beobachtungsdaten beschreibt Unterschiede zwischen Einheiten, nicht was passiert, wenn man X bei einer Einheit ändert.

</details>

<details><summary><b>Die 5 Fragen</b></summary>

Was wird verglichen? Was konstant gehalten? Ist das sinnvoll? Was fehlt? Assoziation oder kausal?

</details>

## Teil 2: Multiple Choice

**1. Team A hat in leichten UND schweren Fällen die niedrigere Komplikationsrate, aber insgesamt die höhere. Warum?**

- A) Rechenfehler
- B) A operiert überwiegend schwere Fälle (andere Fallmischung)
- C) B ist besser
- D) Zu wenige Daten

<details><summary>Lösung</summary>

**B) A operiert überwiegend schwere Fälle (andere Fallmischung)**: Simpsons Paradox.

</details>

**2. zimmer ist allein +30 000 €, mit wohnflaeche im Modell −10 000 €. Welches Ergebnis ist richtig?**

- A) Nur das erste
- B) Nur das zweite
- C) Beide – sie beantworten verschiedene Fragen
- D) Keines

<details><summary>Lösung</summary>

**C) Beide – sie beantworten verschiedene Fragen**: Allgemein mehr Zimmer vs. mehr Zimmer bei gleicher Fläche.

</details>

**3. Folgt aus −10 000 € (bei gleicher Fläche), dass das Entfernen einer Zwischenwand den Wert um 10 000 € erhöht?**

- A) Ja
- B) Nein – das ist eine Intervention, Beobachtungsdaten zeigen nur Unterschiede zwischen Wohnungen
- C) Nur bei Bayes
- D) Ja, wenn das HDI 0 ausschließt

<details><summary>Lösung</summary>

**B) Nein – das ist eine Intervention, Beobachtungsdaten zeigen nur Unterschiede zwischen Wohnungen**: Verständnisaufgabe 15.

</details>

**4. Effekt eines Kurses auf die Leistung: Welche Rolle hat 'Vorerfahrung' (beeinflusst Kursteilnahme und Leistung)?**

- A) Mediator
- B) Collider
- C) Confounder
- D) Instrument

<details><summary>Lösung</summary>

**C) Confounder**: Kontrollieren.

</details>

**5. 'Im Kurs erworbene Kenntnisse' sind …**

- A) Confounder
- B) Mediator – nicht kontrollieren für die Gesamtwirkung
- C) Collider
- D) irrelevant

<details><summary>Lösung</summary>

**B) Mediator – nicht kontrollieren für die Gesamtwirkung**: Kurs → Kenntnisse → Leistung.

</details>

**6. Man analysiert nur Mitglieder einer Projektgruppe, in die man mit Kurszertifikat ODER hoher Motivation kommt. Problem?**

- A) Kein Problem
- B) Collider-Bias: Selektion erzeugt künstlichen Zusammenhang
- C) Confounding durch Alter
- D) Zu viele Daten

<details><summary>Lösung</summary>

**B) Collider-Bias: Selektion erzeugt künstlichen Zusammenhang**: Collider (Verständnisaufgabe 16).

</details>

**7. Smart-Thermostat: roh −8.6 kWh, mit Dämmung im Modell −2.6 kWh. Warum?**

- A) Sampling
- B) Smart-Thermostate sind häufiger in gut gedämmten Häusern – Dämmung ist Confounder
- C) Interaktion
- D) Overfitting

<details><summary>Lösung</summary>

**B) Smart-Thermostate sind häufiger in gut gedämmten Häusern – Dämmung ist Confounder**: Probeklausur B.

</details>

**8. Wie kann man kausal prüfen, ob höherer Druck Defekte verursacht?**

- A) Mehr Beobachtungsdaten
- B) Kontrolliertes Experiment mit zufälliger Zuteilung von Druckstufen
- C) Höheres R²
- D) LOO

<details><summary>Lösung</summary>

**B) Kontrolliertes Experiment mit zufälliger Zuteilung von Druckstufen**: Design of Experiments.

</details>
