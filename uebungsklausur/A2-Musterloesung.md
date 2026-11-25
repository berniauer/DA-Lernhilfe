# Musterlösung: Beispielklausur WS26/27 (Halbleiter-Defekte)

> Die Lösung ist von mir (Claude) auf Basis der Arbeitsblätter und der offiziellen Lösungshinweise zu den 30 Verständnisaufgaben ausgearbeitet. Es ist **keine offizielle Lösung** des Lehrenden.
> Aufbau je Frage: **Kurzantwort** (das, was in der Klausur mindestens dastehen sollte) → **Begründung/Details** → ⚠️ **Falle**.
> Zahlen, die aus Diagrammen abgelesen sind, sind mit „≈“ markiert.

---

## Vorab: drei Dinge, die man in der Klausur sofort erkennen muss

1. **Die Übersicht (`info(df)`) zeigt nur die Trainingsdaten**: Maschinen 738+849+683+674+556 = **3500**, Schichten 1768+1143+589 = **3500**, `neg0` bei `defect` = **2622** Nullen → **878 Defekte** (= 25 %).
2. **Die Tabellen mit `Df / Deviance / AIC` sind die Ausgabe von `effectsize()`**. Bei einem *logistischen* Modell zeigt `effectsize()` kein R²/f², sondern: Modell neu rechnen ohne diese Variable → Deviance und AIC. **Je stärker der AIC steigt, wenn eine Variable fehlt, desto wichtiger ist sie** (die Tabelle ist aufsteigend nach AIC sortiert, die wichtigste Variable steht unten).
3. **Logistische Koeffizienten stehen auf der Logit-Skala (log-odds)**. Interpretation über `exp(β)` als **Odds-Ratio** (Chancenverhältnis), *nicht* als Wahrscheinlichkeitsänderung.

---

## 1. Übersicht über den Datensatz

### 1.1 Welche Informationen über Entstehung und Auswahl der Daten brauchen wir?

**Kurzantwort:** Wie, wann, wo und welche Einheiten ausgewählt wurden, und wie „Defekt“ festgestellt wurde. Nur dann wissen wir, ob die 3500 (bzw. 5000) Einheiten den normalen Produktionsbetrieb abbilden.

**Konkret nachfragen:**
- **Zeitraum:** Welche Wochen/Monate? Saisonale Effekte (Luftfeuchtigkeit hängt vom Wetter ab), Wartungen, Kalibrierungen, neue Materialchargen in dem Zeitraum?
- **Auswahlverfahren:** Alle Einheiten oder eine Stichprobe? Zufällig? Oder nur Einheiten, die ohnehin geprüft wurden (z. B. weil sie auffällig waren)? Die Defektrate von **25 %** ist für einen Produktionsprozess hoch. Wurden Defekte bewusst überrepräsentiert (Oversampling)? Dann stimmen die vorhergesagten Wahrscheinlichkeiten für den Betrieb nicht (Kalibrierung!).
- **Abdeckung:** Sind alle Maschinen, Schichten, Produkttypen bzw. Rezepte im richtigen Verhältnis vertreten? Nachtschicht hat nur 589 Einheiten. Läuft nachts weniger, oder fehlen Daten?
- **Messung:** Wie und wann wird `defect` bestimmt (Prüfverfahren, Fehlerrate der Prüfung)? Wie zuverlässig und kalibriert sind die Sensoren (Druck, Temperatur …)? Wann genau wird gemessen?
- **Bereinigung:** Es gibt `na = 0` überall. Wurden Zeilen mit fehlenden Werten vorher entfernt? Wurden Ausreißer gefiltert oder Ausschuss früherer Schritte ausgeschlossen (Survivorship)?
- **Unabhängigkeit:** Stammen viele Einheiten aus derselben Charge/demselben Wafer? Dann sind die Beobachtungen nicht unabhängig (Voraussetzung der Regression).
- **Betriebszustand:** Waren das normale Produktionsbedingungen oder Versuchsläufe mit absichtlich extremen Einstellungen?

⚠️ **Falle:** „Es gibt keine NAs, also sind die Daten gut“. Fehlende NAs sagen nichts über Repräsentativität.

---

## 2. Erstes Modell: Vorfragen

### 2.1 Warum könnte das Modell bei einer **neuen Produktionsanlage** schlecht vorhersagen?

**Kurzantwort:** Das Modell hat nur die Maschinen M1–M5 gesehen und für jede einen eigenen Koeffizienten gelernt. Für eine neue Anlage M6 gibt es keinen Koeffizienten, und ihre Eigenschaften können ganz anders sein.

