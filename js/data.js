/* Mock catalog for MMAH Platform Portal demo. Metadata only; no PI. */
window.PORTAL = window.PORTAL || {};

PORTAL.asOf = "2026-10-06T21:30:00-04:00";
PORTAL.asOfLabel = "6 Oct 2026, 9:30 PM ET";

PORTAL.catalog = [
  /* Datasets */
  {
    id: "ds-mpd-bronze",
    type: "dataset",
    name: "Municipal quarterly submissions",
    tech: "bronze.municipal_planning.raw_submissions",
    layer: "bronze",
    product: "municipal-planning",
    href: "pages/flows.html#node-mpd-bronze",
    keywords: ["municipal", "planning", "bronze", "raw", "submission"]
  },
  {
    id: "ds-mpd-silver",
    type: "dataset",
    name: "Conformed municipal planning tables",
    tech: "silver.municipal_planning.conform_tables",
    layer: "silver",
    product: "municipal-planning",
    href: "pages/flows.html#node-mpd-silver",
    keywords: ["municipal", "planning", "silver", "conformed"]
  },
  {
    id: "ds-mpd-gold",
    type: "dataset",
    name: "Municipal Planning Data — published measures",
    nameFr: "Données de planification municipale — mesures publiées",
    tech: "gold.municipal_planning.published_measures",
    layer: "gold",
    product: "municipal-planning",
    href: "pages/data-product-municipal.html",
    keywords: ["municipal", "planning", "gold", "O. Reg. 73/23", "housing supply"]
  },
  {
    id: "ds-hh-bronze",
    type: "dataset",
    name: "Aggregated housing / homelessness extracts",
    tech: "bronze.housing_hh.agg_extracts",
    layer: "bronze",
    product: "housing-hh",
    href: "pages/flows.html#node-hh-bronze",
    keywords: ["housing", "homelessness", "aggregated", "bronze"]
  },
  {
    id: "ds-hh-silver",
    type: "dataset",
    name: "Standardized housing / homelessness aggregates",
    tech: "silver.housing_hh.standard_agg",
    layer: "silver",
    product: "housing-hh",
    href: "pages/flows.html#node-hh-silver",
    keywords: ["housing", "homelessness", "silver"]
  },
  {
    id: "ds-hh-gold",
    type: "dataset",
    name: "Housing & Homelessness — published aggregates",
    nameFr: "Logement et itinérance — agrégats publiés",
    tech: "gold.housing_hh.published_agg",
    layer: "gold",
    product: "housing-hh",
    href: "pages/data-product-housing.html",
    keywords: ["housing", "homelessness", "gold", "aggregates", "small cell"]
  },
  /* Rules */
  {
    id: "rule-schema-mpd",
    type: "rule",
    name: "Municipal planning schema / code-list check",
    tech: "dq.mpd.schema_codelist_v1.4",
    href: "pages/rules.html#rule-schema-mpd",
    keywords: ["dq", "schema", "code-list", "municipal"]
  },
  {
    id: "rule-match-muni",
    type: "rule",
    name: "Municipality-name matching threshold",
    tech: "match.municipality_name.threshold",
    href: "pages/rules.html#rule-match-muni",
    keywords: ["matching", "municipality", "threshold", "fuzzy"]
  },
  {
    id: "rule-biz-housing-starts",
    type: "rule",
    name: "Housing starts definition (business rule)",
    tech: "biz.housing_starts.definition",
    href: "pages/rules.html#rule-biz-housing-starts",
    keywords: ["housing starts", "definition", "business rule"]
  },
  {
    id: "rule-contract-mpd",
    type: "rule",
    name: "Municipal planning data contract",
    tech: "contract.mpd.ingest_v2",
    href: "pages/rules.html#rule-contract-mpd",
    keywords: ["contract", "ingest", "municipal"]
  },
  {
    id: "rule-small-cell",
    type: "rule",
    name: "Small-cell suppression threshold",
    tech: "dq.suppression.small_cell_n5",
    href: "pages/rules.html#rule-small-cell",
    keywords: ["suppression", "small cell", "privacy"]
  },
  /* Services */
  {
    id: "svc-clean",
    type: "service",
    name: "Cleaning / validation shared service",
    tech: "svc.clean_validate",
    href: "pages/shared-services.html#svc-clean",
    keywords: ["cleaning", "validation", "shared"]
  },
  {
    id: "svc-muni-match",
    type: "service",
    name: "Municipality-name matching",
    tech: "svc.municipality_name_match",
    href: "pages/shared-services.html#svc-muni-match",
    keywords: ["municipality", "matching", "shared"]
  },
  {
    id: "svc-pi-drop",
    type: "service",
    name: "Personal-field drop",
    tech: "svc.personal_field_drop",
    href: "pages/shared-services.html#svc-pi-drop",
    keywords: ["personal", "field drop", "privacy"]
  },
  {
    id: "svc-suppress",
    type: "service",
    name: "Small-cell suppression",
    tech: "svc.small_cell_suppression",
    href: "pages/shared-services.html#svc-suppress",
    keywords: ["suppression", "small cell", "shared"]
  },
  /* Environments */
  {
    id: "env-dev",
    type: "environment",
    name: "Dev",
    tech: "env.dev",
    href: "pages/platform-setup.html#env-dev",
    keywords: ["dev", "environment"]
  },
  {
    id: "env-test",
    type: "environment",
    name: "Test",
    tech: "env.test",
    href: "pages/platform-setup.html#env-test",
    keywords: ["test", "environment"]
  },
  {
    id: "env-preprod",
    type: "environment",
    name: "Pre-Prod",
    tech: "env.preprod",
    href: "pages/platform-setup.html#env-preprod",
    keywords: ["pre-prod", "preprod", "environment"]
  },
  {
    id: "env-prod",
    type: "environment",
    name: "Prod",
    tech: "env.prod",
    href: "pages/platform-setup.html#env-prod",
    keywords: ["prod", "production", "environment"]
  },
  /* Releases */
  {
    id: "rel-04",
    type: "release",
    name: "Release 0.4 — Municipal Planning Data",
    tech: "release/0.4",
    href: "pages/releases.html#rel-04",
    keywords: ["release", "0.4", "gates", "CAB"]
  },
  {
    id: "rel-03",
    type: "release",
    name: "Release 0.3 — Housing & Homelessness aggregates",
    tech: "release/0.3",
    href: "pages/releases.html#rel-03",
    keywords: ["release", "0.3", "housing"]
  },
  /* Views */
  {
    id: "view-blueprint",
    type: "view",
    name: "Platform blueprint / Toolkit",
    tech: "config/toolkit.yaml",
    href: "pages/blueprint.html",
    keywords: ["blueprint", "toolkit", "tools", "fabric", "branch", "DAB", "phase"]
  }
];

/* NAV-1: catalog item → home map node (opens index.html#node=<id> with its drawer). */
PORTAL.mapNodeFor = {
  "ds-mpd-bronze": "bronze", "ds-hh-bronze": "bronze",
  "ds-mpd-silver": "silver", "ds-hh-silver": "silver",
  "ds-mpd-gold": "gold", "ds-hh-gold": "gold",
  "rule-schema-mpd": "silver", "rule-match-muni": "svc-match", "rule-biz-housing-starts": "gold",
  "rule-contract-mpd": "bronze", "rule-small-cell": "svc-suppress",
  "svc-clean": "svc-clean", "svc-muni-match": "svc-match", "svc-pi-drop": "svc-pidrop", "svc-suppress": "svc-suppress",
  "env-dev": "lane-dev", "env-test": "lane-test", "env-preprod": "lane-preprod", "env-prod": "lane-prod",
  "rel-04": "gate-preprod-prod", "rel-03": "lane-prod"
};

PORTAL.typeLabels = {
  dataset: "Dataset",
  rule: "Rule",
  service: "Service",
  environment: "Environment",
  release: "Release",
  view: "View"
};
