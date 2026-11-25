# Quiz 03: Modellprüfung & MCMC

> Zugehöriges Kapitel: [kapitel/03-Modellpruefung-MCMC.md](../kapitel/03-Modellpruefung-MCMC.md)

## Teil 1: Karteikarten (Begriffe)

<details><summary><b>Die 4 Prüffragen</b></summary>

1) Sampling ok? 2) Reproduziert das Modell die Daten? 3) Systematische Fehler? 4) Generalisierung auf neue Daten?

</details>

<details><summary><b>Rhat</b></summary>

Vergleicht die Chains; ≈ 1 gut, > 1.1 problematisch (Chains nicht konvergiert).

</details>

<details><summary><b>n_eff</b></summary>

Effektive Anzahl unabhängiger Samples; > 2000 gut, < 400 schlecht.

</details>

<details><summary><b>mcse</b></summary>

Monte-Carlo-Standardfehler = numerische Ungenauigkeit; sollte < 5 % des mad sein.

</details>

<details><summary><b>Traceplot</b></summary>

Verlauf der Chains; gut = 'haariges Rauschen', alle Chains überlappen, kein Trend.

</details>

<details><summary><b>mean_PPD</b></summary>

Mittelwert der posterior-predictive Daten; sollte ≈ Mittelwert von y sein.

</details>

<details><summary><b>diagnose_density</b></summary>

Dichte der echten Daten vs. simulierter Datensätze (Posterior Predictive Check).

</details>

<details><summary><b>diagnose_fit</b></summary>

Vergleicht Statistiken (min, max, Mittelwert, Quantile) der Daten mit den 4000 replizierten Datensätzen.

</details>

<details><summary><b>Banane im Residuenplot</b></summary>

Hinweis auf fehlende Nichtlinearität → quadratischer Term, log oder Spline.

</details>

<details><summary><b>Trichter im Residuenplot</b></summary>

Streuung nicht konstant (Heteroskedastizität) → Vorhersageintervalle teils zu eng/zu weit.

</details>

<details><summary><b>Skill (metrisch)</b></summary>

1 − MSE_Modell / MSE_Mittelwertmodell; 0 = nicht besser als Mittelwert.

</details>

<details><summary><b>Overfitting</b></summary>

Modell passt Trainingsdaten (inkl. Zufall) zu gut, Testfehler deutlich größer als Trainingsfehler.

</details>

## Teil 2: Multiple Choice

**1. Rhat = 1.15, n_eff = 80, Chains liegen in verschiedenen Bereichen. Diagnose?**

- A) Modell ist fehlspezifiziert
- B) Das Sampling hat nicht funktioniert – Ergebnisse nicht vertrauenswürdig
- C) Alles ok
- D) Overfitting

<details><summary>Lösung</summary>

**B) Das Sampling hat nicht funktioniert – Ergebnisse nicht vertrauenswürdig**: Berechnungsproblem (Verständnisaufgabe 08).

</details>

**2. Sampling perfekt, aber U-förmige Residuen. Diagnose?**

- A) Berechnungsproblem
- B) Modellproblem: Nichtlinearität fehlt
- C) Zu wenige Samples
- D) Kein Problem

<details><summary>Lösung</summary>

**B) Modellproblem: Nichtlinearität fehlt**: Gutes Sampling ≠ gutes Modell.

</details>

**3. Was bringt es, 40 000 statt 4 000 Samples zu ziehen?**

- A) Zehnmal so viele Daten
- B) Deutlich schmalere Intervalle
- C) Genauere numerische Näherung (kleinerer mcse), aber kaum schmalere Intervalle
- D) Höheres R²

<details><summary>Lösung</summary>

**C) Genauere numerische Näherung (kleinerer mcse), aber kaum schmalere Intervalle**: Die Datenmenge bleibt gleich (Verständnisaufgabe 07).

</details>

**4. Der Gesamtmittelwert der Vorhersagen passt, aber Typ A wird über- und Typ B unterschätzt. Was folgt?**

- A) Modell ist gut
- B) Fehler gleichen sich aus – Untergruppen prüfen, Variable 'Typ' aufnehmen
- C) Mehr Samples ziehen
- D) Prior ändern

<details><summary>Lösung</summary>

**B) Fehler gleichen sich aus – Untergruppen prüfen, Variable 'Typ' aufnehmen**: Verständnisaufgabe 09.

</details>

**5. Die Streuung der Residuen wächst mit der Entfernung. Welche Annahme ist verletzt?**

- A) Linearität
- B) Konstante Residuenstreuung σ
- C) Unabhängigkeit der Chains
- D) Normalverteilter Prior

<details><summary>Lösung</summary>

**B) Konstante Residuenstreuung σ**: Folge: Intervalle für große Entfernungen zu eng.

</details>

**6. Testfehler RMSE 5.2, Trainingsfehler RMSE 5.1. Interpretation?**

- A) Overfitting
- B) Gute Generalisierung auf ähnliche Daten
- C) Modell unbrauchbar
- D) Sampling-Fehler

<details><summary>Lösung</summary>

**B) Gute Generalisierung auf ähnliche Daten**: Test ≈ Training.

</details>

**7. Skill = −0.1 auf Testdaten bedeutet …**

- A) Sehr gutes Modell
- B) Modell ist schlechter als immer den Mittelwert vorherzusagen
- C) 10 % erklärt
- D) Rundungsfehler

<details><summary>Lösung</summary>

**B) Modell ist schlechter als immer den Mittelwert vorherzusagen**: Skill < 0 → schlechter als Baseline.

</details>

**8. Welcher Plot zeigt echte y gegen vorhergesagte ŷ?**

- A) diagnose_density
- B) diagnose_y_vs_yhat
- C) plotcoef
- D) mcmc_trace

<details><summary>Lösung</summary>

**B) diagnose_y_vs_yhat**: Ideal: Punkte entlang der Diagonale.

</details>

**9. Was zeigt plotcorr(model)?**

- A) Korrelationen der Daten
- B) Korrelationen der Posterior-Samples der Koeffizienten
- C) Residuen
- D) ROC

<details><summary>Lösung</summary>

**B) Korrelationen der Posterior-Samples der Koeffizienten**: Hohe Parameterkorrelation → Zentrieren hilft.

</details>

**10. mean_PPD = 31.4, Mittelwert von y = 31.5. Was sagt das?**

- A) Overfitting
- B) Das Modell reproduziert den Mittelwert der Daten
- C) Sampling kaputt
- D) R² = 0.99

<details><summary>Lösung</summary>

**B) Das Modell reproduziert den Mittelwert der Daten**: Teil von Prüffrage 2.

</details>
