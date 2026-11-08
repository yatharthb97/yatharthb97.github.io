#!/usr/bin/env python3
"""
Fetch Wikipedia's Portuguese word list and write data/maze/portuguese_words.json.

Source: https://en.wikipedia.org/wiki/Wikipedia:Language_learning_centre/Portuguese_word_list
License of the word list: CC BY-SA 4.0 (Wikipedia contributors).

Each entry: {"n": <index as numbered on Wikipedia>, "pt": <Portuguese>, "en": <English>}

Usage:
  python3 scripts/fetch_portuguese_words.py              # download and write JSON
  python3 scripts/fetch_portuguese_words.py --input FILE # parse a saved wikitext file instead
"""

import argparse
import json
import re
import sys
import urllib.request
from pathlib import Path

RAW_URL = ("https://en.wikipedia.org/w/index.php?title="
           "Wikipedia:Language_learning_centre/Portuguese_word_list&action=raw")
OUT = Path(__file__).resolve().parent.parent / "data" / "maze" / "portuguese_words.json"

# A dash with whitespace on at least one side separates Portuguese from English.
# Hyphens inside words ("Bem-sucedido", "localiza-se") have no spaces and are not matched.
SEP = re.compile(r"\s+-\s*|\s*-\s+")

# Entries that have no translation on Wikipedia. Only obvious ones are filled in.
# Index 875 ("reclamation") is an English word with no Portuguese, so it is left empty.
OVERRIDES = {
    "apesar de/não obstante": "despite / notwithstanding",
    "emigrar": "to emigrate",
}


def fetch():
    req = urllib.request.Request(RAW_URL, headers={"User-Agent": "yatharthb97.github.io word-list fetcher"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8")


def parse(raw):
    raw = re.sub(r"<!--.*?-->", "", raw, flags=re.S)           # drop hidden (commented-out) entries
    m = re.search(r"\{\{\s*div col\b[^}]*\}\}(.*?)\{\{\s*div col end\s*\}\}", raw, flags=re.S | re.I)
    if not m:
        sys.exit("could not find the {{Div col}} ... {{div col end}} block")
    words = []
    for line in m.group(1).splitlines():
        if not line.startswith("#"):
            continue
        text = re.sub(r"\s+", " ", line[1:]).strip()
        parts = SEP.split(text, maxsplit=1)
        pt = parts[0].strip(" -")
        en = parts[1].strip(" -") if len(parts) > 1 else ""
        if not en:
            en = OVERRIDES.get(pt, "")
        words.append({"n": len(words) + 1, "pt": pt, "en": en})
    return words


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--input", help="parse this wikitext file instead of downloading")
    a = ap.parse_args()
    raw = Path(a.input).read_text(encoding="utf-8") if a.input else fetch()
    words = parse(raw)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("[\n" + ",\n".join(json.dumps(w, ensure_ascii=False) for w in words) + "\n]\n",
                   encoding="utf-8")
    print(f"wrote {len(words)} words -> {OUT}")
    missing = [w["n"] for w in words if not w["en"]]
    if missing:
        print(f"entries without translation: {missing}")


if __name__ == "__main__":
    main()
