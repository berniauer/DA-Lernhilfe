# Kapitel 7: Interaktionen, Referenzpunkte & Nichtlinearität

> Quelle: Arbeitsblatt 05 „Interaktionen“ · Verständnisaufgaben 20–22 · Beispielklausur Abschnitt 3–5

## Lernziele
- Interaktionsmodelle schreiben (`*` vs. `:`) und alle Koeffizienten korrekt interpretieren
- Rolle des **Referenzpunkts** (Zentrierung) verstehen
- Steigungen/Unterschiede für beliebige Gruppen und Werte ausrechnen
- quadratische Terme und „Abweichung vom Zielwert“; Scheitelpunkt

## 1. Was ist eine Interaktion?
Ohne Interaktion: Gruppen haben **parallele** Geraden (gleiche Steigung, nur verschoben).
Mit Interaktion: Die **Wirkung von x hängt von einer anderen Variable ab** → unterschiedliche Steigungen.

```r
m = stan_glm(y ~ x * gruppe, data=df)      # = x + gruppe + x:gruppe
m = stan_glm(y ~ x1 * x2, data=df)         # metrisch × metrisch
```

## 2. Koeffizienten lesen (metrisch × Gruppe)
y = α + β₁·x + β₂·G + β₃·x·G

| Koeffizient | Bedeutung |
|---|---|
| α | y bei x = 0 in der **Referenzgruppe** |
| β₁ (`x`) | Steigung von x **nur in der Referenzgruppe** |
| β₂ (`gruppeG`) | Unterschied G − Referenz **nur bei x = 0** (Referenzpunkt!) |
| β₃ (`x:gruppeG`) | um so viel ist die **Steigung** in G anders |

- Steigung in G = **β₁ + β₃**
- Unterschied G − Ref bei x = c: **β₂ + β₃·c**

**Beispiel Wärmepumpe (Probeklausur B):** `temp5` −1.58, `daemmungneu` −15.25, `temp5:daemmungneu` +1.05
→ Steigung neu = −0.53 kWh/°C; Unterschied bei 0 °C (temp5 = −5) = −15.25 − 5.25 = −20.5 kWh.

## 3. Der Referenzpunkt (Verständnisaufgabe 20/21)
- Ohne Zentrierung ist β₂ der Gruppenunterschied bei x = 0, eventuell weit außerhalb der Daten (Alter 0, 0 m²) → sinnlos oder riesig mit großer Unsicherheit.
- **Zentrieren** (x − Referenzwert) verschiebt den Punkt, an dem β₂ gemessen wird. Das Modell selbst (Vorhersagen) ändert sich **nicht**, nur die Bedeutung der Haupteffekte.
- Darum: „Der Haupteffekt hat sich durch die Interaktion geändert“ ist meistens eine Änderung der **Bedeutung**, nicht der Wirkung.

## 4. metrisch × metrisch
y = α + β₁x₁ + β₂x₂ + β₃x₁x₂ → Steigung von x₁ = β₁ + β₃·x₂.
Beispiel: Werbebudget × Saison: Der Werbeeffekt ist je nach Temperatur unterschiedlich. Interpretieren am besten mit **2–3 konkreten Werten** von x₂ (z. B. Mittelwert ± 1 SD) und grafisch.

## 5. Darstellen
```r
nd = expand.grid(temp5=seq(-17, 13, 1), daemmung=c("alt","mittel","neu"), flaeche130=0, smart=0)
nd$pred = predict(m3, newdata=nd)
ggplot(nd, aes(temp5+5, pred, color=daemmung)) + geom_line()
```
Nur im **gemeinsamen Datenbereich** interpretieren (gibt es neue Häuser bei −12 °C?).

## 6. Wann ist eine Interaktion „echt“? (Verständnisaufgabe 22)
- Intervall von β₃ schließt 0 aus **und** Modellvergleich (LOO) zeigt Verbesserung **und** fachlich plausibel.
- Logistische Regression: Auf der **Wahrscheinlichkeitsskala** sehen Effekte je nach Basisrisiko unterschiedlich aus, **auch ohne Interaktion** (S-Kurve). Das ist keine Interaktion im Modell (Beispielklausur 4.5/5.2, Verständnisaufgabe 27).

## 7. Nichtlinearität: quadratische Terme & Zielwerte
Wenn es ein **Optimum** gibt (Prozessfenster, Dünger, Arbeitsstunden), reicht linear nicht.

```r
df$pressure2 = (df$pressure - 75)^2           # quadratische Abweichung vom Zielwert
m2 = stan_glm(defect ~ pressure + pressure2 + ..., family=binomial, data=df)
# alternativ: y ~ x + I(x^2)  oder  y ~ poly(x, 2)  oder  splines::ns(x, 3)
```

- β₂ > 0 → U-Form (Minimum); β₂ < 0 → umgekehrtes U (Maximum).
- **Scheitelpunkt** von β₁·x + β₂·(x − c)²: **x\* = c − β₁/(2β₂)**. Das Minimum liegt also nicht unbedingt beim Zielwert c!
- Effektgröße: linearer und quadratischer Teil gehören zusammen (effectsize: Df = 2).
- Rohkoeffizienten der quadratischen Terme hängen stark von der Einheit ab (Sekunden²!).
- An den Rändern **extrapolieren** quadratische Terme schnell extrem.

**Erkennen:** U-förmige Residuen / Banane in y-vs-ŷ, U-förmige geglättete Kurven (Beispielklausur Abschnitt 3), Vorzeichen eines linearen Koeffizienten passt nicht zum Fachwissen.

## ⚠️ Typische Fallen
- Haupteffekt bei Interaktion als „Gesamteffekt“ interpretieren.
- Steigung der Nicht-Referenzgruppe = nur der Interaktionskoeffizient (falsch: β₁ + β₃).
- Vergessen, dass der Gruppenunterschied vom x-Wert abhängt.
- Bei logistischen Modellen „unterschiedliche Kurven“ als Interaktion deuten.

➡️ Quiz: [quiz/07-Interaktionen.md](../quiz/07-Interaktionen.md) · Coding: [coding-uebungen/04-Interaktionen.md](../coding-uebungen/04-Interaktionen.md)