**Details:**
- `machine` ist laut `effectsize(m1)` die **wichtigste Variable** (AIC steigt ohne sie um ≈ 160). Die Maschinenunterschiede sind also groß. Eine neue Maschine kann irgendwo (oder außerhalb) dieses Spektrums liegen.
- Neue Anlage = andere Kalibrierung, anderes Prozessfenster, andere Wertebereiche → **Extrapolation** und **Verteilungsverschiebung** (Distribution Shift).
- Die Zusammenhänge selbst können sich unterscheiden (z. B. reagiert die neue Anlage empfindlicher auf Feuchtigkeit). Das Modell nimmt aber für alle Maschinen dieselben Steigungen an (keine Interaktionen).
- Prüfen ließe sich das mit **Leave-one-machine-out**: auf 4 Maschinen trainieren, auf der 5. testen.

### 2.2 Konsequenz, wenn eine Variable erst **nach dem Vorhersagezeitpunkt** gemessen wird?

**Kurzantwort:** **Data Leakage.** Das Modell nutzt Information, die es im Einsatz nicht hat. Train/Test sieht dann zu gut aus, aber im Betrieb ist das Modell unbrauchbar (die Variable fehlt) oder viel schlechter.

**Details:** Eine später gemessene Variable kann sogar eine **Folge** des Defekts sein (umgekehrte Kausalität, z. B. „Nacharbeitszeit“). Sie „verrät“ das Ergebnis. Regel aus Aufgabe 25: *Als Prädiktoren dürfen nur Informationen verwendet werden, die zum Vorhersagezeitpunkt bekannt sind.*

### 2.3 Zusammenhang Druck ↔ Defektrate

**a) Kausal?** **Nein**, nicht ohne Weiteres. Es sind Beobachtungsdaten (kein Experiment). Die Korrelation von 0.41 bzw. der positive Koeffizient zeigt eine **Assoziation**.
- `pressure` korreliert mit `temperature` (0.63), `line_speed` (0.32) und `exposure_time` (−0.28). Ein Teil des Zusammenhangs kann über diese Variablen laufen.
- Es kann **unbeobachtete Störgrößen** (Confounder) geben: Materialcharge, Verschleiß, Rezeptwahl.
- Auch der Koeffizient im Modell ist nur ein **bedingter Vergleich** („Einheiten mit gleicher Temperatur, Maschine … und 1 mTorr mehr Druck“), keine Intervention „Druck um 1 erhöhen“.

**b) Rolle von `machine` und `shift`:** mögliche **Confounder**. Sie können sowohl den Druck als auch die Defektrate beeinflussen. Beispiel: M4/M5 laufen mit höherem Druck *und* haben aus anderen Gründen (Alter, Verschleiß) mehr Defekte. Dann sieht man einen Druck-Defekt-Zusammenhang, der eigentlich ein Maschineneffekt ist. Analog für die Nachtschicht (andere Einstellungen, weniger Personal). Weil beide **vor** der Druckeinstellung feststehen (keine Mediatoren), ist es sinnvoll, sie im Modell zu berücksichtigen. Möglich ist auch eine **Effektmodifikation**: Der Druck wirkt je Maschine unterschiedlich (→ Interaktion `pressure:machine` prüfen).

**c) Wie kausal prüfen?** **Kontrolliertes Experiment** (Design of Experiments / A/B-Test): Druckniveaus **zufällig** zuteilen, innerhalb jeder Maschine und Schicht (Blockbildung), alle anderen Parameter konstant halten, genug Einheiten je Stufe, Defektrate vergleichen. Notfalls ein Vorher/Nachher-Vergleich mit Kontrollmaschinen, bei denen der Druck nicht geändert wird.

---

## 2. Erstes Modell: Interpretation

### 2.4 Basisfall?

**Kurzantwort:** Maschine **M1**, **Tagschicht (Day)** und alle metrischen Variablen **= 0**: Druck 0 mTorr, 0 °C, 0 % Feuchte, 0 s Belichtung, 0 mm/s Geschwindigkeit.

**Details:** Dieser Basisfall liegt **weit außerhalb der Daten** und ist physikalisch sinnlos. Der Intercept −24.05 (p ≈ 0.00000000004) ist deshalb nicht inhaltlich interpretierbar. Abhilfe: **Zentrieren**, z. B. `pressure - 75`, `temperature - 22.5` … Dann wäre der Basisfall „M1, Tagschicht, alle Prozesswerte am Zielwert“ (genau so wurde es in den Arbeitsblättern gemacht, z. B. `year2k`, `Height170`).

⚠️ Referenzgruppen sind die **ersten Faktorlevels** (alphabetisch: M1, Day). Darum fehlen `machineM1` und `shiftDay` in der Tabelle.

### 2.5 Zwei metrische Koeffizienten interpretieren

