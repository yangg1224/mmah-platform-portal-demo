"""Static checks for Meeting mode (PRD §6.7 MTG-1..10): pages/meeting.html + pages/to-confirm.html.

    python3 scripts/test_meeting.py

Stdlib only (html.parser). Prints PASS/FAIL lines and exits non-zero on any FAIL.
"""
import re
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input",
        "link", "meta", "param", "source", "track", "wbr"}

EXPECTED_TITLES = [
    "Where we are",
    "Principles",
    "First two data products",
    "How data flows",
    "90 days and decisions",
]

BANNED_TERMS = [
    "Fabric", "Tender", "8121", "Azure", "AWS", "Amazon", "Google", "Microsoft",
    "Oracle", "OCI", "IBM", "ThinkOn", "Compugen", "OnX", "Databricks", "Synapse",
    "Purview", "Snowflake", "Katona", "Passero", "Jain", "Haque", "Scarfo", "Mahlooji",
]
BANNED_YEAR = re.compile(r"\b(19|20)\d{2}\b")
MONTHS = (
    "January", "February", "March", "April", "May", "June", "July", "August",
    "September", "October", "November", "December",
    "Jan", "Feb", "Mar", "Apr", "Jun", "Jul", "Aug", "Sep", "Sept", "Nov", "Dec",
)
BANNED_MONTH = re.compile(r"\b(" + "|".join(MONTHS) + r")\b", re.I)


class Node:
    def __init__(self, tag, attrs):
        self.tag = tag
        self.attrs = dict(attrs)
        self.children = []

    def cls(self):
        return self.attrs.get("class", "").split()


class DOMParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("#root", {})
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.stack[-1].children.append(Node(tag, attrs))

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                break

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def parse(path):
    p = DOMParser()
    p.feed(path.read_text(encoding="utf-8"))
    return p.root


def find_all(node, pred, out=None):
    if out is None:
        out = []
    for c in node.children:
        if isinstance(c, Node):
            if pred(c):
                out.append(c)
            find_all(c, pred, out)
    return out


def has_class(node, cls):
    return cls in node.cls()


def text_of(node, skip_aria_hidden=False):
    parts = []

    def walk(n):
        for c in n.children:
            if isinstance(c, str):
                parts.append(c)
            elif isinstance(c, Node):
                if skip_aria_hidden and c.attrs.get("aria-hidden") == "true":
                    continue
                walk(c)

    walk(node)
    return "".join(parts)


def text_of_excluding(node, exclude):
    parts = []

    def walk(n):
        for c in n.children:
            if isinstance(c, str):
                parts.append(c)
            elif isinstance(c, Node):
                if c is exclude or c.attrs.get("aria-hidden") == "true":
                    continue
                walk(c)

    walk(node)
    return "".join(parts)


def word_count(text):
    return len([t for t in text.split() if any(ch.isalnum() for ch in t)])


