# Quiz 06: Effektgröße

> Zugehöriges Kapitel: [kapitel/06-Effektgroesse.md](../kapitel/06-Effektgroesse.md)

## Teil 1: Karteikarten (Begriffe)

<details><summary><b>Cohens d</b></summary>

Mittelwertsunterschied in Standardabweichungen; 0.2 klein, 0.5 mittel, 0.8 groß.

</details>

<details><summary><b>f²</b></summary>

(R²_mit − R²_ohne)/(1 − R²_mit): Anteil der unerklärten Varianz, den eine Variable zusätzlich erklärt; 0.02/0.15/0.35.

</details>

<details><summary><b>effectsize() linear</b></summary>

Drop-one-Tabelle mit Df, RSS, AIC, R2, f2; sortiert nach f2.

</details>

<details><summary><b>effectsize() logistisch</b></summary>

Drop-one-Tabelle mit Df, Deviance, AIC; größerer AIC-Anstieg = wichtigere Variable (unten).

</details>

<details><summary><b>Df in effectsize</b></summary>

Anzahl gemeinsam entfernter Koeffizienten (Faktor-Dummies, Interaktionen, quadratische Terme).

</details>

<details><summary><b>Statistische Sicherheit vs. Effektgröße</b></summary>

Ein Effekt kann sehr sicher (enges Intervall) aber winzig sein – bei großen n.

</details>

<details><summary><b>Korrelierte Prädiktoren</b></summary>

Teilen sich Erklärungskraft; beim Weglassen übernimmt die andere → beide wirken einzeln klein.

</details>

<details><summary><b>Standardisierter Koeffizient</b></summary>

Effekt pro 1 SD der Variable (β·SD), macht Variablen verschiedener Einheiten vergleichbar.

</details>

## Teil 2: Multiple Choice

**1. R² mit x = 0.60, ohne x = 0.55. f² = ?**

- A) 0.05
- B) 0.125
- C) 0.083
- D) 0.55

<details><summary>Lösung</summary>

**B) 0.125**: 0.05/0.40 = 0.125.

</details>

**2. f² = 0.125 bedeutet …**

- A) x erklärt 12.5 % der Gesamtvarianz
- B) Die zusätzlich erklärte Varianz (5 Prozentpunkte) beträgt 12.5 % der im vollen Modell unerklärten Varianz (40 %) – klein bis mittel
- C) x ist kausal
- D) 12.5 % Fehler

<details><summary>Lösung</summary>

**B) Die zusätzlich erklärte Varianz (5 Prozentpunkte) beträgt 12.5 % der im vollen Modell unerklärten Varianz (40 %) – klein bis mittel**: Nicht als '% erklärt' lesen (Verständnisaufgabe 18).

</details>

**3. 500 000 Beobachtungen, Unterschied 0.2 kg, HDI [0.15; 0.25]. Was gilt?**

- A) Großer Effekt
- B) Sicher von 0 verschieden, aber praktisch winzig
- C) Unsicher
- D) Kausal

<details><summary>Lösung</summary>

**B) Sicher von 0 verschieden, aber praktisch winzig**: Verständnisaufgabe 17.

</details>

**4. In einer logistischen effectsize-Tabelle steigt der AIC ohne machine um 160, ohne exposure_time um 25. Was folgt?**

- A) exposure_time ist wichtiger
- B) machine trägt im Modell deutlich mehr zur Erklärung bei
- C) Beide gleich
- D) machine ist kausal

<details><summary>Lösung</summary>

**B) machine trägt im Modell deutlich mehr zur Erklärung bei**: Größerer AIC-Anstieg = wichtiger.

</details>

**5. exposure_time hat den betragsmäßig größten Koeffizienten (−5.2). Ist es die wichtigste Variable?**

- A) Ja
- B) Nein – der Koeffizient hängt von der Einheit (Sekunden, Spannweite 0.5 s) ab
- C) Ja, weil negativ
- D) Nur bei Bayes

<details><summary>Lösung</summary>

**B) Nein – der Koeffizient hängt von der Einheit (Sekunden, Spannweite 0.5 s) ab**: Rohe Koeffizienten nicht vergleichbar.

</details>

**6. Warum hat 'temp5' in effectsize(m3) Df = 3?**

- A) Drei Chains
- B) temp5 wird zusammen mit seinen 2 Interaktionstermen entfernt
- C) Drei Ausreißer
- D) Rundung

<details><summary>Lösung</summary>

**B) temp5 wird zusammen mit seinen 2 Interaktionstermen entfernt**: Interaktionen werden mitentfernt.

</details>

**7. Ab welchem f² spricht man nach Cohen von einem großen Effekt?**

- A) 0.02
- B) 0.15
- C) 0.35
- D) 0.8

<details><summary>Lösung</summary>

**C) 0.35**: 0.8 ist der Richtwert für Cohens d.

</details>

**8. Zwei stark korrelierte Variablen zeigen jeweils kleines f². Was ist möglich?**

- A) Beide sind unwichtig
- B) Gemeinsam sind sie wichtig; jede übernimmt beim Weglassen der anderen deren Rolle
- C) Fehler in effectsize
- D) Overfitting

<details><summary>Lösung</summary>

**B) Gemeinsam sind sie wichtig; jede übernimmt beim Weglassen der anderen deren Rolle**: Verständnisaufgabe 19.

</details>
