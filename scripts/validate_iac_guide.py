#!/usr/bin/env python3
"""Validate the toolkit manifest (PRD §6.6 TKT-3; CI check).

    python3 scripts/validate_iac_guide.py [--manifest config/iac-guide.yaml]

Exits 1 when any check fails, 0 otherwise. Checks:
  * TKT-3: every tool lists at least one branch box, and every branch box is a box or band that
    exists on the Data and Analytics Branch (DAB) chart (ALLOWED_BRANCH_BOXES below, taken from
    /workspace/mmah-dab-current-structure.png and §3 of the ideal-state toolkit doc). The manifest's
    own `branch_boxes` catalogue must match the chart too, so a new box can't be invented there.
  * Schema (TKT-2): required fields, unique ids, resource kinds, valid acyclic containment,
    known owning unit, phase, status, per-environment statuses and valid relationship / flow ids.
  * TKT-11: no IP addresses or ranges, GUID-style identifiers, connection strings or secrets.
  * The generated js/iac-guide-manifest.generated.js is up to date (run scripts/build_iac_guide.py).
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
            "status_source", "status_by_env", "summary", "why", "iac", "docs", "resource_kind", "resource_type")
RESOURCE_KINDS = {"boundary", "azure-resource", "fabric-item", "logical-layer", "external", "saas-service"}
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

    units = {u["id"] for u in manifest.get("units") or []}
    phases = {p["id"] for p in manifest.get("phases") or []}
    statuses = set((manifest.get("statuses") or {}).keys()) - {"na"}
    envs = manifest.get("environments") or []
    tools = manifest.get("tools") or []
    ids = [t.get("id") for t in tools]
    known = set(ids)
    by_id = {t.get("id"): t for t in tools}

    if manifest.get("schema_version") != 2:
        err("schema_version must be 2 for the resource hierarchy")
    if not tools:
        err("tools must contain at least one resource")

    for i, t in enumerate(tools):
        name = t.get("id") or f"tools[{i}]"
        for f in REQUIRED:
            if f not in t or t[f] in (None, ""):
                if f != "branch_boxes":
                    err(f"{name}: missing required field '{f}'")
        boxes = t.get("branch_boxes") or []
        if not boxes:
            err(f"{name}: no branch box (TKT-3: every tool must trace to a DAB chart box or band)")
        for b in boxes:
            if b not in ALLOWED_BRANCH_BOXES:
                err(f"{name}: branch box '{b}' is not on the DAB chart")
            elif b not in catalogue:
                err(f"{name}: branch box '{b}' is missing from the manifest's branch_boxes catalogue")
        if not isinstance(t.get("id"), str) or not re.fullmatch(r"[a-z][a-z0-9-]*", t["id"]):
            err(f"{name}: id must be a lowercase, hyphen-separated identifier")
        if "parent" not in t:
            err(f"{name}: missing parent (use null for a top-level boundary)")
        elif t["parent"] is not None and (not isinstance(t["parent"], str) or t["parent"] not in known):
            err(f"{name}: unknown parent '{t['parent']}'")
        if any(k in t for k in ("column", "bar", "container", "row")):
            err(f"{name}: use parent containment instead of column / bar / container / row")
        if t.get("resource_kind") not in RESOURCE_KINDS:
            err(f"{name}: unknown resource_kind '{t.get('resource_kind')}'")
        notes = t.get("architecture_notes", [])
        if not isinstance(notes, list) or any(not isinstance(note, str) or not note.strip() for note in notes):
            err(f"{name}: architecture_notes must be a list of nonempty strings")
        for field, required_keys in (("setup_steps", ("title", "detail")),
                                     ("access_controls", ("principal", "role", "scope", "note"))):
            entries = t.get(field, [])
            if not isinstance(entries, list) or not entries or any(
                not isinstance(entry, dict) or any(not isinstance(entry.get(key), str) or not entry[key].strip()
                                                   for key in required_keys) for entry in entries
            ):
                err(f"{name}: {field} requires entries with {', '.join(required_keys)}")
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
    # Cycles would make the nested renderer and ancestry navigation recurse forever.
    reported_cycles = set()
    for resource_id in ids:
        chain = []
        current = resource_id
        while isinstance(current, str) and current in by_id:
            if current in chain:
                cycle = chain[chain.index(current):]
                key = frozenset(cycle)
                if key not in reported_cycles:
                    err("resource containment cycle: " + " -> ".join(cycle + [current]))
                    reported_cycles.add(key)
                break
            chain.append(current)
            current = by_id[current].get("parent")

    architecture = manifest.get("architecture") or {}
    journeys = architecture.get("journeys")
    if not isinstance(journeys, list) or len(journeys) != 3:
        err("architecture.journeys must contain the three platform guides")
        journeys = []
    journey_ids = []
    for journey in journeys:
        if not isinstance(journey, dict):
            err("architecture.journeys: each guide must be an object")
            continue
        name = str(journey.get("id"))
        journey_ids.append(name)
        for field in ("title", "subtitle", "icon", "intro", "outcome"):
            if not isinstance(journey.get(field), str) or not journey[field].strip():
                err(f"journey {name}: missing {field}")
        steps = journey.get("steps")
        if not isinstance(steps, list) or len(steps) != 5:
            err(f"journey {name}: five ordered steps are required by the flow layout")
            continue
        step_ids = set()
        for step in steps:
            if not isinstance(step, dict):
                err(f"journey {name}: each step must be an object")
                continue
            step_id = step.get("id")
            if not isinstance(step_id, str) or not re.fullmatch(r"[a-z][a-z0-9-]*", step_id) or step_id in step_ids:
                err(f"journey {name}: invalid or duplicate step id")
            else:
                step_ids.add(step_id)
            for field in ("title", "caption", "icon", "handoff", "summary", "input", "output", "gate"):
                if not isinstance(step.get(field), str) or not step[field].strip():
                    err(f"journey {name}/{step_id}: missing {field}")
            for field in ("items", "actions", "access", "resources"):
                entries = step.get(field)
                if not isinstance(entries, list) or not entries or any(not isinstance(v, str) or not v.strip() for v in entries):
                    err(f"journey {name}/{step_id}: {field} must contain nonempty strings")
                elif field == "resources" and any(v not in known for v in entries):
                    err(f"journey {name}/{step_id}: unknown resource in step")
        lanes = journey.get("lanes")
        coverage = []
        if not isinstance(lanes, list) or not lanes:
            err(f"journey {name}: lanes are required")
            lanes = []
        for lane in lanes:
            if (not isinstance(lane, dict) or not isinstance(lane.get("label"), str) or not lane["label"].strip()
                    or type(lane.get("start")) is not int or type(lane.get("end")) is not int
                    or not 0 <= lane["start"] <= lane["end"] < len(steps)):
                err(f"journey {name}: invalid lane bounds or label")
            else:
                coverage.extend(range(lane["start"], lane["end"] + 1))
        if sorted(coverage) != list(range(len(steps))):
            err(f"journey {name}: lanes must cover each step exactly once")
        exception = journey.get("exception")
        if (not isinstance(exception, dict) or any(not isinstance(exception.get(k), str) or not exception[k].strip() for k in ("label", "detail"))
                or any(type(exception.get(k)) is not int for k in ("from", "to"))
                or not 0 <= exception["to"] < exception["from"] < len(steps)):
            err(f"journey {name}: exception must describe a backward path between valid steps")
    if sorted(journey_ids) != ["contracts", "iac", "medallion"]:
        err("architecture.journeys: expected unique iac, contracts and medallion guides")
    for field in ("title", "summary"):
        if not isinstance(architecture.get(field), str) or not architecture[field].strip():
            err(f"architecture.{field} is required")
    flow = architecture.get("flow") or []
    if not flow:
        err("architecture.flow must describe the primary data path")
    for step in flow:
        if step.get("node") not in known:
            err(f"architecture.flow: unknown resource '{step.get('node')}'")
        if not step.get("label") or not step.get("detail"):
            err("architecture.flow: each step needs a label and detail")
    for note in architecture.get("notes") or []:
        if not note.get("title") or not note.get("text"):
            err("architecture.notes: each note needs a title and text")
    diagram = architecture.get("diagram") or {}
    for field in ("width", "height"):
        if not isinstance(diagram.get(field), (int, float)) or diagram[field] <= 0:
            err(f"architecture.diagram: positive {field} is required")
    if not diagram.get("nodes"):
        err("architecture.diagram: overview nodes are required")
    displayed = set()
    for item in diagram.get("nodes", []):
        node_id = item.get("id")
        if node_id not in known or node_id in displayed:
            err(f"architecture.diagram: unknown or duplicate node '{node_id}'")
        displayed.add(node_id)
        for field in ("x", "y", "w", "h"):
            if not isinstance(item.get(field), (int, float)) or item[field] < (1 if field in ("w", "h") else 0):
                err(f"architecture.diagram {node_id}: invalid {field}")
        for position, size, extent in (("x", "w", "width"), ("y", "h", "height")):
            values = [item.get(position), item.get(size), diagram.get(extent)]
            if all(isinstance(v, (int, float)) for v in values) and values[0] + values[1] > values[2]:
                err(f"architecture.diagram {node_id}: exceeds canvas {extent}")
    for e in manifest.get("edges") or []:
        for end in ("from", "to"):
            v = e.get(end, "")
            if v not in known:
                err(f"edge {e.get('from')} -> {e.get('to')}: '{v}' is not a resource")
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


def main():
    ap = argparse.ArgumentParser(description="Validate the toolkit manifest (TKT-3).")
    ap.add_argument("--manifest", default=str(ROOT / "config" / "iac-guide.yaml"))
    ap.add_argument("--skip-generated", action="store_true", help="don't check js/iac-guide-manifest.generated.js")
    args = ap.parse_args()
    path = Path(args.manifest)
    raw = path.read_text(encoding="utf-8")
    manifest = yaml.safe_load(raw)
    errors = validate(manifest, raw)
    if not args.skip_generated and not errors and path.resolve() == (ROOT / "config" / "iac-guide.yaml").resolve():
        import build_iac_guide as build_toolkit
        gen = build_toolkit.OUT
        if not gen.exists() or gen.read_text(encoding="utf-8") != build_toolkit.render(manifest):
            errors.append("js/iac-guide-manifest.generated.js is stale: run python3 scripts/build_iac_guide.py")
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
