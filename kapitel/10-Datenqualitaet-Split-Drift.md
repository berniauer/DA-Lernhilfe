# Kapitel 10: Datenqualität, Train/Test-Split, Leakage & Drift

> Quelle: Arbeitsblätter (Daten-Übersicht, `info(df)`), LV-Diskussionen, Beispielklausur Abschnitte 1, 2.9–2.11, 7 · Verständnisaufgaben 25, 30

## Lernziele
- `info(df)` lesen und Auffälligkeiten erkennen
- Repräsentativität beurteilen (Checkliste)
- geeignete Validierungsstrategie wählen (zufällig, zeitlich, gruppiert)
- Leakage erkennen
- Drift unterscheiden und Monitoring planen

## 1. `info(df)` – Datenübersicht
```
               mean    sd median    min    max na neg0
pressure      75.55  8.28  75.40  50.00 106.60  0    0
defect         0.25  0.43   0.00   0.00   1.00  0 2622
machine:  M1: 738  M2: 849 ...
```
| Spalte | Bedeutung / worauf achten |
|---|---|
| mean vs. median | große Differenz → schiefe Verteilung (log?) |
| sd | Streuung; für sinnvolle Schrittweiten bei der Interpretation |
| min/max | unplausible Werte? (negatives Alter, 999 als Code für fehlend) |
| **na** | fehlende Werte: wie behandelt? Zufällig fehlend? |
| **neg0** | Anzahl Werte ≤ 0: bei Binärvariablen = Anzahl Nullen; bei Variablen, die > 0 sein müssen, ein Warnsignal |
| Faktor-Häufigkeiten | Referenzlevel (erstes), kleine Gruppen (unsichere Schätzung) |

Bei 0/1-Variablen: **mean = Anteil der 1er** (Defektrate 0.25).

## 2. Repräsentativität – Checkliste
- **Population**: Für wen/was soll das Modell gelten? Wurde genau das erhoben?
- **Auswahl**: zufällig? Selbstselektion (Umfragen, freiwillige Teilnahme)? Survivorship?
- **Zeitraum**: Saison, Sonderereignisse, Prozessänderungen?
- **Messung**: Wie wurde y bestimmt? Messfehler, Selbstauskunft, Sensorkalibrierung?
- **Ausschlüsse**: Was wurde entfernt (NAs, Ausreißer)?
- **Abhängigkeiten**: Wiederholte Messungen derselben Einheit, Chargen, Personen?
- **Basisrate**: realistisch oder Oversampling?

## 3. Validierungsstrategien
| Methode | wann | Gefahr |
|---|---|---|
| **zufälliger Split** (`split_random`) | unabhängige Beobachtungen, gleiche Population | zu optimistisch bei Zeit-/Gruppenstruktur |
| **zeitlicher Split** | Vorhersage in die Zukunft (Produktion, Nachfrage, Kündigung) | weniger Trainingsdaten aus der jüngsten Zeit |
| **rollierend / Forward-Chaining** | mehrere Zeitpunkte, stabilere Schätzung | aufwendiger |
| **gruppierter Split / Leave-one-group-out** | Übertragung auf **neue** Gruppen (Maschine, Standort, Person) | viele Gruppen nötig |
| **LOO / K-fold** | Modellvergleich auf allen Daten | setzt Unabhängigkeit voraus |

**Warum zufällig zu optimistisch?** Nahe beieinanderliegende Beobachtungen (gleiche Woche, Charge, Person) landen in Train **und** Test. Das Modell „kennt“ den Kontext schon, der Test misst nicht die echte Zukunft.

## 4. Leakage
Information im Modell, die im Einsatz **nicht** verfügbar wäre:
- **zeitlich**: Variable wird nach dem Vorhersagezeitpunkt gemessen (Kündigungsgespräch, Nacharbeit).
- **Folge des Ergebnisses**: Variable ist durch y verursacht.
- **Vorverarbeitung**: Skalierung/Imputation/Featureauswahl auf **allen** Daten statt nur Training.
- **Duplikate**: dieselbe Einheit in Train und Test.

Warnzeichen: verdächtig gute Werte (AUC 0.99), Separation, eine Variable dominiert alles.

## 5. Drift
| Art | Was ändert sich | Beispiel |
|---|---|---|
| **Covariate Shift** | Verteilung der X | Maschine neu kalibriert → Druck typischerweise höher; neue Kundengruppe |
| **Concept Drift** | Zusammenhang X → y | optimales Prozessfenster verschiebt sich; Kündigungsgründe ändern sich |
| **Prior/Label Shift** | Basisrate von y | Defektrate sinkt insgesamt |

**Extrapolation**: Werte außerhalb des Trainingsbereichs → vor allem bei quadratischen Termen gefährlich.

## 6. Monitoring-Plan (Klausur-Standardantwort)
1. **Neue gelabelte Daten** laufend sammeln.
2. Regelmäßig Güte auf diesen Daten: Brier/LogLoss/Skill/AUC (bzw. RMSE/MAE), Vergleich mit Referenzwerten vom Test.
3. **Kalibrierung**: vorhergesagte vs. beobachtete Rate, gesamt und **je Untergruppe** (Maschine, Schicht, Standort).
4. **Entscheidungsrelevante Raten**: TPR/FPR beim gewählten Cutoff, Kosten.
5. **Eingangsdaten**: Verteilungen (`info()`) vs. Training, Anteil außerhalb des Trainingsbereichs.
6. Schwellen festlegen → bei Verschlechterung **neu trainieren** und mit dem alten Modell auf aktuellen Daten vergleichen.

⚠️ **Stabile Gesamtrate ≠ gutes Modell**: Fehler können sich ausgleichen (Verständnisaufgabe 09). Rangordnung (AUC) und Untergruppen prüfen.

## ⚠️ Typische Fallen
- „Keine NAs → Daten sind gut.“
- Zufälliger Split bei Zeitreihen ohne Hinweis.
- Leakage-Variable wegen „guter Vorhersage“ behalten.
- Monitoring nur über eine Gesamtzahl.

➡️ Quiz: [quiz/10-Daten-Split-Drift.md](../quiz/10-Daten-Split-Drift.md)
