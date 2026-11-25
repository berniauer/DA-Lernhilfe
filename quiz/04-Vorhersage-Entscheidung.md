# Quiz 04: Vorhersagen & Entscheidungen

> Zugehöriges Kapitel: [kapitel/04-Vorhersagen-Entscheidungen.md](../kapitel/04-Vorhersagen-Entscheidungen.md)

## Teil 1: Karteikarten (Begriffe)

<details><summary><b>predict()</b></summary>

Punktvorhersage (Median), ohne Unsicherheit.

</details>

<details><summary><b>posterior_epred()</b></summary>

4000 Samples des Erwartungswerts (Mittelwert vergleichbarer Fälle); nur Koeffizienten-Unsicherheit. Bei logistisch: Wahrscheinlichkeiten.

</details>

<details><summary><b>posterior_predict()</b></summary>

4000 Samples einzelner neuer Beobachtungen; Koeffizienten-Unsicherheit + Fehlerterm ε. Bei logistisch: 0/1.

</details>

<details><summary><b>Zwei Unsicherheitsquellen</b></summary>

1) Koeffizienten (sinkt mit mehr Daten) 2) Fehlerterm ε/σ (bleibt immer).

</details>

<details><summary><b>Differenz mit Samples</b></summary>

Immer zeilenweise im selben Sample bilden: d = pred[,2] − pred[,1]; nie Intervallgrenzen kombinieren.

</details>

<details><summary><b>Optimales Quantil</b></summary>

Bei Kosten c_unter für Unterschätzen und c_über für Überschätzen: Quantil c_unter / (c_unter + c_über) der predict-Verteilung.

</details>

<details><summary><b>rowSums(posterior_predict(...))</b></summary>

Summe über viele Einzelfälle pro Sample → Verteilung einer Gesamtmenge (z. B. Gesamtgewicht eines Flugzeugs).

</details>

<details><summary><b>Vorhersage ≠ Entscheidung</b></summary>

Die wahrscheinlichste Menge ist nicht automatisch die kostenoptimale; Entscheidung minimiert erwartete Kosten.

</details>

## Teil 2: Multiple Choice

**1. Eine Kundin fragt: 'Wann kommt MEINE Lieferung?' Welche Funktion liefert das passende Intervall?**

- A) predict
- B) posterior_epred
- C) posterior_predict
- D) loo

<details><summary>Lösung</summary>

**C) posterior_predict**: Einzelfall → inkl. ε.

</details>

**2. Wären die Koeffizienten exakt bekannt, wie breit wäre das epred-Intervall?**

- A) ±2σ
- B) ein Punkt (Breite 0)
- C) unendlich
- D) gleich breit wie predict

<details><summary>Lösung</summary>

**B) ein Punkt (Breite 0)**: epred enthält nur die Koeffizienten-Unsicherheit (Verständnisaufgabe 11).

</details>

**3. Intervalle A [20; 35] und B [22; 37] überlappen. In jedem Sample ist aber B − A zwischen 1 und 3. Was gilt?**

- A) Kein Unterschied, weil Überlappung
- B) Klarer Unterschied: B ist in allen Samples größer
- C) Unterschied −15 bis +17
- D) Unentscheidbar

<details><summary>Lösung</summary>

**B) Klarer Unterschied: B ist in allen Samples größer**: Verständnisaufgabe 12: gemeinsame Posterior-Struktur zählt.

</details>

**4. Fehlende Essen kosten 3 €, überzählige 1 €. Welches Quantil der Nachfrageverteilung sollte man vorbereiten?**

- A) 50 %
- B) 25 %
- C) 75 %
- D) 90 %

<details><summary>Lösung</summary>

**C) 75 %**: 3/(3+1) = 0.75.

</details>

**5. Man bereitet 120 Essen vor (optimal), gebraucht werden nur 80. War die Entscheidung falsch?**

- A) Ja, 80 wäre richtig gewesen
- B) Nein – sie minimierte die erwarteten Kosten unter Unsicherheit
- C) Ja, immer Median nehmen
- D) Nur wenn die Kosten symmetrisch sind

<details><summary>Lösung</summary>

**B) Nein – sie minimierte die erwarteten Kosten unter Unsicherheit**: Entscheidungen bewertet man ex ante, nicht am Einzelausgang.

</details>

**6. Was liefert posterior_epred bei einem logistischen Modell?**

- A) 0/1-Werte
- B) Wahrscheinlichkeiten mit Unsicherheit
- C) Logits
- D) Odds-Ratios

<details><summary>Lösung</summary>

**B) Wahrscheinlichkeiten mit Unsicherheit**: Erwartungswert von y = p.

</details>

**7. Wie berechnet man P(Mann wiegt > 90 kg) aus pred = posterior_predict(...)?**

- A) predict(m) > 90
- B) mean(pred[,2] > 90)
- C) sum(pred > 90)
- D) hdi(pred)

<details><summary>Lösung</summary>

**B) mean(pred[,2] > 90)**: Anteil der Samples über 90.

</details>

**8. Warum ist das posterior_predict-Intervall breiter als das epred-Intervall?**

- A) Mehr Samples
- B) Es enthält zusätzlich die Residuenstreuung σ
- C) Anderer Prior
- D) Rundung

<details><summary>Lösung</summary>

**B) Es enthält zusätzlich die Residuenstreuung σ**: ≈ ±2σ breiter.

</details>
