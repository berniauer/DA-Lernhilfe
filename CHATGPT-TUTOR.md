# ChatGPT (oder Claude) als Tutor mit diesem Repo

## 1. Repo verbinden
**ChatGPT** (Plus/Pro/Team, App oder Web):
1. Einstellungen → **Apps/Connectors** → **GitHub** → verbinden und Zugriff auf das Repo `DA-Lernhilfe` erlauben (privates Repo: beim GitHub-Autorisieren das Repo freigeben).
2. In einem neuen Chat über „+“ → GitHub (oder „Deep Research“ mit GitHub-Quelle) das Repo auswählen.
3. Alternativ ohne Connector: einzelne Dateien (z. B. `A2-Musterloesung.md`) in den Chat hochladen oder in ein **ChatGPT-Projekt** als Projektdateien legen. Am Handy ist ein Projekt mit den wichtigsten 10–15 Dateien oft am praktischsten.

**Claude** (claude.ai, App): Projekt anlegen → „Add content“ → GitHub → Repo auswählen (oder Dateien hochladen).

**Empfohlene Dateien für ein Projekt** (wenn nur wenige erlaubt sind): `cheatsheet.md`, `glossar.md`, `uebungsklausur/A1…`, `A2…`, `Antwortbausteine.md`, `kapitel/09-Logistische-Regression.md`, `kapitel/02…`, `kapitel/06…`, `kapitel/07…`, `kapitel/08…`, `quiz/quiz-daten.json`.

## 2. Projekt-Anweisung (in die „Instructions“ des Projekts kopieren)
```
Du bist mein strenger, aber freundlicher Tutor für die Klausur „Datenanalyse“ (Bayessche
Regression mit rstanarm/stan_glm und dem R-Paket daatools). Grundlage sind AUSSCHLIESSLICH
die Dateien dieses Repos/Projekts (Kapitel, Musterlösungen, Antwortbausteine, Quizdaten).
Regeln:
- Stelle mir immer nur EINE Frage auf einmal und warte auf meine Antwort.
- Bewerte meine Antwort wie ein Prüfer (0–3 Punkte), nenne fehlende Schlüsselbegriffe
  (z. B. „Odds statt Wahrscheinlichkeit“, „bei sonst gleichen Werten“, „Intervall schließt 0 ein“,
  „nicht kausal“, „Trainings- vs. Testdaten“) und zeige eine Musterformulierung.
- Nutze die Fragetypen der Beispielklausur: Basisfall, Koeffizienten interpretieren, Gruppen
  vergleichen, Güte beurteilen, effectsize/AIC lesen, Modellvergleich (loo_compare), Cutoff,
  Kausalität, Split/Leakage/Drift.
- Wechsle zwischen Rechenaufgaben (Odds ↔ p, Odds-Ratio, Brier-Skill, f², Kostenquantil) und
  Interpretationsfragen. Erfinde R-Ausgaben im Stil von info()/effectsize()/prediction_metrics().
- Führe eine Fehlerliste und wiederhole meine Schwächen später.
- Antworte auf Deutsch, kurz, handyfreundlich.
```

## 3. Nützliche Prompts
- „Prüfe mich mündlich zur Beispielklausur, Abschnitt 2 (Fragen 2.4–2.8). Eine Frage nach der anderen.“
- „Gib mir eine erfundene `info()`-Ausgabe eines logistischen Modells mit 6 Koeffizienten und lass mich Basisfall, zwei Odds-Ratios und die Güte interpretieren.“
- „Erstelle 10 Rechenaufgaben Odds ↔ Wahrscheinlichkeit mit steigender Schwierigkeit.“
- „Erkläre mir Interaktionen, als wäre ich 15, und dann so, wie ich es in der Klausur schreiben soll.“
- „Hier ist meine Antwort auf Frage 4.3: … Bewerte sie wie der Prüfer.“
- „Stelle mir 5 Fragen aus `quiz/quiz-daten.json`, die ich noch nicht hatte, aber mit umformulierten Antwortoptionen.“
- „Erkläre jede Zeile dieser Ausgabe: (Ausgabe einfügen)“
- „Mach mit mir die Probeklausur C als Rollenspiel: Du bist die Geschäftsführung, ich die Analystin.“

## 4. Vorsicht
- KI-Tutoren machen Rechenfehler: Bei Zahlen nachrechnen bzw. mit den Musterlösungen abgleichen.
- Die Musterlösungen sind **nicht offiziell**. Bei Widersprüchen gelten die Arbeitsblätter in `quellen-md/` und die Aussagen des Lehrenden.
