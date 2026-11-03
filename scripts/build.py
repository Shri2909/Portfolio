#!/usr/bin/env python3
"""Build Case File No. 001.

Two builds, one source:
  dist/index.html   production: only content/content.json, no review code or data.
  dist/review.html  review: EMPTY fields filled from content/draft.json, amber outlines, watermark.

Everything (CSS, JS, fonts as base64 woff2, JSON) is inlined into one HTML file. No external requests.
Usage: python3 scripts/build.py [--out DIR]
"""
import base64
import copy
import html
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

FONTS = [
    # family, file, weight, style
    ("Fraunces", "fraunces-wght.woff2", "100 900", "normal"),
    ("Source Serif 4", "source-serif-4-wght.woff2", "200 900", "normal"),
    ("Source Serif 4", "source-serif-4-wght-italic.woff2", "200 900", "italic"),
    ("Courier Prime", "courier-prime-400.woff2", "400", "normal"),
    ("Courier Prime", "courier-prime-700.woff2", "700", "normal"),
]

# Build guard: production must never contain these (checked on the whole file, fonts excluded).
FORBIDDEN = [
    ("lorem", re.compile(r"lorem", re.I)),
    ("TODO", re.compile(r"TODO")),
    ("[__]", re.compile(re.escape("[__]"))),
    ("SAMPLE", re.compile(r"SAMPLE")),
    ("DRAFT", re.compile(r"DRAFT")),
    ("draft", re.compile(r"draft", re.I)),
]


