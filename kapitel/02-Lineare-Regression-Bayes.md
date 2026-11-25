# Kapitel 2: Lineare Regression mit Bayes (`stan_glm`)

> Quelle: Arbeitsblatt 02a · LV-Skripte 01a (Streaming-Unfälle), 02a (Wohnungspreise), 03a (StackOverflow) · Verständnisaufgaben 04–06

## Lernziele
- `stan_glm()` aufrufen, `print`/`info` lesen
- **Basisfall** (Intercept) bestimmen, metrische und Gruppen-Koeffizienten interpretieren
- Median/MAD, **HDI** und σ verstehen
- Zentrieren, log-Transformation von y
- Priors (`prior_summary`)

## 1. Das Modell
y = α + β₁x₁ + β₂x₂ + … + ε, ε ~ Normal(0, σ)

```r
library(rstanarm); library(daatools)
body$Height170 = body$Height - 170     # zentrieren!
body$Age30     = body$Age - 30
modell = stan_glm(Weight ~ Height170 + Age30 + Gender, data=body, seed=123, refresh=0)
print(modell, digits=2)   # Median + MAD_SD
info(modell)              # daatools: median, mad, HDI (lwr/upr), mcse, n_eff, Rhat
```

**Bayes-Sampling:** MC-Stan zieht per **MCMC** standardmäßig 4 Chains × 1000 Samples (nach 1000 Warmup) = **4000 Posterior-Samples**. Jeder Koeffizient hat eine ganze **Verteilung**. Ergebnisse schwanken je nach Seed leicht (2–3 %).

## 2. Ausgabe lesen
```
            Median MAD_SD
(Intercept) 64.6   0.63
Height170    0.73  0.12      (Beispielwerte aus dem Arbeitsblatt)
Age30        0.18  0.08
GenderMale   7.65  2.10
Auxiliary parameter(s):
sigma        8.0
```

| Teil | Bedeutung |
|---|---|
| **Median** | „bester“ Punktwert des Koeffizienten (robuster als Mittelwert) |
| **MAD_SD** | Streuung der Posterior-Verteilung ≈ Standardfehler; grob 95 % ≈ Median ± 2·MAD |
| **lwr/upr** (bei `info`) | Grenzen des **95 %-HDI** (Highest Density Interval: Bereich der wahrscheinlichsten Werte) |
| **sigma** | SD der Residuen: um so viel weichen **einzelne** Beobachtungen typischerweise von der Vorhersage ab (95 % in ±2σ) |
| `family: gaussian [identity]` | normale lineare Regression |
| `observations`, `predictors` | Anzahl Zeilen bzw. Koeffizienten (inkl. Intercept) |

### Basisfall (Intercept)
**Alle metrischen x = 0 und alle Faktoren auf der Referenzgruppe** (erstes Level, meist alphabetisch).
Hier: 170 cm, 30 Jahre, weiblich → 64.6 kg. Ohne Zentrieren wäre es eine 0 cm große, 0 Jahre alte Frau, also sinnlos.
- Referenzgruppe ändern: `df$x = relevel(df$x, ref="B")` oder `factor(x, levels=c(...))`.

### Metrischer Koeffizient
„Bei **sonst gleichen** Personen (gleiches Alter, gleiches Geschlecht), die sich um **1 cm** unterscheiden, unterscheidet sich das Gewicht im Mittel um **0.73 kg**.“
→ Einheit = Einheit(y)/Einheit(x). Vergleich, keine Intervention!

### Gruppenkoeffizient
„Männer sind bei gleicher Größe und gleichem Alter im Mittel **7.65 kg schwerer als Frauen** (Referenz).“
Gruppen verschieben die Gerade **parallel** (gleiche Steigung). Andere Steigungen gibt es nur mit **Interaktion** (Kapitel 7).