Allgemeines Schema: *„Bei ansonsten gleichen Werten (gleiche Maschine, Schicht und übrige Prozesswerte) ist bei +1 Einheit X der Logit um β höher, d. h. die **Chance (Odds)** auf einen Defekt ist um den Faktor exp(β) höher.“*

| Koeffizient | pro Einheit | sinnvollere Schrittweite |
|---|---|---|
| `pressure` 0.08 [0.06; 0.10] | +1 mTorr → Odds × e^0.08 ≈ **1.08** (+8 %) | +1 SD (8.3 mTorr): × e^(0.08·8.28) ≈ **1.94**, also Odds etwa **verdoppelt** |
| `exposure_time` −5.20 [−7.14; −3.30] | +1 s → Odds × e^−5.2 ≈ 0.006 (sinnlos, die Spannweite ist nur 0.5 s!) | +0.1 s: × e^−0.52 ≈ **0.59** → Odds **−41 %** |
| `temperature` 0.46 | +1 °C → × **1.58** | |
| `humidity` 0.11 | +1 % → × **1.12** | +5 %-Punkte: × e^0.55 ≈ 1.73 |
| `line_speed` 0.05 | +1 mm/s → × **1.05** | +10 mm/s: × e^0.5 ≈ **1.65** |

Alle Intervalle schließen 0 aus → die Richtung ist im Modell klar.

⚠️ **Fallen:**
- „Odds steigen um 8 %“ ist **nicht** „Wahrscheinlichkeit steigt um 8 %“ bzw. „um 8 Prozentpunkte“. Wie stark sich p ändert, hängt vom Ausgangsniveau ab (S-Kurve).
- Die Größe des Koeffizienten hängt von der **Einheit** ab (exposure_time in Sekunden, Spannweite 0.5 s). −5.20 heißt nicht „wichtigste Variable“.
- Keine Kausalaussage („Druck erhöhen *verursacht* …“).

### 2.6 Ist M1 die Maschine mit der geringsten und M5 die mit der größten Defektrate?

**Kurzantwort:** **Nicht eindeutig.**
- **M1 vs. M2:** `machineM2` = 0.09 mit 95 %-HDI **[−0.27; 0.40]**, das Intervall schließt 0 ein. M2 könnte genauso gut etwas *besser* als M1 sein. Wir können M1 und M2 nicht unterscheiden.
- **M5 vs. M4:** M5 = 1.59 [1.24; 1.96], M4 = 1.43 [1.08; 1.75]. Die Intervalle überlappen stark, M5 ist also nicht klar die schlechteste. Sauber prüfen: die Posterior-Verteilung der **Differenz** berechnen:
  ```r
  s = as.matrix(m1)
  d = s[, "machineM5"] - s[, "machineM4"]
  hdi(d); mean(d > 0)   # Wahrscheinlichkeit, dass M5 > M4
  ```
  (Das Differenz-Intervall ist enger als der „Überlappungs-Blick“ vermuten lässt, weil die Samples korreliert sind. Siehe Verständnisaufgabe 12.)
- Eindeutig ist nur: **M3, M4, M5 haben höhere Defekt-Odds als M1/M2** (Intervalle weit weg von 0).

**Wichtiger Zusatz:** Das sind **bedingte** Vergleiche, *bei gleichen Prozesswerten und gleicher Schicht*. Die **rohe** Defektrate je Maschine (`table(df$machine, df$defect)`) kann anders aussehen, wenn Maschinen z. B. mit anderen Drücken oder öfter in der Nachtschicht laufen (Simpson-artiger Effekt). „Defektrate“ im Wortsinn wäre also eine andere Frage.

### 2.7 Koeffizient Nachtschicht

**Kurzantwort:** `shiftNight` = 1.41 [1.14; 1.69] → bei gleicher Maschine und gleichen Prozesswerten sind die **Odds** auf einen Defekt in der Nachtschicht etwa **e^1.41 ≈ 4.1-mal** so hoch wie in der Tagschicht (HDI: ×3.1 bis ×5.4). Abendschicht: ×e^0.80 ≈ 2.2.

**Welche Aussagen lassen sich treffen / nicht treffen?**
- ✅ Klare Tendenz: Nachtschicht ist mit deutlich mehr Defekten **assoziiert** (Intervall weit über 0).
- ❌ Nicht „4-mal so wahrscheinlich“. Beispiel: Tag p = 10 % → Odds 0.111 → ×4.1 = 0.456 → p ≈ **31 %**; Tag p = 25 % → Odds 0.333 → 1.37 → p ≈ **58 %**.
- ❌ Nicht kausal: Mögliche Gründe sind Müdigkeit, weniger/anders qualifiziertes Personal, weniger Aufsicht, andere Produkte oder Wartungsfenster in der Nacht, Umgebungsbedingungen. Die Daten können das nicht trennen.
- Nachtschicht hat mit 589 die wenigsten Einheiten; das Intervall ist trotzdem eng genug.

