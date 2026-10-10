"""Regression checks for resource hierarchy edits: python3 -m unittest discover -s scripts -p 'test_*.py'."""
import copy
import re
import unittest

import yaml

import build_iac_guide as build_toolkit
import validate_iac_guide as validate_toolkit


class ResourceManifestTests(unittest.TestCase):
    def setUp(self):
        self.raw = build_toolkit.SRC.read_text(encoding="utf-8")
        self.manifest = yaml.safe_load(self.raw)

    def errors(self):
        return validate_toolkit.validate(self.manifest, self.raw)

    def test_reference_architecture_is_valid(self):
        self.assertEqual(self.errors(), [])

    def test_unknown_parent_cannot_silently_hide_a_resource(self):
        self.manifest["tools"][-1]["parent"] = "missing-resource"
        self.assertTrue(any("unknown parent" in error for error in self.errors()))

    def test_containment_cycle_is_rejected(self):
        first, second = self.manifest["tools"][:2]
        first["parent"] = second["id"]
        second["parent"] = first["id"]
        self.assertTrue(any("containment cycle" in error for error in self.errors()))

    def test_self_containment_is_rejected(self):
        node = self.manifest["tools"][-1]
        node["parent"] = node["id"]
        self.assertTrue(any("containment cycle" in error for error in self.errors()))

    def test_containment_is_explicit_even_for_roots(self):
        del self.manifest["tools"][0]["parent"]
        self.assertTrue(any("missing parent" in error for error in self.errors()))

    def test_parent_must_be_a_single_resource_identifier(self):
        self.manifest["tools"][-1]["parent"] = ["azure", "fabric"]
        self.assertTrue(any("unknown parent" in error for error in self.errors()))

    def test_flow_cannot_link_to_a_missing_drawer(self):
        self.manifest["architecture"]["flow"][0]["node"] = "missing-resource"
        self.assertTrue(any("architecture.flow: unknown resource" in error for error in self.errors()))

    def test_relationships_cannot_reference_removed_resources(self):
        self.manifest["edges"].append({"from": "removed-resource", "to": self.manifest["tools"][0]["id"], "type": "primary"})
        self.assertTrue(any("is not a resource" in error for error in self.errors()))

    def test_resource_kind_and_architecture_notes_are_checked(self):
        node = self.manifest["tools"][-1]
        node["resource_kind"] = "unknown-kind"
        node["architecture_notes"] = "This must be a list, not a string."
        errors = self.errors()
        self.assertTrue(any("unknown resource_kind" in error for error in errors))
        self.assertTrue(any("architecture_notes must be a list" in error for error in errors))

    def test_generated_data_retains_hierarchy_without_mutating_source(self):
        original = copy.deepcopy(self.manifest)
        generated = build_toolkit.build(self.manifest)
        self.assertEqual(self.manifest, original)
        self.assertEqual(generated["architecture"], self.manifest["architecture"])
        actual = {node["id"]: node for node in generated["nodes"]}
        for node in self.manifest["tools"]:
            self.assertEqual(actual[node["id"]]["parent"], node["parent"])
            self.assertEqual(actual[node["id"]]["resourceType"], node["resource_type"])
            self.assertEqual(actual[node["id"]]["resourceKind"], node["resource_kind"])
            self.assertEqual(actual[node["id"]]["architectureNotes"], node.get("architecture_notes", []))
            self.assertEqual(actual[node["id"]]["setupSteps"], node["setup_steps"])
            self.assertEqual(actual[node["id"]]["accessControls"], node["access_controls"])

    def test_every_component_has_setup_and_access_guidance(self):
        self.manifest["tools"][-1]["setup_steps"] = []
        self.manifest["tools"][0]["access_controls"] = [{"role": "Contributor"}]
        errors = self.errors()
        self.assertTrue(any("setup_steps requires" in error for error in errors))
        self.assertTrue(any("access_controls requires" in error for error in errors))

    def test_diagram_nodes_resolve_to_real_components(self):
        self.manifest["architecture"]["diagram"]["nodes"][0]["id"] = "missing-resource"
        self.assertTrue(any("unknown or duplicate node" in error for error in self.errors()))

    def test_diagram_coordinates_fit_the_canvas(self):
        self.manifest["architecture"]["diagram"]["nodes"][0]["w"] = 99999
        self.assertTrue(any("exceeds canvas width" in error for error in self.errors()))

    def test_journey_resource_links_and_step_guidance_are_validated(self):
        step = self.manifest["architecture"]["journeys"][0]["steps"][0]
        step["resources"] = ["missing-resource"]
        step["actions"] = []
        step["gate"] = ""
        errors = self.errors()
        for expected in ("unknown resource in step", "actions must contain", "missing gate"):
            self.assertTrue(any(expected in error for error in errors), expected)

    def test_journey_steps_and_lane_bounds_cannot_break_diagram(self):
        journey = self.manifest["architecture"]["journeys"][0]
        journey["steps"][1]["id"] = journey["steps"][0]["id"]
        journey["lanes"][0]["end"] = 7
        journey["exception"]["from"] = -1
        errors = self.errors()
        for expected in ("duplicate step id", "invalid lane bounds", "exception must describe"):
            self.assertTrue(any(expected in error for error in errors), expected)

    def test_all_three_platform_guides_are_required(self):
        self.manifest["architecture"]["journeys"].pop()
        self.assertTrue(any("three platform guides" in error for error in self.errors()))


if __name__ == "__main__":
    unittest.main()
