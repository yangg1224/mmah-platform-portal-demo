#!/usr/bin/env python3
"""Build the Platform blueprint data file from the toolkit manifest (PRD §6.6 TKT-2).

    python3 scripts/build_toolkit.py           # config/toolkit.yaml -> js/toolkit-manifest.generated.js
    python3 scripts/build_toolkit.py --check   # exit 1 if the generated file is stale (use in CI)

The page stays fully static: no runtime YAML parsing, no CDN. The generated file sets
window.PORTAL.toolkit in the shape js/blueprint.js reads. Needs PyYAML
(`pip install --user pyyaml`).
"""
import argparse
import json
import sys
from pathlib import Path

try:
    import yaml
except ImportError:  # pragma: no cover
    sys.exit("PyYAML is required: pip install --user pyyaml")

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "config" / "toolkit.yaml"
OUT = ROOT / "js" / "toolkit-manifest.generated.js"
ENV_CODE = {"planned": "p", "prov": "v", "live": "l", "na": "n"}

HEADER = """/* GENERATED FILE - DO NOT EDIT.
   Source of truth: config/toolkit.yaml. Regenerate with: python3 scripts/build_toolkit.py
   Validate (CI, TKT-3): python3 scripts/validate_toolkit.py
   Platform blueprint / Toolkit manifest (PRD §6.6 TKT-2). Mock sample metadata only. */
"""


def tool_to_node(t, envs):
    """Map one manifest entry (vendor-neutral snake_case schema) to the renderer's node shape."""
    by_env = t.get("status_by_env") or {}
    node = {
        "id": t["id"],
        "tag": t["tag"],
        "title": t["title"],
        "subtitle": t["subtitle"],
        "column": t.get("column"),
        "bar": t.get("bar"),
        "container": t.get("container"),
        "row": t.get("row"),
        "branchBoxes": list(t.get("branch_boxes") or []),
        "unit": t["owning_unit"],
        "owner": t.get("owner") or t["owning_unit"],
        "phase": t.get("phase", "v1"),
        "status": t.get("status", "planned"),
        "statusSource": t.get("status_source", "manifest only"),
        "statusByEnv": [ENV_CODE[by_env.get(e, "planned")] for e in envs],
        "summary": t["summary"],
        "why": t["why"],
        "iac": t.get("iac", "tbd"),
        "docs": t.get("docs") or [],
        "upstream": t.get("upstream") or [],
        "downstream": t.get("downstream") or [],
        "homeNode": t.get("home_node"),
        "deeper": t.get("links_deeper") or [],
        "statusNote": t.get("status_note", ""),
    }
    # Keep the object lean: drop layout keys that don't apply (undefined in JS either way).
    return {k: v for k, v in node.items() if not (k in ("column", "bar", "container", "row") and v is None)}


def build(manifest):
    envs = manifest["environments"]
    return {
        "manifest": manifest["manifest_ref"],
        "asOf": manifest["as_of"],
        "banner": {
            "text": manifest["banner"]["text"],
            "linkLabel": manifest["banner"]["link_label"],
            "href": manifest["banner"]["href"],
        },
        "columns": manifest["columns"],
        "containers": [
            {"id": c["id"], "label": c["label"], "tag": c["tag"], "slots": c["slots"], "nodeW": c["node_w"]}
            for c in manifest["containers"]
        ],
        "bars": manifest["bars"],
        "units": manifest["units"],
        "functions": manifest["functions"],
        "boxes": [{"id": b["id"], "fn": b["function"], "label": b["label"]} for b in manifest["branch_boxes"]],
        "phases": manifest["phases"],
        "statuses": manifest["statuses"],
        "envs": envs,
        "edgeTypes": manifest["edge_types"],
        "considered": manifest["considered_not_on_blueprint"],
        "openQuestions": manifest["open_questions"],
        "nodes": [tool_to_node(t, envs) for t in manifest["tools"]],
        "edges": manifest["edges"],
    }


def render(manifest):
    data = json.dumps(build(manifest), ensure_ascii=False, indent=1)
    return HEADER + "window.PORTAL = window.PORTAL || {};\nPORTAL.toolkit = " + data + ";\n"


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--check", action="store_true", help="fail if the generated file is out of date")
    args = ap.parse_args()
    manifest = yaml.safe_load(SRC.read_text(encoding="utf-8"))
    text = render(manifest)
    rel = OUT.relative_to(ROOT)
    if args.check:
        if not OUT.exists() or OUT.read_text(encoding="utf-8") != text:
            print(f"STALE: {rel} does not match config/toolkit.yaml. Run: python3 scripts/build_toolkit.py")
            return 1
        print(f"OK: {rel} is up to date with config/toolkit.yaml")
        return 0
    OUT.write_text(text, encoding="utf-8")
    print(f"Wrote {rel} ({len(manifest['tools'])} tools, {len(manifest['edges'])} edges) from config/toolkit.yaml")
    return 0


if __name__ == "__main__":
    sys.exit(main())
