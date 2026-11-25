# Quiz 07: Interaktionen & Nichtlinearität

> Zugehöriges Kapitel: [kapitel/07-Interaktionen-Nichtlinearitaet.md](../kapitel/07-Interaktionen-Nichtlinearitaet.md)

## Teil 1: Karteikarten (Begriffe)

<details><summary><b>Interaktion</b></summary>

Die Wirkung von x hängt vom Wert einer anderen Variable ab (unterschiedliche Steigungen). In R: x * g = x + g + x:g.

</details>

<details><summary><b>Haupteffekt x bei Interaktion</b></summary>

Steigung von x NUR in der Referenzgruppe (bzw. bei x₂ = 0).

</details>

<details><summary><b>Gruppeneffekt bei Interaktion</b></summary>

Unterschied zur Referenzgruppe NUR am Referenzpunkt x = 0 (Zentrierwert).

</details>

<details><summary><b>Interaktionskoeffizient x:G</b></summary>

Um so viel ist die Steigung in G anders als in der Referenz. Steigung in G = β_x + β_x:G.

</details>

<details><summary><b>Gruppenunterschied bei x = c</b></summary>

β_G + β_x:G · c

</details>

<details><summary><b>Referenzpunkt</b></summary>

Wert, an dem Haupteffekte gemessen werden; durch Zentrieren wählbar, ändert die Vorhersagen nicht.

</details>

<details><summary><b>Quadratischer Term</b></summary>

(x − Ziel)² modelliert ein Optimum (U-Form bei β₂ > 0).

</details>

<details><summary><b>Scheitelpunkt</b></summary>

Bei β₁·x + β₂·(x − c)²: x* = c − β₁/(2β₂).

</details>

## Teil 2: Multiple Choice

**1. temp5 = −1.58, temp5:daemmungneu = +1.05. Steigung bei neuer Dämmung?**

- A) +1.05
- B) −1.58
- C) −0.53
- D) −2.63

<details><summary>Lösung</summary>

**C) −0.53**: −1.58 + 1.05.

</details>

**2. daemmungneu = −15.25 im Interaktionsmodell (temp5 = temp − 5). Was bedeutet das?**

- A) Durchschnittlicher Unterschied über alle Temperaturen
- B) Unterschied neu − alt bei 5 °C
- C) Unterschied bei 0 °C
- D) Steigung

<details><summary>Lösung</summary>

**B) Unterschied neu − alt bei 5 °C**: Referenzpunkt temp5 = 0 → 5 °C.

</details>

**3. Unterschied neu − alt bei 0 °C (temp5 = −5)?**

- A) −15.25
- B) −20.5
- C) −10.0
- D) +5.25

<details><summary>Lösung</summary>

**B) −20.5**: −15.25 + 1.05·(−5) = −20.5.

</details>

**4. Nach Aufnahme der Interaktion sinkt daemmungneu von −17.2 auf −15.3. 'Die Dämmung wirkt schwächer.' Richtig?**

- A) Ja
- B) Nein – die Bedeutung des Koeffizienten hat sich geändert (Unterschied am Referenzpunkt)
- C) Ja, wegen Overfitting
- D) Nur bei kleinen n

<details><summary>Lösung</summary>

**B) Nein – die Bedeutung des Koeffizienten hat sich geändert (Unterschied am Referenzpunkt)**: Haupteffekte bei Interaktionen nie isoliert interpretieren.

</details>

**5. Was ändert Zentrieren in einem Interaktionsmodell?**

- A) Die Vorhersagen
- B) Die Interaktionskoeffizienten
- C) Die Haupteffekte (sie werden an einem anderen Referenzpunkt gemessen)
- D) Nichts

<details><summary>Lösung</summary>

**C) Die Haupteffekte (sie werden an einem anderen Referenzpunkt gemessen)**: Vorhersagen und Interaktionskoeffizient bleiben gleich.

</details>

**6. Logistisches Modell ohne Interaktion: Die Wahrscheinlichkeitskurven für M1 und M5 haben unterschiedliche Formen. Liegt eine Interaktion vor?**

- A) Ja
- B) Nein – auf Logit-Skala sind sie parallel; die Logit-Transformation erzeugt die Formunterschiede
- C) Nur bei M5
- D) Unklar

<details><summary>Lösung</summary>

**B) Nein – auf Logit-Skala sind sie parallel; die Logit-Transformation erzeugt die Formunterschiede**: Verständnisaufgabe 27, Beispielklausur 4.5.

</details>

**7. Scheitelpunkt für exposure_time: linear −5.48, quadratisch 42, Ziel 1.05?**

- A) 1.05
- B) ≈1.115
- C) ≈0.98
- D) ≈1.5

<details><summary>Lösung</summary>

**B) ≈1.115**: 1.05 − (−5.48)/(84) ≈ 1.115.

</details>

**8. Woran erkennt man, dass ein quadratischer Term nötig sein könnte?**

- A) Rhat > 1.1
- B) Bananenförmige Residuen / U-förmige Zusammenhänge
- C) Hohe n_eff
- D) Kleines σ

<details><summary>Lösung</summary>

**B) Bananenförmige Residuen / U-förmige Zusammenhänge**: Systematischer Fehler.

</details>
