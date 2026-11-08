#!/usr/bin/env python3
"""
maze.py - hidden pages for the Hugo site.

Every maze page lives at  /maze/<random-token>/<slug>/  and is linked from
nowhere: content/maze/_index.md keeps it out of the sitemap, RSS, search,
tags, archives and prev/next links, and extend_head.html adds noindex.

Commands
  python maze.py new "Title" [--slug SLUG] [--encrypt]
      Create a page via `hugo new` with a fresh token; prints its bookmark URL.
      --encrypt  makes it password-locked: write in .maze-src/<slug>.md
                 (gitignored), then run `encrypt`. Public title becomes "🔒".
  python maze.py list
      Print the bookmark URL of every maze page.
  python maze.py rotate SLUG
      Give the page a new token. The old URL stops working.
  python maze.py encrypt SLUG
      Encrypt .maze-src/SLUG.md into content/maze/SLUG.md (asks for a password).
  python maze.py decrypt SLUG
      Recover .maze-src/SLUG.md from the committed ciphertext.

Encryption: PBKDF2-SHA256 (600k iterations) -> AES-256-GCM, decrypted in the
browser by layouts/shortcodes/maze-locked.html. Needs `pip install cryptography`.
What stays public for locked pages: the slug (in the URL and filename) and the
front matter. Only the body is encrypted.
"""

import argparse
import base64
import getpass
import json
import os
import re
import secrets
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MAZE = ROOT / "content" / "maze"
SRC = ROOT / ".maze-src"
TOKEN_BYTES = 24          # 24 bytes -> 32 url-safe characters
PBKDF2_ITER = 600_000

URL_RE = re.compile(r'^url:\s*"?/maze/([^/"]+)/([^/"]+)/"?\s*$', re.M)
TITLE_RE = re.compile(r'^title:\s*(.*)$', re.M)
LOCK_RE = re.compile(r"\{\{<\s*maze-locked\s*>\}\}(.*?)\{\{<\s*/maze-locked\s*>\}\}", re.S)


def die(msg):
    sys.exit(f"maze: {msg}")


def base_url():
    m = re.search(r'^baseURL:\s*"?([^"\s]+)"?', (ROOT / "config.yml").read_text(), re.M)
    return (m.group(1) if m else "/").rstrip("/")


def slugify(text):
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return s or "page"


def split_page(path):
    text = path.read_text()
    m = re.match(r"(---\n.*?\n---\n)(.*)", text, re.S)
    if not m:
        die(f"{path} has no YAML front matter")
    return m.group(1), m.group(2)


def page_path(slug):
    p = MAZE / f"{slug}.md"
    if not p.exists():
        die(f"no such page: {p.relative_to(ROOT)}")
    return p


def page_url(front):
    m = URL_RE.search(front)
    return f"{base_url()}/maze/{m.group(1)}/{m.group(2)}/" if m else None


# ---------------------------------------------------------------- crypto ---

def _aesgcm():
    try:
        from cryptography.hazmat.primitives.ciphers.aead import AESGCM
        return AESGCM
    except ImportError:
        die("encryption needs the 'cryptography' package: pip install cryptography")


def _key(password, salt, iterations):
    import hashlib
    return hashlib.pbkdf2_hmac("sha256", password.encode(), salt, iterations, 32)


def encrypt_text(plain, password):
    salt, iv = os.urandom(16), os.urandom(12)
    ct = _aesgcm()(_key(password, salt, PBKDF2_ITER)).encrypt(iv, plain.encode(), None)
    b = lambda x: base64.b64encode(x).decode()
    payload = {"v": 1, "iter": PBKDF2_ITER, "salt": b(salt), "iv": b(iv), "ct": b(ct)}
    return base64.b64encode(json.dumps(payload, separators=(",", ":")).encode()).decode()


def decrypt_text(payload, password):
    p = json.loads(base64.b64decode(payload))
    d = base64.b64decode
    try:
        plain = _aesgcm()(_key(password, d(p["salt"]), p["iter"])).decrypt(d(p["iv"]), d(p["ct"]), None)
    except Exception:
        die("wrong password")
    return plain.decode()


def ask_password(confirm):
    pw = os.environ.get("MAZE_PASSWORD") or getpass.getpass("Password: ")
    if confirm and not os.environ.get("MAZE_PASSWORD") and pw != getpass.getpass("Again:    "):
        die("passwords do not match")
    if not pw:
        die("empty password")
    return pw


