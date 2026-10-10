#!/usr/bin/env python3
"""Validate the toolkit manifest (PRD §6.6 TKT-3; CI check).

    python3 scripts/validate_toolkit.py [--manifest config/toolkit.yaml]

Exits 1 when any check fails, 0 otherwise. Checks:
  * TKT-3: every tool lists at least one branch box, and every branch box is a box or band that
    exists on the Data and Analytics Branch (DAB) chart (ALLOWED_BRANCH_BOXES below, taken from
    /workspace/mmah-dab-current-structure.png and §3 of the ideal-state toolkit doc). The manifest's
    own `branch_boxes` catalogue must match the chart too, so a new box can't be invented there.
  * Schema (TKT-2): required fields, unique ids, exactly one of column / bar / container, known
    owning unit, phase, status, per-environment statuses, valid upstream / downstream / edge ids.
  * TKT-11: no IP addresses or ranges, GUID-style identifiers, connection strings or secrets.
  * The generated js/toolkit-manifest.generated.js is up to date (run scripts/build_toolkit.py).
Needs PyYAML (`pip install --user pyyaml`).
"""
import argparse
import re
import sys
from pathlib import Path

try:
    import yaml
except ImportError:  # pragma: no cover
    sys.exit("PyYAML is required: pip install --user pyyaml")

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))

# DAB chart (Data and Analytics Branch, current structure): id -> (DAB function or band, label).
# Changing this list means the branch chart changed; it is deliberately not read from the manifest.
ALLOWED_BRANCH_BOXES = {
    # Data Acquisition (Get Data) - DPU
    "dpr": ("acq", "Data in Policy & Regulation"),
    "dsa": ("acq", "Data Procurement & Data Sharing Agreement"),
    "mpdr": ("acq", "MPDR (Municipal Planning Data Reporting)"),
    # Metadata Management (Define Data) - SDGU governance
    "cls": ("meta", "Data Classification"),
    "std": ("meta", "Standardizing Data"),
    "dict": ("meta", "Data Dictionary & Lineage"),
    "mdm": ("meta", "Master Data Management"),
    # Data Pipeline (Process Data) - SDGU engineering
    "ingest": ("pipe", "Data Ingestion"),
    "clean": ("pipe", "Data Cleaning"),
    "xform": ("pipe", "Data Transformation"),
    "integ": ("pipe", "Data Integration & Consolidation"),
    # Data Quality (Check Data)
    "dqp": ("dq", "Data Quality Program"),
    "dqm": ("dq", "Data Quality Monitoring"),
    # Analytics Products (Analyze & Report) - BIRU
    "adhoc": ("ana", "Analytics (One-off & Projects)"),
    "fact": ("ana", "Fact Checking"),
    "rpt": ("ana", "Reports & Dashboards"),
    "ml": ("ana", "Machine Learning & AI (future state)"),
    "kpi": ("ana", "KPI & Metric Development"),
    "perf": ("ana", "Performance Monitoring"),
    # Cross-cutting bands
    "council": ("band", "Data Council, Steering Committee & Data Working Groups"),
    "access": ("band", "Data Access & Permissions Framework"),
    "policy": ("band", "Ministry Data Policies"),
    "literacy": ("band", "Data Maturity & Literacy"),
    "procimp": ("band", "Data & Analytics Process Improvement"),
    "projmgmt": ("band", "Analytics Project Management"),
    "change": ("band", "Data & Analytics Change Management"),
}
TAGS = {"EXT", "ING", "STORE", "PROC", "SERVE", "ENR", "SVC", "GOV", "MON", "PLAT", "PORTAL"}
REQUIRED = ("id", "tag", "title", "subtitle", "branch_boxes", "owning_unit", "phase", "status",
            "status_source", "status_by_env", "summary", "why", "iac", "docs")
ENV_STATUSES = {"planned", "prov", "live", "na"}
FORBIDDEN = [
    (re.compile(r"\b\d{1,3}(?:\.\d{1,3}){3}(?:/\d{1,2})?\b"), "IP address or range"),
    (re.compile(r"\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b"), "GUID-style identifier"),
    (re.compile(r"(?i)\b(password|passwd|secret|api[_-]?key|access[_-]?key|token|sas|accountkey)\s*[:=]\s*\S+"), "credential-like value"),
    (re.compile(r"(?i)-----BEGIN [A-Z ]*PRIVATE KEY-----"), "private key"),
    (re.compile(r"(?i)\b[a-z0-9-]+\.vault\.azure\.net\b"), "key store URI"),
    (re.compile(r"(?i)DefaultEndpointsProtocol=|SharedAccessSignature="), "connection string"),
]


