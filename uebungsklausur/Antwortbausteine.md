# Antwortbausteine: Formulierungen & Checklisten für die Klausur

> Die Klausur fragt fast immer dieselben **Fragetypen**. Hier steht für jeden Typ eine Checkliste plus eine Musterformulierung. Auswendig lernen lohnt sich!

---

## A. „Was ist der Basisfall?“

**Checkliste:** ① alle **Referenzgruppen** nennen (erstes Faktorlevel) ② alle **metrischen Variablen = 0**, bei zentrierten Variablen den Zentrierwert nennen ③ Wert angeben (bei logistisch: in p umrechnen) ④ sinnvoll oder Extrapolation?

> „Der Intercept beschreibt [Referenz Faktor 1], [Referenz Faktor 2] mit [X1 = 0 → konkret], [X2 = …]. Laut Modell beträgt [y] dort im Mittel [Wert] (logistisch: logit = a → p = e^a/(1+e^a)). Da [z. B. 0 m², 0 °C, 0 mTorr] außerhalb des Datenbereichs liegt, ist der Wert nicht sinnvoll interpretierbar → zentrieren.“

## B. Metrischen Koeffizienten interpretieren

**Linear:** „Bei sonst gleichen Werten von [andere Variablen] ist [y] bei +1 [Einheit X] im Mittel um **β [Einheit y]** höher/niedriger (95 %-HDI [lwr; upr]).“

**Logistisch:** „Bei sonst gleichen Werten sind bei +1 [Einheit X] die **Odds** (Chancen) für [y = 1] um den **Faktor e^β ≈ …** höher (also +…%). Die Änderung der *Wahrscheinlichkeit* hängt vom Ausgangsniveau ab.“ Dazu eine sinnvolle Schrittweite wählen (z. B. 10 Einheiten oder 1 SD: e^(β·Δ)).

**Log-Y (`log(y) ~ …`):** „+1 X → y wird mit e^β multipliziert, also ≈ 100·(e^β − 1) % mehr.“

**Immer mitdenken:** Einheit · „bei sonst gleichen …“ · Intervall (schließt es 0 ein?) · keine Kausalität.

## C. Gruppenkoeffizienten

> „Im Vergleich zur Referenzgruppe [R] ist [y] in Gruppe [G] bei sonst gleichen Werten um β höher (logistisch: Odds × e^β).“

- Intervall schließt **0** ein → „die Daten sind auch mit keinem bzw. einem negativen Unterschied vereinbar; die Gruppen sind nicht klar unterscheidbar.“
- Vergleich **zweier Nicht-Referenzgruppen** (z. B. M4 vs. M5): nicht aus Überlappung der Intervalle schließen, sondern die **Differenz der Samples** bilden: `s[,"G1"] - s[,"G2"]`.
- **Bedingter vs. roher Vergleich**: Der Koeffizient ist *bei gleichen anderen Variablen*. Rohe Gruppenmittelwerte können anders aussehen.

## D. Interaktion interpretieren

> „`x` = Steigung **nur in der Referenzgruppe**. `gruppeG` = Gruppenunterschied **nur am Referenzpunkt** x = 0 (bzw. Zentrierwert). `x:gruppeG` = um so viel ist die Steigung in G **anders** als in der Referenz → Steigung in G = β_x + β_x:G. Der Gruppenunterschied bei x = c ist β_G + β_x:G · c.“

Warnungen: Haupteffekte nicht isoliert interpretieren · Referenzpunkt angeben · nur im Datenbereich (gemeinsame Überlappung?) · besser grafisch darstellen.

## E. „Ist das Modell gut?“ (Güte)

Geh die **4 Fragen** durch (Arbeitsblatt 02b):

1. **Sampling ok?** Rhat ≈ 1 (< 1.1), n_eff > 2000 gut (< 400 schlecht), mcse < 5 % von mad, Traceplots als „Rauschen“.
2. **Reproduziert es die Daten?** mean_PPD ≈ Mittelwert von y, `diagnose_density`/`diagnose_fit`.
3. **Systematische Fehler?** Residuen ohne Muster (keine Banane, kein Trichter), y vs. ŷ auf der Diagonale.
4. **Generalisierung?** Testdaten: RMSE/MAE/Skill (linear) bzw. Brier/LogLoss/Skill + AUC (logistisch). Test ≈ Training → kein Overfitting.

Plus: R² (moderat/hoch?), LOO. **Mehrere Kriterien kombinieren**, keines allein ist Beweis.

## F. Modelle vergleichen

> „Modell B ist besser: höheres R² (…→…), kleinerer Testfehler (…), höherer Skill/AUC, und im LOO-Vergleich liegt A um |elpd_diff| = … zurück, das sind ≈ k × se_diff (> 2) → deutlich. Kein Overfitting, da Test ≈ Training. Fachlich plausibel, weil …“

- `|elpd_diff| < 2·se_diff` → **kein überzeugender Unterschied** → einfacheres/billigeres Modell ist vertretbar (beweist aber keine Gleichwertigkeit).
- Voraussetzung: **gleiche y-Variable**, **gleiche Datenzeilen**.

## G. Effektgröße

