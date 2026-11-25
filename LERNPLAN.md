# Lernplan bis zur Klausur

> Annahme: etwas Vorwissen, ca. 7–10 Lerntage à 1.5–3 h. Bei weniger Zeit: die ⭐-Einheiten zuerst. Die Beispielklausur ist zu ca. 60 % **logistische Regression** + Interpretation von Ausgaben → dort liegt der Schwerpunkt.

| Tag | Inhalt | Material | Check |
|---|---|---|---|
| 1 | Grundlagen, Bayes, Basisrate | [Kap. 0](kapitel/00-Grundlagen-Wiederholung.md), [Kap. 1](kapitel/01-Bayes-Schlussfolgern.md) | [Quiz 01](quiz/01-Grundlagen-Bayes.md) ≥ 80 % |
| 2 ⭐ | Lineare Regression lesen: Basisfall, Koeffizienten, HDI, σ | [Kap. 2](kapitel/02-Lineare-Regression-Bayes.md), [R-Output 1](r-output-lesen/01-info-print-stan_glm.md), [Coding 1](coding-uebungen/01-Setup-erstes-Modell.md) | [Quiz 02](quiz/02-Lineare-Regression.md) |
| 3 ⭐ | Modellprüfung, Vorhersagen, Entscheidungen | [Kap. 3](kapitel/03-Modellpruefung-MCMC.md), [Kap. 4](kapitel/04-Vorhersagen-Entscheidungen.md), [R-Output 2](r-output-lesen/02-Sampling-und-Diagnose.md), [Coding 3](coding-uebungen/03-Vorhersagen-Samples.md) | Quiz 03 + 04 |
| 4 ⭐ | Simpson/Kausalität, Effektgröße | [Kap. 5](kapitel/05-Simpson-Kausalitaet.md), [Kap. 6](kapitel/06-Effektgroesse.md), [R-Output 3](r-output-lesen/03-effectsize.md) | Quiz 05 + 06 |
| 5 | Interaktionen, Nichtlinearität, Modellvergleich | [Kap. 7](kapitel/07-Interaktionen-Nichtlinearitaet.md), [Kap. 8](kapitel/08-Modellvergleich-LOO.md), [R-Output 4](r-output-lesen/04-loo-compare.md), [Coding 4](coding-uebungen/04-Interaktionen.md) | Quiz 07 + 08 |
| 6 ⭐⭐ | Logistische Regression komplett | [Kap. 9](kapitel/09-Logistische-Regression.md), [R-Output 5](r-output-lesen/05-prediction_metrics-ROC-logrates.md), [Coding 5 (von Hand)](coding-uebungen/05-Logistisch-von-Hand.md) | [Quiz 09](quiz/09-Logistische-Regression.md) ≥ 80 % |
| 7 ⭐ | Daten, Split, Leakage, Drift + **Probeklausur B** (60 min, dann Lösung) | [Kap. 10](kapitel/10-Datenqualitaet-Split-Drift.md), [B1](uebungsklausur/B1-Probeklausur-Waermepumpen.md) → [B2](uebungsklausur/B2-Loesung-Waermepumpen.md) | Quiz 10 |
| 8 ⭐⭐ | **Beispielklausur** unter Klausurbedingungen, danach mit Musterlösung korrigieren | [A1](uebungsklausur/A1-Beispielklausur-WS2627.md) → [A2](uebungsklausur/A2-Musterloesung.md) | Fehler notieren |
| 9 ⭐ | **Probeklausur C**, Antwortbausteine auswendig, Fehlerquiz | [C1](uebungsklausur/C1-Probeklausur-Fitnessstudio.md) → [C2](uebungsklausur/C2-Loesung-Fitnessstudio.md), [Antwortbausteine](uebungsklausur/Antwortbausteine.md) | App: „Fehler wiederholen“ |
| 10 | Wiederholung: Cheatsheet, Quiz 11, Beispielklausur nochmal *mündlich* durchgehen (ChatGPT als Prüfer) | [Cheatsheet](cheatsheet.md), [Quiz 11](quiz/11-Beispielklausur.md), [CHATGPT-TUTOR](CHATGPT-TUTOR.md) | alles ≥ 85 % |

## Täglich (10 min, am Handy)
- [Quiz-App](app/quiz.html): 10 Fragen gemischt + „Fehler wiederholen“.
- 5 Begriffe aus dem [Glossar](glossar.md) laut erklären.

## Lernmethode
1. **Aktiv statt lesen**: Erst Quiz/Aufgabe versuchen, dann nachlesen.
2. **Ausgaben laut interpretieren**: Jede Zeile einer `info`/`effectsize`/`loo_compare`-Ausgabe in einem Satz erklären.
3. **Formulierungen trainieren**: Die Klausur bewertet präzise Sprache („Odds“, „bei sonst gleichen Werten“, „nicht kausal“).
4. **Fehlerliste**: Jede falsche Antwort mit kurzer Begründung notieren und am Tag 10 nochmal durchgehen.