def load(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def is_empty(v):
    return v is None or v == "" or v == [] or v == {}


# ---------------------------------------------------------------- content

def internal_keys_removed(content):
    """Strip build/dev notes that are not page content."""
    c = copy.deepcopy(content)
    c.pop("_meta", None)
    if isinstance(c.get("exhibit0"), dict):
        c["exhibit0"].pop("excludedTakes", None)
    if isinstance(c.get("brief"), dict):
        c["brief"].pop("note", None)
    for m in (c.get("wispr") or {}).get("moments", []) or []:
        m.pop("note", None)
    return c


def set_path(root, path, value):
    cur = root
    for key in path[:-1]:
        cur = cur[key]
    cur[path[-1]] = value


def get_path(root, path):
    cur = root
    for key in path:
        try:
            cur = cur[key]
        except (KeyError, IndexError, TypeError):
            return None
    return cur


def leaf_paths(value, prefix):
    """Dotted paths for every string leaf, so the review build can outline each filled field."""
    out = []
    if isinstance(value, dict):
        for k, v in value.items():
            out += leaf_paths(v, prefix + [k])
    elif isinstance(value, list):
        for i, v in enumerate(value):
            out += leaf_paths(v, prefix + [i])
    elif isinstance(value, str) and value.strip():
        out.append(".".join(str(p) for p in prefix))
    return out


def review_content(content, draft):
    """Fill only EMPTY fields from draft.json. Returns (data, filled_paths)."""
    data = copy.deepcopy(content)
    filled = []

    def fill(path, value):
        if is_empty(value):
            return
        cur = get_path(data, path)
        if not is_empty(cur):
            return
        set_path(data, path, copy.deepcopy(value))
        filled.extend(leaf_paths(value, path))

    d = draft
    fill(["brief", "summary"], (d.get("brief") or {}).get("summary"))
    fill(["against", "reasons"], (d.get("against") or {}).get("reasons"))

    worth = d.get("specialtyWorth") or {}
    for i, sp in enumerate(data.get("specialties", [])):
        fill(["specialties", i, "worth"], worth.get(sp.get("id")))

    for ex in ("exhibitA", "exhibitB"):
        dx = d.get(ex) or {}
        for beat in ("did", "didnt", "learned", "next"):
            fill([ex, "beats", beat], (dx.get("beats") or {}).get(beat))
        fill([ex, "crossExam"], dx.get("crossExam"))

    pit = (d.get("pitdb") or {}).get("text")
    for i, case in enumerate((data.get("ledger") or {}).get("cases", [])):
        if case.get("id") == "c1" and pit and "note" not in case:
            case["note"] = pit
            filled.append("ledger.cases.%d.note" % i)

    de = d.get("effects") or {}
    intro = "\n\n".join(x for x in (de.get("setbacks"), de.get("debate")) if x)
    fill(["effects", "intro"], intro)
    fill(["effects", "timeline"], de.get("timeline"))
    fill(["effects", "philosophy", "text"], (de.get("philosophy") or {}).get("text"))

    dd = {f.get("id"): f for f in (d.get("decisions") or {}).get("forks", [])}
    for i, fk in enumerate((data.get("decisions") or {}).get("forks", [])):
        src = dd.get(fk.get("id")) or {}
        fill(["decisions", "forks", i, "changeMyMind"], src.get("changeMyMind"))
        if src.get("narration") and "narration" not in fk:
            fk["narration"] = src["narration"]
            filled.append("decisions.forks.%d.narration" % i)

    dl = d.get("lab") or {}
    for key in ("hypothesis", "usableDefinition", "preregisteredAt"):
        fill(["lab", key], dl.get(key))
    if dl.get("protocol") and "protocol" not in data.get("lab", {}):
        data["lab"]["protocol"] = dl["protocol"]
        filled.append("lab.protocol")

    dw = (d.get("wispr") or {}).get("moments") or {}
    for i, m in enumerate((data.get("wispr") or {}).get("moments", [])):
        src = dw.get(m.get("id")) or {}
        fill(["wispr", "moments", i, "suggests"], src.get("suggests"))
        fill(["wispr", "moments", i, "firstTest"], src.get("firstTest"))
    fill(["wispr", "pov", "text"], ((d.get("wispr") or {}).get("pov") or {}).get("text"))

    dc = d.get("closing") or {}
    fill(["closing", "findings"], dc.get("findings"))
    fill(["closing", "line"], dc.get("line"))
    fill(["closing", "openQuestions"], dc.get("openQuestions"))
    return data, sorted(set(filled))


# ---------------------------------------------------------------- assets

def fonts_css():
    out = []
    for family, fname, weight, style in FONTS:
        b64 = base64.b64encode((SRC / "fonts" / fname).read_bytes()).decode("ascii")
        out.append(
            "@font-face{font-family:'%s';font-style:%s;font-weight:%s;font-display:swap;"
            "src:url(data:font/woff2;base64,%s) format('woff2');}" % (family, style, weight, b64)
        )
    return "\n".join(out)


def bundle_js():
    parts = []
    for p in sorted((SRC / "js").glob("*.js")):
        text = p.read_text(encoding="utf-8")
        text = re.sub(r"^\s*'use strict';\s*", "", text, count=1)
        parts.append("/* ---- %s ---- */\n%s" % (p.name, text))
    return "(function () {\n'use strict';\n" + "\n".join(parts) + "\n})();"


def json_for_html(obj):
    s = json.dumps(obj, ensure_ascii=False, separators=(",", ":"))
    return s.replace("</", "<\\/").replace("<!--", "<\\!--").replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")


FAVICON = (
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E"
    "%3Crect width='64' height='64' rx='14' fill='%2315211B'/%3E"
    "%3Ccircle cx='28' cy='28' r='14' fill='none' stroke='%23B8872B' stroke-width='6'/%3E"
    "%3Cpath d='M39 39 L52 52' stroke='%23B8872B' stroke-width='7' stroke-linecap='round'/%3E"
    "%3Ccircle cx='28' cy='28' r='6' fill='%23D2452E'/%3E%3C/svg%3E"
)


def render(template, data, mode, filled=None):
    site = data.get("site") or {}
    css = (SRC / "styles.css").read_text(encoding="utf-8")
    for extra in sorted((SRC / "css").glob("*.css")):
        css += "\n" + extra.read_text(encoding="utf-8")
    head_extra, body_extra = "", ""
    js = bundle_js()
    if mode == "review":
        css += "\n" + (SRC / "review" / "review.css").read_text(encoding="utf-8")
        js += "\n(function () {\n" + (SRC / "review" / "review.js").read_text(encoding="utf-8") + "\n})();"
        body_extra = (
            '<div class="review-mark" aria-hidden="true"><span>REVIEW DRAFT - NOT YET SPOKEN BY SHRINIWAS</span></div>\n'
            '<script type="application/json" id="cf-filled">%s</script>' % json_for_html(filled or [])
        )
    page = (
        template.replace("@@TITLE@@", html.escape(site.get("title", "Case File No. 001"), quote=True))
        .replace("@@DESCRIPTION@@", html.escape(site.get("description", ""), quote=True))
        .replace("@@FAVICON@@", FAVICON)
        .replace("@@HEAD_EXTRA@@", head_extra)
        .replace("@@BODY_EXTRA@@", body_extra)
        .replace("@@FONTS@@", fonts_css())
        .replace("@@CSS@@", css)
        .replace("@@DATA@@", json_for_html(data))
        .replace("@@JS@@", js.replace("</script", "<\\/script"))
    )
    return page


def guard(page_html):
    """Fail the production build on forbidden strings. Base64 font payloads are excluded from the scan."""
    scan = re.sub(r"data:font/woff2;base64,[A-Za-z0-9+/=]+", "data:font", page_html)
    problems = []
    for name, rx in FORBIDDEN:
        for m in rx.finditer(scan):
            a = max(0, m.start() - 40)
            problems.append("forbidden %r near: ...%s..." % (name, scan[a:m.end() + 40].replace("\n", " ")))
            break
    return problems


def main():
    out = ROOT / "dist"
    if "--out" in sys.argv:
        out = Path(sys.argv[sys.argv.index("--out") + 1])
    out.mkdir(parents=True, exist_ok=True)

    content = load(ROOT / "content" / "content.json")
    draft = load(ROOT / "content" / "draft.json")
    template = (SRC / "template.html").read_text(encoding="utf-8")

    prod_data = internal_keys_removed(content)
    prod = render(template, prod_data, "production")
    problems = guard(prod)
    if problems:
        print("BUILD GUARD FAILED for dist/index.html:")
        for p in problems:
            print("  -", p)
        sys.exit(1)
    (out / "index.html").write_text(prod, encoding="utf-8")

    rev_data, filled = review_content(prod_data, draft)
    rev = render(template, rev_data, "review", filled)
    (out / "review.html").write_text(rev, encoding="utf-8")

    print("built %s (%d KB) and %s (%d KB); build guard passed; review fills %d fields"
          % ("index.html", len(prod) // 1024, "review.html", len(rev) // 1024, len(filled)))


if __name__ == "__main__":
    main()
