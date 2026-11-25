# Quiz 08: Modellvergleich (LOO)

> Zugehöriges Kapitel: [kapitel/08-Modellvergleich-LOO.md](../kapitel/08-Modellvergleich-LOO.md)

## Teil 1: Karteikarten (Begriffe)

<details><summary><b>LOO</b></summary>

Leave-One-Out-Kreuzvalidierung, approximiert mit PSIS aus den Posterior-Samples (loo()).

</details>

<details><summary><b>elpd</b></summary>

Expected log pointwise predictive density: Vorhersagegüte für ausgelassene Punkte; größer = besser.

</details>

<details><summary><b>looic</b></summary>

= −2·elpd; kleiner = besser.

</details>

<details><summary><b>loo_compare</b></summary>

Bestes Modell oben mit 0; andere zeigen elpd_diff (negativ) und se_diff.

</details>

<details><summary><b>2·se-Regel</b></summary>

|elpd_diff| > 2·se_diff → relevanter Unterschied.

</details>

<details><summary><b>Pareto k</b></summary>

< 0.7 ok; 0.7–1 problematisch; > 1 sehr schlecht (einflussreiche Beobachtungen).

</details>

<details><summary><b>p_loo</b></summary>

Effektive Anzahl Parameter.

</details>

<details><summary><b>AIC</b></summary>

Deviance + 2·Parameterzahl; kleiner = besser; ΔAIC/2 ≈ elpd-Differenz.

</details>

## Teil 2: Multiple Choice

**1. loo_compare: m1 elpd_diff −222.8, se_diff 24.0. Ergebnis?**

- A) Kein klarer Unterschied
- B) m2 ist klar besser (> 9 se)
- C) m1 ist besser
- D) Ungültig

<details><summary>Lösung</summary>

**B) m2 ist klar besser (> 9 se)**: 222.8 > 2·24.

</details>

**2. elpd_diff −3.1, se_diff 2.5. Was folgt?**

- A) Deutlicher Unterschied
- B) Kein überzeugender Unterschied – einfacheres Modell vertretbar
- C) Modelle identisch
- D) Pareto-Problem

<details><summary>Lösung</summary>

**B) Kein überzeugender Unterschied – einfacheres Modell vertretbar**: 3.1 < 5.

</details>

**3. Darf man ein Modell für y mit einem für log(y) per loo_compare vergleichen?**

- A) Ja
- B) Nein – andere Skala der Zielvariable
- C) Nur bei gleichen Prädiktoren
- D) Nur bei Bayes

<details><summary>Lösung</summary>

**B) Nein – andere Skala der Zielvariable**: Gleiche y-Variable nötig.

</details>

**4. Ein Modell verliert wegen NAs 50 Zeilen. Vergleich per LOO?**

- A) Gültig
- B) Ungültig – gleiche Datenzeilen nötig
- C) Gültig mit Korrektur
- D) Nur AIC

<details><summary>Lösung</summary>

**B) Ungültig – gleiche Datenzeilen nötig**: Verständnisaufgabe 23/24.

</details>

**5. Viele Beobachtungen mit Pareto k > 1. Bedeutung?**

- A) Sehr gutes Modell
- B) LOO-Approximation unzuverlässig; einflussreiche Punkte/Fehlspezifikation prüfen
- C) Overfitting ausgeschlossen
- D) Sampling perfekt

<details><summary>Lösung</summary>

**B) LOO-Approximation unzuverlässig; einflussreiche Punkte/Fehlspezifikation prüfen**: Dann kfold oder Refits.

</details>

**6. Warum reicht R² für den Modellvergleich nicht?**

- A) R² ist immer 1
- B) R² steigt fast immer mit mehr Variablen (Overfitting) und misst nicht die Vorhersage neuer Daten
- C) R² ist bayesianisch
- D) R² ist negativ

<details><summary>Lösung</summary>

**B) R² steigt fast immer mit mehr Variablen (Overfitting) und misst nicht die Vorhersage neuer Daten**: Deshalb Testdaten/LOO.

</details>

**7. Welches Modell steht in loo_compare ganz oben?**

- A) Das komplexeste
- B) Das mit dem höchsten elpd (bestes)
- C) Das erste übergebene
- D) Das mit dem kleinsten R²

<details><summary>Lösung</summary>

**B) Das mit dem höchsten elpd (bestes)**: elpd_diff = 0.

</details>

**8. AIC sinkt von 2671 auf 2227. Etwa welche elpd-Differenz erwartet man?**

- A) 444
- B) 222
- C) 44
- D) 2227

<details><summary>Lösung</summary>

**B) 222**: ΔAIC/2.

</details>