def validate(manifest, raw_text):
    errors = []
    err = errors.append

    # The manifest's branch-box catalogue must be a subset of the DAB chart.
    catalogue = {}
    for b in manifest.get("branch_boxes") or []:
        allowed = ALLOWED_BRANCH_BOXES.get(b.get("id"))
        if not allowed:
            err(f"branch_boxes: '{b.get('id')}' ({b.get('label')}) is not a box or band on the DAB chart")
        elif (b.get("function"), b.get("label")) != allowed:
            err(f"branch_boxes: '{b['id']}' must be {allowed[1]!r} under '{allowed[0]}' as on the DAB chart")
        else:
            catalogue[b["id"]] = b

    columns = {c["id"] for c in manifest.get("columns") or []}
    bars = {b["id"] for b in manifest.get("bars") or []}
    containers = {c["id"] for c in manifest.get("containers") or []}
    units = {u["id"] for u in manifest.get("units") or []}
    for u in manifest.get("units") or []:
        for fld in ("label", "legend_label", "name"):
            if VERIFY_WORDING.search(str(u.get(fld) or "")):
                err(f"unit {u['id']}: {fld} uses '(verify)' / 'to verify'; use '(to be confirmed)'")
    phases = {p["id"] for p in manifest.get("phases") or []}
    statuses = set((manifest.get("statuses") or {}).keys()) - {"na"}
    envs = manifest.get("environments") or []
    tools = manifest.get("tools") or []
    ids = [t.get("id") for t in tools]
    known = set(ids)

    for i, t in enumerate(tools):
        name = t.get("id") or f"tools[{i}]"
        for f in REQUIRED:
            if f not in t or t[f] in (None, ""):
                if f != "branch_boxes":
                    err(f"{name}: missing required field '{f}'")
        for fld in ("owner", "name"):
            if VERIFY_WORDING.search(str(t.get(fld) or "")):
                err(f"{name}: {fld} uses '(verify)' / 'to verify'; use '(to be confirmed)' (CLUSTER? legend wording)")
        both = set(t.get("upstream") or []) & set(t.get("downstream") or [])
        if both:
            err(f"{name}: {sorted(both)} listed as both upstream and downstream")
        iac = t.get("iac")
        if iac not in (None, "na", "tbd"):
            import build_toolkit
            if "@" in str(iac) or not build_toolkit.IAC_PATH.match(str(iac)) or not (ROOT / str(iac)).is_file():
                err(f"{name}: iac must be an existing repo file path like services/x/rules.yaml "
                    f"(no @tag, no folder; the SHA is added at build time): {iac}")
        boxes = t.get("branch_boxes") or []
        if not boxes:
            err(f"{name}: no branch box (TKT-3: every tool must trace to a DAB chart box or band)")
        for b in boxes:
            if b not in ALLOWED_BRANCH_BOXES:
                err(f"{name}: branch box '{b}' is not on the DAB chart")
            elif b not in catalogue:
                err(f"{name}: branch box '{b}' is missing from the manifest's branch_boxes catalogue")
        places = [k for k in ("column", "bar", "container") if t.get(k)]
        if len(places) != 1:
            err(f"{name}: needs exactly one of column / bar / container (has {places or 'none'})")
        if t.get("column") and t["column"] not in columns:
            err(f"{name}: unknown column '{t['column']}'")
        if t.get("column") and not isinstance(t.get("row"), int):
            err(f"{name}: column tools need an integer row")
        if t.get("bar") and t["bar"] not in bars:
            err(f"{name}: unknown bar '{t['bar']}'")
        if t.get("container") and t["container"] not in containers:
            err(f"{name}: unknown container '{t['container']}'")
        if t.get("tag") not in TAGS:
            err(f"{name}: tag '{t.get('tag')}' is not a vendor-neutral type tag")
        if t.get("owning_unit") not in units:
            err(f"{name}: unknown owning unit '{t.get('owning_unit')}'")
        if t.get("phase") not in phases:
            err(f"{name}: unknown phase '{t.get('phase')}'")
        if t.get("status") not in statuses:
            err(f"{name}: unknown status '{t.get('status')}'")
        by_env = t.get("status_by_env") or {}
        if set(by_env) != set(envs) or not set(by_env.values()) <= ENV_STATUSES:
            err(f"{name}: status_by_env must give {envs} each one of {sorted(ENV_STATUSES)}")
        for rel in ("upstream", "downstream"):
            for o in t.get(rel) or []:
                if o not in known:
                    err(f"{name}: {rel} '{o}' is not a tool id")
        for d in t.get("docs") or []:
            if not d.get("label"):
                err(f"{name}: every doc needs a label")

    for dup in sorted({x for x in ids if ids.count(x) > 1}):
        err(f"duplicate tool id '{dup}'")
    for e in manifest.get("edges") or []:
        for end in ("from", "to"):
            v = e.get(end, "")
            ok = v in known or (v.startswith("container:") and v[10:] in containers)
            if not ok:
                err(f"edge {e.get('from')} -> {e.get('to')}: '{v}' is not a tool or container")
        if e.get("type") not in (manifest.get("edge_types") or {}):
            err(f"edge {e.get('from')} -> {e.get('to')}: unknown type '{e.get('type')}'")
    for c in manifest.get("considered_not_on_blueprint") or []:
        if not c.get("name") or not c.get("reason"):
            err("considered_not_on_blueprint: every item needs a name and a one-line reason")
    if not (manifest.get("banner") or {}).get("text"):
        err("banner.text is required (TKT-9)")

    for n, line in enumerate(raw_text.splitlines(), 1):
        if line.lstrip().startswith("#"):
            continue
        for rx, what in FORBIDDEN:
            if rx.search(line):
                err(f"line {n}: looks like a {what} (TKT-11 forbids these in the manifest)")
    return errors


