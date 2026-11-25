# Lösung Probeklausur C: Fitnessstudio-Kündigungen

## 1.1 Variable `kuendigungsgespraech`

**Ablehnen: Data Leakage.** Das Gespräch findet **nach dem Stichtag** (März/April) statt, also im Vorhersagezeitraum. Zum Vorhersagezeitpunkt (1. März) ist es unbekannt. Es ist vermutlich sogar eine **Folge** der Kündigungsabsicht. Es „sagt gut vorher“, weil es das Ergebnis schon halb verrät. Im Einsatz wäre die Variable nicht verfügbar → das Modell ist im Test zu gut und im Betrieb unbrauchbar. Regel: Prädiktoren nur aus Informationen bis zum Vorhersagezeitpunkt.

## 2. Modell

**2.1** Basisfall: Mitglied mit **0 Besuchen/Monat**, **36 Jahre**, **Monatsvertrag**, **0 km** Entfernung, **keine** Preiserhöhung.
Logit = −0.43 → Odds = e^−0.43 ≈ 0.65 → p = 0.65 / 1.65 ≈ **0.39** (39 % Kündigungswahrscheinlichkeit).
(0 km liegt knapp außerhalb der Daten, min. 0.3 km, ist aber nah genug für eine Interpretation.)

**2.2**
- `besuche` = −0.32 → OR = e^−0.32 ≈ **0.73**: Je zusätzlichem Besuch pro Monat sind die Kündigungs-**Odds** um ca. **27 % niedriger** (bei sonst gleichen Merkmalen). 4 Besuche mehr (≈ 1 SD): 0.73⁴ ≈ 0.28 → Odds −72 %.
- `jahresvertrag` = −0.92 → OR ≈ **0.40**: Mitglieder mit Jahresvertrag haben bei sonst gleichen Merkmalen ca. **60 % niedrigere Odds** zu kündigen als solche mit Monatsvertrag. (Plausibel, kündigen ist dort ja auch schwieriger. Und nicht kausal: Wer sich ein Jahr bindet, ist vielleicht ohnehin motivierter.)

**2.3** „Verdoppelt das Risiko“ ist **falsch formuliert**: Verdoppelt (×2.085) werden die **Odds**, nicht die Wahrscheinlichkeit.
- Mitglied A: Odds 0.65 → ×2.085 = 1.36 → p = 1.36/2.36 ≈ **0.58**. Von 39 % auf 58 %, also **+19 Prozentpunkte** (Faktor 1.5, nicht 2).
- Mitglied B: Odds 0.019/0.981 ≈ 0.0194 → ×2.085 ≈ 0.040 → p ≈ **0.039**. Von 1.9 % auf 3.9 %, also nur **+2 Prozentpunkte** (hier fast eine Verdopplung, weil p klein ist).

→ Gleiche Odds-Ratio, sehr unterschiedliche Wirkung in Prozentpunkten, je nach Ausgangsrisiko (S-Kurve). Zusätzlich: nicht kausal gesichert. Wer von der Preiserhöhung betroffen war, kann sich auch in anderen Merkmalen unterscheiden (Tarif, Standort).

**2.4** `alter36` = −0.01, HDI [−0.02; 0.00] → Tendenz: Ältere kündigen etwas seltener. Der Effekt ist sehr klein (OR 0.99 je Jahr; 10 Jahre: e^−0.1 ≈ 0.90), und das Intervall reicht an 0 heran. Die Daten sind gut mit „kaum/kein Zusammenhang“ vereinbar. Passt zu `effectsize`: Ohne Alter steigt der AIC nur um 1.7.

## 3. Güte

**3.1** Skill = 1 − Brier_Modell / Brier_Null. Das Modell ist um **22 % besser** als das Nullmodell, das immer die mittlere Kündigungsrate (≈ 0.24) vorhersagt. Brier des Nullmodells ≈ 0.24 · 0.76 ≈ **0.18** (Kontrolle: 1 − 0.144/0.18 ≈ 0.2 ✓). Moderat: Das Modell hilft, die Wahrscheinlichkeiten sind aber weit von perfekt.

**3.2** Wählt man zufällig ein kündigendes und ein bleibendes Mitglied, dann gibt das Modell in **≈ 80 %** der Fälle dem kündigenden Mitglied die höhere Kündigungswahrscheinlichkeit.

**3.3** **c2** ist besser: kleinerer Brier (0.144 vs. 0.153) und LogLoss auf Testdaten, höherer Skill (0.22 vs. 0.18), höhere AUC (0.80 vs. 0.78). LOO: c1 liegt 42.6 elpd zurück, bei se_diff 9.3 → **≈ 4.6 × se** > 2 → **überzeugend**. Kein Overfitting (Test ≈ Training).