### 95 %-Intervall: worauf bezieht es sich? (Verständnisaufgabe 05)
- ✅ „Der **mittlere** Zusammenhang liegt mit 95 % posteriorer Wahrscheinlichkeit zwischen 1.20 und 1.80 €/m²“ (bedingt auf Modell, Prior und Daten).
- ❌ „95 % der **einzelnen** Wohnungen haben …“ (Parameterunsicherheit ≠ Streuung der Einzelfälle).
- ❌ „Vergrößern wir **eine** Wohnung um 10 m², steigen die Kosten **sicher** um 12–18 €“ (Assoziation ≠ Intervention, mittlerer Wert ≠ Einzelfall).

## 3. Transformationen
- **log(y):** bei rechtsschiefen, positiven y (Gehälter). Koeffizienten wirken **multiplikativ**: `exp(β)` = Faktor, 100·(e^β − 1) = % Unterschied. Beispiel StackOverflow: Spaces e^0.21 ≈ 1.23 → +23 % (Rohmodell). Nach Kontrolle für Land und Erfahrung nur noch ≈ +12 %.
- `exp(Intercept)` ist dann der **Median** von y im Basisfall (nicht der Mittelwert).
- **Skalieren von x** (z. B. Streams in 100 Mio, `streams_m100`) macht Koeffizienten lesbarer und ändert keine Vorhersage.
- `log1p(x)` = log(1 + x) für Werte ab 0 (abnehmender Zuwachs, z. B. Dünger).
- **Splines** `ns(x, 5)` für flexible Kurven (z. B. Saison/Woche).

## 4. Priors
```r
prior_summary(modell)
```
- *Specified prior*: normal(0, 2.5) auf **z-skalierten** Variablen → erlaubt Koeffizienten von etwa −5…+5 SD, also praktisch kein Einfluss.
- *Adjusted prior*: zurückgerechnet auf die Originalskala: σ_adj = 2.5 · sd(y)/sd(x).
- In der LV: **immer die schwach-informativen Default-Priors**.

## 5. Intervalle berechnen
```r
hdi(modell)                          # 95%-HDI (daatools), bevorzugt in der LV
posterior_interval(modell, prob=0.95) # Quantil-Intervall (2.5%/97.5%)
plothist(modell, "GenderMale")        # Verteilung + HDI + Median
plothist(modell, "x", compVal=0)      # zeigt Anteil links/rechts von 0
plotcoef(modell, "beta")              # alle Koeffizienten mit HDI auf einen Blick
s = as.matrix(modell)                 # 4000 x Parameter Matrix aller Samples
mean(s[, "GenderMale"] > 5)           # P(Koeffizient > 5)
```

## 6. Beispiel aus der LV: Streaming & Verkehrstote (LV-01a)
- Ohne Kontrollvariablen war `streams` **negativ**. Mit `year` und `holiday` wurde es **positiv**. Grund: Jahr und Streams entwickeln sich nicht synchron, Information „versteckte“ sich im Streams-Koeffizienten (**Omitted Variable Bias**).
- R² von 0.33 → 0.44 → 0.62 (mit Wochen-Spline): mehr Kontext, bessere Erklärung.
- `new_streams` HDI [−1; +21] mit Spline → „mit 96 % Wahrscheinlichkeit positiv“, aber 95 %-HDI schließt 0 ein.
- Lehre: Koeffizienten hängen davon ab, **was sonst im Modell ist**.

## 7. Extrapolation (Verständnisaufgabe 06)
Ein enges Intervall für die Steigung (Daten 20–40 h) sagt **nichts** darüber, ob der Zusammenhang bei 70 h noch gilt (Sättigung, Ermüdung). Vorhersagen nur im Datenbereich.

## ⚠️ Typische Fallen
- Basisfall unvollständig (Referenzgruppe vergessen) oder unsinnig (nicht zentriert).
- Koeffizient als **Durchschnittsunterschied der Rohdaten** lesen (Verständnisaufgabe 04.4: Der Bezirk-2-Koeffizient ist *bei gleicher Fläche*. Die rohen Mittelwerte können anders sein).
- Intervall für einzelne Fälle verwenden.
- Kausale Formulierungen.

➡️ Quiz: [quiz/02-Lineare-Regression.md](../quiz/02-Lineare-Regression.md) · R-Output: [r-output-lesen/01-info-print-stan_glm.md](../r-output-lesen/01-info-print-stan_glm.md)