### 2.8 Güte des Modells

Systematisch nach den **vier Fragen** (Arbeitsblatt 02b):

1. **Sampling:** ✅ Rhat = 1, n_eff > 2000 überall (Log-Posterior 1639, ok), mcse sehr klein (< 5 % von mad) → Berechnung vertrauenswürdig.
2. **Reproduktion der Daten:** ✅ `mean_PPD` = 0.25 = beobachtete Defektrate 0.25.
3. **Erklärungskraft:** Bayes-R² = **0.37**, moderat.
4. **Vorhersagegüte / Generalisierung:**
   - **AUC 0.86** (Training) und **0.86** (Test): gute **Diskriminierung**. Bei einem zufälligen Paar (1 Defekt, 1 OK-Teil) bekommt das defekte Teil mit 86 % Wahrscheinlichkeit die höhere Prognose.
   - **Brier** 0.115 (Train) / 0.109 (Test); das Nullmodell (immer 25 % vorhersagen) hätte 0.25·0.75 = **0.1875** → **Skill ≈ 0.39 / 0.41**, also rund 40 % besser als das Nullmodell.
   - **LogLoss** 0.378 / 0.379 (Nullmodell ≈ 0.56).
   - Testwerte sind **nicht schlechter** als Trainingswerte → kein Hinweis auf Overfitting (für *zufällige* Splits, siehe 2.9).

**Aber:** Abschnitt 3 zeigt nicht-lineare (U-förmige) Zusammenhänge, die Modell 1 nicht abbilden kann → **systematischer Modellfehler**. Gute Kennzahlen ≠ korrektes Modell. Nicht gezeigt sind Kalibrierungsplot, Hinkley-Test und Pareto-k.

### 2.9 Warum kann ein **zufälliger** Train/Test-Split zu optimistisch sein?

**Kurzantwort:** Bei zufälliger Aufteilung landen Einheiten aus **derselben Zeit, Charge und Maschinenkalibrierung** sowohl im Training als auch im Test. Der Test prüft dann nur „mehr vom Gleichen“, nicht die Zukunft.

**Details:**
- Zeitlich benachbarte Einheiten sind sich sehr ähnlich (**Autokorrelation**: gleiche Materialcharge, gleicher Verschleiß, gleiches Wetter).
- Zukünftige Wochen bringen **Drift**: neue Chargen, Kalibrierungen, Jahreszeiten. Das kommt im zufälligen Test nicht vor.
- Verletzt die Unabhängigkeitsannahme → Testfehler unterschätzt den echten Zukunftsfehler.

### 2.10 Welche Aufteilung stattdessen?

**Kurzantwort:** **Zeitliche Aufteilung**: Auf früheren Wochen trainieren, auf **späteren Wochen** testen (z. B. Wochen 1–8 Training, 9–10 Test). Das bildet den späteren Einsatz nach. Besser noch rollierend: mehrfach „Vergangenheit → nächste Woche“ (Forward-Chaining).

Ergänzend: nach **Chargen** gruppiert aufteilen (eine Charge komplett in Train *oder* Test). Für die Frage „neue Maschine“: Leave-one-machine-out.

### 2.11 Funktioniert das Modell für alle Anlagen und Schichten ähnlich gut?

**Kurzantwort:** **Getrennte Auswertung je Untergruppe** auf den Testdaten: Brier/LogLoss/Skill, AUC/ROC und Kalibrierung **pro Maschine und pro Schicht** berechnen und vergleichen.

```r
for (m in levels(df_test$machine)) {
  print(m); print(prediction_metrics(m1, newdata = subset(df_test, machine == m)))
}
ROC(m1, newdata = subset(df_test, shift == "Night"))
```

Dazu: vorhergesagte vs. beobachtete Defektrate je Gruppe vergleichen (Kalibrierung), auf kleine Gruppen achten (Nacht: wenige Daten → unsichere Kennzahlen). Bei deutlichen Unterschieden Interaktionen (`machine:humidity` …) oder getrennte Modelle prüfen. Ein guter Gesamtwert kann schlechte Untergruppen verdecken (vgl. Verständnisaufgabe 9).

### Effektgröße m1 (Tabelle `effectsize(m1)`)

| entfernte Variable | ΔAIC zu `<none>` (2671.1) |
|---|---|
| exposure_time | +25.3 |
| temperature | +45.9 |
| humidity | +67.5 |
| pressure | +77.0 |
| line_speed | +105.5 |
| shift (2 Df) | +115.0 |
| **machine** (4 Df) | **+160.5** |

