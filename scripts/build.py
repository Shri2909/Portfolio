#!/usr/bin/env python3
"""Build Ek Diya Se Doosra.

Two builds, one source:
  dist/index.html   production: only content/content.json, no review code or data.
  dist/review.html  review: EMPTY fields filled from content/draft.json, amber outlines, watermark.

Everything (CSS, JS, JSON) is inlined into one HTML file. System fonts only. No external requests.
Usage: python3 scripts/build.py [--out DIR]
"""
import copy
import html
import json
import os
import re
import sys
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

# Build guard: production must never contain these.
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
    return c


def gate_unconfirmed(content):
    """Production hook for claims that wait on a confirmation. Nothing is gated at the moment: every visible fact
    in content.json comes from the final copy and evidence package. Kept so a future gate has one place to live."""
    return copy.deepcopy(content)


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
    """Fill only EMPTY fields from draft.json, at the same path. Returns (data, filled_paths)."""
    data = copy.deepcopy(content)
    filled = []

    def walk(node, d, path):
        if isinstance(node, dict) and isinstance(d, dict):
            for k, v in d.items():
                if k in node:
                    if is_empty(node[k]) and not is_empty(v):
                        node[k] = copy.deepcopy(v)
                        filled.extend(leaf_paths(v, path + [k]))
                    else:
                        walk(node[k], v, path + [k])
        elif isinstance(node, list) and isinstance(d, list):
            for i, (n, v) in enumerate(zip(node, d)):
                walk(n, v, path + [i])

    walk(data, draft, [])
    return data, sorted(set(filled))


# ---------------------------------------------------------------- assets

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
    "%3Crect width='64' height='64' rx='14' fill='%230A0B14'/%3E"
    "%3Cpath d='M12 40 C12 54 22 58 32 58 C42 58 52 54 52 40 Z' fill='%23C2410C'/%3E"
    "%3Cpath d='M32 10 C38 20 40 28 32 36 C24 28 26 20 32 10 Z' fill='%23FFB347'/%3E"
    "%3Cpath d='M32 20 C35 25 36 29 32 33 C28 29 29 25 32 20 Z' fill='%23FFD27A'/%3E%3C/svg%3E"
)


SITE_URL = os.environ.get("SITE_URL", "").rstrip("/")


def share_meta(site):
    """Open Graph, Twitter and canonical tags. Absolute URLs only when SITE_URL is known (it is set at publish time)."""
    title = html.escape(site.get("ogTitle") or site.get("title", "Ek Diya Se Doosra"), quote=True)
    desc = html.escape(site.get("description", ""), quote=True)
    img = (SITE_URL + "/og.png") if SITE_URL else "og.png"
    out = [
        '<meta property="og:type" content="website">',
        '<meta property="og:title" content="%s">' % title,
        '<meta property="og:description" content="%s">' % desc,
        '<meta property="og:image" content="%s">' % img,
        '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">',
        '<meta name="twitter:card" content="summary_large_image">',
        '<meta name="twitter:title" content="%s">' % title,
        '<meta name="twitter:description" content="%s">' % desc,
        '<meta name="twitter:image" content="%s">' % img,
        '<link rel="apple-touch-icon" href="apple-touch-icon.png">',
    ]
    if SITE_URL:
        out.append('<link rel="canonical" href="%s/">' % SITE_URL)
        out.append('<meta property="og:url" content="%s/">' % SITE_URL)
    return "\n".join(out)


def write_static(out, site):
    """robots.txt, sitemap.xml, 404.html and favicon.svg next to the production build."""
    (out / "robots.txt").write_text("User-agent: *\nAllow: /\n" + (("Sitemap: %s/sitemap.xml\n" % SITE_URL) if SITE_URL else ""), encoding="utf-8")
    loc = ('<url><loc>%s/</loc></url>' % SITE_URL) if SITE_URL else ""
    (out / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">%s</urlset>\n' % loc, encoding="utf-8")
    svg = urllib.parse.unquote(FAVICON.split(",", 1)[1])
    (out / "favicon.svg").write_text(svg, encoding="utf-8")
    page404 = (SRC / "404.html").read_text(encoding="utf-8").replace("@@TITLE@@", html.escape(site.get("title", ""), quote=True))
    (out / "404.html").write_text(page404, encoding="utf-8")


def render(template, data, mode, filled=None):
    site = data.get("site") or {}
    css = (SRC / "styles.css").read_text(encoding="utf-8")
    head_extra, body_extra = share_meta(site), ""
    js = bundle_js()
    if mode == "review":
        css += "\n" + (SRC / "review" / "review.css").read_text(encoding="utf-8")
        js += "\n(function () {\n" + (SRC / "review" / "review.js").read_text(encoding="utf-8") + "\n})();"
        body_extra = (
            '<div class="review-mark" aria-hidden="true"><span>REVIEW DRAFT - NOT YET SPOKEN BY SHRINIWAS</span></div>\n'
            '<script type="application/json" id="ek-filled">%s</script>' % json_for_html(filled or [])
        )
    page = (
        template.replace("@@TITLE@@", html.escape(site.get("title", "Ek Diya Se Doosra"), quote=True))
        .replace("@@DESCRIPTION@@", html.escape(site.get("description", ""), quote=True))
        .replace("@@FAVICON@@", FAVICON)
        .replace("@@HEAD_EXTRA@@", head_extra)
        .replace("@@BODY_EXTRA@@", body_extra)
        .replace("@@CSS@@", css)
        .replace("@@DATA@@", json_for_html(data))
        .replace("@@JS@@", js.replace("</script", "<\\/script"))
    )
    return page


def guard(page_html):
    """Fail the production build on forbidden strings. """
    scan = page_html
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

    prod_data = gate_unconfirmed(internal_keys_removed(content))
    review_base = internal_keys_removed(content)
    prod = render(template, prod_data, "production")
    problems = guard(prod)
    if problems:
        print("BUILD GUARD FAILED for dist/index.html:")
        for p in problems:
            print("  -", p)
        sys.exit(1)
    (out / "index.html").write_text(prod, encoding="utf-8")
    write_static(out, prod_data.get("site") or {})

    rev_data, filled = review_content(review_base, draft)
    rev = render(template, rev_data, "review", filled)
    (out / "review.html").write_text(rev, encoding="utf-8")

    print("built %s (%d KB) and %s (%d KB); build guard passed; review fills %d fields"
          % ("index.html", len(prod) // 1024, "review.html", len(rev) // 1024, len(filled)))


if __name__ == "__main__":
    main()
