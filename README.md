# DA-Lernhilfe: Datenanalyse (Bayes-Regression mit R)

Lernmaterial zur LV **Datenanalyse** (rstanarm `stan_glm`, daatools) mit dem Ziel, die Klausur nach dem Muster der **Beispielklausur WS26/27** zu bestehen.

> 🔒 Privates Repo: enthält urheberrechtlich geschützte Kursunterlagen (`originale/`, `quellen-md/`). Bitte nicht öffentlich machen.

## 🚀 Start hier
1. **[LERNPLAN.md](LERNPLAN.md)**: 10-Tage-Plan mit Checks
2. **[Beispielklausur](uebungsklausur/A1-Beispielklausur-WS2627.md)** einmal überfliegen, damit du weißt, worauf es hinausläuft
3. Kapitel → Quiz → R-Output → Probeklausuren
4. Täglich am Handy: **Quiz-App** (Link unten) oder die Quiz-Markdown-Dateien

## 📚 Inhalt

### Übungsklausuren
| Datei | Inhalt |
|---|---|
| [A1 Beispielklausur WS26/27](uebungsklausur/A1-Beispielklausur-WS2627.md) | bereinigter Klausurtext, Diagramme als Tabellen beschrieben |
| [A2 Musterlösung](uebungsklausur/A2-Musterloesung.md) | ausführliche Lösung zu allen 30 Teilfragen + Fallen |
| [B Probeklausur Wärmepumpen](uebungsklausur/B1-Probeklausur-Waermepumpen.md) · [Lösung](uebungsklausur/B2-Loesung-Waermepumpen.md) | linear, Confounding, Interaktion, f², epred/predict, Kosten |
| [C Probeklausur Fitnessstudio](uebungsklausur/C1-Probeklausur-Fitnessstudio.md) · [Lösung](uebungsklausur/C2-Loesung-Fitnessstudio.md) | logistisch, Odds-Ratio, Kalibrierung, Cutoff-Kosten, Leakage |
| [Antwortbausteine](uebungsklausur/Antwortbausteine.md) | Checklisten und Formulierungen je Fragetyp |

### Kapitel (Kompaktskript)
0. [Grundlagen-Wiederholung](kapitel/00-Grundlagen-Wiederholung.md)
1. [Schlussfolgern mit Bayes](kapitel/01-Bayes-Schlussfolgern.md)
2. [Lineare Regression mit stan_glm](kapitel/02-Lineare-Regression-Bayes.md)
3. [Modellprüfung & MCMC](kapitel/03-Modellpruefung-MCMC.md)
4. [Vorhersagen & Entscheidungen](kapitel/04-Vorhersagen-Entscheidungen.md)
5. [Simpson & Kausalität](kapitel/05-Simpson-Kausalitaet.md)
6. [Effektgröße](kapitel/06-Effektgroesse.md)
7. [Interaktionen & Nichtlinearität](kapitel/07-Interaktionen-Nichtlinearitaet.md)
8. [Modellvergleich (LOO)](kapitel/08-Modellvergleich-LOO.md)
9. [Logistische Regression](kapitel/09-Logistische-Regression.md) ⭐ Klausurschwerpunkt
10. [Datenqualität, Split, Leakage, Drift](kapitel/10-Datenqualitaet-Split-Drift.md)

### Üben
- **[Quizzes](quiz/README.md)**: 11 Themen, 111 Karteikarten, 99 Multiple-Choice-Fragen (aufklappbare Lösungen)
- **[R-Output lesen](r-output-lesen/)**: annotierte Ausgaben von `info`, `check_sampling`, `effectsize`, `loo_compare`, `prediction_metrics`, `ROC`, `plotlogrates`
- **[Coding-Übungen](coding-uebungen/)**: R-Aufgaben mit Lösungen zu den Kursdatensätzen + Rechnen von Hand + Code erklären
- **[Cheatsheet](cheatsheet.md)** · **[Glossar](glossar.md)**

### Quellen
- `quellen-md/`: alle Kursmaterialien (Arbeitsblätter, LV-Code, Übungen, Verständnisaufgaben mit Lösungen, daatools-Quellcode) per **markitdown** nach Markdown konvertiert, gut durchsuchbar und für KI-Tutoren lesbar
- `originale/`: Original-PDFs/HTML/Rmd
- `daten/`: Datensätze (CSV) + `daatools_0.8.tar.gz`

## 📱 Am Handy lernen
- **Quiz-App** (interaktiv, Fortschritt + Fehlerwiederholung): **https://claude.ai/artifact/54iQ4mv4i4oE5MKqvAqR6b** (privat, nur mit deinem Claude-Login sichtbar). Lokal: `app/quiz.html` im Browser öffnen.
- **GitHub-App**: Markdown wird schön dargestellt, `<details>`-Lösungen lassen sich antippen.
- **ChatGPT/Claude als Prüfer**: siehe **[CHATGPT-TUTOR.md](CHATGPT-TUTOR.md)** (Connector einrichten, Projekt-Prompt, Beispiel-Prompts).

## 🔧 Pflege
- Quizfragen ergänzen: `quiz/quiz-daten.json` bearbeiten → `python tools/build_quiz.py` erzeugt `quiz/*.md` und `app/quiz.html` neu.
- Kursmaterial neu konvertieren: `tools/convert.py <Quellordner> quellen-md` (benötigt `pip install markitdown[all]`).

---
*Kapitel, Lösungen und Übungen wurden mit Claude erstellt und sind keine offiziellen Unterlagen der LV.*
