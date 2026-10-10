"""file@sha rule for every served 'Defined in' (python3 -m unittest discover -s scripts -p 'test_*.py')."""
import unittest

import build_refs


class RefTests(unittest.TestCase):
    def test_site_refs_pass(self):
        self.assertEqual(build_refs.main(check=True), 0)

    def test_fake_sha_fails(self):
        self.assertIsNotNone(build_refs.problems_for("iac/envs/prod/main.tf", "f2a88b1"))

    def test_folder_and_tag_fail(self):
        self.assertIsNotNone(build_refs.problems_for("iac/envs/prod/", "f2a88b1"))
        self.assertIsNotNone(build_refs.problems_for("services/clean_validate/rules.yaml", "v3.2.0"))

    def test_missing_file_fails(self):
        self.assertIsNotNone(build_refs.problems_for("iac/envs/nowhere/main.tf", "18b64aa"))

    def test_real_ref_passes(self):
        sha = build_refs.last_sha("iac/envs/prod/main.tf")
        self.assertIsNone(build_refs.problems_for("iac/envs/prod/main.tf", sha))

    def test_token_catches_folder_and_tag(self):
        found = build_refs.TOKEN.findall('a "iac/envs/dev/@b1c44e9" b "services/x/@v1.2.0" c')
        self.assertEqual(len(found), 2)


if __name__ == "__main__":
    unittest.main()
