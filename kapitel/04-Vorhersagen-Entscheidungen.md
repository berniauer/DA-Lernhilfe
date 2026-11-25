# Kapitel 4: Vorhersagen mit Samples & Entscheidungen

> Quelle: Arbeitsblatt 02c „Vorhersagen mit linearen Modellen“ · Verständnisaufgaben 11–13 · LV-02b Feuerwehr

## Zwei Quellen der Unsicherheit
In y = α + βx + ε:
1. **Koeffizienten** α, β sind unsicher (wir haben nur eine Stichprobe) → wird kleiner mit mehr Daten.
2. **Fehlerterm ε** (σ): alles, was das Modell nicht erfasst (Messfehler, fehlende Variablen). Er bleibt **immer** bestehen, auch bei unendlich vielen Daten.

## Die drei Vorhersage-Funktionen

| Funktion | liefert | Unsicherheit | wofür |
|---|---|---|---|
| `predict(m, newdata)` | Punktwert (Median) | keine | schnelle Schätzung |
| `posterior_epred(m, newdata)` | 4000 Samples des **Erwartungswerts** | nur Koeffizienten | **Durchschnitt** vieler vergleichbarer Fälle |
| `posterior_predict(m, newdata)` | 4000 Samples **einzelner** Werte | Koeffizienten **+ ε** | **ein konkreter** neuer Fall |

```r
body_new = data.frame(Height=c(171, 196), Age=c(36, 48), Gender=c('Female','Male'))
predict(modell, newdata=body_new)
epred = posterior_epred(modell, newdata=body_new);  hdi(epred, add=median)   # z. B. 64–68 kg
pred  = posterior_predict(modell, newdata=body_new); hdi(pred, add=median)   # z. B. 50–81 kg
```

- Die Matrix hat **4000 Zeilen (Samples) × n Spalten (Fälle)**.
- Das predict-Intervall ist um ca. **±2σ** breiter.
- **Gedankenexperiment:** Bei exakt bekannten Koeffizienten schrumpft das epred-Intervall auf einen **Punkt**, das predict-Intervall bleibt ≈ **4σ** breit (Verständnisaufgabe 11).
- Bei logistischen Modellen liefert `posterior_epred` **Wahrscheinlichkeiten**, `posterior_predict` **0/1-Werte**. `predict(..., type="response")` gibt Wahrscheinlichkeiten.

## Mit Samples rechnen
Weil wir echte Verteilungen haben, können wir beliebige Fragen beantworten:
```r
mean(pred[,1] >= 55 & pred[,1] < 60)    # P(Frau wiegt 55–60 kg)  ~16 %
mean(pred[,2] > 90)                      # P(Mann > 90 kg)         ~63 %
quantile(epred[,2], c(.25,.5,.75))       # Quartile des Mittelwerts
diff = pred[,2] - pred[,1]               # Differenz ZEILENWEISE (selbes Sample!)
mean(diff < 0)                           # P(Frau schwerer als Mann)
```

**Verständnisaufgabe 12, ganz wichtig:** Differenzen immer **innerhalb derselben Sample-Zeile** bilden. Kleinsten B-Wert mit größtem A-Wert kombinieren (−28 min) ist **unzulässig**, weil die gemeinsame Posterior-Struktur verloren geht. In jedem Sample ist B − A ≈ 1–3 min → klarer Unterschied, **obwohl sich die einzelnen Intervalle überlappen**. Das gilt genauso für Koeffizienten: `s[,"machineM5"] - s[,"machineM4"]`.

## Entscheidungen: Vorhersage ≠ Entscheidung

**Beispiel Fluggesellschaft:** Gesamtgewicht von 150 Passagieren planen.
```r
ppred = posterior_predict(modell, newdata=passagiere)
gesamt = rowSums(ppred)          # 4000 mögliche Gesamtgewichte
# Kosten: zu wenig eingeplant 15 €/kg, zu viel 5 €/kg
kosten = function(e) mean(ifelse(gesamt > e, 15*(gesamt-e), 5*(e-gesamt)))
seq_e = seq(min(gesamt), max(gesamt), length.out=200)
seq_e[which.min(sapply(seq_e, kosten))]
```

- Bei **asymmetrischen** Kosten ist das optimale Quantil **c_unter / (c_unter + c_über)** = 15/(15+5) = **0.75**. Bei symmetrischen Kosten: Median.
- **Verständnisaufgabe 13 (Mittagessen):** Fehlende Essen kosten 3 €, überzählige 1 € → **120 Essen** vorbereiten (erwartete Kosten 18 €), obwohl 100 am wahrscheinlichsten ist. Werden dann nur 80 gebraucht, war die Entscheidung trotzdem **nicht falsch**: Sie war optimal unter der Unsicherheit und minimiert die Kosten **im Mittel**.
- Modell vs. Faustregel (69 kg pro Person): fair vergleichen über **viele** simulierte Flüge (Testdaten). Das Modell spart im Mittel ≈ 310 €/Flug, ist aber nicht bei jedem Flug besser (56 %).

## ⚠️ Typische Fallen
- Für die Frage einer Kundin („Wann kommt **meine** Lieferung?“) das schmale epred-Intervall nehmen.
- Differenzen aus Intervallgrenzen statt aus Samples berechnen.
- Beste Schätzung (Median) automatisch als beste Entscheidung verwenden.
- Eine Entscheidung im Nachhinein am Einzelergebnis bewerten.

➡️ Quiz: [quiz/04-Vorhersage-Entscheidung.md](../quiz/04-Vorhersage-Entscheidung.md) · Coding: [coding-uebungen/03-Vorhersagen-Samples.md](../coding-uebungen/03-Vorhersagen-Samples.md)
