#!/usr/bin/env python3
"""Stamp every 'Defined in' reference in the served site (index.html, pages/, js/) with the short SHA
of the last commit that touched that file (TKT-4 / MAP-3 file@sha rule).

    python3 scripts/build_refs.py           # rewrite path/file.ext@<sha7> in place (run locally, needs .git)
    python3 scripts/build_refs.py --check   # exit 1 on any folder, tag, missing file or stale / fake SHA

Runs locally only. The stamped files are committed; Vercel's build (scripts/build_site.mjs) only
copies files and never calls git. Never invents a SHA: a path with no git history fails.
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
# Anything path-like with a slash followed by @: catches files, folders (x/@...) and tags (@v1.2.0).
TOKEN = re.compile(r"(?<![\w.@/-])([A-Za-z0-9_.\-]+(?:/[A-Za-z0-9_.\-]*)+)@([A-Za-z0-9.\-]+)")
GOOD = re.compile(r"^[A-Za-z0-9_.\-]+(?:/[A-Za-z0-9_.\-]+)*\.[A-Za-z0-9]+$")


def git(*args):
    return subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True)


def served_files():
    out = git("ls-files", "index.html", "pages", "js").stdout.split()
    return [ROOT / f for f in out if f.endswith((".html", ".js"))]


def last_sha(path):
    sha = git("log", "-1", "--format=%h", "--abbrev=7", "--", path).stdout.strip()[:7]
    return sha if re.fullmatch(r"[0-9a-f]{7}", sha) else None


def problems_for(path, sha):
    if not GOOD.match(path):
        return f"{path}@{sha}: not a file path (folder or no extension)"
    if not (ROOT / path).is_file():
        return f"{path}@{sha}: file does not exist in the repo"
    if not re.fullmatch(r"[0-9a-f]{7}", sha):
        return f"{path}@{sha}: not a 7-hex commit SHA (tags are not allowed)"
    if git("cat-file", "-e", f"{sha}:{path}").returncode != 0:
        return f"{path}@{sha}: file not present at that commit"
    want = last_sha(path)
    if want is None:
        return f"{path}: no git history (commit and push it first)"
    if sha != want:
        return f"{path}@{sha}: stale or made-up SHA, last commit touching it is {want}"
    return None


def main(check):
    errors, changed = [], []
    for f in served_files():
        text = f.read_text(encoding="utf-8")
        rel = f.relative_to(ROOT)

        def fix(m):
            path, sha = m.group(1), m.group(2)
            if check or not GOOD.match(path) or not (ROOT / path).is_file():
                err = problems_for(path, sha)
                if err:
                    errors.append(f"{rel}: {err}")
                return m.group(0)
            new = last_sha(path)
            if not new:
                errors.append(f"{rel}: {path}: no git history (commit and push it first)")
                return m.group(0)
            return f"{path}@{new}"

        out = TOKEN.sub(fix, text)
        if out != text and not check:
            f.write_text(out, encoding="utf-8")
            changed.append(str(rel))
    for e in errors:
        print("FAIL: " + e)
    if errors:
        return 1
    n = sum(len(TOKEN.findall(f.read_text(encoding="utf-8"))) for f in served_files())
    print(("OK: " if check else "Stamped: ") + f"{n} file@sha refs" + (f" ({len(changed)} files rewritten)" if changed else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main("--check" in sys.argv))
