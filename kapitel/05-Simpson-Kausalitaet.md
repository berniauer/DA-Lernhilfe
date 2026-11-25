# Kapitel 5: Simpsons Paradox, Kontrollvariablen & Kausalität

> Quelle: Arbeitsblatt 03 „Simpsons Paradox“ · Verständnisaufgaben 14–16 · LV-01a (Streaming), StackOverflow-Analyse

## 1. Simpsons Paradox: OP-Teams

| Team | leicht | schwer | gesamt |
|---|---|---|---|
| A | 2 % (2/100) | 10 % (90/900) | **9.2 %** |
| B | 4 % (36/900) | 15 % (15/100) | **5.1 %** |

- **Gesamt** wirkt B besser, **innerhalb jeder Schwierigkeitsstufe** ist A besser!
- Grund: A operiert überwiegend **schwere** Fälle, B überwiegend **leichte**. Die Gesamtquote vermischt (a) wie gut ein Team arbeitet und (b) **welche Fälle** es behandelt (Fallmischung).
- Gedeckt ist: „In beiden Schwierigkeitsgruppen hatte A die niedrigere beobachtete Komplikationsrate.“ **Nicht** gedeckt: kausale Überlegenheit (Vorerkrankungen, Unterschiede innerhalb der groben Gruppen, statistische Unsicherheit).

## 2. Vorzeichenwechsel in der Regression: Wohnungspreise

```r
fit_zi    = stan_glm(preis ~ zimmer4, data=wohnungen)                  # zimmer4 ≈ +30 000 €
fit_beide = stan_glm(preis ~ wohnflaeche90 + zimmer4, data=wohnungen)  # zimmer4 ≈ −10 000 €!
```
- Zimmer und Fläche korrelieren stark (0.66).
- `fit_zi` vergleicht Wohnungen mit mehr/weniger Zimmern **allgemein** (größere Wohnungen haben mehr Zimmer).
- `fit_beide` vergleicht Wohnungen **mit gleicher Fläche**: Mehr Zimmer heißt dann kleinere Räume, „zerstückelt“ → billiger.
- **Beide Aussagen gelten gleichzeitig.** Die Modelle beantworten **verschiedene Fragen**. Mehr Variablen ≠ besseres Modell, sondern **anderes** Modell.
- Verständnisaufgabe 15: „Zwischenwand entfernen → +10 000 €“ ist eine **Intervention**, die Beobachtungsdaten nicht belegen (kein Vorher/Nachher bei derselben Wohnung).

## 3. Die 5 Fragen vor jeder Koeffizienten-Interpretation
1. **Was** wird miteinander verglichen?
2. Was wird dabei **konstant gehalten**?
3. Ist es **realistisch und sinnvoll**, diese Variablen konstant zu halten?
4. Gibt es wichtige Gruppen oder Einflussgrößen, die das Modell **nicht** berücksichtigt?
5. Beschreiben die Koeffizienten nur eine **Assoziation**, oder dürfen wir sie **kausal** deuten?

## 4. Confounder, Mediator, Collider (Verständnisaufgabe 16)

Beispiel: Wirkt ein freiwilliger Programmierkurs auf die Arbeitsleistung?

| Rolle | Beispiel | Struktur | kontrollieren? |
|---|---|---|---|
| **Confounder** (Störgröße) | Vorerfahrung | Vorerfahrung → Kurs **und** Vorerfahrung → Leistung | **Ja**, erfasst vorbestehende Unterschiede |
| **Mediator** | erworbene Kenntnisse | Kurs → Kenntnisse → Leistung | **Nein**, wenn die *Gesamt*wirkung gefragt ist (sonst wird ein Teil der Wirkung ausgeblendet) |
| **Collider** | Projektgruppen-Mitgliedschaft | Kurs → Mitgliedschaft ← Motivation | **Nein**, nicht darauf selektieren! Sonst entsteht ein künstlicher Zusammenhang |

Collider-Erklärung: Unter Projektgruppenmitgliedern müssen Personen **ohne** Zertifikat besonders motiviert sein, um hineinzukommen. Selektiert man nur Mitglieder, sind die Nicht-Kurs-Leute überdurchschnittlich motiviert → der Kurseffekt wird verzerrt.

## 5. Omitted Variable Bias: Beispiele aus der LV
- **Streaming & Unfälle:** `streams` erst negativ, nach Aufnahme von `year` + `holiday` positiv.
- **StackOverflow:** „Spaces verdienen mehr“: roh ≈ +29 %, mit Land und Erfahrung ≈ +12 %, mit weiteren Variablen ≈ +8 %. Ein großer Teil des Effekts hing an der **Zusammensetzung** (Land, Erfahrung). Kausalität bleibt unbelegt (Selbstauskunft, keine Zufallszuteilung).
- **Probeklausur B:** Smart-Thermostat −8.6 kWh → mit Dämmung nur −2.6 kWh.

## 6. Kausalität nachweisen
- **Randomisiertes Experiment** (A/B-Test, Randomized Controlled Trial, Design of Experiments): Zuteilung per Zufall → Confounder im Mittel ausgeglichen.
- Vorher/Nachher mit Kontrollgruppe.
- Beobachtungsdaten + Kontrollvariablen sind **nur eine Annäherung**. Statistisch kontrollieren ist schwerer, als man denkt (Messfehler in Kontrollvariablen, unbekannte Confounder).

## ⚠️ Typische Fallen
- Aggregierte Quoten vergleichen, ohne die Zusammensetzung zu prüfen.
- „Einfach alles kontrollieren“ (Mediatoren/Collider!).
- Vorzeichenwechsel als „Fehler des Modells“ deuten.
- Aus Regressionskoeffizienten von Beobachtungsdaten Interventionen ableiten.

➡️ Quiz: [quiz/05-Simpson-Kausalitaet.md](../quiz/05-Simpson-Kausalitaet.md)
