# Quiz 10: Daten, Split, Leakage, Drift

> Zugehöriges Kapitel: [kapitel/10-Datenqualitaet-Split-Drift.md](../kapitel/10-Datenqualitaet-Split-Drift.md)

## Teil 1: Karteikarten (Begriffe)

<details><summary><b>neg0 (info)</b></summary>

Anzahl Werte ≤ 0; bei 0/1-Variablen = Anzahl Nullen.

</details>

<details><summary><b>Mittelwert einer 0/1-Variable</b></summary>

Anteil der Einser (z. B. Defektrate).

</details>

<details><summary><b>Repräsentativität</b></summary>

Spiegeln die Daten die Population/Situation wider, für die das Modell gelten soll? (Auswahl, Zeitraum, Messung, Ausschlüsse)

</details>

<details><summary><b>Zeitlicher Split</b></summary>

Früher trainieren, später testen – realistisch für Vorhersagen in die Zukunft.

</details>

<details><summary><b>Gruppierter Split</b></summary>

Ganze Gruppen (Maschinen, Standorte) in Train oder Test – prüft Übertragbarkeit auf neue Gruppen.

</details>

<details><summary><b>Data Leakage</b></summary>

Information im Modell, die zum Vorhersagezeitpunkt nicht verfügbar ist → zu gute Testwerte.

</details>

<details><summary><b>Covariate Shift</b></summary>

Verteilung der X ändert sich (z. B. nach Kalibrierung).

</details>

<details><summary><b>Concept Drift</b></summary>

Der Zusammenhang X → y ändert sich.

</details>

<details><summary><b>Monitoring</b></summary>

Neue gelabelte Daten → Güte, Kalibrierung je Gruppe, TPR/FPR am Cutoff, Eingangsverteilungen; bei Verschlechterung neu trainieren.

</details>

## Teil 2: Multiple Choice

**1. Warum kann ein zufälliger Split bei Produktionsdaten zu optimistisch sein?**

- A) Zu wenig Testdaten
- B) Ähnliche Einheiten (gleiche Zeit/Charge) landen in Train und Test – Zukunft/Drift wird nicht geprüft
- C) Zufall ist immer schlecht
- D) Weil R² sinkt

<details><summary>Lösung</summary>

**B) Ähnliche Einheiten (gleiche Zeit/Charge) landen in Train und Test – Zukunft/Drift wird nicht geprüft**: Autokorrelation.

</details>

**2. Welche Validierung prüft, ob das Modell bei einer NEUEN Maschine funktioniert?**

- A) Zufälliger Split
- B) Leave-one-machine-out
- C) Mehr Samples
- D) LOO

<details><summary>Lösung</summary>

**B) Leave-one-machine-out**: Gruppierter Split.

</details>

**3. Nach einer Neukalibrierung liegt der Druck meist über dem Trainingsbereich. Wie heißt das?**

- A) Concept Drift
- B) Covariate Shift / Extrapolation
- C) Leakage
- D) Simpson

<details><summary>Lösung</summary>

**B) Covariate Shift / Extrapolation**: X-Verteilung ändert sich.

</details>

**4. Die Gesamtdefektrate bleibt gleich. Ist das ein Beleg, dass das Modell noch gut ist?**

- A) Ja
- B) Nein – Fehler können sich ausgleichen; Rangordnung und Untergruppen prüfen
- C) Ja, wenn AUC > 0.5
- D) Nur bei Bayes

<details><summary>Lösung</summary>

**B) Nein – Fehler können sich ausgleichen; Rangordnung und Untergruppen prüfen**: Beispielklausur 7b.

</details>

**5. info(df) zeigt na = 0 für alle Variablen. Was folgt?**

- A) Die Daten sind repräsentativ
- B) Nur, dass keine NAs im Datensatz sind – über Auswahl/Entfernung sagt das nichts
- C) Keine Ausreißer
- D) Kein Leakage

<details><summary>Lösung</summary>

**B) Nur, dass keine NAs im Datensatz sind – über Auswahl/Entfernung sagt das nichts**: Eventuell wurden Zeilen vorher entfernt.

</details>

**6. Eine Skalierung wurde auf ALLEN Daten berechnet, bevor gesplittet wurde. Problem?**

- A) Keines
- B) Leakage durch Vorverarbeitung (Testinformation fließt ins Training)
- C) Simpson
- D) Separation

<details><summary>Lösung</summary>

**B) Leakage durch Vorverarbeitung (Testinformation fließt ins Training)**: Vorverarbeitung nur auf Training fitten.

</details>

**7. Defektrate in den Daten 25 %, im Betrieb typischerweise 3 %. Welche Frage zur Datenentstehung ist zentral?**

- A) Welcher Prior?
- B) Wurden Defekte überrepräsentiert (Oversampling/Auswahl)? → Kalibrierung
- C) Wie viele Chains?
- D) Welche Farbe?

<details><summary>Lösung</summary>

**B) Wurden Defekte überrepräsentiert (Oversampling/Auswahl)? → Kalibrierung**: Basisrate.

</details>

**8. Welche Maßnahme gehört NICHT zum Monitoring?**

- A) Brier/AUC auf neuen gelabelten Daten
- B) Kalibrierung je Maschine
- C) Mehr MCMC-Samples ziehen
- D) Eingangsverteilungen vs. Training

<details><summary>Lösung</summary>

**C) Mehr MCMC-Samples ziehen**: Samples ändern nichts an Drift.

</details>
