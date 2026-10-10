"""Regression checks for the Platform blueprint manifest (PRD §6.6 TKT-2/3):
python3 -m unittest discover -s scripts -p 'test_*.py'."""
import copy
import re
import unittest

import yaml

import build_toolkit
import validate_toolkit

TKT2_FIELDS = ("id", "title", "subtitle", "branch_boxes", "owning_unit", "phase",
               "status_source", "why", "docs", "iac")


class BlueprintManifestTests(unittest.TestCase):
    def setUp(self):
        self.raw = build_toolkit.SRC.read_text(encoding="utf-8")
        self.manifest = yaml.safe_load(self.raw)

    def errors(self, manifest=None):
        return validate_toolkit.validate(manifest or self.manifest, self.raw)

    def test_manifest_is_valid(self):
        self.assertEqual(self.errors(), [])

    def test_every_tool_has_tkt2_fields_and_one_placement(self):
        for t in self.manifest["tools"]:
            for f in TKT2_FIELDS:
                self.assertIn(f, t, f"{t['id']}: missing {f}")
            places = [k for k in ("column", "bar", "container") if t.get(k)]
            self.assertEqual(len(places), 1, t["id"])

    def test_missing_branch_box_fails(self):
        self.manifest["tools"][0]["branch_boxes"] = []
        self.assertTrue(any("no branch box" in e for e in self.errors()))

    def test_unknown_branch_box_fails(self):
        self.manifest["tools"][0]["branch_boxes"] = ["not-a-box"]
        self.assertTrue(any("not on the DAB chart" in e for e in self.errors()))

    def test_owning_units_are_exact(self):
        self.assertEqual([u["id"] for u in self.manifest["units"]], ["BIRU", "SDGU-G", "SDGU-E", "DPU", "CLUSTER?"])

    def test_phases_and_statuses(self):
        self.assertEqual([p["id"] for p in self.manifest["phases"]], ["v1", "next", "future"])
        self.assertTrue(all(t["status"] in ("planned", "prov", "live") for t in self.manifest["tools"]))

    def test_layout_columns_bars_containers(self):
        self.assertEqual([c["label"] for c in self.manifest["columns"]], ["Sources", "Ingest", "Store", "Process", "Serve", "Enrich"])
        self.assertEqual([b["label"] for b in self.manifest["bars"]], ["Governance", "Monitoring", "Platform"])
        self.assertEqual([c["label"] for c in self.manifest["containers"]], ["Reusable services", "Platform Portal"])

    def test_banner_and_considered(self):
        self.assertIn("Intended platform: Microsoft Fabric", self.manifest["banner"]["text"])
        names = " ".join(c["name"] for c in self.manifest["considered_not_on_blueprint"])
        for item in ("Eventstream", "Eventhouse", "Real-Time Intelligence", "Mirrored databases", "API for GraphQL", "Copilot", "data agents"):
            self.assertIn(item, names)

    def test_edge_types_match_home_map(self):
        self.assertEqual(set(self.manifest["edge_types"]), {"primary", "request", "return", "gate"})

    def test_generated_file_is_current(self):
        self.assertEqual(build_toolkit.OUT.read_text(encoding="utf-8"), build_toolkit.render(self.manifest))

    def test_home_map_links_open_existing_blueprint_nodes(self):
        ids = {t["id"] for t in self.manifest["tools"]}
        for filename in ("map-data.js", "map-data-overlays.js"):
            source = (build_toolkit.ROOT / "js" / filename).read_text(encoding="utf-8")
            links = re.findall(r"blueprint\.html#node=([a-z0-9-]+)", source)
            self.assertTrue(links, filename)
            for node_id in links:
                self.assertIn(node_id, ids, f"{filename}: broken blueprint link {node_id}")



    def test_iac_version_tag_or_folder_fails(self):
        for bad in ("services/clean_validate/@v3.2.0", "services/clean_validate/", "services/missing/rules.yaml"):
            self.manifest["tools"][0]["iac"] = bad
            self.assertTrue(any("iac must be" in e for e in self.errors()), bad)

    def test_generated_defined_in_is_file_at_real_sha(self):
        text = build_toolkit.OUT.read_text(encoding="utf-8")
        vals = [v for v in re.findall(r'"iac":\s*"([^"]+)"', text) if v not in ("na", "tbd")]
        self.assertTrue(vals)
        for v in vals:
            self.assertRegex(v, r"^[\w.\-]+(/[\w.\-]+)*\.\w+@[0-9a-f]{7}$")
            self.assertIsNone(validate_toolkit.check_defined_in(v))
        self.assertIsNotNone(validate_toolkit.check_defined_in("config/toolkit.yaml@0000000"))

    def test_verify_owner_wording_fails(self):
        self.manifest["tools"][0]["owner"] = "Cluster (verify)"
        self.assertTrue(any("to be confirmed" in e for e in self.errors()))
        self.manifest["tools"][0]["owner"] = "SDGU-E"
        self.manifest["units"][-1]["name"] = "Cluster / enterprise (to verify)"
        self.assertTrue(any("to be confirmed" in e for e in self.errors()))

if __name__ == "__main__":
    unittest.main()
