# Quiz 09: Logistische Regression

> Zugehöriges Kapitel: [kapitel/09-Logistische-Regression.md](../kapitel/09-Logistische-Regression.md)

## Teil 1: Karteikarten (Begriffe)

<details><summary><b>Odds</b></summary>

p/(1 − p); p = 0.2 → Odds 0.25.

</details>

<details><summary><b>Logit</b></summary>

log(Odds); Bereich −∞ bis +∞; logit 0 ↔ p = 0.5.

</details>

<details><summary><b>Rückrechnung</b></summary>

p = e^logit/(1 + e^logit) = plogis(logit).

</details>

<details><summary><b>Odds-Ratio</b></summary>

e^β: Faktor, um den sich die Odds bei +1 Einheit x ändern (bei sonst gleichen Werten).

</details>

<details><summary><b>Faustregel β/4</b></summary>

Maximale Änderung von p pro Einheit x (bei p ≈ 0.5).

</details>

<details><summary><b>Brier-Score</b></summary>

mean((y − p)²); 0 perfekt; Nullmodell p̄(1 − p̄).

</details>

<details><summary><b>LogLoss</b></summary>

−mean(y log p + (1−y) log(1−p)); bestraft sichere Fehlprognosen stark.

</details>

<details><summary><b>Brier-Skill</b></summary>

1 − Brier/Brier_Null.

</details>

<details><summary><b>AUC</b></summary>

Wahrscheinlichkeit, dass ein zufälliges positives Beispiel ein höheres p bekommt als ein zufälliges negatives; 0.5 = Zufall.

</details>

<details><summary><b>TPR / Sensitivität</b></summary>

TP/(TP + FN): Anteil erkannter Positiver.

</details>

<details><summary><b>FPR</b></summary>

FP/(FP + TN): Anteil fälschlich markierter Negativer.

</details>

<details><summary><b>Precision</b></summary>

TP/(TP + FP): Anteil echter Positiver unter den Alarmen.

</details>

<details><summary><b>Kalibrierung</b></summary>

Stimmen vorhergesagte Wahrscheinlichkeiten mit beobachteten Raten überein?

</details>

<details><summary><b>Separation</b></summary>

Eine Variable trennt 0/1 (fast) perfekt → Koeffizient extrem; oft Leakage.

</details>

<details><summary><b>plotlogrates / logistic_rates</b></summary>

Raten (TPR, FPR, …) in Abhängigkeit vom Cutoff; ohne newdata = Trainingsdaten!

</details>

<details><summary><b>Kostenoptimaler Cutoff (kalibriert)</b></summary>

markieren, wenn p > c_FP/(c_FP + c_FN).

</details>

## Teil 2: Multiple Choice

**1. Logit = −0.43. p ≈ ?**

- A) 0.43
- B) 0.39
- C) 0.61
- D) 0.65

<details><summary>Lösung</summary>

**B) 0.39**: e^−0.43 = 0.65 → 0.65/1.65 ≈ 0.39.

</details>

**2. shiftNight = 1.41 → e^1.41 ≈ 4.1. Richtige Aussage?**

- A) Defekte in der Nacht 4.1-mal so wahrscheinlich
- B) Odds auf Defekt in der Nacht ≈ 4.1-mal so hoch wie am Tag (bei sonst gleichen Werten)
- C) +141 Prozentpunkte
- D) +4.1 %

<details><summary>Lösung</summary>

**B) Odds auf Defekt in der Nacht ≈ 4.1-mal so hoch wie am Tag (bei sonst gleichen Werten)**: Odds-Ratio ≠ Wahrscheinlichkeitsverhältnis.

</details>

**3. Tag p = 10 %, Odds-Ratio Nacht 4.1. p in der Nacht ≈ ?**

- A) 41 %
- B) 31 %
- C) 14 %
- D) 50 %

<details><summary>Lösung</summary>

**B) 31 %**: Odds 0.111 × 4.1 = 0.456 → p = 0.31.

</details>

**4. pressure = 0.08 pro mTorr. Odds-Faktor pro 1 SD (8.28)?**

- A) 1.08
- B) ≈1.94
- C) 0.66
- D) 8.28

<details><summary>Lösung</summary>

