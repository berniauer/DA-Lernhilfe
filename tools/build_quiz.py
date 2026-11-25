"""Erzeugt quiz/*.md und app/quiz.html aus quiz/quiz-daten.json.

Aufruf (im Repo-Hauptordner):  python tools/build_quiz.py
"""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
data = json.loads((ROOT / "quiz" / "quiz-daten.json").read_text(encoding="utf-8"))
BUCHST = "ABCD"

index_lines = ["# Quizzes: Übersicht", "",
               "Jede Datei hat **Karteikarten** (Begriff → aufklappen) und **Multiple-Choice-Fragen** (Antwort unter „Lösung“).",
               "Tipp: Erst selbst antworten, dann aufklappen. Am Handy funktionieren die `<details>`-Blöcke direkt in der GitHub-App.",
               "Interaktiv: [app/quiz.html](../app/quiz.html).", ""]
gesamt_k = gesamt_f = 0

for deck in data:
    out = [f"# Quiz {deck['id'][:2]}: {deck['titel']}", "",
           f"> Zugehöriges Kapitel: [{deck['kapitel']}](../{deck['kapitel']})", "",
           "## Teil 1: Karteikarten (Begriffe)", ""]
    for begriff, erkl in deck["karten"]:
        out += [f"<details><summary><b>{begriff}</b></summary>", "", erkl, "", "</details>", ""]
    out += ["## Teil 2: Multiple Choice", ""]
    for i, f in enumerate(deck["fragen"], 1):
        out.append(f"**{i}. {f['q']}**")
        out.append("")
        for j, o in enumerate(f["o"]):
            out.append(f"- {BUCHST[j]}) {o}")
        out += ["", "<details><summary>Lösung</summary>", "",
                f"**{BUCHST[f['a']]}) {f['o'][f['a']]}**: {f['e']}", "", "</details>", ""]
    (ROOT / "quiz" / f"{deck['id']}.md").write_text("\n".join(out), encoding="utf-8")
    index_lines.append(f"- [{deck['id'][:2]}: {deck['titel']}]({deck['id']}.md): {len(deck['karten'])} Karten, {len(deck['fragen'])} Fragen")
    gesamt_k += len(deck["karten"]); gesamt_f += len(deck["fragen"])

index_lines += ["", f"**Gesamt:** {gesamt_k} Karteikarten, {gesamt_f} Multiple-Choice-Fragen."]
(ROOT / "quiz" / "README.md").write_text("\n".join(index_lines) + "\n", encoding="utf-8")

# App: Platzhalter im Template durch JSON ersetzen
tpl = ROOT / "tools" / "quiz-template.html"
if tpl.exists():
    html = tpl.read_text(encoding="utf-8").replace("/*__QUIZDATA__*/[]", json.dumps(data, ensure_ascii=False))
    (ROOT / "app" / "quiz.html").write_text(html, encoding="utf-8")
    print("app/quiz.html geschrieben")
print(f"{len(data)} Quizdateien, {gesamt_k} Karten, {gesamt_f} Fragen")
