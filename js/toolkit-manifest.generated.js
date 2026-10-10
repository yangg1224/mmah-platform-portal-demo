/* GENERATED FILE - DO NOT EDIT.
   Source of truth: config/toolkit.yaml. Regenerate with: python3 scripts/build_toolkit.py
   Validate (CI, TKT-3): python3 scripts/validate_toolkit.py
   Platform blueprint / Toolkit manifest (PRD §6.6 TKT-2). Mock sample metadata only. */
window.PORTAL = window.PORTAL || {};
PORTAL.toolkit = {
 "manifest": "config/toolkit.yaml (sample manifest)",
 "asOf": "6 Oct 2026, 9:30 PM ET",
 "banner": {
  "text": "Intended platform: Microsoft Fabric. Per Yang 2026-10-07, not yet ministry-confirmed.",
  "linkLabel": "Open questions",
  "href": "#open-questions"
 },
 "columns": [
  {
   "id": "src",
   "step": "01",
   "label": "Sources",
   "tag": "EXT"
  },
  {
   "id": "ing",
   "step": "02",
   "label": "Ingest",
   "tag": "ING"
  },
  {
   "id": "store",
   "step": "03",
   "label": "Store",
   "tag": "STORE"
  },
  {
   "id": "proc",
   "step": "04",
   "label": "Process",
   "tag": "PROC"
  },
  {
   "id": "serve",
   "step": "05",
   "label": "Serve",
   "tag": "SERVE"
  },
  {
   "id": "enr",
   "step": "06",
   "label": "Enrich",
   "tag": "ENR"
  }
 ],
 "containers": [
  {
   "id": "services",
   "label": "Reusable services",
   "tag": "SVC",
   "slots": [
    410,
    556,
    716,
    862
   ],
   "nodeW": 134
  },
  {
   "id": "portal",
   "label": "Platform Portal",
   "tag": "PORTAL",
   "slots": [
    1032
   ],
   "nodeW": 140
  }
 ],
 "bars": [
  {
   "id": "gov",
   "label": "Governance",
   "tag": "GOV"
  },
  {
   "id": "mon",
   "label": "Monitoring",
   "tag": "MON"
  },
  {
   "id": "plat",
   "label": "Platform",
   "tag": "PLAT"
  }
 ],
 "units": [
  {
   "id": "BIRU",
   "label": "BIRU",
   "name": "Business Intelligence and Reporting Unit",
   "color": "#b07a12"
  },
  {
   "id": "SDGU-G",
   "label": "SDGU-G",
   "name": "Strategic Data Governance Unit · governance",
   "color": "#4f8a3c"
  },
  {
   "id": "SDGU-E",
   "label": "SDGU-E",
   "name": "Strategic Data Governance Unit · engineering",
   "color": "#2f6ea8"
  },
  {
   "id": "DPU",
   "label": "DPU",
   "name": "Data Policy Unit",
   "color": "#b5473a"
  },
  {
   "id": "CLUSTER?",
   "label": "CLUSTER?",
   "legend_label": "CLUSTER? (Cluster, to be confirmed)",
   "name": "Cluster / enterprise (to verify)",
   "color": "#6b7480"
  }
 ],
 "functions": [
  {
   "id": "acq",
   "label": "Data Acquisition",
   "short": "Acquisition",
   "unit": "DPU",
   "color": "#b5473a"
  },
  {
   "id": "meta",
   "label": "Metadata Management",
   "short": "Metadata",
   "unit": "SDGU-G",
   "color": "#4f8a3c"
  },
  {
   "id": "pipe",
   "label": "Data Pipeline",
   "short": "Pipeline",
   "unit": "SDGU-E",
   "color": "#2f6ea8"
  },
  {
   "id": "dq",
   "label": "Data Quality",
   "short": "Quality",
   "unit": "SDGU-G / SDGU-E",
   "color": "#2a8a86"
  },
  {
   "id": "ana",
   "label": "Analytics Products",
   "short": "Analytics",
   "unit": "BIRU",
   "color": "#b07a12"
  },
  {
   "id": "band",
   "label": "Cross-cutting bands",
   "short": "Band",
   "unit": "SDGU-G / DPU",
   "color": "#6b7480"
  }
 ],
 "boxes": [
  {
   "id": "dpr",
   "fn": "acq",
   "label": "Data in Policy & Regulation"
  },
  {
   "id": "dsa",
   "fn": "acq",
   "label": "Data Procurement & Data Sharing Agreement"
  },
  {
   "id": "mpdr",
   "fn": "acq",
   "label": "MPDR (Municipal Planning Data Reporting)"
  },
  {
   "id": "cls",
   "fn": "meta",
   "label": "Data Classification"
  },
  {
   "id": "std",
   "fn": "meta",
   "label": "Standardizing Data"
  },
  {
   "id": "dict",
   "fn": "meta",
   "label": "Data Dictionary & Lineage"
  },
  {
   "id": "mdm",
   "fn": "meta",
   "label": "Master Data Management"
  },
  {
   "id": "ingest",
   "fn": "pipe",
   "label": "Data Ingestion"
  },
  {
   "id": "clean",
   "fn": "pipe",
   "label": "Data Cleaning"
  },
  {
   "id": "xform",
   "fn": "pipe",
   "label": "Data Transformation"
  },
  {
   "id": "integ",
   "fn": "pipe",
   "label": "Data Integration & Consolidation"
  },
  {
   "id": "dqp",
   "fn": "dq",
   "label": "Data Quality Program"
  },
  {
   "id": "dqm",
   "fn": "dq",
   "label": "Data Quality Monitoring"
  },
  {
   "id": "adhoc",
   "fn": "ana",
   "label": "Analytics (One-off & Projects)"
  },
  {
   "id": "fact",
   "fn": "ana",
   "label": "Fact Checking"
  },
  {
   "id": "rpt",
   "fn": "ana",
   "label": "Reports & Dashboards"
  },
  {
   "id": "ml",
   "fn": "ana",
   "label": "Machine Learning & AI (future state)"
  },
  {
   "id": "kpi",
   "fn": "ana",
   "label": "KPI & Metric Development"
  },
  {
   "id": "perf",
   "fn": "ana",
   "label": "Performance Monitoring"
  },
  {
   "id": "council",
   "fn": "band",
   "label": "Data Council, Steering Committee & Data Working Groups"
  },
  {
   "id": "access",
   "fn": "band",
   "label": "Data Access & Permissions Framework"
  },
  {
   "id": "policy",
   "fn": "band",
   "label": "Ministry Data Policies"
  },
  {
   "id": "literacy",
   "fn": "band",
   "label": "Data Maturity & Literacy"
  },
  {
   "id": "procimp",
   "fn": "band",
   "label": "Data & Analytics Process Improvement"
  },
  {
   "id": "projmgmt",
   "fn": "band",
   "label": "Analytics Project Management"
  },
  {
   "id": "change",
   "fn": "band",
   "label": "Data & Analytics Change Management"
  }
 ],
 "phases": [
  {
   "id": "v1",
   "label": "v1",
   "icon": "◆",
   "why": "Needed for the two first products."
  },
  {
   "id": "next",
   "label": "Next",
   "icon": "◇",
   "why": "After both products are live, or when a named trigger happens."
  },
  {
   "id": "future",
   "label": "Future",
   "icon": "◌",
   "why": "Gated by later policy or assessment."
  }
 ],
 "statuses": {
  "planned": {
   "icon": "○",
   "word": "Planned",
   "cls": "neutral"
  },
  "prov": {
   "icon": "◐",
   "word": "Provisioned",
   "cls": "info"
  },
  "live": {
   "icon": "✓",
   "word": "Live",
   "cls": "ok"
  },
  "na": {
   "icon": "–",
   "word": "Not applicable",
   "cls": "neutral"
  }
 },
 "envs": [
  "Dev",
  "Test",
  "Pre-Prod",
  "Prod"
 ],
 "edgeTypes": {
  "primary": "Primary flow",
  "request": "Request",
  "return": "Return / async",
  "gate": "Gate"
 },
 "considered": [
  {
   "name": "Eventstream",
   "reason": "No streaming sources: MMAH data arrives as periodic batches. Streaming is on the refuse list."
  },
  {
   "name": "Eventhouse / KQL database (as a workload)",
   "reason": "No streaming or telemetry product; only appears inside workspace monitoring."
  },
  {
   "name": "Real-Time Intelligence and its dashboards",
   "reason": "No real-time use case in either v1 product."
  },
  {
   "name": "Mirrored databases",
   "reason": "No operational database source is in scope; submissions arrive as files."
  },
  {
   "name": "SQL database in Fabric",
   "reason": "No OLTP need; the lakehouse covers storage."
  },
  {
   "name": "API for GraphQL",
   "reason": "No application consumers; BIRU reads semantic models, the portal reads metadata APIs."
  },
  {
   "name": "Copilot in Fabric",
   "reason": "No branch box needs it in v1; off until AI policy, TRA and the AI Directive say otherwise."
  },
  {
   "name": "Fabric data agents",
   "reason": "Same reason as Copilot; revisit under the ML & AI (future state) box."
  },
  {
   "name": "Cross-tenant OneLake data share",
   "reason": "No external tenant consumer; Ontario Data Catalogue is the only public channel."
  },
  {
   "name": "Streaming sources (IoT Hub, Event Hubs, Kafka and others)",
   "reason": "Not MMAH sources."
  },
  {
   "name": "Shortcuts to Amazon S3, Google Cloud Storage, Dataverse",
   "reason": "No v1 source lives there."
  },
  {
   "name": "Commercial MDM product",
   "reason": "One master entity (municipality) is handled by a reference table plus the matching service."
  }
 ],
 "openQuestions": [
  {
   "id": "oq1",
   "text": "Confirm the ministry has chosen Fabric, and through which procurement door (target Fri Oct 31)."
  },
  {
   "id": "oq2",
   "text": "Tenancy and region: does an OPS Fabric tenant or capacity exist, and who administers it?"
  },
  {
   "id": "oq3",
   "text": "Purview: adopt, share or skip? It is a candidate, not a given."
  },
  {
   "id": "oq4",
   "text": "Engineering toolchain: Azure DevOps or GitHub; Terraform or Bicep + fabric-cicd."
  },
  {
   "id": "oq5",
   "text": "Power BI and DIVA VOR: how BIRU reporting fits the no-second-analytics-tool rule."
  },
  {
   "id": "oq6",
   "text": "MPDR intake channel: reuse an existing one, or SFTP with malware scanning?"
  },
  {
   "id": "oq7",
   "text": "Capacities and environments: separate non-prod and prod, where Pre-Prod sits, budget owner."
  },
  {
   "id": "oq8",
   "text": "Network posture for Prod: workspace private link or public endpoints behind Conditional Access."
  }
 ],
 "nodes": [
  {
   "id": "s-muni",
   "tag": "EXT",
   "title": "Municipalities",
   "subtitle": "O. Reg. 73/23 Sch 2, 3, 4",
   "column": "src",
   "row": 0,
   "branchBoxes": [
    "mpdr"
   ],
   "unit": "DPU",
   "owner": "Submitting municipalities · DPU owns who submits what",
   "phase": "v1",
   "status": "prov",
   "statusSource": "intake-log adapter (mock): submissions received per environment",
   "statusByEnv": [
    "v",
    "v",
    "v",
    "p"
   ],
   "summary": "Municipal submissions under O. Reg. 73/23 Schedules 2, 3 and 4.",
   "why": "Source for Municipal Planning Data; Release 0.4 is at Pre-Prod.",
   "iac": "na",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.3 (internal doc · not in this demo)",
     "href": null
    }
   ],
   "upstream": [],
   "downstream": [
    "i-sftp"
   ],
   "homeNode": "sources",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "s-sm",
   "tag": "EXT",
   "title": "Service managers",
   "subtitle": "aggregated housing data",
   "column": "src",
   "row": 1,
   "branchBoxes": [
    "dsa",
    "mpdr"
   ],
   "unit": "DPU",
   "owner": "Service managers · DPU holds the data sharing agreements",
   "phase": "v1",
   "status": "live",
   "statusSource": "intake-log adapter (mock): submissions received per environment",
   "statusByEnv": [
    "v",
    "v",
    "v",
    "l"
   ],
   "summary": "Aggregated housing and homelessness extracts; no person-level data.",
   "why": "Source for Housing & Homelessness, live in Prod since 29 Sep 2026 (Release 0.3).",
   "iac": "na",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.3 (internal doc · not in this demo)",
     "href": null
    }
   ],
   "upstream": [],
   "downstream": [
    "i-sftp"
   ],
   "homeNode": "sources",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "s-list",
   "tag": "EXT",
   "title": "Provincial municipality list",
   "subtitle": "codes · names EN/FR",
   "column": "src",
   "row": 4,
   "branchBoxes": [
    "mdm"
   ],
   "unit": "SDGU-G",
   "owner": "SDGU-G",
   "phase": "v1",
   "status": "prov",
   "statusSource": "reference-load adapter (mock): list loaded per environment",
   "statusByEnv": [
    "v",
    "v",
    "v",
    "p"
   ],
   "summary": "The provincial list of municipalities and service managers.",
   "why": "Master data for name matching in both products.",
   "iac": "na",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.5 (internal doc · not in this demo)",
     "href": null
    }
   ],
   "upstream": [],
   "downstream": [
    "st-ref"
   ],
   "homeNode": "svc-match",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "s-onprem",
   "tag": "EXT",
   "title": "On-prem OPS systems",
   "subtitle": "Guelph Data Centre",
   "column": "src",
   "row": 3,
   "branchBoxes": [
    "ingest"
   ],
   "unit": "CLUSTER?",
   "owner": "Cluster / enterprise (verify)",
   "phase": "next",
   "status": "planned",
   "statusSource": "manifest only",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "On-premises OPS systems that may feed later products.",
   "why": "No v1 source needs it.",
   "iac": "na",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.3 (internal doc · not in this demo)",
     "href": null
    }
   ],
   "upstream": [],
   "downstream": [
    "i-gw"
   ],
   "homeNode": null,
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "i-sftp",
   "tag": "ING",
   "title": "SFTP intake",
   "subtitle": "ADLS Gen2 · per-submitter ACLs",
   "column": "ing",
   "row": 0,
   "branchBoxes": [
    "mpdr",
    "ingest"
   ],
   "unit": "SDGU-E",
   "owner": "SDGU-E runs it · DPU owns who submits what",
   "phase": "v1",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Secure batch submission channel, one local user per submitter.",
   "why": "Lands municipal and service-manager files without B2B identities in v1.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.3 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    },
    {
     "label": "Open question 6",
     "href": "#open-questions"
    }
   ],
   "upstream": [
    "s-muni",
    "s-sm"
   ],
   "downstream": [
    "i-notify",
    "st-bronze"
   ],
   "homeNode": "bronze",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "i-notify",
   "tag": "ING",
   "title": "Logic Apps or Functions",
   "subtitle": "receipt · notify · start run",
   "column": "ing",
   "row": 1,
   "branchBoxes": [
    "mpdr",
    "ingest"
   ],
   "unit": "SDGU-E",
   "owner": "SDGU-E",
   "phase": "v1",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "On upload: log the receipt, acknowledge, start the pipeline, route rejects.",
   "why": "Submitters get a receipt and the run starts without manual steps.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.3 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    }
   ],
   "upstream": [
    "i-sftp"
   ],
   "downstream": [
    "i-adf"
   ],
   "homeNode": "bronze",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "i-adf",
   "tag": "ING",
   "title": "Data Factory pipelines",
   "subtitle": "land → validate → conform → publish",
   "column": "ing",
   "row": 2,
   "branchBoxes": [
    "ingest",
    "xform"
   ],
   "unit": "SDGU-E",
   "owner": "SDGU-E",
   "phase": "v1",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Orchestrates one batch pattern with retries and per-environment parameters.",
   "why": "One pipeline pattern reused for both products.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.6 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    }
   ],
   "upstream": [
    "i-notify",
    "i-gw"
   ],
   "downstream": [
    "st-bronze"
   ],
   "homeNode": "bronze",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "i-gw",
   "tag": "ING",
   "title": "On-premises data gateway",
   "subtitle": "pull from OPS systems",
   "column": "ing",
   "row": 3,
   "branchBoxes": [
    "ingest"
   ],
   "unit": "CLUSTER?",
   "owner": "SDGU-E / Cluster (verify)",
   "phase": "next",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Gateway to pull from on-premises OPS systems.",
   "why": "Only when an on-prem source appears; a cluster-run gateway is preferred.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.3 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    }
   ],
   "upstream": [
    "s-onprem"
   ],
   "downstream": [
    "i-adf"
   ],
   "homeNode": null,
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "st-bronze",
   "tag": "STORE",
   "title": "Bronze lakehouse",
   "subtitle": "as received · intake log",
   "column": "store",
   "row": 0,
   "branchBoxes": [
    "ingest"
   ],
   "unit": "SDGU-E",
   "owner": "SDGU-E",
   "phase": "v1",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Raw submissions, unchanged, tagged with source, schedule, period and received date.",
   "why": "Keeps what was received, for audit and re-runs.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.5 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    }
   ],
   "upstream": [
    "i-sftp",
    "i-adf"
   ],
   "downstream": [
    "st-silver",
    "p-dq"
   ],
   "homeNode": "bronze",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "st-silver",
   "tag": "STORE",
   "title": "Silver lakehouse",
   "subtitle": "validated · conformed",
   "column": "store",
   "row": 1,
   "branchBoxes": [
    "clean",
    "xform",
    "std"
   ],
   "unit": "SDGU-E",
   "owner": "SDGU-E",
   "phase": "v1",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Checked, cleaned, municipality-matched data with personal fields dropped.",
   "why": "One conformed layer both products build on.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.5 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    }
   ],
   "upstream": [
    "st-bronze",
    "p-dq",
    "p-spark"
   ],
   "downstream": [
    "st-gold"
   ],
   "homeNode": "silver",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "st-gold",
   "tag": "STORE",
   "title": "Gold lakehouse",
   "subtitle": "trusted outputs · trust card",
   "column": "store",
   "row": 2,
   "branchBoxes": [
    "integ",
    "rpt"
   ],
   "unit": "SDGU-E",
   "owner": "SDGU-E builds, BIRU consumes",
   "phase": "v1",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Aggregated, suppressed, documented outputs.",
   "why": "Source of every trust card and published figure.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.5 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    }
   ],
   "upstream": [
    "st-silver"
   ],
   "downstream": [
    "sv-model",
    "sv-odc",
    "st-wh",
    "e-ml"
   ],
   "homeNode": "gold",
   "deeper": [
    {
     "label": "Data products and trust cards",
     "href": "data-products.html"
    }
   ],
   "statusNote": ""
  },
  {
   "id": "st-ref",
   "tag": "STORE",
   "title": "Municipality reference table",
   "subtitle": "in Silver · shared",
   "column": "store",
   "row": 4,
   "branchBoxes": [
    "mdm",
    "std"
   ],
   "unit": "SDGU-G",
   "owner": "SDGU-G owns the content, SDGU-E runs it",
   "phase": "v1",
   "status": "prov",
   "statusSource": "iac-state adapter (mock): found in at least one environment",
   "statusByEnv": [
    "v",
    "v",
    "v",
    "p"
   ],
   "summary": "Provincial municipality and service-manager list with codes, EN/FR names and aliases.",
   "why": "Master data as a table plus process; no MDM product in v1.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.5 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Rule / config entry",
     "href": "rules.html#rule-match-muni"
    }
   ],
   "upstream": [
    "s-list"
   ],
   "downstream": [
    "svc-match"
   ],
   "homeNode": "svc-match",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "st-wh",
   "tag": "STORE",
   "title": "Warehouse",
   "subtitle": "T-SQL serving if needed",
   "column": "store",
   "row": 3,
   "branchBoxes": [
    "integ",
    "rpt"
   ],
   "unit": "BIRU",
   "owner": "BIRU / SDGU-E",
   "phase": "next",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Optional T-SQL serving layer.",
   "why": "Only if BIRU needs stored procedures; the SQL endpoint is enough for v1.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.5 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    }
   ],
   "upstream": [
    "st-gold"
   ],
   "downstream": [],
   "homeNode": null,
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "p-spark",
   "tag": "PROC",
   "title": "Spark notebooks",
   "subtitle": "+ pinned environment",
   "column": "proc",
   "row": 0,
   "branchBoxes": [
    "clean",
    "xform"
   ],
   "unit": "SDGU-E",
   "owner": "SDGU-E",
   "phase": "v1",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "PySpark notebooks for cleaning, conforming, aggregation and suppression.",
   "why": "Notebooks call shared libraries; no copy-paste logic.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.6 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    }
   ],
   "upstream": [
    "st-bronze"
   ],
   "downstream": [
    "st-silver",
    "svc-clean",
    "svc-match",
    "svc-pidrop",
    "svc-suppress"
   ],
   "homeNode": "silver",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "p-dq",
   "tag": "PROC",
   "title": "DQ rules as YAML",
   "subtitle": "run every load · results table",
   "column": "proc",
   "row": 1,
   "branchBoxes": [
    "dqp",
    "dqm"
   ],
   "unit": "SDGU-G",
   "owner": "SDGU-G owns the rules, SDGU-E the engine",
   "phase": "v1",
   "status": "live",
   "statusSource": "iac-state + run adapter (mock): in Prod and used by a v1 run within the freshness window",
   "statusByEnv": [
    "v",
    "v",
    "v",
    "l"
   ],
   "summary": "Schema, code-list, completeness and geometry rules with thresholds and approvers.",
   "why": "Pull-request approval is steward approval; the same counts feed the portal badges.",
   "iac": "config/dq/mpd_schema_codelist.yaml@18b64aa",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.11 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Rule / config entry",
     "href": "rules.html#rule-schema-mpd"
    }
   ],
   "upstream": [
    "st-bronze"
   ],
   "downstream": [
    "st-silver",
    "sv-alert"
   ],
   "homeNode": "silver",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "p-geo",
   "tag": "PROC",
   "title": "Geospatial notebooks",
   "subtitle": "Sedona or GeoPandas",
   "column": "proc",
   "row": 3,
   "branchBoxes": [
    "mpdr",
    "xform",
    "std"
   ],
   "unit": "SDGU-E",
   "owner": "SDGU-E",
   "phase": "v1",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Validate geometry, reproject and join Schedule 3 land-supply data.",
   "why": "O. Reg. 73/23 Schedule 3 includes geospatial submissions.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.8 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    }
   ],
   "upstream": [
    "st-bronze",
    "st-ref"
   ],
   "downstream": [
    "st-silver"
   ],
   "homeNode": "silver",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "p-df2",
   "tag": "PROC",
   "title": "Dataflow Gen2",
   "subtitle": "low-code for analysts",
   "column": "proc",
   "row": 4,
   "branchBoxes": [
    "xform",
    "adhoc"
   ],
   "unit": "BIRU",
   "owner": "BIRU",
   "phase": "next",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Low-code transforms for BIRU analysts.",
   "why": "Kept out of v1 so engineering has one pattern.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.6 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    }
   ],
   "upstream": [],
   "downstream": [
    "st-gold"
   ],
   "homeNode": null,
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "sv-score",
   "tag": "SERVE",
   "title": "Scorecards",
   "subtitle": "KPI tracking",
   "column": "serve",
   "row": 0,
   "branchBoxes": [
    "kpi",
    "perf"
   ],
   "unit": "BIRU",
   "owner": "BIRU",
   "phase": "next",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "KPI tracking with owners and check-ins.",
   "why": "After both products are live.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.9 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    }
   ],
   "upstream": [
    "sv-model"
   ],
   "downstream": [],
   "homeNode": null,
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "sv-alert",
   "tag": "SERVE",
   "title": "Activator alerts",
   "subtitle": "DQ fail · late submission",
   "column": "serve",
   "row": 1,
   "branchBoxes": [
    "dqm",
    "perf"
   ],
   "unit": "SDGU-E",
   "owner": "SDGU-E (DQ), BIRU (KPI)",
   "phase": "next",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Alerts on DQ failures, late submissions or KPI thresholds.",
   "why": "v1 alerts come from pipeline notifications and logs.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.9 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    }
   ],
   "upstream": [
    "p-dq"
   ],
   "downstream": [],
   "homeNode": null,
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "sv-model",
   "tag": "SERVE",
   "title": "Semantic models",
   "subtitle": "Direct Lake over Gold",
   "column": "serve",
   "row": 2,
   "branchBoxes": [
    "kpi",
    "rpt"
   ],
   "unit": "BIRU",
   "owner": "BIRU (with SDGU-G for definitions)",
   "phase": "v1",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Governed measures over Gold for both products.",
   "why": "One set of measures behind every report.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.9 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    }
   ],
   "upstream": [
    "st-gold"
   ],
   "downstream": [
    "sv-pbi",
    "sv-score",
    "e-ml"
   ],
   "homeNode": "gold",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "sv-pbi",
   "tag": "SERVE",
   "title": "Power BI reports and app",
   "subtitle": "internal reporting",
   "column": "serve",
   "row": 3,
   "branchBoxes": [
    "rpt",
    "adhoc"
   ],
   "unit": "BIRU",
   "owner": "BIRU",
   "phase": "v1",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Internal reports for planning and housing data.",
   "why": "BIRU's reporting surface, subject to the DIVA VOR question.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.9 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    },
    {
     "label": "Open question 5",
     "href": "#open-questions"
    }
   ],
   "upstream": [
    "sv-model"
   ],
   "downstream": [],
   "homeNode": null,
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "sv-odc",
   "tag": "SERVE",
   "title": "Ontario Data Catalogue export",
   "subtitle": "EN + FR · open licence",
   "column": "serve",
   "row": 4,
   "branchBoxes": [
    "dpr",
    "dict"
   ],
   "unit": "DPU",
   "owner": "DPU (publishing policy), SDGU-G (metadata)",
   "phase": "v1",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Publishes catalogue titles and descriptions in English and French together.",
   "why": "The Ontario Data Catalogue stays the only public channel.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.9 (internal doc · not in this demo)",
     "href": null
    }
   ],
   "upstream": [
    "st-gold"
   ],
   "downstream": [],
   "homeNode": "catalogue",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "e-ml",
   "tag": "ENR",
   "title": "Foundry or Azure ML",
   "subtitle": "gated by the AI Directive",
   "column": "enr",
   "row": 2,
   "branchBoxes": [
    "ml"
   ],
   "unit": "BIRU",
   "owner": "BIRU (with SDGU-G)",
   "phase": "future",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Future ML and AI use cases over Gold aggregates.",
   "why": "Gated by SoS, TRA, PIA and Ontario's Responsible Use of AI Directive.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.14 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    }
   ],
   "upstream": [
    "sv-model",
    "st-gold"
   ],
   "downstream": [],
   "homeNode": null,
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "svc-clean",
   "tag": "SVC",
   "title": "Cleaning library",
   "subtitle": "config-driven cleaning",
   "container": "services",
   "branchBoxes": [
    "clean",
    "std"
   ],
   "unit": "SDGU-E",
   "owner": "SDGU-E",
   "phase": "v1",
   "status": "live",
   "statusSource": "iac-state + run adapter (mock): in Prod and used by a v1 run within the freshness window",
   "statusByEnv": [
    "v",
    "v",
    "v",
    "l"
   ],
   "summary": "Shared cleaning library used by the Spark notebooks.",
   "why": "Trim, parse and map code lists from config, not code.",
   "iac": "services/clean_validate/rules.yaml@18b64aa",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.7 (internal doc · not in this demo)",
     "href": null
    }
   ],
   "upstream": [
    "p-spark"
   ],
   "downstream": [],
   "homeNode": "svc-clean",
   "deeper": [
    {
     "label": "Shared services: Cleaning library",
     "href": "shared-services.html#svc-clean"
    }
   ],
   "statusNote": ""
  },
  {
   "id": "svc-match",
   "tag": "SVC",
   "title": "Municipality-name matching",
   "subtitle": "library first · API later",
   "container": "services",
   "branchBoxes": [
    "mdm",
    "integ",
    "fact"
   ],
   "unit": "SDGU-E",
   "owner": "SDGU-E builds, SDGU-G approves thresholds",
   "phase": "v1",
   "status": "prov",
   "statusSource": "iac-state adapter (mock): found in at least one environment",
   "statusByEnv": [
    "v",
    "v",
    "v",
    "p"
   ],
   "summary": "Shared municipality-name matching used by the Spark notebooks.",
   "why": "Matches names to the reference table; unmatched rows go to a steward queue.",
   "iac": "services/municipality_name_match/rules.yaml@18b64aa",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.7 (internal doc · not in this demo)",
     "href": null
    }
   ],
   "upstream": [
    "p-spark",
    "st-ref"
   ],
   "downstream": [],
   "homeNode": "svc-match",
   "deeper": [
    {
     "label": "Shared services: Municipality-name matching",
     "href": "shared-services.html#svc-muni-match"
    }
   ],
   "statusNote": ""
  },
  {
   "id": "svc-pidrop",
   "tag": "SVC",
   "title": "Personal-field drop",
   "subtitle": "tag-list driven",
   "container": "services",
   "branchBoxes": [
    "cls",
    "dpr"
   ],
   "unit": "SDGU-G",
   "owner": "SDGU-G owns the list, SDGU-E the code",
   "phase": "v1",
   "status": "live",
   "statusSource": "iac-state + run adapter (mock): in Prod and used by a v1 run within the freshness window",
   "statusByEnv": [
    "v",
    "v",
    "v",
    "l"
   ],
   "summary": "Shared personal-field drop used by the Spark notebooks.",
   "why": "Keeps the aggregate-only path free of personal fields.",
   "iac": "services/personal_field_drop/rules.yaml@18b64aa",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.7 (internal doc · not in this demo)",
     "href": null
    }
   ],
   "upstream": [
    "p-spark"
   ],
   "downstream": [],
   "homeNode": "svc-pidrop",
   "deeper": [
    {
     "label": "Shared services: Personal-field drop",
     "href": "shared-services.html#svc-pi-drop"
    }
   ],
   "statusNote": ""
  },
  {
   "id": "svc-suppress",
   "tag": "SVC",
   "title": "Small-cell suppression",
   "subtitle": "before Gold and portal counts",
   "container": "services",
   "branchBoxes": [
    "dpr",
    "cls"
   ],
   "unit": "DPU",
   "owner": "DPU / SDGU-G agree the rule, SDGU-E implements",
   "phase": "v1",
   "status": "live",
   "statusSource": "iac-state + run adapter (mock): in Prod and used by a v1 run within the freshness window",
   "statusByEnv": [
    "v",
    "v",
    "v",
    "l"
   ],
   "summary": "Shared small-cell suppression used by the Spark notebooks.",
   "why": "Published counts cannot identify small groups.",
   "iac": "services/small_cell_suppression/rules.yaml@18b64aa",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.7 (internal doc · not in this demo)",
     "href": null
    }
   ],
   "upstream": [
    "p-spark"
   ],
   "downstream": [],
   "homeNode": "svc-suppress",
   "deeper": [
    {
     "label": "Shared services: Small-cell suppression",
     "href": "shared-services.html#svc-suppress"
    }
   ],
   "statusNote": ""
  },
  {
   "id": "pt-adapters",
   "tag": "PORTAL",
   "title": "Portal adapters",
   "subtitle": "vendor-neutral · read-only",
   "container": "portal",
   "branchBoxes": [
    "dict",
    "change"
   ],
   "unit": "SDGU-E",
   "owner": "SDGU-E",
   "phase": "v1",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "This portal: reads lineage, IaC and config metadata through vendor-neutral adapters.",
   "why": "One read-only lens on code and metadata for engineers and stewards.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §1 (internal doc · not in this demo)",
     "href": null
    }
   ],
   "upstream": [],
   "downstream": [],
   "homeNode": null,
   "deeper": [
    {
     "label": "Process map (home)",
     "href": "../index.html"
    }
   ],
   "statusNote": ""
  },
  {
   "id": "g-catalog",
   "tag": "GOV",
   "title": "Purview Unified Catalog",
   "subtitle": "glossary · candidate",
   "bar": "gov",
   "branchBoxes": [
    "dict",
    "council"
   ],
   "unit": "SDGU-G",
   "owner": "SDGU-G",
   "phase": "v1",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Glossary terms and data product entries with owner and steward.",
   "why": "A candidate, not a given: join an OPS-wide catalogue rather than run a rival one.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.10 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    },
    {
     "label": "Open question 3",
     "href": "#open-questions"
    }
   ],
   "upstream": [],
   "downstream": [],
   "homeNode": "catalogue",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "g-labels",
   "tag": "GOV",
   "title": "Sensitivity labels and DLP",
   "subtitle": "match the SoS level",
   "bar": "gov",
   "branchBoxes": [
    "cls",
    "policy"
   ],
   "unit": "SDGU-G",
   "owner": "SDGU-G",
   "phase": "v1",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Labels on lakehouses, semantic models and reports.",
   "why": "Item labels follow the Statement of Sensitivity; DLP comes Next.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.10 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    }
   ],
   "upstream": [],
   "downstream": [],
   "homeNode": null,
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "g-contracts",
   "tag": "GOV",
   "title": "Data contracts in Git",
   "subtitle": "Open Data Contract Standard",
   "bar": "gov",
   "branchBoxes": [
    "dqp",
    "std"
   ],
   "unit": "SDGU-G",
   "owner": "SDGU-G",
   "phase": "v1",
   "status": "prov",
   "statusSource": "iac-state adapter (mock): found in at least one environment",
   "statusByEnv": [
    "v",
    "v",
    "v",
    "p"
   ],
   "summary": "One contract per dataset: schema, quality, owner, SLA; checked every run.",
   "why": "Submitters and engineers share one definition of a valid file.",
   "iac": "config/contracts/mpd_ingest_v2.yaml@18b64aa",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.11 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Rule / config entry",
     "href": "rules.html#rule-contract-mpd"
    }
   ],
   "upstream": [],
   "downstream": [],
   "homeNode": "bronze",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "g-dsa",
   "tag": "GOV",
   "title": "DSA register",
   "subtitle": "YAML in Git or a list",
   "bar": "gov",
   "branchBoxes": [
    "dsa",
    "dpr"
   ],
   "unit": "DPU",
   "owner": "DPU",
   "phase": "v1",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Every data sharing agreement: parties, datasets, purpose, retention, expiry.",
   "why": "Each Bronze source must point to an agreement.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.3 (internal doc · not in this demo)",
     "href": null
    }
   ],
   "upstream": [],
   "downstream": [],
   "homeNode": "sources",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "g-pdq",
   "tag": "GOV",
   "title": "Purview Data Quality",
   "subtitle": "managed DQ scores",
   "bar": "gov",
   "branchBoxes": [
    "dqp"
   ],
   "unit": "SDGU-G",
   "owner": "SDGU-G",
   "phase": "next",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Managed DQ rules and scores on Gold data products.",
   "why": "Only if Purview is adopted; YAML rules cover v1.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.10 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    },
    {
     "label": "Open question 3",
     "href": "#open-questions"
    }
   ],
   "upstream": [],
   "downstream": [],
   "homeNode": null,
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "m-hub",
   "tag": "MON",
   "title": "Monitoring hub",
   "subtitle": "+ workspace monitoring",
   "bar": "mon",
   "branchBoxes": [
    "dqm",
    "ingest"
   ],
   "unit": "SDGU-E",
   "owner": "SDGU-E",
   "phase": "v1",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Run status of pipelines, notebooks and refreshes.",
   "why": "Built-in run status; workspace monitoring for Prod.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.13 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    }
   ],
   "upstream": [],
   "downstream": [],
   "homeNode": "silver",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "m-logs",
   "tag": "MON",
   "title": "Azure Monitor + Log Analytics",
   "subtitle": "diagnostic logs · alerts",
   "bar": "mon",
   "branchBoxes": [
    "dqm",
    "access"
   ],
   "unit": "SDGU-E",
   "owner": "SDGU-E / Cluster (verify central workspace)",
   "phase": "v1",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Diagnostic logs from storage, intake functions, key store and the portal.",
   "why": "Logs reach the central store (build plan exit criterion).",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.13 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    }
   ],
   "upstream": [],
   "downstream": [],
   "homeNode": "ops",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "m-capacity",
   "tag": "MON",
   "title": "Capacity Metrics app",
   "subtitle": "use · throttling",
   "bar": "mon",
   "branchBoxes": [
    "procimp",
    "projmgmt"
   ],
   "unit": "SDGU-E",
   "owner": "SDGU-E",
   "phase": "v1",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Capacity use, throttling and system events.",
   "why": "Size capacity from evidence; no SKU is assumed.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.13 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    }
   ],
   "upstream": [],
   "downstream": [],
   "homeNode": "env",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "m-cost",
   "tag": "MON",
   "title": "Cost Management budgets",
   "subtitle": "per capacity and tag",
   "bar": "mon",
   "branchBoxes": [
    "projmgmt"
   ],
   "unit": "DPU",
   "owner": "DPU (project management) · SDGU-E",
   "phase": "v1",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Budgets and alerts per subscription, capacity and tag.",
   "why": "Budget owner is still a week-1 question; no prices here.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.13 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    }
   ],
   "upstream": [],
   "downstream": [],
   "homeNode": "env",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "pl-entra",
   "tag": "PLAT",
   "title": "Entra ID groups",
   "subtitle": "PIM · Conditional Access",
   "bar": "plat",
   "branchBoxes": [
    "access"
   ],
   "unit": "SDGU-G",
   "owner": "SDGU-G defines, Cluster (verify) operates",
   "phase": "v1",
   "status": "prov",
   "statusSource": "iac-state adapter (mock): found in at least one environment",
   "statusByEnv": [
    "v",
    "v",
    "v",
    "v"
   ],
   "summary": "Role-based groups per environment; just-in-time elevation; sign-in policies.",
   "why": "Every permission goes to a group, never a person.",
   "iac": "iac/modules/identity/roles.tf@18b64aa",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.1 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    }
   ],
   "upstream": [],
   "downstream": [],
   "homeNode": "iam",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "pl-kv",
   "tag": "PLAT",
   "title": "Key Vault",
   "subtitle": "few secrets · managed keys",
   "bar": "plat",
   "branchBoxes": [
    "access",
    "policy"
   ],
   "unit": "SDGU-E",
   "owner": "SDGU-E / Cluster (verify)",
   "phase": "v1",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Holds the few remaining non-identity secrets and managed keys.",
   "why": "Prefer identity over secrets; rotation is an exit criterion.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.2 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    }
   ],
   "upstream": [],
   "downstream": [],
   "homeNode": "ops",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "pl-policy",
   "tag": "PLAT",
   "title": "Azure Policy and tags",
   "subtitle": "regions · required tags",
   "bar": "plat",
   "branchBoxes": [
    "policy",
    "cls"
   ],
   "unit": "SDGU-G",
   "owner": "SDGU-G sets the rules, SDGU-E codes them",
   "phase": "v1",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Enforces regions, required tags and no public data access.",
   "why": "Untagged storage is blocked or alerted (the Test retention-tag flag).",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.2 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    }
   ],
   "upstream": [],
   "downstream": [],
   "homeNode": "env",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "pl-network",
   "tag": "PLAT",
   "title": "Private endpoints",
   "subtitle": "+ trusted workspace access",
   "bar": "plat",
   "branchBoxes": [
    "access",
    "ingest"
   ],
   "unit": "CLUSTER?",
   "owner": "Cluster (verify) network, SDGU-E",
   "phase": "v1",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "No public data-plane access to intake storage.",
   "why": "Network posture for Prod is a CISO / TRA decision.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.2 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    },
    {
     "label": "Open question 8",
     "href": "#open-questions"
    }
   ],
   "upstream": [],
   "downstream": [],
   "homeNode": "ops",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "pl-capacity",
   "tag": "PLAT",
   "title": "Capacity per environment",
   "subtitle": "non-prod · prod",
   "bar": "plat",
   "branchBoxes": [
    "procimp",
    "projmgmt"
   ],
   "unit": "CLUSTER?",
   "owner": "Cluster (verify) buys, SDGU-E operates",
   "phase": "v1",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Separate non-prod and prod compute capacity.",
   "why": "Isolate Prod load; pause non-prod out of hours.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.4 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    },
    {
     "label": "Open question 7",
     "href": "#open-questions"
    }
   ],
   "upstream": [],
   "downstream": [],
   "homeNode": "env",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "pl-repo",
   "tag": "PLAT",
   "title": "Azure DevOps or GitHub",
   "subtitle": "repos · pipelines · boards",
   "bar": "plat",
   "branchBoxes": [
    "procimp",
    "projmgmt",
    "change"
   ],
   "unit": "SDGU-E",
   "owner": "SDGU-E (DPU for project management practice)",
   "phase": "v1",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Repos, CI/CD from Dev to Prod, boards and runbooks.",
   "why": "Pick whatever OPS already runs.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.12 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    },
    {
     "label": "Open question 4",
     "href": "#open-questions"
    }
   ],
   "upstream": [],
   "downstream": [],
   "homeNode": "gate-preprod-prod",
   "deeper": [
    {
     "label": "Releases and gates",
     "href": "releases.html"
    }
   ],
   "statusNote": ""
  },
  {
   "id": "pl-iac",
   "tag": "PLAT",
   "title": "Terraform or Bicep",
   "subtitle": "+ fabric-cicd deploys",
   "bar": "plat",
   "branchBoxes": [
    "procimp",
    "policy",
    "change"
   ],
   "unit": "SDGU-E",
   "owner": "SDGU-E",
   "phase": "v1",
   "status": "prov",
   "statusSource": "iac-state adapter (mock): found in at least one environment",
   "statusByEnv": [
    "v",
    "v",
    "v",
    "v"
   ],
   "summary": "Infrastructure and workspace definitions as code; code-first deployment.",
   "why": "Every environment item links to a repo file path plus the commit that last changed it.",
   "iac": "iac/envs/prod/main.tf@18b64aa",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.12 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    },
    {
     "label": "Open question 4",
     "href": "#open-questions"
    }
   ],
   "upstream": [],
   "downstream": [],
   "homeNode": "env",
   "deeper": [
    {
     "label": "Platform setup",
     "href": "platform-setup.html"
    }
   ],
   "statusNote": "Demo IaC paths (iac/envs/*) exist for all four environments."
  },
  {
   "id": "pl-defender",
   "tag": "PLAT",
   "title": "Defender + OPS SOC",
   "subtitle": "upload scan · connect SOC",
   "bar": "plat",
   "branchBoxes": [
    "access",
    "ingest"
   ],
   "unit": "CLUSTER?",
   "owner": "Cluster / CISO (verify)",
   "phase": "v1",
   "status": "planned",
   "statusSource": "manifest only (no adapter has found it yet)",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Scans every upload before Bronze; sends logs to the OPS SOC.",
   "why": "External uploads are the main inbound risk; don't build a SOC.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Ideal-state toolkit §2.2 (internal doc · not in this demo)",
     "href": null
    },
    {
     "label": "Microsoft Learn page (external link · not linked in demo)",
     "href": null
    }
   ],
   "upstream": [],
   "downstream": [],
   "homeNode": "ops",
   "deeper": [],
   "statusNote": ""
  }
 ],
 "edges": [
  {
   "from": "s-muni",
   "to": "i-sftp",
   "type": "request",
   "label": "upload"
  },
  {
   "from": "s-sm",
   "to": "i-sftp",
   "type": "request",
   "label": "upload"
  },
  {
   "from": "i-sftp",
   "to": "i-notify",
   "type": "request",
   "label": "event"
  },
  {
   "from": "i-sftp",
   "to": "st-bronze",
   "type": "primary",
   "label": "land"
  },
  {
   "from": "s-onprem",
   "to": "i-gw",
   "type": "request",
   "label": "pull"
  },
  {
   "from": "i-gw",
   "to": "i-adf",
   "type": "request",
   "label": "feeds"
  },
  {
   "from": "i-adf",
   "to": "st-bronze",
   "type": "request",
   "label": "copy"
  },
  {
   "from": "s-list",
   "to": "st-ref",
   "type": "request",
   "label": "load"
  },
  {
   "from": "st-bronze",
   "to": "st-silver",
   "type": "primary",
   "label": "validate"
  },
  {
   "from": "st-silver",
   "to": "st-gold",
   "type": "primary",
   "label": "conform"
  },
  {
   "from": "p-dq",
   "to": "st-silver",
   "type": "request",
   "label": "pass / flag"
  },
  {
   "from": "p-spark",
   "to": "st-silver",
   "type": "request",
   "label": "run"
  },
  {
   "from": "p-spark",
   "to": "container:services",
   "type": "request",
   "label": "calls"
  },
  {
   "from": "p-dq",
   "to": "sv-alert",
   "type": "return",
   "label": "DQ fail"
  },
  {
   "from": "st-gold",
   "to": "sv-model",
   "type": "request",
   "label": "reads"
  },
  {
   "from": "st-gold",
   "to": "sv-odc",
   "type": "primary",
   "label": "publish"
  },
  {
   "from": "sv-model",
   "to": "sv-pbi",
   "type": "request",
   "label": "reports"
  },
  {
   "from": "sv-model",
   "to": "e-ml",
   "type": "return",
   "label": "future"
  }
 ]
};
