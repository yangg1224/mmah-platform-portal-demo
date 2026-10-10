/* Home process map: data model (MAP-1). Mock metadata only; no PI, no person-level data.
   The renderer (js/map.js) draws nodes, edges and containers from this model.
   Layout hints (x, y) are presentation only; edge geometry, containers, focal node,
   dimming and the list view are all computed from the model.

   Node ids (used in the permalink, see js/map.js):
     sources, bronze, silver, svc-clean, svc-match, svc-pidrop, svc-suppress, gold, catalogue
     Platform setup overlay:  env, iam, ops
     Releases overlay:        lane-dev, gate-dev-test, lane-test, gate-test-preprod,
                              lane-preprod, gate-preprod-prod, lane-prod
   Products: mpd (Municipal Planning Data, O. Reg. 73/23), hh (Housing & Homelessness) */
window.PORTAL = window.PORTAL || {};

(function () {
  "use strict";
  var NA = "na", TBD = "tbd"; // "Not applicable" / "Not yet defined"
  function st(kind, word) { return { kind: kind, word: word }; }

  var MPD_RUN_LOAD = { flow: "MPD load", start: "6 Oct 2026, 8:05 PM ET", end: "6 Oct 2026, 8:12 PM ET", result: st("ok", "Passing"), rows: "47 orgs in → 47 orgs out" };
  var MPD_RUN_CONFORM = { flow: "MPD validate → conform", start: "6 Oct 2026, 8:12 PM ET", end: "6 Oct 2026, 8:34 PM ET", result: st("warn", "Completed, 12 DQ warnings"), rows: "47 orgs in → 47 orgs out" };
  var MPD_RUN_PUBLISH = { flow: "MPD publish", start: "6 Oct 2026, 8:34 PM ET", end: "6 Oct 2026, 8:41 PM ET", result: st("ok", "Passing"), rows: "47 orgs in → 47 orgs out" };
  var HH_RUN_LOAD = { flow: "HH load", start: "6 Oct 2026, 7:30 PM ET", end: "6 Oct 2026, 7:36 PM ET", result: st("ok", "Passing"), rows: "12 regions in → 12 regions out" };
  var HH_RUN_CONFORM = { flow: "HH standardize", start: "6 Oct 2026, 7:36 PM ET", end: "6 Oct 2026, 7:49 PM ET", result: st("ok", "Passing"), rows: "12 regions in → 12 regions out" };
  var HH_RUN_PUBLISH = { flow: "HH publish", start: "6 Oct 2026, 7:49 PM ET", end: "6 Oct 2026, 7:55 PM ET", result: st("ok", "Passing"), rows: "12 regions in → 12 regions out" };

  var R = {
    contract: { label: "Municipal planning data contract", path: "config/contracts/mpd_ingest_v2.yaml@11ab90c", version: "ingest_v2", approver: "Platform engineer (mock) · 1 Aug 2026", href: "pages/rules.html#rule-contract-mpd" },
    schema: { label: "Schema / code-list check", path: "config/dq/mpd_schema_codelist.yaml@e7b3c01", version: "v1.4", approver: "Data steward (mock) · 12 Aug 2026", href: "pages/rules.html#rule-schema-mpd" },
    match: { label: "Municipality-name matching threshold", path: "config/match/municipality_name.yaml@9a1f2d4", version: "v2.1 · threshold 0.86", approver: "Platform lead (mock) · 3 Sep 2026", href: "pages/rules.html#rule-match-muni" },
    starts: { label: "Housing starts definition", path: "config/biz/housing_starts.yaml@c8e21a0", version: "v1.0", approver: "Program steward (mock) · 22 Sep 2026", href: "pages/rules.html#rule-biz-housing-starts" },
    smallCell: { label: "Small-cell suppression threshold", path: "config/dq/small_cell_suppression.yaml@55de901", version: "n5 · v1.2", approver: "Privacy advisor (mock) · 10 Sep 2026", href: "pages/rules.html#rule-small-cell" },
    zoneBronze: { label: "Storage zone zone.bronze.landing", path: "iac/modules/storage/bronze.tf@f2a88b1", version: "retention 2 years", approver: TBD, href: "pages/platform-setup.html#zones-h" },
    zoneSilver: { label: "Storage zone zone.silver.conform", path: "iac/modules/storage/silver.tf@f2a88b1", version: "retention 5 years", approver: TBD, href: "pages/platform-setup.html#zones-h" },
    zoneGold: { label: "Storage zone zone.gold.publish", path: "iac/modules/storage/gold.tf@f2a88b1", version: "retention 7 years", approver: TBD, href: "pages/platform-setup.html#zones-h" }
  };
  function svcRule(label, path, version) { return { label: label, path: path, version: version, approver: TBD }; }

  PORTAL.map = {
    asOf: "6 Oct 2026, 9:30 PM ET",
    focal: "silver", // the node needing attention (MAP-13); the selected node takes over when one is open
    coverage: { captured: 4, total: 5, note: "Lineage captured for 4 of 5 flows (mock)" },
    products: [
      { id: "all", label: "All products" },
      { id: "mpd", label: "Municipal Planning Data (O. Reg. 73/23)" },
      { id: "hh", label: "Housing & Homelessness" }
    ],
    /* Containers come from each node's ownerTag. Tenancy and service ownership are
       unconfirmed, so this placement is illustrative (PRD A3). */
    containers: [
      { ownerTag: "mmah", caption: "MMAH thin landing" },
      { ownerTag: "cluster", caption: "Cluster / enterprise shared services", capPos: "bottom" }, // caption below: connectors enter from the top
      { ownerTag: "external", caption: "External" },
      { ownerTag: "setup", caption: "Platform setup", overlay: "setup" },
      { ownerTag: "releases", caption: "Releases and gates · promotion lane · Sample statuses, not real infrastructure", overlay: "releases" }
    ],
    /* Overlay bands sit under the base canvas, in this order, only when switched on. */
    baseHeight: 476,
    bands: [
      { id: "setup", label: "Platform setup", height: 176 },
      { id: "releases", label: "Releases and gates", height: 176 }
    ],
    edgeTypes: {
      primary: "Primary flow",
      request: "Request",
      "return": "Return / async",
      gate: "Gate"
    },
    nodes: [],
    edges: []
  };

  var N = PORTAL.map.nodes;

  N.push({
    id: "sources", step: "01", tag: "EXT", kind: "ext", title: "Sources", subtitle: "municipalities · service managers",
    ownerTag: "external", products: ["mpd", "hh"], x: 24, y: 84,
    status: st("ok", "Received"),
    summary: "Quarterly housing-supply submissions from municipalities and aggregated extracts from service managers.",
    owner: "Submitting organizations (municipalities, service managers)",
    lastRun: NA,
    dq: NA,
    rules: [R.contract, { label: "Housing & HH ingest contract", path: TBD }],
    links: [{ label: "Data contract", href: "pages/rules.html#rule-contract-mpd" }, { label: "Flows / lineage", href: "pages/flows.html" }]
  });

  N.push({
    id: "bronze", step: "02", tag: "ZONE", kind: "zone", title: "Landing / Raw (Bronze)", subtitle: "as received · unchanged",
    ownerTag: "mmah", products: ["mpd", "hh"], x: 268, y: 84,
    status: st("ok", "Passing"),
    summary: "Submissions stored exactly as received, checked only against their data contract.",
    owner: "Platform engineering",
    lastRun: [MPD_RUN_LOAD, HH_RUN_LOAD],
    dq: { pass: 2, warn: 0, fail: 0, open: 0 },
    rules: [R.contract, R.zoneBronze],
    links: [{ label: "MPD raw submissions", href: "pages/flows.html#node-mpd-bronze" }, { label: "HH raw extracts", href: "pages/flows.html#node-hh-bronze" }, { label: "Storage zones", href: "pages/platform-setup.html#zones-h" }]
  });

  N.push({
    id: "silver", step: "03", tag: "PIPE", kind: "pipe", title: "Standardize and conform (Silver)", subtitle: "validate · conform",
    ownerTag: "mmah", products: ["mpd", "hh"], x: 520, y: 84,
    status: st("warn", "Warnings · 12 open"),
    statusBy: { hh: st("ok", "Passing") },
    summary: "Validates, cleans and conforms submissions using the shared services; 12 schema / code-list exceptions are open across 3 submitters.",
    owner: "Platform engineering",
    lastRun: [MPD_RUN_CONFORM, HH_RUN_CONFORM],
    dq: { pass: 4, warn: 1, fail: 0, open: 12, note: "12 open across 3 submitters (Municipal Planning)" },
    rules: [R.schema, R.match, R.zoneSilver],
    links: [{ label: "Open DQ exceptions (12)", href: "pages/data-product-municipal.html#dq" }, { label: "MPD conform step", href: "pages/flows.html#node-mpd-clean" }, { label: "Shared services", href: "pages/shared-services.html" }, { label: "Rules / config", href: "pages/rules.html" }]
  });

  N.push({
    id: "svc-clean", step: "03a", tag: "SVC", kind: "svc", title: "Cleaning", subtitle: "shared cleaning rules",
    ownerTag: "cluster", products: ["mpd", "hh"], x: 220, y: 308,
    status: st("warn", "Warnings · 12"),
    statusBy: { hh: st("ok", "Passing") },
    summary: "Schema checks, code-list conformance and standard null / type cleaning for inbound submissions.",
    owner: "Platform engineering (cluster / enterprise owner unconfirmed)",
    lastRun: [MPD_RUN_CONFORM, HH_RUN_CONFORM],
    dq: { pass: 3, warn: 1, fail: 0, open: 12 },
    rules: [svcRule("Service svc.clean_validate", "services/clean_validate/@v3.2.0", "v3.2.0"), R.schema],
    links: [{ label: "Shared service: Cleaning / validation", href: "pages/shared-services.html#svc-clean" }, { label: "Platform blueprint: Cleaning library", href: "pages/blueprint.html#node=svc-clean" }]
  });

  N.push({
    id: "svc-match", step: "03b", tag: "SVC", kind: "svc", title: "Municipality-name matching", subtitle: "match to provincial list",
    ownerTag: "cluster", products: ["mpd"], x: 400, y: 308,
    status: st("ok", "Stable"),
    summary: "Maps submitter municipality names to the provincial reference list; below-threshold matches are flagged, not overwritten.",
    owner: "Platform engineering (cluster / enterprise owner unconfirmed)",
    lastRun: [MPD_RUN_CONFORM],
    dq: { pass: 1, warn: 0, fail: 0, open: 0 },
    rules: [svcRule("Service svc.municipality_name_match", "services/municipality_name_match/@v2.1.0", "v2.1.0"), R.match],
    links: [{ label: "Shared service: Municipality-name matching", href: "pages/shared-services.html#svc-muni-match" }, { label: "Platform blueprint: Municipality-name matching", href: "pages/blueprint.html#node=svc-match" }]
  });

  N.push({
    id: "svc-pidrop", step: "03c", tag: "SVC", kind: "svc", title: "Personal-field drop", subtitle: "remove personal fields",
    ownerTag: "cluster", products: ["hh"], x: 690, y: 308,
    status: st("ok", "Stable"),
    summary: "Drops fields that could carry personal information so the aggregate-only path stays aggregate-only.",
    owner: "Platform engineering (cluster / enterprise owner unconfirmed)",
    lastRun: [HH_RUN_CONFORM],
    dq: { pass: 1, warn: 0, fail: 0, open: 0, note: "Audit: dropped field names counted, never values" },
    rules: [svcRule("Service svc.personal_field_drop", "services/personal_field_drop/@v1.5.0", "v1.5.0"), { label: "Field allow-list config", path: TBD }],
    links: [{ label: "Shared service: Personal-field drop", href: "pages/shared-services.html#svc-pi-drop" }, { label: "Platform blueprint: Personal-field drop", href: "pages/blueprint.html#node=svc-pidrop" }]
  });

  N.push({
    id: "svc-suppress", step: "03d", tag: "SVC", kind: "svc", title: "Small-cell suppression", subtitle: "suppress small counts",
    ownerTag: "cluster", products: ["hh"], x: 870, y: 308,
    status: st("ok", "Stable"),
    summary: "Suppresses aggregate cells below the approved threshold before publish so small groups cannot be identified.",
    owner: "Platform engineering (cluster / enterprise owner unconfirmed)",
    lastRun: [HH_RUN_CONFORM],
    dq: { pass: 1, warn: 0, fail: 0, open: 0 },
    rules: [svcRule("Service svc.small_cell_suppression", "services/small_cell_suppression/@v1.2.0", "v1.2.0"), R.smallCell],
    links: [{ label: "Shared service: Small-cell suppression", href: "pages/shared-services.html#svc-suppress" }, { label: "Platform blueprint: Small-cell suppression", href: "pages/blueprint.html#node=svc-suppress" }]
  });

  N.push({
    id: "gold", step: "04", tag: "ZONE", kind: "zone", title: "Published / trusted (Gold)", subtitle: "trusted outputs · trust card",
    ownerTag: "mmah", products: ["mpd", "hh"], x: 772, y: 84,
    status: st("ok", "Passing"),
    summary: "Trusted, published outputs for both v1 products, each with a trust card.",
    owner: "Platform engineering",
    steward: "Data & Analytics Branch (mock) · Municipal Planning; Housing program area (mock) · Housing & HH",
    lastRun: [MPD_RUN_PUBLISH, HH_RUN_PUBLISH],
    dq: { pass: 3, warn: 0, fail: 0, open: 0 },
    rules: [R.starts, R.smallCell, R.zoneGold],
    links: [{ label: "Trust card: Municipal Planning Data", href: "pages/data-product-municipal.html" }, { label: "Trust card: Housing & Homelessness", href: "pages/data-product-housing.html" }, { label: "All data products", href: "pages/data-products.html" }]
  });

  N.push({
    id: "catalogue", step: "05", tag: "PUB", kind: "ext", title: "Catalogue / publish", subtitle: "enterprise catalogue · public open-data catalogue",
    ownerTag: "external", products: ["mpd", "hh"], x: 1004, y: 84,
    status: st("tbd", "Not yet linked"),
    summary: "Published outputs are listed in the enterprise catalogue and the public open-data catalogue; the portal links out and does not duplicate them.",
    owner: "Enterprise catalogue team (mock)",
    lastRun: TBD,
    dq: NA,
    rules: TBD,
    links: [{ label: "Catalogue entry (external link · not yet defined)", href: null }, { label: "Data products", href: "pages/data-products.html" }]
  });

  var E = PORTAL.map.edges;
  E.push({ from: "sources", to: "bronze", type: "request", label: "load" });
  E.push({ from: "bronze", to: "silver", type: "primary", label: "validate" });
  E.push({ from: "silver", to: "svc-clean", type: "request", label: "clean" });
  E.push({ from: "svc-clean", to: "silver", type: "return", label: "" });
  E.push({ from: "silver", to: "svc-match", type: "request", label: "match" });
  E.push({ from: "svc-match", to: "silver", type: "return", label: "" });
  E.push({ from: "silver", to: "svc-pidrop", type: "request", label: "drop fields" });
  E.push({ from: "svc-pidrop", to: "silver", type: "return", label: "" });
  E.push({ from: "silver", to: "svc-suppress", type: "request", label: "suppress" });
  E.push({ from: "svc-suppress", to: "silver", type: "return", label: "" });
  E.push({ from: "silver", to: "gold", type: "primary", label: "conform" });
  E.push({ from: "gold", to: "catalogue", type: "primary", label: "publish" });
  E.push({ from: "silver", to: "sources", type: "return", label: "DQ feedback" });
})();