→ In Modell 1 tragen **Maschine** und **Schicht** am meisten zur Erklärung bei, `exposure_time` am wenigsten (obwohl sie den betragsmäßig größten Koeffizienten hat!). Alle Variablen verschlechtern das Modell deutlich, wenn man sie weglässt.

---

## 3. Defektrate abhängig von Variablen

### 3.1 Interpretation der vier Diagramme

**Kurzantwort:** Alle vier Kurven sind **U-förmig** (bei humidity eher J-förmig): Die Defektrate ist bei **mittleren** Werten am niedrigsten und steigt bei zu niedrigen **und** zu hohen Werten. Modell 1 hat aber nur **lineare** Terme (auf der Logit-Skala). Es kann pro Variable nur „mehr → mehr Defekte“ oder „mehr → weniger Defekte“ abbilden. Die Koeffizienten von m1 sind deshalb eine Art **Durchschnittssteigung** über einen U-förmigen Zusammenhang. Das Modell ist **fehlspezifiziert**, und wir sollten Nichtlinearität modellieren (→ Modell 2).

**Warum haben die m1-Koeffizienten genau diese Vorzeichen?** Weil die meisten Daten auf **einem Ast** des U liegen:

| Variable | Minimum der Kurve | Mittelwert der Daten | → meiste Daten auf … | Vorzeichen in m1 |
|---|---|---|---|---|
| exposure_time | ≈ 1.13 s | 1.05 s | fallendem Ast | **negativ** (−5.20) |
| pressure | ≈ 65–70 | 75.5 | steigendem Ast | positiv |
| temperature | ≈ 22 | 22.65 | (eher) steigendem Ast | positiv |
| humidity | ≈ 42–44 | 44.6 | steigendem Ast | positiv |

**Kann man den Schluss verlässlich ziehen?** Nur **eingeschränkt**:
- Die Kurven sind **marginal** (je eine Variable allein). Wegen der Korrelationen (pressure–temperature 0.63, exposure–line_speed −0.68) kann ein Teil der U-Form von anderen Variablen kommen (Confounding).
- **Geglättete Kurven an den Rändern** beruhen auf sehr wenigen Datenpunkten (z. B. humidity 60 % ist > 3 SD vom Mittel). Es gibt kein Unsicherheitsband, und die Ränder sind wenig verlässlich.
- Nur Testdaten (1500 Einheiten).
- Aber: Es passt zum **Fachwissen** (stabiles Prozessfenster). Prüfen über Partial-Residual-Plots, Residuen und **Modellvergleich** (Abschnitt 4 bestätigt es deutlich).

---

## 4. Zweites Modell mit „Referenzpunkt“

### 4.1 Vergleich mit Modell 1

| Kriterium | m1 | m2 | besser |
|---|---|---|---|
| Sampling | ok | ok (Rhat 1, n_eff > 1600) | — |
| Bayes-R² | 0.37 | **0.49** | m2 |
| AUC Training / Test | 0.86 / 0.86 | **0.905 / 0.917** | m2 |
| Brier Test | 0.109 | **0.089** | m2 |
| LogLoss Test | 0.379 | **0.294** | m2 |
| Skill Test | 0.41 | **0.52** | m2 |
| AIC (`<none>`) | 2671.1 | **2226.6** (−444) | m2 |
| LOO `elpd_diff` | **−222.8** (se 24.0) | 0 | m2 |

- `loo_compare`: |−222.8| ≈ **9.3 × se_diff** → weit über der Faustregel 2×se → m2 sagt neue Daten **deutlich** besser vorher.
- Nebenbei: ΔAIC/2 = 444.5/2 ≈ 222 ≈ elpd-Differenz. Beide Maße erzählen dieselbe Geschichte (looic = −2·elpd).
- Testwerte sind sogar leicht **besser** als Trainingswerte → **kein Overfitting** trotz 5 zusätzlicher Parameter.
- Die linearen Koeffizienten bleiben fast gleich. Maschinen- und Schichtkoeffizienten werden etwas größer (in logistischen Modellen typisch, wenn man erklärende Variablen ergänzt).

### 4.2 Ist Modell 2 besser geeignet?

**Ja.** Alle Kriterien zeigen in dieselbe Richtung (Fit, Vorhersage auf Testdaten, LOO, AIC), und m2 bildet das **fachlich plausible** Prozessfenster ab, das Abschnitt 3 nahelegt. Einschränkungen: komplexer zu kommunizieren. Die Zielwerte (75, 22.5 …) sind fest vorgegeben und nicht aus den Daten geschätzt. Der zufällige Split ist weiterhin zu optimistisch (2.9).