**B) ≈1.94**: e^(0.08·8.28) = e^0.66 ≈ 1.94.

</details>

**5. Defektrate 25 %. Brier des Nullmodells?**

- A) 0.25
- B) 0.1875
- C) 0.5
- D) 0.0625

<details><summary>Lösung</summary>

**B) 0.1875**: 0.25·0.75.

</details>

**6. Brier Modell 0.109, Null 0.1875. Skill?**

- A) 0.109
- B) ≈0.42
- C) ≈0.58
- D) 0.1875

<details><summary>Lösung</summary>

**B) ≈0.42**: 1 − 0.109/0.1875 ≈ 0.42.

</details>

**7. AUC = 0.86 bedeutet …**

- A) 86 % richtig klassifiziert
- B) Ein zufälliges defektes Teil bekommt mit 86 % Wahrscheinlichkeit eine höhere Prognose als ein zufälliges gutes
- C) 86 % Defekte erkannt
- D) Brier 0.14

<details><summary>Lösung</summary>

**B) Ein zufälliges defektes Teil bekommt mit 86 % Wahrscheinlichkeit eine höhere Prognose als ein zufälliges gutes**: Rangordnung.

</details>

**8. Ein Modell halbiert alle Wahrscheinlichkeiten (Reihenfolge gleich). Was passiert?**

- A) AUC sinkt
- B) AUC gleich, Brier schlechter (schlecht kalibriert)
- C) Beides besser
- D) Nichts

<details><summary>Lösung</summary>

**B) AUC gleich, Brier schlechter (schlecht kalibriert)**: Verständnisaufgabe 28.

</details>

**9. 25 % Positive. Modell 'immer 0' hat welche Accuracy?**

- A) 25 %
- B) 50 %
- C) 75 %
- D) 0 %

<details><summary>Lösung</summary>

**C) 75 %**: Accuracy irreführend (Verständnisaufgabe 29).

</details>

**10. 'Max. 1 von 4 Defekten übersehen' entspricht …**

- A) FPR ≤ 0.25
- B) TPR ≥ 0.75
- C) Precision ≥ 0.75
- D) Accuracy ≥ 0.75

<details><summary>Lösung</summary>

**B) TPR ≥ 0.75**: FNR ≤ 0.25 ⇔ TPR ≥ 0.75.

</details>

**11. Senkt man den Cutoff von 0.5 auf 0.2, dann …**

- A) sinken TPR und FPR
- B) steigen TPR und FPR
- C) steigt TPR, sinkt FPR
- D) bleibt alles gleich

<details><summary>Lösung</summary>

**B) steigen TPR und FPR**: Mehr Fälle werden als 1 markiert.

</details>

**12. Gutschein 30 €, verlorener Kunde 300 €, Modell gut kalibriert. Ab welchem p lohnt sich der Gutschein?**

- A) 0.5
- B) 0.1
- C) 0.9
- D) 0.3

<details><summary>Lösung</summary>

**B) 0.1**: p·300 > 30 → p > 0.1 (≈ 30/330 ≈ 0.09).

</details>

**13. plotlogrates(m2) ohne newdata verwendet …**

- A) Testdaten
- B) Trainingsdaten
- C) Simulierte Daten
- D) Nichts

<details><summary>Lösung</summary>

**B) Trainingsdaten**: Für Entscheidungen newdata=df_test angeben.

</details>

**14. Im Training wurden Defekte auf 50 % übersampelt, real sind es 5 %. Folge?**

- A) Keine
- B) Vorhergesagte p zu hoch → Kalibrierung und Kostenentscheidungen falsch; AUC ähnlich
- C) AUC sinkt auf 0.5
- D) Modell wird kausal

<details><summary>Lösung</summary>

**B) Vorhergesagte p zu hoch → Kalibrierung und Kostenentscheidungen falsch; AUC ähnlich**: Verständnisaufgabe 30.

</details>

**15. Eine Variable sagt fast perfekt vorher und wurde nach dem Ereignis gemessen. Wie heißt das Problem?**

- A) Overfitting
- B) Data Leakage
- C) Simpson
- D) Multikollinearität

<details><summary>Lösung</summary>

**B) Data Leakage**: Verständnisaufgabe 25.

</details>