VERIFY_WORDING = re.compile(r"\(\s*verify|\bto verify\b", re.I)
DEFINED_IN = re.compile(r"^([A-Za-z0-9_.\-]+(?:/[A-Za-z0-9_.\-]+)*\.[A-Za-z0-9]+)@([0-9a-f]{7})$")


def check_defined_in(value):
    """TKT-4: 'path/file.ext@sha7', where sha is a commit that touched that file (git history required)."""
    import subprocess
    m = DEFINED_IN.match(value)
    if not m:
        return f"Defined in '{value}' is not path/file.ext@<7-hex sha>"
    path, sha = m.groups()
    ok = subprocess.run(["git", "cat-file", "-e", f"{sha}:{path}"], cwd=ROOT, capture_output=True).returncode == 0
    touched = subprocess.run(["git", "log", "-1", "--format=%h", "--abbrev=7", sha, "--", path], cwd=ROOT,
                             capture_output=True, text=True).stdout.strip()[:7]
    if not ok or touched != sha:
        return f"Defined in '{value}': {sha} is not a commit that touched {path}"
    return None


def check_generated_defined_in():
    import json
    text = (ROOT / "js" / "toolkit-manifest.generated.js").read_text(encoding="utf-8")
    vals = re.findall(r'"iac":\s*"([^"]+)"', text)
    return [e for e in (check_defined_in(v) for v in vals if v not in ("na", "tbd")) if e]


def main():
    ap = argparse.ArgumentParser(description="Validate the toolkit manifest (TKT-3).")
    ap.add_argument("--manifest", default=str(ROOT / "config" / "toolkit.yaml"))
    ap.add_argument("--skip-generated", action="store_true", help="don't check js/toolkit-manifest.generated.js")
    args = ap.parse_args()
    path = Path(args.manifest)
    raw = path.read_text(encoding="utf-8")
    manifest = yaml.safe_load(raw)
    errors = validate(manifest, raw)
    if not args.skip_generated and not errors and path.resolve() == (ROOT / "config" / "toolkit.yaml").resolve():
        import build_toolkit
        gen = build_toolkit.OUT
        if not gen.exists() or gen.read_text(encoding="utf-8") != build_toolkit.render(manifest):
            errors.append("js/toolkit-manifest.generated.js is stale: run python3 scripts/build_toolkit.py")
    if not args.skip_generated and not errors:
        errors.extend(check_generated_defined_in())
    tools = manifest.get("tools") or []
    if errors:
        print(f"FAIL: {len(errors)} problem(s) in {path.name}")
        for e in errors:
            print("  - " + e)
        return 1
    traced = len({b for t in tools for b in t["branch_boxes"]})
    print(f"PASS: {len(tools)} tools, each traced to a DAB chart box or band ({traced} of "
          f"{len(ALLOWED_BRANCH_BOXES)} boxes/bands used); {len(manifest.get('edges') or [])} edges; "
          f"{len(manifest.get('considered_not_on_blueprint') or [])} considered-not-on-blueprint items")
    return 0


if __name__ == "__main__":
    sys.exit(main())