def main():
    results = []

    def ok(cond, msg):
        results.append((bool(cond), msg))
        print(("PASS: " if cond else "FAIL: ") + msg, flush=True)

    meeting_path = ROOT / "pages" / "meeting.html"
    confirm_path = ROOT / "pages" / "to-confirm.html"
    index_path = ROOT / "index.html"

    meeting = parse(meeting_path)
    confirm = parse(confirm_path)

    # --- screens ---
    screens = find_all(meeting, lambda n: n.tag == "section" and has_class(n, "mm-screen"))
    ok(len(screens) == 5, f"meeting.html has exactly 5 section.mm-screen (found {len(screens)})")

    screens_sorted = sorted(screens, key=lambda s: s.attrs.get("data-screen", ""))
    ok([s.attrs.get("data-screen") for s in screens_sorted] == ["1", "2", "3", "4", "5"],
       "screens carry data-screen 1..5")
    ok(screens == screens_sorted, "screens appear in document order 1..5")

    titles = [s.attrs.get("data-title") for s in screens_sorted]
    ok(titles == EXPECTED_TITLES, f"screen titles match expected list (got {titles})")

    for s in screens_sorted:
        n = s.attrs.get("data-screen", "?")
        headlines = find_all(s, lambda x: x.tag == "h2" and has_class(x, "mm-headline"))
        visuals = find_all(s, lambda x: has_class(x, "mm-visual"))
        ok(len(headlines) == 1, f"screen {n} has exactly one h2.mm-headline (found {len(headlines)})")
        ok(len(visuals) == 1, f"screen {n} has exactly one .mm-visual (found {len(visuals)})")
        headline = headlines[0] if headlines else None
        body_text = text_of_excluding(s, headline) if headline else text_of(s, skip_aria_hidden=True)
        wc = word_count(body_text)
        ok(wc <= 40, f"screen {n} body word count <= 40 (got {wc})")

    full_screens_text = " ".join(text_of(s) for s in screens_sorted)
    hit = None
    for term in BANNED_TERMS:
        if re.search(r"\b" + re.escape(term) + r"\b", full_screens_text, re.I):
            hit = term
            break
    ok(hit is None, f"no banned vendor/person terms in the 5 screens (first hit: {hit})")
    ok(not BANNED_YEAR.search(full_screens_text), "no 4-digit 19xx/20xx year in the 5 screens")
    ok(not BANNED_MONTH.search(full_screens_text), "no month name in the 5 screens")

    # --- meeting nav ---
    navs = find_all(meeting, lambda n: n.tag == "nav" and n.attrs.get("aria-label") == "Meeting")
    ok(len(navs) == 1, "meeting.html has one nav[aria-label=Meeting]")
    if navs:
        links = find_all(navs[0], lambda n: n.tag == "a")
        hrefs = [a.attrs.get("href", "") for a in links]
        allowed = {f"#screen={i}" for i in range(1, 6)} | {"to-confirm.html"}
        ok(hrefs and set(hrefs) <= allowed and len(hrefs) == 6,
           f"meeting nav links only to the 5 screens + to-confirm.html (got {hrefs})")

    # screen 4 -> flows.html, screen 5 -> to-confirm.html
    s4_links = [a.attrs.get("href", "") for a in find_all(screens_sorted[3], lambda n: n.tag == "a")]
    ok("flows.html" in s4_links, f"screen 4 links to flows.html (got {s4_links})")
    s5_links = [a.attrs.get("href", "") for a in find_all(screens_sorted[4], lambda n: n.tag == "a")]
    ok(any(h == "to-confirm.html" for h in s5_links), f"screen 5 links to to-confirm.html (got {s5_links})")

    # --- to-confirm.html ---
    tc_items = find_all(confirm, lambda n: n.tag == "li" and has_class(n, "tc-item"))
    ok(len(tc_items) >= 1, "to-confirm.html has tc-item entries")
    bad = []
    for li in tc_items:
        tags = find_all(li, lambda n: has_class(n, "tag"))
        if not any(text_of(t).strip() == "Assumption" for t in tags):
            bad.append(text_of(li).strip()[:40])
    ok(not bad, f"every li.tc-item has a tag with text exactly 'Assumption' (bad: {bad})")

    confirm_text = text_of(confirm)
    for term in ("Fabric", "Tender-8121", "Azure"):
        ok(term in confirm_text, f"to-confirm.html mentions '{term}'")

    confirm_navs = find_all(confirm, lambda n: n.tag == "nav" and n.attrs.get("aria-label") == "Meeting")
    ok(len(confirm_navs) == 1, "to-confirm.html has one nav[aria-label=Meeting]")
    if confirm_navs:
        c_links = find_all(confirm_navs[0], lambda n: n.tag == "a")
        c_hrefs = [a.attrs.get("href", "") for a in c_links]
        c_allowed = {f"meeting.html#screen={i}" for i in range(1, 6)} | {"to-confirm.html"}
        ok(c_hrefs and set(c_hrefs) <= c_allowed and len(c_hrefs) == 6,
           f"to-confirm nav links only to the 5 screens + to-confirm.html (got {c_hrefs})")

    # --- index.html links to meeting mode ---
    index = parse(index_path)
    idx_links = [a.attrs.get("href", "") for a in find_all(index, lambda n: n.tag == "a")]
    ok("pages/meeting.html" in idx_links, "index.html links to pages/meeting.html")

    failed = [m for good, m in results if not good]
    print(f"\n{len(results) - len(failed)} passed, {len(failed)} failed")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