**3.4** Am wichtigsten **besuche** (AIC +284.6 ohne sie), dann jahresvertrag (+63), entfernung (+48), preiserhoehung (+38). Am unwichtigsten **alter36** (+1.7, fast kein Beitrag).

## 4. Kalibrierung

**4.1** Insgesamt **brauchbar, aber nicht perfekt**: Im niedrigen Bereich (< 0.1) passt es sehr gut (0.050 vs. 0.048). Im Bereich 0.1–0.2 **unterschätzt** das Modell (0.15 vorhergesagt, 0.19 beobachtet), bei 0.2–0.3 **überschätzt** es (0.25 vs. 0.17), bei ≥ 0.5 unterschätzt es leicht (0.61 vs. 0.68). Kleine Gruppen (n = 84 oder 118) → beobachtete Raten schwanken zufällig stark. Kein eindeutiges systematisches Muster, keine dramatische Fehlkalibrierung.

**4.2** Die **AUC** bewertet nur die **Rangfolge** (bekommen Kündiger höhere Werte als Nicht-Kündiger?), nicht die absolute Höhe. Ein Modell, das alle Wahrscheinlichkeiten verdoppelt (gleiche Reihenfolge), hat dieselbe AUC, aber einen viel schlechteren **Brier-Score**, weil die Wahrscheinlichkeiten falsch sind (Verständnisaufgabe 28). Brier misst Genauigkeit **und** Kalibrierung, AUC nur Diskriminierung.

## 5. Cutoff und Kosten

**5.1** Bei 0.5: richtig = TP + TN = 57 + 577 = 634 von 800 = **79.3 %** ✓.
Die triviale Regel „niemand kündigt“ hätte aber 604/800 = **75.5 %** richtig und erkennt **keinen einzigen** Kündiger. Bei 0.5 erkennt das Modell nur 57 von 196 Kündigern (TPR 29 %), 139 werden übersehen. **Accuracy ist bei unausgeglichenen Klassen und ungleichen Fehlerkosten ein schlechtes Kriterium.** Entscheidend sind die Kosten der Fehlerarten.

**5.2** Kosten = 30 € · (TP + FP) + 300 € · FN

| Strategie | Rechnung | Kosten |
|---|---|---|
| niemandem Gutschein | 300 · 196 | **58 800 €** |
| allen Gutschein | 30 · 800 | **24 000 €** |
| Cutoff 0.5 | 30·(57+27) + 300·139 = 2 520 + 41 700 | **44 220 €** |
| Cutoff 0.3 | 30·(131+126) + 300·65 = 7 710 + 19 500 | **27 210 €** |
| Cutoff 0.1 | 30·(184+364) + 300·12 = 16 440 + 3 600 | **20 040 €** |

→ **Cutoff 0.1** ist unter den betrachteten Optionen am günstigsten und auch günstiger als „alle bekommen einen Gutschein“. Weil ein übersehener Kündiger 10× so teuer ist wie ein unnötiger Gutschein, lohnt sich ein **niedriger** Schwellwert: lieber viele Fehlalarme als wenige übersehene Kündiger.
(Faustregel: Optimal ist es, ein Mitglied zu markieren, wenn p · 300 > 30, also p > 0.1. Das gilt, wenn das Modell gut kalibriert ist.)
Einschränkung: Kosten nur für die gelisteten Cutoffs berechnet, nicht global optimiert. Außerdem wirkt der Gutschein nicht bei allen Kündigern, die Annahme „alle bleiben“ ist optimistisch.

**5.3** **Nein.** Mit 150 € Gutschein verschiebt sich das Verhältnis (übersehen 300 vs. Fehlalarm 150 = 2:1), und Fehlalarme werden teuer → ein **höherer** Cutoff wird optimal (Faustregel: p > 150/300 = 0.5). Die Schwelle hängt immer von der Kostenstruktur ab.

## 6. Einsatz

**6.1** **Nicht ohne Prüfung.** Andere Population (Student\*innen: anderes Alter, andere Vertragsarten, Semesterferien → anderes Kündigungsverhalten). Das Alter liegt teilweise am Rand der Trainingsdaten, die Basisrate ist eventuell anders → die **Kalibrierung** stimmt dann nicht, eventuell auch die Zusammenhänge. Erst Daten im neuen Studio sammeln, das Modell dort testen (Brier, AUC, Kalibrierung) und gegebenenfalls neu trainieren.

**6.2** Alle Daten stammen vom **selben Stichtag**. Ein zufälliger Split prüft nur Mitglieder unter denselben Bedingungen (gleiche Saison, gleiche Preiserhöhung). Kündigungen sind **saisonal** (Neujahrsvorsätze, Sommer). Besser: **zeitliche Validierung**, also Modell mit Stichtag März trainieren und mit Daten von einem **späteren** Stichtag (z. B. September) testen. Gegebenenfalls zusätzlich nach Studio-Standorten aufteilen.
