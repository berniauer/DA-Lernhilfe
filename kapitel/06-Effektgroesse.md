# Kapitel 6: Effektgröße: Wie wichtig ist eine Variable?

> Quelle: Arbeitsblatt 04 „Effektgröße“ · Verständnisaufgaben 17–19 · daatools `effectsize()`

## Lernziele
- Statistische Sicherheit (Intervall ≠ 0) und Effektgröße unterscheiden
- **Cohens d** und **f²** berechnen und einordnen
- `effectsize()`-Ausgabe für **lineare** und **logistische** Modelle lesen
- Grenzen: Einheiten, Korrelation, praktische Relevanz

## 1. Warum Effektgröße?
- „Der Koeffizient ist klar ≠ 0“ heißt nur, dass wir uns **sicher** sind, dass es einen Zusammenhang gibt. Wie **groß und wichtig** er ist, sagt das nicht.
- Bei **sehr vielen Daten** wird auch ein winziger Effekt „sicher“ (enges Intervall). Verständnisaufgabe 17: 500 000 Personen, Unterschied 0.2 kg → sicher, aber praktisch irrelevant.
- Rohe Koeffizienten sind **nicht vergleichbar**: Sie hängen von der Einheit ab (Sekunden vs. Millisekunden, € vs. T€).

## 2. Cohens d (Unterschied zweier Gruppen)
$$d = \frac{\bar{x}_1 - \bar{x}_2}{s_{\text{gepoolt}}}$$
Unterschied der Mittelwerte **in Standardabweichungen**. Richtwerte: **0.2 klein · 0.5 mittel · 0.8 groß**.
Beispiel: Körpergröße Männer vs. Frauen ≈ 13 cm bei SD ≈ 7 cm → d ≈ 1.9 (sehr groß).

## 3. f² (Beitrag einer Variable in der Regression)
$$f^2 = \frac{R^2_{AB} - R^2_{A}}{1 - R^2_{AB}}$$
- R²_AB = Modell **mit** Variable B, R²_A = Modell **ohne** B.
- Interpretation: Anteil der **noch unerklärten** Varianz, den B zusätzlich erklärt.
- Richtwerte: **0.02 klein · 0.15 mittel · 0.35 groß**.

**Rechenbeispiel:** R² mit allen = 0.60, ohne `x` = 0.55 → f² = 0.05/0.40 = **0.125** (klein bis mittel).
⚠️ Verständnisaufgabe 18: f² = 0.125 heißt **nicht** „x erklärt 12.5 % der Varianz“. Zusätzlich erklärt sind nur 5 Prozentpunkte.

## 4. `effectsize()` lesen

### Lineares Modell
```
               Df   RSS    AIC    R2    f2
<none>             21336 3078.4 0.829
smart           1  22546 3131.5 0.819 0.057
flaeche130      1  27524 3331.0 0.779 0.290
temp5           3  60487 4114.4 0.514 1.835
```
- Jede Zeile = Modell **ohne** diese Variable (Drop-one). `<none>` = volles Modell.
- **RSS** (Residual Sum of Squares) steigt, **R2** sinkt, **f2** = Effektgröße. Sortiert nach f².
- **Df** = Anzahl entfernter Koeffizienten (Faktor mit k Levels → k−1; Interaktionen werden **mitentfernt**).

### Logistisches Modell (wie in der Beispielklausur!)
```
               Df Deviance    AIC
<none>             2647.1  2671.1
exposure_time   1  2674.4  2696.4
...
machine         4  2815.6  2831.6
```
- Kein R²/f², sondern **Deviance** und **AIC** beim Weglassen.
- **ΔAIC = AIC_ohne − AIC_<none>**: je **größer**, desto wichtiger. Die wichtigste Variable steht **unten**.
- Faktoren mit vielen Df werden durch AIC stärker bestraft (+2 pro Parameter).

## 5. Standardisierte Koeffizienten
Alternative: Variablen z-skalieren (`scale(x)`) → Koeffizient = Änderung von y pro **1 SD** von x. Bei logistisch: e^(β·SD) = Odds-Faktor pro SD. Bei quadratischen Termen: β₂·SD² (siehe Beispielklausur 4.3).

## 6. Grenzen (Verständnisaufgabe 19)
- **Korrelierte Variablen** teilen sich die Erklärungskraft. Entfernt man eine, übernimmt die andere einen Teil → beide wirken einzeln „klein“, obwohl sie gemeinsam wichtig sind.
- Effektgröße ist **modell- und datenabhängig** (andere Kontrollvariablen → andere f²).
- **Statistisch ≠ praktisch relevant**: Auch ein kleiner f² kann viel Geld bedeuten (Smart-Thermostat). Ein großer kann irrelevant sein, wenn man die Variable nicht beeinflussen kann (Wetter).
- **Keine Kausalität.**

## ⚠️ Typische Fallen
- Größten Rohkoeffizienten als „wichtigste Variable“ bezeichnen (exposure_time −5.2!).
- f² als „% erklärte Varianz“ lesen.
- Bei logistischer Ausgabe nach f² suchen. Dort zählt der AIC-Anstieg.
- Df bei Interaktionen bzw. quadratischen Termen übersehen.

➡️ Quiz: [quiz/06-Effektgroesse.md](../quiz/06-Effektgroesse.md) · R-Output: [r-output-lesen/03-effectsize.md](../r-output-lesen/03-effectsize.md)