# -------------------------------------------------------------- commands ---

def cmd_new(a):
    slug = a.slug or slugify(a.title)
    target = MAZE / f"{slug}.md"
    if target.exists():
        die(f"{target.relative_to(ROOT)} already exists")
    token = secrets.token_urlsafe(TOKEN_BYTES)
    env = dict(os.environ, HUGO_MAZE_TOKEN=token,
               HUGO_MAZE_TITLE="🔒" if a.encrypt else a.title)
    r = subprocess.run(["hugo", "new", "content", f"maze/{slug}.md", "--kind", "maze"],
                       cwd=ROOT, env=env, capture_output=True, text=True)
    if r.returncode != 0:
        die(r.stderr.strip() or r.stdout.strip())

    if a.encrypt:
        front, _ = split_page(target)
        target.write_text(front + "\n{{< maze-locked >}}{{< /maze-locked >}}\n")
        SRC.mkdir(exist_ok=True)
        src = SRC / f"{slug}.md"
        src.write_text(f"# {a.title}\n\nWrite here. Markdown works.\n")
        print(f"locked page : {target.relative_to(ROOT)}")
        print(f"write in    : {src.relative_to(ROOT)}   (gitignored)")
        print(f"then run    : python maze.py encrypt {slug}")
    else:
        print(f"page        : {target.relative_to(ROOT)}")
    print(f"bookmark    : {base_url()}/maze/{token}/{slug}/")


def cmd_list(a):
    rows = []
    for p in sorted(MAZE.glob("*.md")):
        if p.name == "_index.md":
            continue
        front, body = split_page(p)
        url = page_url(front) or f"{base_url()}/maze/{p.stem}/   (no token: old-style URL)"
        locked = "🔒" if LOCK_RE.search(body) else "  "
        rows.append(f"{locked} {p.stem:<24} {url}")
    print("\n".join(rows) or "no maze pages")


def cmd_rotate(a):
    p = page_path(a.slug)
    front, body = split_page(p)
    if not URL_RE.search(front):
        die(f"{p.name} has no tokenized url: line")
    token = secrets.token_urlsafe(TOKEN_BYTES)
    front = URL_RE.sub(f'url: "/maze/{token}/{a.slug}/"', front)
    p.write_text(front + body)
    print(f"new bookmark: {page_url(front)}")


def cmd_encrypt(a):
    p = page_path(a.slug)
    src = SRC / f"{a.slug}.md"
    if not src.exists():
        die(f"no plaintext at {src.relative_to(ROOT)} (use `decrypt` to recover it)")
    front, _ = split_page(p)
    payload = encrypt_text(src.read_text(), ask_password(confirm=True))
    p.write_text(front + "\n{{< maze-locked >}}\n" + payload + "\n{{< /maze-locked >}}\n")
    print(f"encrypted   : {p.relative_to(ROOT)}")
    print(f"bookmark    : {page_url(front)}")


def cmd_decrypt(a):
    p = page_path(a.slug)
    _, body = split_page(p)
    m = LOCK_RE.search(body)
    if not m or not m.group(1).strip():
        die(f"{p.name} holds no ciphertext")
    plain = decrypt_text(m.group(1).strip(), ask_password(confirm=False))
    SRC.mkdir(exist_ok=True)
    src = SRC / f"{a.slug}.md"
    src.write_text(plain)
    print(f"recovered   : {src.relative_to(ROOT)}")


def main():
    ap = argparse.ArgumentParser(description="Hidden pages under /maze/<token>/.")
    sub = ap.add_subparsers(dest="cmd", required=True)
    n = sub.add_parser("new", help="create a hidden page")
    n.add_argument("title")
    n.add_argument("--slug", help="URL/file name (default: from title)")
    n.add_argument("--encrypt", action="store_true", help="password-lock the page")
    sub.add_parser("list", help="print bookmark URLs")
    for name, h in [("rotate", "issue a new token"), ("encrypt", "encrypt plaintext source"),
                    ("decrypt", "recover plaintext source")]:
        sub.add_parser(name, help=h).add_argument("slug")
    a = ap.parse_args()
    {"new": cmd_new, "list": cmd_list, "rotate": cmd_rotate,
     "encrypt": cmd_encrypt, "decrypt": cmd_decrypt}[a.cmd](a)


if __name__ == "__main__":
    main()