**Bonus-Einsicht:** Linearer + quadratischer Term zusammen ergeben eine Parabel (auf Logit-Skala), deren **Minimum nicht beim Zielwert** liegen muss: x* = Ziel − β_linear / (2·β_quadr).
- exposure_time: 1.05 − (−5.48)/(2·42) ≈ **1.115 s** (passt zum Minimum ≈ 1.13 im Diagramm!)
- humidity: 45 − 0.13/(2·0.02) ≈ **41.8 %**
- temperature: 22.5 − 0.45/(2·0.18) ≈ **21.3 °C**

### 4.3 Welche Abweichung ist besonders stark mit Defekten verbunden?

**Kurzantwort:** Der **rohe** Koeffizient führt in die Irre. `exposure_time2` = 42 ist nur deshalb so groß, weil die Belichtungszeit in Sekunden gemessen wird und Abweichungen winzig sind (SD = 0.07 s → quadriert 0.0049). Vergleichbar wird es erst über eine **gemeinsame Skala**:

Logit-Zuwachs bei Abweichung um **1 SD** vom Zielwert (β₂ · SD²):

| Term | β₂ | SD | β₂·SD² |
|---|---|---|---|
| pressure2 | 0.01 (gerundet! [0.00; 0.01]) | 8.28 | ≈ 0.69 (sehr unsicher wegen Rundung) |
| humidity2 | 0.02 | 4.59 | ≈ 0.42 |
| temperature2 | 0.18 | 1.13 | ≈ 0.23 |
| exposure_time2 | 42.0 | 0.07 | ≈ 0.21 |
| line_speed2 | 0.00 (gerundet) | 15.58 | nicht bestimmbar |

Laut `effectsize(m2)` (linear + quadratisch zusammen) ist **line_speed** (ΔAIC +251) am wichtigsten, dann **humidity** (+159), machine, pressure (+140). In den Diagrammen aus Abschnitt 3 zeigen **Druck und Belichtungszeit** die ausgeprägteste U-Form.

**Gute Klausurantwort:** „Aus den Rohkoeffizienten nicht ablesbar (Einheiten; Rundung auf 2 Stellen: `line_speed2` und `pressure2` zeigen 0.00/0.01). Man muss auf eine gemeinsame Skala bringen (pro SD, z-Skalierung) oder `info(m2, digits=4)` anschauen. Nach `effectsize` tragen line_speed und humidity am meisten bei; pro SD-Abweichung scheinen Druck- und Feuchte-Abweichung am stärksten.“

### 4.4 Was bei der Effektgröße berücksichtigen?

- `effectsize(m2)` entfernt **linearen und quadratischen Teil gemeinsam** (deshalb `Df = 2`). Wir messen also den Beitrag der **ganzen Variable**, nicht nur den der Abweichung.
- **AIC-Differenzen** hängen von Datensatz und Modell ab. Sie sind kein „Prozent erklärte Varianz“ (bei logistischer Regression gibt es kein f²) und keine Kausalaussage.
- **Korrelierte Variablen** teilen sich die Erklärung: Fehlt `exposure_time`, übernimmt die stark korrelierte `line_speed` (r = −0.68) einen Teil → der Beitrag von `exposure_time` wirkt kleiner, als er „real“ ist.
- Unterschiedliche **Df**: machine (4 Df) wird durch AIC stärker bestraft.
- **Statistische ≠ praktische Bedeutung:** Wichtig für den Betrieb ist auch, welche Größe man überhaupt **steuern** kann (line_speed leicht, humidity aufwendiger).

### 4.5 Annahme beider Modelle zu Luftfeuchtigkeit × Maschine?

**Kurzantwort:** **Keine Interaktion**: Beide Modelle nehmen an, dass die Luftfeuchtigkeit auf **allen Maschinen gleich** wirkt (gleiche Steigung bzw. gleiche Parabel auf der Logit-Skala). Die Maschine verschiebt die Kurve nur nach oben oder unten (additiv auf der Logit-Skala). Ob das stimmt, könnte man mit `humidity:machine` (bzw. `humidity2:machine`) und einem Modellvergleich prüfen.

⚠️ Auf der **Wahrscheinlichkeitsskala** sehen die Kurven trotzdem unterschiedlich aus (siehe Abschnitt 5). Das kommt von der nichtlinearen Logit-Umrechnung, nicht von einer Interaktion (Verständnisaufgabe 27).

---

## 5. Zusammenhang mit Luftfeuchtigkeit

### 5.1 Unterschied Modell 1 vs. Modell 2

