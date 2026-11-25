"""Convert course material to Markdown (markitdown for PDF/HTML, wrappers for code/data)."""
import csv, io, sys, tarfile, zipfile, re
from pathlib import Path
from markitdown import MarkItDown

SRC = Path(sys.argv[1])
DST = Path(sys.argv[2])
md = MarkItDown()

def slug(p: Path) -> Path:
    return p

def out_path(rel: Path, ext=".md") -> Path:
    o = DST / rel
    return o.with_name(o.name + ext) if o.suffix.lower() in (".r", ".rmd", ".csv", ".txt") else o.with_suffix(ext)

def write(o: Path, text: str):
    o.parent.mkdir(parents=True, exist_ok=True)
    o.write_text(text, encoding="utf-8")
    print("OK ", o.relative_to(DST))

def csv_md(path: Path, name: str) -> str:
    raw = path.read_bytes().decode("utf-8", errors="replace")
    sample = raw[:5000]
    try:
        dialect = csv.Sniffer().sniff(sample, delimiters=",;\t")
    except csv.Error:
        dialect = csv.excel
    rows = list(csv.reader(io.StringIO(raw), dialect))
    header, body = rows[0], rows[1:]
    lines = [f"# Datensatz: {name}", "", f"- Zeilen (ohne Header): **{len(body)}**",
             f"- Spalten: **{len(header)}**", f"- Trennzeichen: `{dialect.delimiter}`", "",
             "## Spalten", ""]
    for i, h in enumerate(header):
        vals = [r[i] for r in body if i < len(r)]
        uniq = sorted(set(vals))
        ex = ", ".join(uniq[:6]) + (" …" if len(uniq) > 6 else "")
        lines.append(f"- `{h}` — {len(uniq)} verschiedene Werte, z. B.: {ex}")
    lines += ["", "## Erste 10 Zeilen", "", "| " + " | ".join(header) + " |",
              "|" + "---|" * len(header)]
    for r in body[:10]:
        lines.append("| " + " | ".join(c.replace("|", "\\|") for c in r) + " |")
    return "\n".join(lines) + "\n"

def code_md(text: str, name: str, lang="r") -> str:
    return f"# {name}\n\n```{lang}\n{text.rstrip()}\n```\n"

for f in sorted(SRC.rglob("*")):
    if not f.is_file():
        continue
    rel = f.relative_to(SRC)
    ext = f.suffix.lower()
    try:
        if ext in (".pdf", ".html"):
            res = md.convert(str(f))
            write(out_path(rel), f"<!-- Quelle: {rel.as_posix()} -->\n\n" + res.text_content)
        elif ext == ".rmd":
            write(out_path(rel), f"<!-- Quelle: {rel.as_posix()} (R Markdown, Code-Chunks = ```{{r}}) -->\n\n" + f.read_text(encoding="utf-8", errors="replace"))
        elif ext == ".r":
            write(out_path(rel), code_md(f.read_text(encoding="utf-8", errors="replace"), rel.name))
        elif ext == ".txt":
            write(out_path(rel), f"# {rel.name}\n\n```\n{f.read_text(encoding='utf-8', errors='replace')}\n```\n")
        elif ext == ".csv":
            write(out_path(rel), csv_md(f, rel.name))
        elif ext == ".tgz" or f.name.endswith(".tgz"):
            with tarfile.open(f) as t:
                for m in t.getmembers():
                    if m.isfile() and re.search(r"\.(R|r|Rd|md|txt)$|DESCRIPTION$|NAMESPACE$", m.name):
                        data = t.extractfile(m).read().decode("utf-8", errors="replace")
                        lang = "r" if m.name.lower().endswith(".r") else ""
                        write(DST / rel.parent / "R-Bibliothek-DAA" / (m.name.replace("/", "__") + ".md"), code_md(data, m.name, lang))
        elif ext == ".zip":
            with zipfile.ZipFile(f) as z:
                for n in z.namelist():
                    if n.lower().endswith(".r"):
                        write(out_path(rel.parent / Path(n).name), code_md(z.read(n).decode("utf-8", errors="replace"), n))
                    else:
                        print("SKIP", rel, "->", n, "(binär)")
        else:
            print("SKIP", rel)
    except Exception as e:
        print("FAIL", rel, e)
