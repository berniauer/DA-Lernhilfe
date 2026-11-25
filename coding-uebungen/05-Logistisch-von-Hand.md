# Coding 5: Logistische Regression von Hand rechnen (ohne R!)

> In der Klausur hast du keinen Rechner für R, aber einfache Umrechnungen musst du können. Merkwerte: e^0.1 ≈ 1.105, e^0.5 ≈ 1.65, e^0.7 ≈ 2.0, e^1 ≈ 2.72, e^1.4 ≈ 4.0, e^2 ≈ 7.4, e^−0.5 ≈ 0.61, e^−1 ≈ 0.37.

## Aufgabe 5.1: Umrechnen
Fülle die Tabelle aus:

| p | Odds | Logit |
|---|---|---|
| 0.5 | ? | ? |
| 0.2 | ? | ? |
| ? | 3 | ? |
| ? | ? | −2 |

<details><summary>Lösung</summary>

| p | Odds | Logit |
|---|---|---|
| 0.5 | 1 | 0 |
| 0.2 | 0.25 | log(0.25) ≈ −1.39 |
| 0.75 | 3 | log 3 ≈ 1.10 |
| 0.12 | e^−2 ≈ 0.135 | −2 |
</details>

## Aufgabe 5.2: Odds-Ratio interpretieren
Koeffizient `jahresvertrag = −0.92`. a) Odds-Ratio? b) Formuliere die Interpretation.

<details><summary>Lösung</summary>

a) e^−0.92 ≈ **0.40**. b) Mitglieder mit Jahresvertrag haben bei sonst gleichen Merkmalen ca. 60 % niedrigere **Odds** zu kündigen als Mitglieder mit Monatsvertrag.
</details>

## Aufgabe 5.3: Wirkung in Prozentpunkten
Odds-Ratio 2. Wie ändert sich p bei Ausgangswerten p₀ = 0.05, 0.25, 0.5, 0.8?

<details><summary>Lösung</summary>

| p₀ | Odds₀ | Odds₁ = 2·Odds₀ | p₁ | Δ |
|---|---|---|---|---|
| 0.05 | 0.0526 | 0.105 | 0.095 | +4.5 PP |
| 0.25 | 0.333 | 0.667 | 0.40 | +15 PP |
| 0.50 | 1 | 2 | 0.667 | +16.7 PP |
| 0.80 | 4 | 8 | 0.889 | +8.9 PP |

Gleiche Odds-Ratio, sehr unterschiedliche Wirkung auf p.
</details>

## Aufgabe 5.4: Vorhersage für einen Fall
Intercept −0.43, besuche −0.32, jahresvertrag −0.92, entfernung 0.11, preiserhoehung 0.73 (alter36 = 0).
Mitglied: 2 Besuche, Monatsvertrag, 5 km, Preiserhöhung. p = ?

<details><summary>Lösung</summary>

Logit = −0.43 − 0.64 + 0 + 0.55 + 0.73 = **0.21** → p = 1/(1 + e^−0.21) ≈ **0.55**.
(Simulation mit ungerundeten Werten: 0.557.)
</details>

## Aufgabe 5.5: Brier-Skill
Defektrate 30 %. Brier des Modells 0.15. Skill?

<details><summary>Lösung</summary>

Brier_Null = 0.3·0.7 = 0.21 → Skill = 1 − 0.15/0.21 ≈ **0.29**.
</details>

## Aufgabe 5.6: Confusion Matrix
1000 Teile, 250 defekt. Beim gewählten Cutoff: TPR 0.8, FPR 0.1. Berechne TP, FN, FP, TN, Precision, Accuracy.

<details><summary>Lösung</summary>

TP = 200, FN = 50, FP = 75, TN = 675. Precision = 200/275 ≈ **0.73**. Accuracy = 875/1000 = **0.875** (nur gering besser als „alles ok“ mit 0.75!).
</details>

## Aufgabe 5.7: Kostenoptimaler Cutoff
Fehlalarm kostet 10 €, übersehener Defekt 90 €. Ab welchem p sollte man (bei kalibriertem Modell) prüfen?

<details><summary>Lösung</summary>

Prüfen, wenn p·90 > (1 − p)·10 ⇔ p > 10/(10 + 90) = **0.1**.
</details>

## Aufgabe 5.8: Faustregel durch 4
Koeffizient 0.8. Wie stark ändert sich p maximal pro Einheit?

<details><summary>Lösung</summary>

≈ 0.8/4 = **0.2**, also 20 Prozentpunkte (nur in der Nähe von p = 0.5; an den Rändern weniger).
</details>