- **Modell 1:** monoton steigende Kurve. „Je trockener, desto besser“, das Optimum läge bei 30 % oder darunter (Extrapolation!).
- **Modell 2:** U-/J-Form. Es gibt einen **optimalen Bereich** (ca. 35–48 %, Minimum um ≈ 40–42 %). Darüber steigt die Defektrate steil an (bei 60 % fast alles defekt), darunter leicht.
- Die beiden Modelle führen also zu **widersprüchlichen Empfehlungen** im unteren Bereich. Da m2 klar besser ist (LOO, Test), glauben wir eher m2.

### 5.2 Unterschied Maschine 1 vs. Maschine 5

- M5 liegt bei **jeder** Feuchtigkeit und Schicht deutlich **höher** (Logit-Verschiebung ≈ +1.6/+1.7 → Odds × ≈ 5).
- Weil keine Interaktion modelliert ist, ist die Form auf der Logit-Skala gleich. Auf der Wahrscheinlichkeitsskala wirkt sie anders: Bei M1 ist der Bereich 35–50 % „flach nahe 0“, bei M5 sieht man das U deutlich, und auch zu trockene Luft (30 %) ist relevant (Nacht ≈ 50 %).
- Die **Schichtunterschiede** sind bei M5 in Prozentpunkten viel größer (bei M1 liegen die Linien im Optimum fast aufeinander).
- Bei M5 ist die Prozessführung also besonders kritisch (enges Fenster, Nachtschicht vermeiden oder besser überwachen).

### 5.3 Empfehlung für die Luftfeuchtigkeit

**Kurzantwort:** Luftfeuchtigkeit im Bereich **≈ 38–47 %** halten (Optimum ≈ 40–42 %), **über 50 % unbedingt vermeiden**, unter ≈ 35 % ebenfalls ungünstig (vor allem bei M5/Nachtschicht).

**Einschränkungen nennen:**
- Vorhersagen gelten für **mittlere** Werte der anderen Variablen. Bei anderen Kombinationen kann das Optimum verschoben sein.
- Es sind **Beobachtungsdaten**: Die Empfehlung ist plausibel, aber nicht kausal belegt → mit kontrolliertem Versuch bestätigen.
- Bei 30 % und 60 % gibt es **kaum Daten** (Mittel 44.6, SD 4.6) → die Kurvenenden sind unsicher bzw. extrapoliert. Unsicherheitsbänder fehlen im Diagramm.

---

## 6. Cutoff

> „Maximal einen von vier tatsächlichen Defekten falsch vorhersagen“ → **False-Negative-Rate ≤ 0.25** ⇔ **True-Positive-Rate ≥ 0.75**.

### 6.1 Welcher Cutoff?

**≈ 0.3** (abgelesen: Dort erreicht die FN-Kurve 0.25 bzw. die TP-Kurve 0.75). **Höchstens** so groß. Ein höherer Schwellwert würde mehr Defekte übersehen.

### 6.2 Wie viele tatsächliche Defekte sagen wir vorher?

**75 %** der echten Defekte (TPR = 0.75). `plotlogrates(m2)` ohne `newdata` verwendet die **Trainingsdaten**: 878 Defekte → **≈ 660** erkannt, ≈ 220 übersehen. Pro 100 echten Defekten: 75 erkannt.

### 6.3 Wie viele fehlerfreie Stücke als Defekt vorhergesagt?

FP-Rate bei Schwelle ≈ 0.3 abgelesen: **≈ 0.12–0.14**. Also werden etwa **13 von 100 fehlerfreien Stücken** fälschlich als defekt markiert. Im Training: 2622 OK-Teile × 0.13 ≈ **340 Fehlalarme**.
Pro 1000 produzierten Einheiten (250 defekt, 750 OK): ≈ 188 erkannte Defekte und ≈ 98 Fehlalarme. Von allen Alarmen sind also ≈ 2/3 echt (Precision ≈ 66 %).

⚠️ **Hinweise für volle Punkte:**
- Für die Entscheidung besser **Testdaten** verwenden: `plotlogrates(m2, newdata=df_test)` bzw. exakt mit `logistic_rates(m2, newdata=df_test)`. Mit `count=TRUE` zeigt `plotlogrates` Anzahlen statt Raten.
- Der „richtige“ Cutoff hängt eigentlich von den **Kosten** ab (übersehener Defekt vs. unnötige Nachprüfung). Die Vorgabe „max. 1 von 4 übersehen“ ist eine solche Geschäftsregel.

---

## 7. Zukunft

### 7a.1 Warum nach einer Neukalibrierung schlechtere Vorhersagen?

