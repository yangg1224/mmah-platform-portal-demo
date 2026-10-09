/* Home process map: overlay nodes and edges (MAP-8). Both overlays are off by default.
   Reuses content from pages/platform-setup.html and pages/releases.html. Mock only. */
(function () {
  "use strict";
  var NA = "na", TBD = "tbd";
  function st(kind, word) { return { kind: kind, word: word }; }
  var M = PORTAL.map, N = M.nodes, E = M.edges;
  var ENV_APPROVER = "Not yet defined";

  /* ---- Platform setup band: ENV / IAM / OPS beneath the zones they apply to ---- */
  N.push({
    id: "env", tag: "ENV", kind: "overlay", title: "Environments", subtitle: "Dev · Test · Pre-Prod · Prod",
    ownerTag: "setup", overlay: "setup", products: ["mpd", "hh"], x: 268, band: "setup", dy: 36,
    status: st("warn", "1 flag · Test"),
    summary: "Four environments defined in IaC; Test has one storage zone missing its retention tag.",
    statusNote: "Tag compliance: zone.silver.scratch on Test missing retention tag. Deployed: Dev 0.4-dev.12 · Test 0.4-rc.3 · Pre-Prod 0.4 · Prod 0.3.",
    owner: "Platform engineering",
    lastRun: NA, dq: NA,
    rules: [
      { label: "Test storage (flag: retention tag missing)", path: "iac/envs/test/storage.tf@a3f91c2", version: "Test", approver: ENV_APPROVER, href: "pages/platform-setup.html#env-test" },
      { label: "Dev environment", path: "iac/envs/dev/@b1c44e9", version: "Dev", approver: ENV_APPROVER, href: "pages/platform-setup.html#env-dev" },
      { label: "Pre-Prod environment", path: "iac/envs/preprod/@d9e01aa", version: "Pre-Prod", approver: ENV_APPROVER, href: "pages/platform-setup.html#env-preprod" },
      { label: "Prod environment", path: "iac/envs/prod/@f2a88b1", version: "Prod", approver: ENV_APPROVER, href: "pages/platform-setup.html#env-prod" }
    ],
    appliesTo: ["bronze", "silver", "gold"],
    links: [{ label: "Platform setup: Test", href: "pages/platform-setup.html#env-test" }, { label: "Storage zones and tags", href: "pages/platform-setup.html#zones-h" },
      { label: "Platform blueprint: Capacity per environment", href: "pages/blueprint.html#node=pl-capacity" }, { label: "Platform blueprint: Terraform or Bicep", href: "pages/blueprint.html#node=pl-iac" }]
  });

  N.push({
    id: "iam", tag: "IAM", kind: "overlay", title: "Identity", subtitle: "roles · purpose, no memberships",
    ownerTag: "setup", overlay: "setup", products: ["mpd", "hh"], x: 520, band: "setup", dy: 36,
    status: st("ok", "4 roles defined"),
    summary: "Four platform roles by name and purpose; memberships are not shown.",
    owner: "Platform engineering",
    lastRun: NA, dq: NA,
    rules: [{ label: "Roles: platform.engineer, data.steward, program.viewer, governance.reviewer", path: "iac/modules/identity/roles.tf@c4d12ef", version: "c4d12ef", approver: ENV_APPROVER, href: "pages/platform-setup.html#roles-h" }],
    appliesTo: ["bronze", "silver", "gold"],
    links: [{ label: "Roles (name and purpose)", href: "pages/platform-setup.html#roles-h" }, { label: "Platform blueprint: Entra ID groups", href: "pages/blueprint.html#node=pl-entra" }]
  });

  N.push({
    id: "ops", tag: "OPS", kind: "overlay", title: "Network / logging / keys", subtitle: "status · last verified",
    ownerTag: "setup", overlay: "setup", products: ["mpd", "hh"], x: 772, band: "setup", dy: 36,
    status: st("warn", "1 unverified · Test"),
    summary: "Logging and key management verified in all environments; Test backup is unverified.",
    statusNote: "Logging verified 3–4 Oct · Keys verified 1–5 Oct · Backup: Prod 5 Oct, Pre-Prod 2 Oct, Test unverified, Dev not applicable.",
    owner: "Platform engineering",
    lastRun: NA, dq: NA,
    rules: [
      { label: "Prod environment (logging, backup, keys)", path: "iac/envs/prod/@f2a88b1", version: "Prod", approver: ENV_APPROVER, href: "pages/platform-setup.html#env-prod" },
      { label: "Network configuration", path: TBD }
    ],
    appliesTo: ["bronze", "silver", "gold"],
    links: [{ label: "Platform setup: environments side by side", href: "pages/platform-setup.html#env-h" },
      { label: "Platform blueprint: Azure Monitor + Log Analytics", href: "pages/blueprint.html#node=m-logs" }, { label: "Platform blueprint: Key Vault", href: "pages/blueprint.html#node=pl-kv" }, { label: "Platform blueprint: Private endpoints", href: "pages/blueprint.html#node=pl-network" }]
  });

  /* ---- Releases and gates band: promotion lane with GATE nodes between environments ---- */
  function lane(id, title, rel, status, x, products, envAnchor, path, links) {
    N.push({
      id: id, tag: "ENV", kind: "overlay", title: title, subtitle: rel,
      ownerTag: "releases", overlay: "releases", products: products, x: x, w: 140, band: "releases", dy: 36,
      status: status,
      summary: title + " runs " + rel + ".",
      statusNote: "Deployed release: " + rel + ".",
      owner: "Platform engineering",
      lastRun: NA, dq: NA,
      rules: [{ label: title + " environment", path: path, version: title, approver: ENV_APPROVER, href: "pages/platform-setup.html#" + envAnchor }],
      links: links.concat([{ label: "Platform setup: " + title, href: "pages/platform-setup.html#" + envAnchor },
        { label: "Platform blueprint: Capacity per environment", href: "pages/blueprint.html#node=pl-capacity" }])
    });
  }
  function gate(id, title, rel, status, x, products, summary, checklist, rules, links) {
    N.push({
      id: id, tag: "GATE", kind: "gate", title: title, subtitle: rel,
      ownerTag: "releases", overlay: "releases", products: products, x: x, w: 120, band: "releases", dy: 36,
      status: status, summary: summary,
      owner: "Platform engineering · CAB (GO-ITS 35)",
      lastRun: NA, dq: NA, checklist: checklist, rules: rules, links: links
    });
  }
  var REL04 = { label: "Release 0.4 gates", path: "releases/0.4/gates.yaml@88cf12a", version: "0.4", approver: "Steward approval 22 Sep 2026 · Data & Analytics Branch (mock)", href: "pages/releases.html#rel-04" };
  var REL03 = { label: "Release 0.3 gates", path: "releases/0.3/gates.yaml@71aa0e3", version: "0.3", approver: "Steward approval 18 Sep 2026 (mock)", href: "pages/releases.html#rel-03" };
  var L04 = [{ label: "Release 0.4 · Municipal Planning Data", href: "pages/releases.html#rel-04" }];
  var L03 = [{ label: "Release 0.3 · Housing & Homelessness", href: "pages/releases.html#rel-03" }];

  lane("lane-dev", "Dev", "0.4-dev.12", st("ok", "Deployed"), 16, ["mpd"], "env-dev", "iac/envs/dev/@b1c44e9", L04);
  gate("gate-dev-test", "Dev → Test", "promotion gate", st("tbd", "Not yet defined"), 186, ["mpd"],
    "The Dev → Test promotion gate is not yet established, so it is shown as not yet defined (GOV-12).",
    [{ item: "Promotion checklist", state: "tbd", note: "No gate source in version control yet" }],
    TBD, L04);
  lane("lane-test", "Test", "0.4-rc.3", st("ok", "Deployed"), 336, ["mpd"], "env-test", "iac/envs/test/storage.tf@a3f91c2", L04);
  gate("gate-test-preprod", "Test → Pre-Prod", "0.4-rc.3 → 0.4", st("ok", "Passed"), 506, ["mpd"],
    "Release 0.4 passed the Test → Pre-Prod checks and is now at Pre-Prod.",
    [
      { item: "Statement of Sensitivity (SoS)", state: "pass", note: "Recorded 15 Sep 2026 · Low for this product path" },
      { item: "DQ pass", state: "pass", note: "12 schema warnings acknowledged with steward note" },
      { item: "Steward approval", state: "pass", note: "22 Sep 2026 · Data & Analytics Branch (mock)" }
    ],
    [REL04], L04);
  lane("lane-preprod", "Pre-Prod", "0.4 · Municipal Planning", st("info", "Waiting"), 656, ["mpd"], "env-preprod", "iac/envs/preprod/@d9e01aa", L04);
  gate("gate-preprod-prod", "Pre-Prod → Prod", "release 0.4", st("fail", "Blocked"), 826, ["mpd"],
    "Release 0.4 is waiting at Pre-Prod; the Prod gate is blocked until a CAB reference is linked.",
    [
      { item: "Statement of Sensitivity (SoS)", state: "pass", note: "Recorded 15 Sep 2026" },
      { item: "TRA / PIA", state: "tbd", note: "TRA linkage for portal gates not yet established (GOV-12)" },
      { item: "DQ pass", state: "pass", note: "Contract and match rules passing; 12 schema warnings acknowledged" },
      { item: "Steward approval", state: "pass", note: "22 Sep 2026 · Data & Analytics Branch (mock)" },
      { item: "CAB reference (GO-ITS 35)", state: "fail", note: "Missing · blocking. No CAB record linked yet" }
    ],
    [REL04], L04.concat([{ label: "Mock CAB record (external, read-only)", href: "https://example.ontario.ca/cab/CHANGE-000000" }]));
  lane("lane-prod", "Prod", "0.3 · Housing & HH", st("ok", "Live"), 976, ["hh"], "env-prod", "iac/envs/prod/@f2a88b1", L03);
  // Release 0.3's own gates (passed) are reachable from the Prod drawer.
  N[N.length - 1].statusNote = "Deployed release: 0.3 · Housing & Homelessness aggregates, live since 29 Sep 2026.";
  N[N.length - 1].rules.push(REL03);
  N[N.length - 1].links.push({ label: "CAB CHANGE-004821 (external, read-only)", href: "https://example.ontario.ca/cab/CHANGE-004821" });

  E.push({ from: "lane-dev", to: "gate-dev-test", type: "gate", label: "" });
  E.push({ from: "gate-dev-test", to: "lane-test", type: "gate", label: "" });
  E.push({ from: "lane-test", to: "gate-test-preprod", type: "gate", label: "" });
  E.push({ from: "gate-test-preprod", to: "lane-preprod", type: "gate", label: "" });
  E.push({ from: "lane-preprod", to: "gate-preprod-prod", type: "gate", label: "" });
  E.push({ from: "gate-preprod-prod", to: "lane-prod", type: "gate", label: "" });

  /* Needs-attention line above the map (one line, each item opens a drawer). */
  M.attention = [
    { node: "silver", status: st("warn", "12 DQ warnings"), text: "Municipal Planning, 3 submitters" },
    { node: "gate-preprod-prod", status: st("fail", "Release 0.4 blocked"), text: "waiting at Pre-Prod on CAB reference" },
    { node: "env", status: st("warn", "1 infra flag"), text: "Test retention tag missing" }
  ];
})();
