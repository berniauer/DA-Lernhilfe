# Quiz 11: Beispielklausur-Training

> Zugehöriges Kapitel: [uebungsklausur/A2-Musterloesung.md](../uebungsklausur/A2-Musterloesung.md)

## Teil 1: Karteikarten (Begriffe)

<details><summary><b>Basisfall Klausur-Modell 1</b></summary>

Maschine M1, Tagschicht, alle Prozesswerte = 0 (0 mTorr, 0 °C, 0 %, 0 s, 0 mm/s) – außerhalb der Daten, nicht interpretierbar → zentrieren.

</details>

<details><summary><b>Tabelle Df/Deviance/AIC</b></summary>

Ausgabe von effectsize() für ein logistisches Modell; großer AIC-Anstieg ohne Variable = wichtig.

</details>

<details><summary><b>Wichtigste Variable m1 / m2</b></summary>

m1: machine (+160 AIC); m2: line_speed (+251 AIC).

</details>

<details><summary><b>M1 vs. M2</b></summary>

machineM2 0.09 [−0.27; 0.40] schließt 0 ein → nicht unterscheidbar.

</details>

<details><summary><b>Nachtschicht</b></summary>

OR e^1.41 ≈ 4.1 (Odds!), nicht 4× Wahrscheinlichkeit; nicht kausal.

</details>

<details><summary><b>Güte m1</b></summary>

Sampling ok, mean_PPD 0.25, R² 0.37, AUC 0.86/0.86, Brier 0.115/0.109 vs. 0.1875 → Skill ≈ 0.4; aber Nichtlinearität.

</details>

<details><summary><b>m2 vs. m1</b></summary>

R² 0.49, AUC Test 0.917, Brier 0.089, Skill 0.52, elpd-Diff −222.8 (se 24) → m2 klar besser, kein Overfitting.

</details>

<details><summary><b>Cutoff Klausur</b></summary>

TPR ≥ 0.75 → Cutoff ≈ 0.3; ca. 75 % Defekte erkannt, ca. 13 % der guten Teile Fehlalarm.

</details>

<details><summary><b>Luftfeuchtigkeit Empfehlung</b></summary>

≈ 38–47 % (Minimum ≈ 40–42 %), > 50 % vermeiden; Ränder dünn, nicht kausal.

</details>

<details><summary><b>Transport vs. Belichtung</b></summary>

Bei line_speed mehr Vorsicht (größter AIC-Beitrag); Korrelation −0.68 beachten.

</details>

## Teil 2: Multiple Choice

**1. In der Klausur: Welche Variable ist in Modell 1 laut AIC-Tabelle am wichtigsten?**

- A) exposure_time
- B) pressure
- C) machine
- D) temperature

<details><summary>Lösung</summary>

**C) machine**: AIC ohne machine 2831.6 vs. 2671.1 (+160.5).

</details>

**2. Warum ist der Basisfall von Modell 1 nicht sinnvoll interpretierbar?**

- A) Weil M1 die beste Maschine ist
- B) Alle Prozesswerte = 0 liegen weit außerhalb der Daten
- C) Weil der Intercept negativ ist
- D) Weil Rhat ≠ 1

<details><summary>Lösung</summary>

**B) Alle Prozesswerte = 0 liegen weit außerhalb der Daten**: Zentrieren.

</details>

**3. machineM5 1.59 [1.24; 1.96], machineM4 1.43 [1.08; 1.75]. Ist M5 sicher die schlechteste Maschine?**

- A) Ja
- B) Nicht eindeutig – Differenz über Samples prüfen
- C) Nein, M1
- D) M4 ist sicher schlechter

<details><summary>Lösung</summary>

**B) Nicht eindeutig – Differenz über Samples prüfen**: s[,'machineM5'] − s[,'machineM4'].

</details>

**4. Die U-förmigen Kurven in Abschnitt 3 zeigen vor allem, dass …**

- A) Modell 1 overfittet
- B) Modell 1 nur monotone (lineare) Zusammenhänge abbilden kann – quadratische Terme nötig
- C) die Daten fehlerhaft sind
- D) die Maschinen gleich sind

<details><summary>Lösung</summary>

**B) Modell 1 nur monotone (lineare) Zusammenhänge abbilden kann – quadratische Terme nötig**: Fehlspezifikation.

</details>

**5. Warum ist exposure_time2 = 42 nicht automatisch der stärkste Effekt?**

- A) Weil 42 klein ist
- B) Einheit Sekunden² und winzige Streuung (SD 0.07 s) – auf gemeinsame Skala bringen
- C) Weil quadratisch immer schwach ist
- D) Rundung

<details><summary>Lösung</summary>

**B) Einheit Sekunden² und winzige Streuung (SD 0.07 s) – auf gemeinsame Skala bringen**: β₂·SD² ≈ 0.21.

</details>

**6. Beide Klausurmodelle nehmen bezüglich Luftfeuchtigkeit und Maschine an, dass …**

- A) die Feuchtigkeit nur bei M5 wirkt
- B) die Wirkung der Feuchtigkeit auf allen Maschinen gleich ist (keine Interaktion)
- C) Maschine kausal ist
- D) Feuchtigkeit linear wirkt

<details><summary>Lösung</summary>

**B) die Wirkung der Feuchtigkeit auf allen Maschinen gleich ist (keine Interaktion)**: Additiv auf Logit-Skala.

</details>

**7. plotlogrates(m2): Bei welchem Cutoff erreicht man TPR = 0.75?**

- A) ≈0.1
- B) ≈0.3
- C) ≈0.5
- D) ≈0.7

<details><summary>Lösung</summary>

**B) ≈0.3**: Abgelesen ≈ 0.28–0.32.

</details>

**8. Warum ist ein zufälliger Split in der Klausur problematisch?**

- A) Weil 70/30 falsch ist
- B) Daten aus denselben Wochen in Train und Test → Zukunft/Drift nicht geprüft
- C) Zu wenig Defekte
- D) Bayes erlaubt keine Splits

<details><summary>Lösung</summary>

**B) Daten aus denselben Wochen in Train und Test → Zukunft/Drift nicht geprüft**: Besser zeitlicher Split.

</details>