- **Verteilungsverschiebung (Covariate Shift):** Die typischen Prozesswerte liegen woanders, eventuell **außerhalb** des Trainingsbereichs → das Modell extrapoliert, und die quadratischen Terme können dort extrem werden.
- **Geänderte Zusammenhänge (Concept Drift):** Das optimale Prozessfenster kann sich verschieben. Die im Modell **fest eingebauten Zielwerte** (75, 22.5, 45, 1.05, 110) passen dann nicht mehr.
- Die **Maschinenkoeffizienten** beschreiben den alten Kalibrierungszustand.
- Die Kalibrierung der Wahrscheinlichkeiten (Basis-Defektrate) kann sich ändern.

### 7a.2 Welche Auswertungen regelmäßig durchführen? (Monitoring)

- Laufend **neue, gelabelte Daten** sammeln (tatsächliche Defekte) und regelmäßig (z. B. wöchentlich) **Brier/LogLoss/Skill, AUC** berechnen und mit den Werten vom Test vergleichen → Verschlechterung erkennen.
- **Kalibrierung:** vorhergesagte vs. beobachtete Defektrate (gesamt, je Risikoklasse, je Maschine und Schicht). Kalibrierungsplot (`rms::val.prob`).
- **TPR/FPR beim gewählten Cutoff**: Werden noch 75 % der Defekte erkannt?
- **Eingangsdaten überwachen:** `info()` der neuen Daten vs. Training, Anteil der Werte außerhalb des Trainingsbereichs, Mittelwerte und Streuungen je Variable (Drift-Erkennung).
- Bei Verschlechterung: **neu trainieren** (mit Daten nach der Kalibrierung), Zielwerte überprüfen.

### 7b.3 Belichtungszeit vs. Transportgeschwindigkeit: wo mehr Vorsicht?

**Kurzantwort:** Bei der **Transportgeschwindigkeit**. Laut `effectsize(m2)` steigt der AIC ohne `line_speed` um **≈ 251** (größter Wert), ohne `exposure_time` nur um **≈ 53** (kleinster Wert). Das Modell stützt sich also viel stärker auf `line_speed`. Ändert sich deren Verteilung, sind die Vorhersagen stärker betroffen.

**Ergänzend:** Die beiden Variablen sind stark korreliert (r = −0.68). Sie teilen sich Information, und die AIC-Tabelle unterschätzt deshalb den Beitrag jeder einzelnen. Ändert sich nur eine (die Korrelation bricht), ist die Aufteilung der Effekte nicht mehr verlässlich. Außerdem: `exposure_time2` hat eine sehr starke Krümmung (42). Werte außerhalb 0.79–1.3 s würden extrem extrapoliert.

### 7b.4 Ist die unveränderte Gesamtdefektrate ein Beleg für zuverlässige Vorhersagen?

**Nein.** Ein Gesamtdurchschnitt kann stimmen, obwohl die **einzelnen** Vorhersagen falsch sind: Fehler in verschiedene Richtungen gleichen sich aus (wie Verständnisaufgabe 9: Typ A überschätzt, Typ B unterschätzt → Durchschnitt passt). Das Modell könnte die Defekte den **falschen Einheiten** zuordnen (Diskriminierung verloren, AUC gesunken) oder in Untergruppen schlecht kalibriert sein. Eine stabile Gesamtrate zeigt nur, dass die **Basisrate** gleich ist.

### 7b.5 Wie prüfen, ob Modell 2 noch geeignet ist?

- **Neue gelabelte Daten** nach der Veränderung sammeln und als Testdaten verwenden: `prediction_metrics(m2, newdata=df_neu)`, `ROC(m2, newdata=df_neu)`, `brier(m2, newdata=df_neu)` → mit früheren Testwerten vergleichen.
- **Kalibrierung** auf den neuen Daten, auch **je Bereich** von exposure_time und line_speed und je Maschine/Schicht.
- Prüfen, ob die neuen Werte **im Trainingsbereich** liegen (`info(df_neu)` vs. `info(df_train)`).
- TPR/FPR beim gewählten Cutoff kontrollieren.
- Wenn schlechter: Modell mit neuen Daten **aktualisieren/neu trainieren** und mit dem alten Modell vergleichen (auf zeitlich späteren Testdaten).

---

## Häufigste Punktverluste in dieser Art Klausur

1. Odds-Ratio als Wahrscheinlichkeit („4-mal so wahrscheinlich“).
2. Koeffizienten verschiedener Einheiten direkt vergleichen („42 ist der größte Effekt“).
3. Kausale Sprache („Druck verursacht“, „Nachtschicht führt zu“) bei Beobachtungsdaten.
4. „Intervall schließt 0 ein“ ignorieren (M1 vs. M2).
5. Basisfall nicht vollständig angeben (alle Referenzgruppen **und** alle metrischen = 0).
6. Trainings- statt Testdaten für Güte/Cutoff ohne Hinweis.
7. Einen einzelnen Kennwert als Beweis nehmen, statt mehrere Kriterien zu kombinieren.