- **Linear (`effectsize`)**: f² = (R²_voll − R²_ohne)/(1 − R²_voll). Richtwerte 0.02 / 0.15 / 0.35. f² ist **relativ zur unerklärten Varianz**, kein „% erklärt“.
- **Logistisch (`effectsize`)**: ΔAIC/ΔDeviance beim Weglassen. Größerer Anstieg = wichtigere Variable.
- Immer: Variablen werden **mit ihren Interaktionen bzw. quadratischen Termen** entfernt (Df beachten). **Korrelierte** Variablen teilen sich Erklärung. Rohe Koeffizienten sind wegen der Einheiten **nicht** vergleichbar. Statistisch ≠ praktisch relevant.

## H. Kausalität: „Können wir schließen, dass X Y verursacht?“

> „Nein, nicht allein aus diesen Beobachtungsdaten. Der Koeffizient beschreibt eine (bedingte) **Assoziation**. Mögliche **Confounder** wie [konkret nennen] könnten X und Y gleichzeitig beeinflussen. Selbstselektion bzw. fehlende Zufallszuteilung. Um es kausal zu prüfen: **randomisiertes Experiment** (A/B-Test/DoE), bei dem X gezielt und zufällig variiert wird, während andere Faktoren konstant bleiben.“

Begriffe: **Confounder** (beeinflusst X und Y → kontrollieren) · **Mediator** (liegt auf dem Wirkungsweg X → M → Y → nicht kontrollieren, wenn die Gesamtwirkung gefragt ist) · **Collider** (wird von X und Y beeinflusst → nicht darauf selektieren/kontrollieren).

## I. Repräsentativität / Datenherkunft

Checkliste: **Wer/was** (Population, Auswahlverfahren, zufällig?) · **Wann** (Zeitraum, Saison, Änderungen) · **Wie gemessen** (Messfehler, Selbstauskunft, Prüfverfahren) · **Was fehlt** (Ausschlüsse, NAs, Survivorship) · **Unabhängigkeit** (Chargen, wiederholte Messungen) · **Basisrate** (Oversampling?).

## J. Vorhersage: epred vs. predict

> „Für den **Durchschnitt** vergleichbarer Fälle: `posterior_epred` (nur Unsicherheit der Koeffizienten, schmal). Für einen **einzelnen** neuen Fall: `posterior_predict` (zusätzlich der Fehlerterm ε bzw. σ, breit). Bei exakt bekannten Koeffizienten schrumpft epred auf einen Punkt, predict bleibt ≈ ±2σ breit.“

## K. Entscheidung mit Kosten

> „Beste Vorhersage ≠ beste Entscheidung. Bei asymmetrischen Kosten (Unterschätzen kostet a, Überschätzen b) ist das **a/(a+b)-Quantil** der posterior_predict-Verteilung optimal. Allgemein: erwartete Kosten über alle Samples berechnen und minimieren.“

## L. Cutoff (logistisch)

- „Max. 1 von 4 Defekten übersehen“ → FNR ≤ 0.25 ⇔ TPR ≥ 0.75 → in `plotlogrates` dort ablesen, wo TP = 0.75.
- „Wie viele echte Positive erkannt?“ → TPR × Anzahl Positive. „Wie viele Negative falsch markiert?“ → FPR × Anzahl Negative.
- Kosten = c_FP·FP + c_FN·FN (+ c_TP·TP …) → minimieren. **Accuracy ist bei unausgeglichenen Klassen ungeeignet.**
- Faustregel bei gut kalibriertem Modell: markieren, wenn p > c_FP / (c_FP + c_FN).
- Für Entscheidungen **Testdaten** verwenden (`newdata=`).

## M. Train/Test-Split & Zukunft

> „Ein **zufälliger** Split ist zu optimistisch, wenn Beobachtungen zeitlich/gruppiert zusammenhängen (gleiche Charge, Woche, Person). Test dann ≈ Training. Für Vorhersagen in die Zukunft: **zeitlicher Split** (früher trainieren, später testen). Für neue Gruppen (Maschinen/Standorte): **gruppierter Split** (Leave-one-group-out).“

## N. Drift / Monitoring

> „Wenn sich Prozesswerte ändern (Kalibrierung, neue Bedingungen): **Covariate Shift** (Werte außerhalb des Trainingsbereichs → Extrapolation) und/oder **Concept Drift** (Zusammenhang selbst ändert sich). Monitoring: regelmäßig neue gelabelte Daten → Brier/LogLoss/AUC/RMSE vs. Referenz, Kalibrierung je Gruppe, TPR/FPR beim Cutoff, Verteilung der Eingangsvariablen vs. Training; bei Verschlechterung neu trainieren. Eine **stabile Gesamtrate** beweist nichts, weil sich Fehler ausgleichen können.“

## O. Extrapolation

> „Das Modell wurde nur mit X zwischen [min] und [max] trainiert. Für [Wert außerhalb] extrapoliert es. Ein enges Koeffizientenintervall zeigt nur die Unsicherheit **unter der Annahme**, dass der (lineare) Zusammenhang dort weiter gilt. Plausibel wären auch Sättigung oder ein Umkippen. → Daten im Zielbereich sammeln.“
