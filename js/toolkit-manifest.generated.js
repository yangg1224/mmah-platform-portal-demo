/* GENERATED FILE - DO NOT EDIT.
   Source of truth: config/toolkit.yaml. Regenerate with: python3 scripts/build_toolkit.py
   Validate (CI, TKT-3): python3 scripts/validate_toolkit.py
   Platform blueprint / Toolkit manifest (PRD §6.6 TKT-2). Mock sample metadata only. */
window.PORTAL = window.PORTAL || {};
PORTAL.toolkit = {
 "manifest": "config/toolkit.yaml · proposed resource architecture",
 "asOf": "9 Oct 2026 · design proposal",
 "architecture": {
  "journeys": [
   {
    "id": "iac",
    "title": "Infrastructure as Code",
    "subtitle": "Provision the platform",
    "icon": "code",
    "intro": "Turn a reviewed design into repeatable Azure infrastructure and Fabric environments. Follow the release from Git to an approved production deployment.",
    "outcome": "Repeatable environments, with evidence for every change.",
    "lanes": [
     {
      "label": "DESIGN & REVIEW · version control",
      "start": 0,
      "end": 2
     },
     {
      "label": "DEPLOY & OPERATE · Azure + Fabric",
      "start": 3,
      "end": 4
     }
    ],
    "exception": {
     "from": 3,
     "to": 1,
     "label": "Failed checks → stop, fix code, re-plan",
     "detail": "Stop promotion on a failed deployment or policy check. Investigate partial changes, correct the code, and produce a new plan before retrying. Review destructive changes separately; infrastructure rollback is not automatic."
    },
    "steps": [
     {
      "id": "scope",
      "title": "Define environments",
      "caption": "Agree the landing zone",
      "icon": "azure",
      "items": [
       "Subscription & region",
       "Dev / Test / Pre-Prod / Prod"
      ],
      "handoff": "Design",
      "summary": "Establish the boundaries, owners and requirements before writing a deployment.",
      "input": "Approved solution design, data classification and enterprise landing-zone requirements.",
      "actions": [
       "Choose subscription and resource-group boundaries, approved regions, naming, tags and cost owners for each environment.",
       "Agree network routes for ingestion and Fabric access, retention requirements, and capacity sizing.",
       "Record which resources belong in Azure and which Fabric items require a separate tenant or workspace deployment."
      ],
      "output": "Environment parameter sets and a reviewed resource inventory.",
      "gate": "Platform and security owners accept the scope, network design and cost envelope.",
      "access": [
       "Enterprise platform owners control subscription creation, Azure Policy and baseline role assignments.",
       "Keep production deployment identities and environment permissions separate from development."
      ],
      "resources": [
       "azure",
       "pl-vnet",
       "pl-capacity",
       "pl-workspaces"
      ]
     },
     {
      "id": "codify",
      "title": "Codify the platform",
      "caption": "Reusable modules in Git",
      "icon": "code",
      "items": [
       "Bicep or Terraform",
       "Fabric item definitions"
      ],
      "handoff": "Pull request",
      "summary": "Describe infrastructure and analytics items as versioned, reviewable artifacts.",
      "input": "Environment parameters and approved architecture decisions.",
      "actions": [
       "Author Azure modules for ADLS Gen2, ADF, Key Vault, networking, monitoring and Fabric capacity. Choose Bicep or Terraform as the team's standard.",
       "Keep Fabric workspace and item deployment in a separate supported API or deployment pipeline stage; Azure resource deployment alone does not create the full workspace contents.",
       "Version environment configuration and policy checks. Reference Key Vault for secrets; if using Terraform, secure and lock its remote state."
      ],
      "output": "Reusable modules, Fabric artifacts and environment-specific configuration in a pull request.",
      "gate": "Peer review confirms scope, idempotency and no credentials in source or generated plans.",
      "access": [
       "Engineers propose pull requests; branch protection requires independent reviewers.",
       "Restrict pipeline configuration and Terraform state access to the deployment team; state can contain sensitive values."
      ],
      "resources": [
       "pl-repo",
       "pl-kv",
       "st-adls",
       "pl-workspaces"
      ]
     },
     {
      "id": "plan",
      "title": "Validate & plan",
      "caption": "Preview the change",
      "icon": "shield",
      "items": [
       "Lint + policy checks",
       "What-if / plan review"
      ],
      "handoff": "Approved plan",
      "summary": "Produce evidence of what will change and obtain approval before deployment.",
      "input": "Reviewed pull request and the target environment's parameters.",
      "actions": [
       "Run syntax, module, policy and configuration checks in CI. Validate Fabric item dependencies and the supported deployment route.",
       "Produce an Azure what-if or Terraform plan. Review replacements, deletions, role assignments and network exposure.",
       "Attach check results and change evidence to the release, then require the appropriate environment approval."
      ],
      "output": "A versioned release candidate with reviewed deployment evidence.",
      "gate": "All required checks pass and the target environment's approver accepts the change.",
      "access": [
       "Use a federated workload identity for CI where supported, with the permissions required to generate the plan at the target scope.",
       "Keep permission to approve production changes separate from permission to edit deployment code."
      ],
      "resources": [
       "pl-repo",
       "pl-entra",
       "azure"
      ]
     },
     {
      "id": "deploy",
      "title": "Deploy & verify",
      "caption": "Prove the design in Dev",
      "icon": "pipeline",
      "items": [
       "VNet · ADLS · Key Vault",
       "Fabric workspaces & items"
      ],
      "handoff": "Test evidence",
      "summary": "Deploy the approved release and test connectivity, permissions and a representative data flow.",
      "input": "Approved release candidate and scoped deployment identities.",
      "actions": [
       "Deploy Azure modules in dependency order, including storage, integration runtime networking, secret references and monitoring.",
       "Assign Fabric capacity and deploy supported workspace items and connections using the chosen Fabric deployment mechanism.",
       "Test approved and denied data access, name resolution, ingestion, shortcut reads, transformations and a report using mock data."
      ],
      "output": "A verified Dev environment and recorded smoke-test results.",
      "gate": "Connectivity, denied-access checks and an end-to-end mock-data run all pass.",
      "access": [
       "Scope Azure deployment rights to the required resource groups; role-assignment changes require separately authorized RBAC administration.",
       "Fabric workspace roles and capacity permissions are separate from Azure resource permissions; grant each only as required."
      ],
      "resources": [
       "pl-vnet",
       "pl-network",
       "st-adls",
       "pl-kv",
       "i-adf",
       "pl-workspaces"
      ]
     },
     {
      "id": "promote",
      "title": "Promote & operate",
      "caption": "Controlled environment releases",
      "icon": "monitor",
      "items": [
       "Test → Pre-Prod → Prod",
       "Drift & health monitoring"
      ],
      "handoff": "Operate",
      "summary": "Promote the same reviewed artifact through environments and monitor the deployed result.",
      "input": "Verified release artifact, test evidence and approved environment configuration.",
      "actions": [
       "Promote through Test and Pre-Prod, then apply the required production approval using environment-specific parameters and identities.",
       "Record release versions, verify access again, and enable operational alerts, cost checks and periodic drift review.",
       "Reconcile drift through reviewed code. Maintain service-specific recovery runbooks and validate recovery separately from deployment."
      ],
      "output": "Traceable releases, monitored services and tested recovery procedures.",
      "gate": "Each environment has its own approval and post-deployment checks before the next promotion.",
      "access": [
       "Production deployers use scoped workload identities; operators receive only the rights needed for their duties.",
       "Restrict production secret access and Fabric authoring; business consumers receive product-level access."
      ],
      "resources": [
       "pl-repo",
       "m-logs",
       "m-hub",
       "pl-entra"
      ]
     }
    ]
   },
   {
    "id": "contracts",
    "title": "Open Data Contract",
    "subtitle": "Governance by agreement",
    "icon": "shield",
    "intro": "Agree a versioned contract between data producers and consumers, then enforce it in the pipeline. The contract defines ownership, schema, quality, service expectations and permitted use.",
    "outcome": "Data moves with clear ownership and measurable expectations.",
    "note": "Open Data Contract describes a shared, versioned specification here. It does not make a dataset public; publication and access still require approval. A specific contract standard and version are design decisions.",
    "lanes": [
     {
      "label": "DEFINE & AGREE · DPU + data stewards + consumers",
      "start": 0,
      "end": 2
     },
     {
      "label": "ENFORCE & EVOLVE · engineering + governance",
      "start": 3,
      "end": 4
     }
    ],
    "exception": {
     "from": 3,
     "to": 1,
     "label": "Contract breach → hold data, notify owner, revise & review",
     "detail": "Hold nonconforming records or batches according to the contract and notify the accountable owner. Correct the source or review a contract change; never silently relax a quality rule to pass a failing batch."
    },
    "steps": [
     {
      "id": "agree",
      "title": "Agree the purpose",
      "caption": "Producer ↔ consumer",
      "icon": "identity",
      "items": [
       "Accountable owner",
       "Permitted use & sensitivity"
      ],
      "handoff": "Agreement",
      "summary": "Establish why the data is needed, who is accountable and which uses are permitted.",
      "input": "A data acquisition request and the proposed consumer use case.",
      "actions": [
       "Name the producer, accountable data owner, steward, engineering operator and consuming team.",
       "Confirm acquisition authority, data-sharing terms, classification, retention and any publication restrictions.",
       "Agree the product boundaries and the business meaning of key fields and measures."
      ],
      "output": "An agreed purpose, responsibility matrix and approved acquisition terms.",
      "gate": "DPU and the accountable owner confirm permitted use before ingestion is enabled.",
      "access": [
       "DPU reviews acquisition and policy; SDGU governance stewards definitions and classification.",
       "Approving a purpose does not grant technical access. Record an explicit consumer entitlement and its approving owner."
      ],
      "resources": [
       "sources",
       "governance",
       "pl-entra"
      ]
     },
     {
      "id": "specify",
      "title": "Define the contract",
      "caption": "Expectations as a specification",
      "icon": "source",
      "items": [
       "Schema · keys · classifications",
       "Quality · freshness · support"
      ],
      "handoff": "Versioned spec",
      "summary": "Write a machine-readable agreement that can be reviewed and tested alongside the pipeline.",
      "input": "Approved purpose, field definitions and consumer requirements.",
      "actions": [
       "Select the contract standard and version; define product identity, ownership, schema, keys, types, nullability and classifications.",
       "Define measurable quality rules, thresholds, freshness and availability targets, retention, support contacts and breach handling.",
       "Define compatibility, versioning and deprecation rules. Link rules to their executable validation checks and access policy."
      ],
      "output": "A draft contract file, validation rules and a field-level dictionary in Git.",
      "gate": "Required fields, measurable thresholds and accountable owners are complete; the specification validates against the selected standard.",
      "access": [
       "Stewards maintain definitions; engineers implement checks; consumers review whether the promises support their use case.",
       "Store contract metadata in an approved repository. Exclude credentials and sensitive sample records."
      ],
      "resources": [
       "pl-repo",
       "g-catalog",
       "p-dq"
      ]
     },
     {
      "id": "approve",
      "title": "Review & version",
      "caption": "An explicit agreement",
      "icon": "code",
      "items": [
       "Producer + consumer review",
       "Compatibility & sign-off"
      ],
      "handoff": "Approved version",
      "summary": "Review the contract with both sides and pin an approved version to the data release.",
      "input": "Draft contract, test evidence and a compatibility assessment.",
      "actions": [
       "Validate the contract and run representative passing and failing fixtures against its executable rules.",
       "Obtain producer, consumer and governance approval. Assess downstream impact and a migration window for breaking changes.",
       "Merge through protected review and publish an immutable contract version that ingestion and transformation jobs reference."
      ],
      "output": "An approved contract version with review and compatibility evidence.",
      "gate": "Required reviewers approve; breaking changes have an agreed consumer migration plan.",
      "access": [
       "Limit contract approval and protected-branch bypass rights to designated owners.",
       "Track technical role grants separately in Entra, Azure and Fabric; a merged contract is not an access grant."
      ],
      "resources": [
       "pl-repo",
       "pl-entra",
       "g-catalog"
      ]
     },
     {
      "id": "enforce",
      "title": "Enforce the rules",
      "caption": "Gates in the data flow",
      "icon": "shield",
      "items": [
       "Schema & quality validation",
       "Hold / quarantine failures"
      ],
      "handoff": "Quality evidence",
      "summary": "Check incoming and transformed data against the pinned contract before making it available downstream.",
      "input": "A data batch, its lineage metadata and the approved contract version.",
      "actions": [
       "Validate file shape and schema at ingestion; execute completeness, validity, uniqueness and business rules before publishing Silver or Gold.",
       "Record batch identifiers, contract versions, rule outcomes and lineage. Route failures to restricted quarantine or hold the batch according to policy.",
       "Permit downstream publication only when the required gates pass; preserve the source and validation evidence for repair and replay."
      ],
      "output": "Accepted data plus auditable quality results, or a held batch with a reason and owner.",
      "gate": "Contract thresholds pass; a catalog entry alone does not enforce a quality check.",
      "access": [
       "Workload identities read only their approved sources and write only the designated layer and quality outputs.",
       "Restrict quarantine to operators and approved stewards. Consumers cannot bypass failed publication gates."
      ],
      "resources": [
       "i-adf",
       "i-fabric",
       "p-spark",
       "p-dq",
       "st-quarantine"
      ]
     },
     {
      "id": "evolve",
      "title": "Catalog & monitor",
      "caption": "Keep the agreement current",
      "icon": "catalog",
      "items": [
       "Purview · lineage · discovery",
       "Breaches · access reviews"
      ],
      "handoff": "Govern",
      "summary": "Make approved products discoverable and check whether the producer keeps its promises.",
      "input": "Approved product metadata, contract version, lineage and validation results.",
      "actions": [
       "Link the contract, dictionary, owner and quality evidence to the catalog entry; register lineage through supported integrations.",
       "Monitor freshness and quality targets, route breaches to the named owner and track resolution against the agreed support process.",
       "Review consumer access and contract changes regularly. Return changes through the contract review and compatibility process."
      ],
      "output": "Discoverable products, monitored commitments and governed change history.",
      "gate": "The owner approves each access request and reviews any change to consumer expectations.",
      "access": [
       "Catalog discovery is distinct from data access; grant data permissions in the relevant Azure or Fabric service.",
       "Use approved Entra groups, least-privilege workspace and item permissions, and periodic access reviews."
      ],
      "resources": [
       "g-catalog",
       "pl-entra",
       "m-hub",
       "p-dq"
      ]
     }
    ]
   },
   {
    "id": "medallion",
    "title": "Bronze / Silver / Gold",
    "subtitle": "From source to insight",
    "icon": "lake",
    "intro": "Follow a batch from its original landing copy to a trusted analytical product. Each layer has a purpose, an owner and a gate before the next handoff.",
    "outcome": "Raw evidence → trusted tables → business-ready insights.",
    "lanes": [
     {
      "label": "ACQUIRE & LAND · sources + Azure Data Lake Storage",
      "start": 0,
      "end": 1
     },
     {
      "label": "REFINE & SERVE · Microsoft Fabric / OneLake + Power BI",
      "start": 2,
      "end": 4
     }
    ],
    "exception": {
     "from": 2,
     "to": 1,
     "label": "Failed validation → restricted quarantine → repair & replay Bronze",
     "detail": "Preserve the original Bronze batch. Record failed rules and route rejected records to restricted ADLS quarantine, or hold the batch. Repair the source or transformation, then replay idempotently; publish only after the gates pass again."
    },
    "steps": [
     {
      "id": "acquire",
      "title": "Approved sources",
      "caption": "Acquire with permission",
      "icon": "source",
      "items": [
       "Municipal & housing feeds",
       "Azure Data Factory copy"
      ],
      "handoff": "Ingest",
      "summary": "Ingest only the agreed source data, with enough metadata to trace and replay a batch.",
      "input": "Approved producer feed, acquisition terms and a pinned data contract.",
      "actions": [
       "Confirm producer access, expected schema, cadence and source-to-target mappings against the contract.",
       "Configure an ADF copy pipeline and an approved source connection; use managed identities where supported and Key Vault references for required secrets.",
       "Capture source identifiers, ingestion time and batch identifiers; make retries safe before scheduling ingestion."
      ],
      "output": "An identified batch ready to land in the Bronze container.",
      "gate": "Acquisition is approved, source authentication succeeds and the incoming structure can be handled safely.",
      "access": [
       "The ingestion identity reads only the approved source and writes only its assigned landing paths.",
       "Source owners authorize extraction; DPU reviews acquisition terms; engineering operates the copy pipeline."
      ],
      "resources": [
       "sources",
       "i-adf",
       "pl-kv"
      ]
     },
     {
      "id": "bronze",
      "title": "Bronze",
      "caption": "Original data · ADLS Gen2",
      "icon": "lake",
      "tone": "bronze",
      "items": [
       "Raw files + batch metadata",
       "Fabric shortcut · no copy"
      ],
      "handoff": "Validate",
      "summary": "Preserve the original landing copy in Azure Data Lake Storage and expose approved paths to Fabric.",
      "input": "An identified raw batch from the ingestion pipeline.",
      "actions": [
       "Write raw files and ingestion metadata to controlled Bronze paths in ADLS Gen2; define retention and a deliberate correction policy.",
       "Create a shortcut in the Fabric Bronze access lakehouse to the approved ADLS path. A shortcut references the raw copy; it does not move it into OneLake.",
       "Trigger the Fabric pipeline with batch and contract identifiers. Verify the approved network and identity route before enabling scheduled reads."
      ],
      "output": "Traceable raw data available for validation through the Fabric Bronze shortcut.",
      "gate": "Batch completeness and landing checks pass; original inputs are retained for replay.",
      "access": [
       "The ingestion workload writes its landing paths; the Fabric connection receives only the required Bronze read scope.",
       "Business users consume curated products. Keep quarantine and unrestricted raw access outside their entitlements."
      ],
      "resources": [
       "st-adls",
       "st-bronze",
       "st-bronze-view",
       "st-shortcut"
      ]
     },
     {
      "id": "silver",
      "title": "Silver",
      "caption": "Trusted tables · OneLake",
      "icon": "database",
      "tone": "silver",
      "items": [
       "Clean · deduplicate · conform",
       "Contract & quality checks"
      ],
      "handoff": "Curate",
      "summary": "Convert raw inputs into consistent, validated Delta tables in a Fabric lakehouse.",
      "input": "Raw data through the Bronze shortcut, reference tables and the approved contract version.",
      "actions": [
       "Orchestrate notebooks with Fabric pipelines. Normalize types and identifiers, deduplicate, and apply approved reference or master-data mappings.",
       "Execute contract quality checks and record rule-level results and source lineage. Hold or quarantine failures instead of silently dropping them.",
       "Write accepted Delta tables to Silver with a repeatable merge strategy, then reconcile counts and quality metrics against the input batch."
      ],
      "output": "Conformed Silver tables with quality evidence and reproducible lineage.",
      "gate": "Schema, completeness, uniqueness and agreed business thresholds pass before the batch is published.",
      "access": [
       "Transformation workloads read approved Bronze and reference inputs and write Silver plus quality evidence.",
       "Data engineers and stewards receive scoped access for their duties; report consumers do not need workspace author roles."
      ],
      "resources": [
       "i-fabric",
       "p-spark",
       "st-silver",
       "st-ref",
       "p-dq",
       "st-quarantine"
      ]
     },
     {
      "id": "gold",
      "title": "Gold",
      "caption": "Business products · OneLake",
      "icon": "model",
      "tone": "gold",
      "items": [
       "Curated facts & dimensions",
       "Approved KPI definitions"
      ],
      "handoff": "Publish",
      "summary": "Shape trusted records into products with agreed grain, measures and business meaning.",
      "input": "Accepted Silver tables, approved metric definitions and consumer requirements.",
      "actions": [
       "Build facts, dimensions and aggregates at the agreed product grain. Version transformation logic and business definitions.",
       "Reconcile totals and test business rules with BIRU and data owners. Confirm appropriate aggregation and sensitivity for the intended audience.",
       "Publish approved Gold Delta tables and use a supported semantic-model connection mode; the SQL analytics endpoint supports applicable SQL consumption."
      ],
      "output": "Approved Gold data products with stable definitions and lineage back to Silver.",
      "gate": "Business reconciliation, product quality and the accountable owner's approval pass before release.",
      "access": [
       "Engineering writes Gold; approved model builders receive the read permissions required by their connection mode.",
       "Apply item and data permissions for the product and review sensitivity before enabling broad consumption."
      ],
      "resources": [
       "st-gold",
       "sv-sql",
       "p-spark"
      ]
     },
     {
      "id": "serve",
      "title": "Power BI",
      "caption": "Governed consumption",
      "icon": "powerbi",
      "tone": "gold",
      "items": [
       "Semantic model & measures",
       "Reports · apps · audiences"
      ],
      "handoff": "Consume",
      "summary": "Deliver approved insights through a semantic model and controlled report distribution.",
      "input": "Approved Gold products, business measures and the intended audience list.",
      "actions": [
       "Build the semantic model and measures using the selected supported connectivity mode; configure refresh or data freshness behavior.",
       "Implement row-level and object-level security where required, then test with representative consumer identities, including denied cases.",
       "Release reports through approved app audiences and monitor refresh, usage and metric changes through the governance process."
      ],
      "output": "Governed reports and apps that serve approved consumers from trusted Gold data.",
      "gate": "Metric reconciliation, freshness, security tests and business-owner sign-off pass.",
      "access": [
       "Give viewers app or item access; grant Build permission only when needed. Verify licensing and capacity requirements for the audience.",
       "RLS does not restrict workspace Admin, Member or Contributor roles; keep consumers in supported viewer or app-consumer roles and test effective access."
      ],
      "resources": [
       "sv-model",
       "sv-pbi",
       "pl-entra",
       "m-hub"
      ]
     }
    ]
   }
  ],
  "title": "Azure landing zone + Microsoft Fabric analytics",
  "summary": "Land original files in Azure Data Lake Storage Gen2. Reference Bronze in Fabric, build Silver and Gold in OneLake, and serve governed Power BI products.",
  "flow": [
   {
    "label": "Sources",
    "detail": "Approved submissions and reference data",
    "node": "sources"
   },
   {
    "label": "Ingest",
    "detail": "Azure Data Factory copy pipelines",
    "node": "i-adf"
   },
   {
    "label": "Bronze",
    "detail": "Raw files in ADLS · shortcut into Fabric",
    "node": "st-bronze"
   },
   {
    "label": "Silver",
    "detail": "Fabric validation and conformed Delta tables",
    "node": "st-silver"
   },
   {
    "label": "Gold",
    "detail": "Curated products and approved measures",
    "node": "st-gold"
   },
   {
    "label": "Power BI",
    "detail": "Semantic model, reports and apps",
    "node": "sv-pbi"
   }
  ],
  "notes": [
   {
    "title": "Read the boundaries",
    "text": "Nested boundaries show where components belong. Animated arrows illustrate the proposed data and control paths; they are not live traffic. Select a component to explore its contents, setup steps, access controls and connections."
   },
   {
    "title": "One raw landing copy",
    "text": "Bronze and quarantine live in ADLS Gen2. A shortcut in a Fabric lakehouse references approved Bronze files; Silver and Gold are materialized as Delta tables in OneLake."
   },
   {
    "title": "Private access needs a service-specific route",
    "text": "The customer VNet contains private endpoints, not ADLS, Key Vault or Fabric. ADF uses its managed integration-runtime network. The proposed Fabric shortcut uses trusted workspace access; a policy requiring disabled public network access needs a separately validated supported route."
   },
   {
    "title": "Branch responsibilities become controls",
    "text": "Proposed ownership: DPU approves acquisition and policy; SDGU-G stewards metadata and quality; SDGU-E builds and operates pipelines; BIRU owns metrics and reporting. Enterprise teams confirm tenant, identity, network and platform responsibilities."
   }
  ],
  "diagram": {
   "width": 1560,
   "height": 880,
   "nodes": [
    {
     "id": "governance",
     "x": 220,
     "y": 22,
     "w": 1300,
     "h": 98,
     "icon": "shield",
     "label": "Shared identity, governance & delivery",
     "caption": "Controls across Azure and Fabric",
     "boundary": true
    },
    {
     "id": "pl-entra",
     "x": 660,
     "y": 40,
     "w": 238,
     "h": 62,
     "icon": "identity",
     "label": "Microsoft Entra ID",
     "caption": "Identity · groups · permissions",
     "boundary": false
    },
    {
     "id": "g-catalog",
     "x": 916,
     "y": 40,
     "w": 265,
     "h": 62,
     "icon": "catalog",
     "label": "Microsoft Purview",
     "caption": "Catalog · classification · lineage",
     "boundary": false
    },
    {
     "id": "pl-repo",
     "x": 1199,
     "y": 40,
     "w": 296,
     "h": 62,
     "icon": "code",
     "label": "Azure DevOps / GitHub",
     "caption": "Versioning · review · deployment",
     "boundary": false
    },
    {
     "id": "sources",
     "x": 20,
     "y": 310,
     "w": 165,
     "h": 180,
     "icon": "source",
     "label": "Data sources",
     "caption": "Municipal · housing · reference",
     "boundary": false
    },
    {
     "id": "azure",
     "x": 220,
     "y": 155,
     "w": 610,
     "h": 675,
     "icon": "azure",
     "label": "Azure subscription",
     "caption": "Landing zone · Azure resource groups",
     "boundary": true
    },
    {
     "id": "i-adf",
     "x": 250,
     "y": 300,
     "w": 165,
     "h": 105,
     "icon": "pipeline",
     "label": "Data Factory",
     "caption": "Ingest & orchestrate",
     "boundary": false
    },
    {
     "id": "st-adls",
     "x": 465,
     "y": 248,
     "w": 335,
     "h": 220,
     "icon": "lake",
     "label": "Data Lake Storage Gen2",
     "caption": "Storage account · hierarchical namespace",
     "boundary": true
    },
    {
     "id": "st-bronze",
     "x": 485,
     "y": 343,
     "w": 145,
     "h": 90,
     "icon": "database",
     "label": "Bronze / raw",
     "caption": "Original files",
     "boundary": false
    },
    {
     "id": "st-quarantine",
     "x": 647,
     "y": 343,
     "w": 135,
     "h": 90,
     "icon": "shield",
     "label": "Quarantine",
     "caption": "Restricted rejects",
     "boundary": false
    },
    {
     "id": "pl-capacity",
     "x": 250,
     "y": 500,
     "w": 165,
     "h": 94,
     "icon": "capacity",
     "label": "Fabric capacity",
     "caption": "Compute & billing",
     "boundary": false
    },
    {
     "id": "m-logs",
     "x": 535,
     "y": 505,
     "w": 245,
     "h": 86,
     "icon": "monitor",
     "label": "Monitor / Log Analytics",
     "caption": "Diagnostics · alerts",
     "boundary": false
    },
    {
     "id": "pl-vnet",
     "x": 250,
     "y": 630,
     "w": 275,
     "h": 165,
     "icon": "network",
     "label": "Virtual network",
     "caption": "Private endpoint subnet",
     "boundary": true
    },
    {
     "id": "pl-network",
     "x": 270,
     "y": 710,
     "w": 235,
     "h": 65,
     "icon": "link",
     "label": "Private endpoints",
     "caption": "Storage + Key Vault",
     "boundary": false
    },
    {
     "id": "pl-kv",
     "x": 590,
     "y": 645,
     "w": 190,
     "h": 72,
     "icon": "key",
     "label": "Key Vault",
     "caption": "Secrets · controlled access",
     "boundary": false
    },
    {
     "id": "pl-dns",
     "x": 590,
     "y": 740,
     "w": 190,
     "h": 60,
     "icon": "network",
     "label": "Private DNS",
     "caption": "VNet-linked zones",
     "boundary": false
    },
    {
     "id": "fabric",
     "x": 875,
     "y": 155,
     "w": 645,
     "h": 675,
     "icon": "fabric",
     "label": "Microsoft Fabric",
     "caption": "SaaS tenant · connected to Azure",
     "boundary": true
    },
    {
     "id": "st-onelake",
     "x": 900,
     "y": 230,
     "w": 275,
     "h": 66,
     "icon": "lake",
     "label": "OneLake",
     "caption": "Storage for Fabric items",
     "boundary": false
    },
    {
     "id": "m-hub",
     "x": 1195,
     "y": 230,
     "w": 300,
     "h": 66,
     "icon": "monitor",
     "label": "Fabric monitoring",
     "caption": "Runs · capacity metrics",
     "boundary": false
    },
    {
     "id": "pl-workspaces",
     "x": 900,
     "y": 325,
     "w": 595,
     "h": 475,
     "icon": "workspace",
     "label": "Fabric workspace",
     "caption": "Repeat per environment / data product",
     "boundary": true
    },
    {
     "id": "i-fabric",
     "x": 925,
     "y": 403,
     "w": 180,
     "h": 85,
     "icon": "pipeline",
     "label": "Data pipelines",
     "caption": "Orchestrate curation",
     "boundary": false
    },
    {
     "id": "p-spark",
     "x": 1250,
     "y": 403,
     "w": 215,
     "h": 85,
     "icon": "code",
     "label": "Spark notebooks",
     "caption": "Validate · transform",
     "boundary": false
    },
    {
     "id": "st-bronze-view",
     "x": 925,
     "y": 550,
     "w": 150,
     "h": 95,
     "icon": "lake",
     "label": "Bronze shortcut",
     "caption": "ADLS reference · no copy",
     "boundary": false
    },
    {
     "id": "st-silver",
     "x": 1115,
     "y": 550,
     "w": 150,
     "h": 95,
     "icon": "database",
     "label": "Silver lakehouse",
     "caption": "Conformed Delta tables",
     "boundary": false
    },
    {
     "id": "st-gold",
     "x": 1305,
     "y": 550,
     "w": 160,
     "h": 95,
     "icon": "database",
     "label": "Gold lakehouse",
     "caption": "Curated Delta tables",
     "boundary": false
    },
    {
     "id": "sv-model",
     "x": 1115,
     "y": 703,
     "w": 150,
     "h": 72,
     "icon": "model",
     "label": "Semantic model",
     "caption": "Measures · RLS / OLS",
     "boundary": false
    },
    {
     "id": "sv-pbi",
     "x": 1305,
     "y": 703,
     "w": 160,
     "h": 72,
     "icon": "powerbi",
     "label": "Power BI",
     "caption": "Reports · apps",
     "boundary": false
    }
   ]
  }
 },
 "banner": {
  "text": "Proposed architecture · animated flows illustrate the design, not live traffic. Setup guidance must be adapted to approved tenant, region and access policies.",
  "linkLabel": "Design decisions",
  "href": "#open-questions"
 },
 "units": [
  {
   "id": "BIRU",
   "label": "BIRU",
   "name": "Business Intelligence and Reporting Unit",
   "color": "#b07a12"
  },
  {
   "id": "SDGU-G",
   "label": "SDGU · governance",
   "name": "Strategic Data Governance Unit · governance role",
   "color": "#4f8a3c"
  },
  {
   "id": "SDGU-E",
   "label": "SDGU · engineering",
   "name": "Strategic Data Governance Unit · engineering role",
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
   "label": "Core",
   "icon": "◆",
   "why": "Proposed foundation for batch ingestion, governed lakehouses and reporting."
  },
  {
   "id": "next",
   "label": "Next",
   "icon": "◇",
   "why": "Add when an agreed product or operational requirement justifies it."
  },
  {
   "id": "future",
   "label": "Future",
   "icon": "◌",
   "why": "Subject to a defined use case, policy and architecture assessment."
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
  "primary": "Data flow",
  "request": "Dependency / control",
  "return": "Results / rejects / telemetry"
 },
 "considered": [
  {
   "name": "Fabric Warehouse",
   "reason": "Gold lakehouse and its SQL analytics endpoint cover the proposed batch analytics path. Add a warehouse only for a demonstrated SQL warehousing requirement."
  },
  {
   "name": "Real-Time Intelligence / Eventstream / Eventhouse",
   "reason": "No streaming requirement was supplied. Add these after identifying a concrete real-time source, latency target and consumer."
  },
  {
   "name": "Fabric Data Science / machine learning / Copilot",
   "reason": "The branch chart marks Machine Learning & AI as future state. Define the use case, responsible owner, approved data and policy controls before selecting these capabilities."
  },
  {
   "name": "Standalone MDM platform",
   "reason": "Reference Delta tables and stewarded matching rules cover the proposed initial master-data scope. Revisit when entity mastering and stewardship requirements expand."
  },
  {
   "name": "Public data publishing or external sharing",
   "reason": "No release channel or public-access requirement was provided. DPU must define approval and disclosure controls before a publishing service is added."
  }
 ],
 "openQuestions": [
  {
   "id": "oq1",
   "text": "Confirm tenant, Azure subscription, approved region/data residency, enterprise platform owners and whether existing Fabric/Purview services can be reused."
  },
  {
   "id": "oq2",
   "text": "Confirm source systems, intake channels, data-sharing agreements, sensitivity, retention and expected volumes; decide whether on-premises connectivity is required."
  },
  {
   "id": "oq3",
   "text": "Approve the Fabric-to-ADLS network route. Validate trusted workspace access prerequisites; if policy requires disabled public network access, prove a supported private route for the shortcut workload before provisioning."
  },
  {
   "id": "oq4",
   "text": "Confirm environment/workspace separation, production capacity isolation, budget owner and Power BI producer/consumer licensing."
  },
  {
   "id": "oq5",
   "text": "Agree SDGU-G quality gates and reference-data ownership, DPU disclosure rules, BIRU KPI definitions and operational support responsibilities."
  },
  {
   "id": "oq6",
   "text": "Choose the existing enterprise Git and delivery toolchain; confirm Purview scanning/lineage coverage, diagnostic collection and release approvals."
  }
 ],
 "nodes": [
  {
   "id": "sources",
   "tag": "EXT",
   "title": "Approved data sources",
   "subtitle": "Branch intake · agreements · source contracts",
   "parent": null,
   "resourceKind": "boundary",
   "resourceType": "External source boundary",
   "architectureNotes": [
    "Confirm each source, delivery channel, frequency and sensitivity before enabling ingestion."
   ],
   "setupSteps": [
    {
     "title": "Agree the intake contract",
     "detail": "Record business purpose, data-sharing agreement, schema, frequency, ownership and retention for every source."
    },
    {
     "title": "Approve and test ingestion",
     "detail": "Use a minimal representative sample to verify source access, schema and delivery behavior before scheduling."
    }
   ],
   "accessControls": [
    {
     "principal": "DPU and source stewards",
     "role": "Business approval and stewardship",
     "scope": "Approved source contracts",
     "note": "Technical access requires a separately authorized connector identity."
    },
    {
     "principal": "Ingestion identity",
     "role": "Read-only source permission",
     "scope": "Approved extracts or delivery location",
     "note": "Use the minimum source permission supported by the connector."
    }
   ],
   "branchBoxes": [
    "dsa",
    "dpr",
    "mpdr"
   ],
   "unit": "DPU",
   "owner": "Proposed: DPU approves purpose, agreements and retention; SDGU-E confirms technical intake.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Approved municipal, housing and reference data enter through agreed intake contracts. These are source categories, not deployed cloud resources.",
   "why": "Connects the branch acquisition responsibilities to technical ingestion.",
   "iac": "na",
   "docs": [],
   "upstream": [],
   "downstream": [],
   "homeNode": "sources",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "s-muni",
   "tag": "EXT",
   "title": "Municipal submissions",
   "subtitle": "MPDR · files and approved extracts",
   "parent": "sources",
   "resourceKind": "external",
   "resourceType": "External submission source",
   "architectureNotes": [],
   "setupSteps": [
    {
     "title": "Confirm MPDR intake",
     "detail": "Agree municipal submission formats, delivery authorization and receipt tracking."
    },
    {
     "title": "Approve and test ingestion",
     "detail": "Use a minimal representative sample to verify source access, schema and delivery behavior before scheduling."
    }
   ],
   "accessControls": [
    {
     "principal": "DPU and source stewards",
     "role": "Business approval and stewardship",
     "scope": "Approved source contracts",
     "note": "Technical access requires a separately authorized connector identity."
    },
    {
     "principal": "Ingestion identity",
     "role": "Read-only source permission",
     "scope": "Approved extracts or delivery location",
     "note": "Use the minimum source permission supported by the connector."
    }
   ],
   "branchBoxes": [
    "mpdr",
    "dpr"
   ],
   "unit": "DPU",
   "owner": "Proposed: Municipal source owners submit; DPU owns submission requirements.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Proposed intake for municipal planning submissions using an approved file or connector-based channel.",
   "why": "Supplies the branch MPDR function without assuming a new public upload endpoint.",
   "iac": "na",
   "docs": [
    {
     "label": "Azure Data Factory connectors",
     "href": "https://learn.microsoft.com/en-us/azure/data-factory/connector-overview"
    }
   ],
   "upstream": [],
   "downstream": [
    "i-adf"
   ],
   "homeNode": "sources",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "s-sm",
   "tag": "EXT",
   "title": "Housing & partner data",
   "subtitle": "Data-sharing agreements · approved feeds",
   "parent": "sources",
   "resourceKind": "external",
   "resourceType": "External partner source",
   "architectureNotes": [],
   "setupSteps": [
    {
     "title": "Approve the partner feed",
     "detail": "Confirm data-sharing terms and exclude unapproved person-level data from this demo pattern."
    },
    {
     "title": "Approve and test ingestion",
     "detail": "Use a minimal representative sample to verify source access, schema and delivery behavior before scheduling."
    }
   ],
   "accessControls": [
    {
     "principal": "DPU and source stewards",
     "role": "Business approval and stewardship",
     "scope": "Approved source contracts",
     "note": "Technical access requires a separately authorized connector identity."
    },
    {
     "principal": "Ingestion identity",
     "role": "Read-only source permission",
     "scope": "Approved extracts or delivery location",
     "note": "Use the minimum source permission supported by the connector."
    }
   ],
   "branchBoxes": [
    "dsa",
    "dpr"
   ],
   "unit": "DPU",
   "owner": "Proposed: DPU owns sharing agreements; source owners approve access.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Proposed partner and service-manager feeds, subject to approved sharing terms, schema and sensitivity assessment.",
   "why": "Makes acquisition agreements a prerequisite for technical access.",
   "iac": "na",
   "docs": [
    {
     "label": "Azure Data Factory connectors",
     "href": "https://learn.microsoft.com/en-us/azure/data-factory/connector-overview"
    }
   ],
   "upstream": [],
   "downstream": [
    "i-adf"
   ],
   "homeNode": "sources",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "s-list",
   "tag": "EXT",
   "title": "Reference data",
   "subtitle": "Municipality codes · agreed code lists",
   "parent": "sources",
   "resourceKind": "external",
   "resourceType": "External reference source",
   "architectureNotes": [],
   "setupSteps": [
    {
     "title": "Version reference releases",
     "detail": "Have the steward approve identifiers, effective dates and the change process."
    },
    {
     "title": "Approve and test ingestion",
     "detail": "Use a minimal representative sample to verify source access, schema and delivery behavior before scheduling."
    }
   ],
   "accessControls": [
    {
     "principal": "SDGU governance stewards",
     "role": "Reference approval and stewardship",
     "scope": "Approved reference releases",
     "note": "Approve definitions, matching thresholds and version changes."
    },
    {
     "principal": "Ingestion identity",
     "role": "Read-only source permission",
     "scope": "Approved reference extracts",
     "note": "Use a versioned source; do not grant permission to alter the authoritative reference list."
    }
   ],
   "branchBoxes": [
    "mdm",
    "std"
   ],
   "unit": "SDGU-G",
   "owner": "Proposed: SDGU-G stewards reference definitions; SDGU-E loads approved versions.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Approved reference lists and identifiers used to standardize branch datasets.",
   "why": "Provides one steward-approved source for matching and common dimensions.",
   "iac": "na",
   "docs": [
    {
     "label": "Fabric lakehouse overview",
     "href": "https://learn.microsoft.com/en-us/fabric/data-engineering/lakehouse-overview"
    }
   ],
   "upstream": [],
   "downstream": [
    "i-adf"
   ],
   "homeNode": "svc-match",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "azure",
   "tag": "PLAT",
   "title": "Azure subscription",
   "subtitle": "Landing, network, secrets and capacity billing",
   "parent": null,
   "resourceKind": "boundary",
   "resourceType": "Azure subscription / resource-group boundary",
   "architectureNotes": [
    "Repeat the deployment pattern for approved environments; confirm region, subscription and naming standards.",
    "Use enterprise Azure Policy, resource tags, diagnostic settings and budget controls.",
    "ADLS and Key Vault are PaaS resources outside the customer VNet; private endpoints provide a network interface to them."
   ],
   "setupSteps": [
    {
     "title": "Establish the landing zone",
     "detail": "Confirm subscription, approved region, naming, budgets and enterprise policies. Separate resource groups and identities by environment."
    },
    {
     "title": "Provision from reviewed infrastructure code",
     "detail": "Create storage, Data Factory, networking, Key Vault and monitoring. Review the deployment plan before applying it."
    },
    {
     "title": "Verify the boundaries",
     "detail": "Confirm resource inventory, denied public access where required, diagnostic destinations and a separate approval path for production."
    }
   ],
   "accessControls": [
    {
     "principal": "Platform deployment identity",
     "role": "Contributor; role assignment handled separately",
     "scope": "Approved resource group",
     "note": "Use scoped deployment permissions. Owner is not a routine engineering role."
    },
    {
     "principal": "Enterprise administrators",
     "role": "Privileged access with approval",
     "scope": "Subscription governance",
     "note": "Time-limit role elevation and audit changes; confirm the enterprise operating model."
    }
   ],
   "branchBoxes": [
    "access",
    "policy",
    "ingest",
    "projmgmt"
   ],
   "unit": "SDGU-E",
   "owner": "Proposed: SDGU-E coordinates delivery; enterprise platform team provisions and governs the subscription.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Proposed Azure landing-zone resources, organized into resource groups per environment. This is a logical deployment boundary, not an existing subscription inventory.",
   "why": "Separates Azure infrastructure from the Microsoft Fabric SaaS workspaces it supports.",
   "iac": "na",
   "docs": [
    {
     "label": "Azure resource organization",
     "href": "https://learn.microsoft.com/en-us/cloud-adoption-framework/ready/landing-zone/design-area/resource-org"
    }
   ],
   "upstream": [
    "pl-repo"
   ],
   "downstream": [],
   "homeNode": "env",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "i-adf",
   "tag": "ING",
   "title": "Azure Data Factory",
   "subtitle": "Copy approved sources into ADLS Bronze",
   "parent": "azure",
   "resourceKind": "azure-resource",
   "resourceType": "Microsoft.DataFactory/factories",
   "architectureNotes": [
    "This Azure resource handles source-to-Bronze ingestion. Fabric Data Factory pipelines handle curation after landing.",
    "Use a managed VNet Azure integration runtime with approved managed private endpoints where supported; it is distinct from the customer VNet.",
    "For future on-premises sources, assess a self-hosted integration runtime and approved connectivity before onboarding.",
    "Use a batch manifest or completion event for a supported Fabric API or scheduled handoff; prevent incomplete batches from being processed."
   ],
   "setupSteps": [
    {
     "title": "Create a factory and identity",
     "detail": "Provision an environment-specific factory with managed identity and a Git collaboration workflow."
    },
    {
     "title": "Configure integration runtime and connections",
     "detail": "Use managed-VNet Azure IR and approved managed private endpoints for supported private PaaS access. Assess self-hosted IR separately for sources that require it."
    },
    {
     "title": "Build an idempotent landing pipeline",
     "detail": "Parameterize source and destination, capture batch identifiers, route failed intake to quarantine, and define retries and completion handoff."
    },
    {
     "title": "Validate and release",
     "detail": "Test connector authentication, failure handling and diagnostics in Dev before controlled promotion."
    }
   ],
   "accessControls": [
    {
     "principal": "Deployment engineers",
     "role": "Data Factory Contributor",
     "scope": "Factory",
     "note": "Author and deploy pipelines; this does not grant source or storage data access."
    },
    {
     "principal": "Factory managed identity",
     "role": "Scoped data roles; Key Vault Secrets User when needed",
     "scope": "Approved storage and secret scopes",
     "note": "Prefer identity-based connections; grant only the source reads, sink writes and secret references needed."
    }
   ],
   "branchBoxes": [
    "ingest",
    "mpdr",
    "dsa"
   ],
   "unit": "SDGU-E",
   "owner": "Proposed: SDGU-E operates ingestion; DPU approves source onboarding.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Azure Data Factory copy pipelines land source files in ADLS Gen2 with source, batch, receipt and schema metadata.",
   "why": "Provides a single default ingestion service with connector support, retries and repeatable batch landing.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Azure Data Factory overview",
     "href": "https://learn.microsoft.com/en-us/azure/data-factory/introduction"
    },
    {
     "label": "Managed VNet and private endpoints",
     "href": "https://learn.microsoft.com/en-us/azure/data-factory/managed-virtual-network-private-endpoint"
    }
   ],
   "upstream": [
    "s-muni",
    "s-sm",
    "s-list",
    "pl-kv"
   ],
   "downstream": [
    "st-bronze",
    "st-quarantine",
    "i-fabric",
    "m-logs"
   ],
   "homeNode": "bronze",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "pl-capacity",
   "tag": "PLAT",
   "title": "Fabric capacity",
   "subtitle": "Azure F capacity · assigned to workspaces",
   "parent": "azure",
   "resourceKind": "azure-resource",
   "resourceType": "Microsoft.Fabric/capacities",
   "architectureNotes": [
    "Size from workload measurements; assess separate production and non-production capacity.",
    "Confirm region, budget owner and Power BI creator/viewer licensing before selecting a SKU."
   ],
   "setupSteps": [
    {
     "title": "Select a capacity",
     "detail": "Confirm workload sizing, approved region and cost controls before creating a Fabric F capacity resource."
    },
    {
     "title": "Assign workspaces and monitor",
     "detail": "Authorize capacity administrators, assign approved workspaces and check utilization and throttling under representative load."
    }
   ],
   "accessControls": [
    {
     "principal": "Azure provisioning identity",
     "role": "Contributor",
     "scope": "Capacity resource",
     "note": "Azure resource permissions govern provisioning and billing, not automatic workspace data access."
    },
    {
     "principal": "Capacity administrators",
     "role": "Capacity administration",
     "scope": "Fabric capacity",
     "note": "Control workspace assignment separately from workspace permissions."
    }
   ],
   "branchBoxes": [
    "projmgmt",
    "procimp"
   ],
   "unit": "SDGU-E",
   "owner": "Proposed: Enterprise platform team owns billing; SDGU-E operates capacity with BIRU demand planning.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Azure-billed Fabric capacity supplies compute for assigned Fabric workspaces. Workspaces remain in the Fabric service.",
   "why": "Creates an explicit cost and performance boundary for analytics workloads.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Buy a Fabric subscription",
     "href": "https://learn.microsoft.com/en-us/fabric/enterprise/buy-subscription"
    },
    {
     "label": "Fabric capacity metrics",
     "href": "https://learn.microsoft.com/en-us/fabric/enterprise/metrics-app"
    }
   ],
   "upstream": [],
   "downstream": [
    "pl-workspaces"
   ],
   "homeNode": "env",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "st-adls",
   "tag": "STORE",
   "title": "Azure Data Lake Storage Gen2",
   "subtitle": "Storage account · hierarchical namespace",
   "parent": "azure",
   "resourceKind": "azure-resource",
   "resourceType": "Microsoft.Storage/storageAccounts (ADLS Gen2)",
   "architectureNotes": [
    "Bronze and quarantine are logical containers or paths in this account, not separate Azure services.",
    "Apply scoped Entra RBAC and, where needed, directory ACLs; configure retention, recovery and lifecycle policies.",
    "Use storage firewall restrictions. The proposed Fabric shortcut route uses trusted workspace access and must be verified before network rules are finalized."
   ],
   "setupSteps": [
    {
     "title": "Create the storage account",
     "detail": "Choose an approved region and redundancy tier. Enable hierarchical namespace for ADLS Gen2 and enforce secure transport."
    },
    {
     "title": "Create Bronze and quarantine areas",
     "detail": "Create separate containers or directory scopes, agree partitioning, retention and lifecycle rules, and retain original receipt metadata."
    },
    {
     "title": "Configure each access route",
     "detail": "Use approved ADF managed private endpoints for ingestion. For Fabric, validate the trusted-workspace shortcut route separately; it is not automatically carried by customer VNet endpoints."
    },
    {
     "title": "Test allowed and denied access",
     "detail": "Copy a sample batch with the ingestion identity, read only approved Bronze with the analytics identity, and prove an ordinary report user cannot read raw files."
    }
   ],
   "accessControls": [
    {
     "principal": "ADF managed identity",
     "role": "Storage Blob Data Contributor",
     "scope": "Bronze and approved quarantine scope",
     "note": "Data-plane access is separate from Azure resource management roles."
    },
    {
     "principal": "Fabric connection / workspace identity",
     "role": "Storage Blob Data Reader",
     "scope": "Approved Bronze scope",
     "note": "Use a supported connector identity and trusted workspace configuration. Validate shortcut permissions end to end."
    },
    {
     "principal": "Engineers / operators",
     "role": "Scoped RBAC or POSIX ACL permissions",
     "scope": "Required containers and paths",
     "note": "RBAC data grants can authorize access without ACL evaluation; when using ACL-based access, include directory traversal. Avoid broad account-wide grants."
    }
   ],
   "branchBoxes": [
    "ingest",
    "access",
    "policy"
   ],
   "unit": "SDGU-E",
   "owner": "Proposed: SDGU-E manages storage; DPU and SDGU-G set retention and access requirements.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "A storage account with hierarchical namespace enabled holds the original landed files and a restricted quarantine area.",
   "why": "Retains source evidence for replay, lineage and policy-based retention before Fabric processing.",
   "iac": "tbd",
   "docs": [
    {
     "label": "ADLS Gen2 introduction",
     "href": "https://learn.microsoft.com/en-us/azure/storage/blobs/data-lake-storage-introduction"
    },
    {
     "label": "ADLS access control",
     "href": "https://learn.microsoft.com/en-us/azure/storage/blobs/data-lake-storage-access-control"
    }
   ],
   "upstream": [
    "pl-network",
    "pl-entra",
    "g-catalog"
   ],
   "downstream": [],
   "homeNode": "bronze",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "st-bronze",
   "tag": "STORE",
   "title": "Bronze · raw landing",
   "subtitle": "Original files · batch manifests · receipt metadata",
   "parent": "st-adls",
   "resourceKind": "logical-layer",
   "resourceType": "ADLS Gen2 container / directory",
   "architectureNotes": [
    "Treat raw files as append-only through pipeline permissions; separately assess legal retention or immutability requirements.",
    "Fabric references this layer through an ADLS shortcut. The design does not copy Bronze into a second raw store."
   ],
   "setupSteps": [
    {
     "title": "Preserve the received batch",
     "detail": "Create a dedicated raw container/path; retain original files, receipt timestamps and replay identifiers without silent overwrite."
    },
    {
     "title": "Create Bronze and quarantine areas",
     "detail": "Create separate containers or directory scopes, agree partitioning, retention and lifecycle rules, and retain original receipt metadata."
    },
    {
     "title": "Configure each access route",
     "detail": "Use approved ADF managed private endpoints for ingestion. For Fabric, validate the trusted-workspace shortcut route separately; it is not automatically carried by customer VNet endpoints."
    },
    {
     "title": "Test allowed and denied access",
     "detail": "Copy a sample batch with the ingestion identity, read only approved Bronze with the analytics identity, and prove an ordinary report user cannot read raw files."
    }
   ],
   "accessControls": [
    {
     "principal": "ADF managed identity",
     "role": "Storage Blob Data Contributor",
     "scope": "Bronze and approved quarantine scope",
     "note": "Data-plane access is separate from Azure resource management roles."
    },
    {
     "principal": "Fabric connection / workspace identity",
     "role": "Storage Blob Data Reader",
     "scope": "Approved Bronze scope",
     "note": "Use a supported connector identity and trusted workspace configuration. Validate shortcut permissions end to end."
    },
    {
     "principal": "Engineers / operators",
     "role": "Scoped RBAC or POSIX ACL permissions",
     "scope": "Required containers and paths",
     "note": "RBAC data grants can authorize access without ACL evaluation; when using ACL-based access, include directory traversal. Avoid broad account-wide grants."
    }
   ],
   "branchBoxes": [
    "ingest",
    "dict"
   ],
   "unit": "SDGU-E",
   "owner": "Proposed: SDGU-E runs landing; DPU approves source purpose and retention.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Raw source files remain in their original form with ingestion metadata and a link to their source contract.",
   "why": "Enables audit and replay without making the source submit the same data again.",
   "iac": "na",
   "docs": [
    {
     "label": "Medallion lakehouse architecture",
     "href": "https://learn.microsoft.com/en-us/fabric/onelake/onelake-medallion-lakehouse-architecture"
    }
   ],
   "upstream": [
    "i-adf"
   ],
   "downstream": [
    "st-shortcut"
   ],
   "homeNode": "bronze",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "st-quarantine",
   "tag": "STORE",
   "title": "Quarantine",
   "subtitle": "Restricted rejects · inspection and replay",
   "parent": "st-adls",
   "resourceKind": "logical-layer",
   "resourceType": "ADLS Gen2 container / directory",
   "architectureNotes": [
    "Quality rejection is a pipeline rule, not a built-in feature of a storage container.",
    "Assess upload malware scanning for the chosen intake channel; do not treat quality validation as malware protection."
   ],
   "setupSteps": [
    {
     "title": "Isolate rejected intake",
     "detail": "Create a restricted quarantine scope with reason codes and a reviewed replay process. Keep it outside the report consumer path."
    },
    {
     "title": "Create Bronze and quarantine areas",
     "detail": "Create separate containers or directory scopes, agree partitioning, retention and lifecycle rules, and retain original receipt metadata."
    },
    {
     "title": "Configure each access route",
     "detail": "Use approved ADF managed private endpoints for ingestion. For Fabric, validate the trusted-workspace shortcut route separately; it is not automatically carried by customer VNet endpoints."
    },
    {
     "title": "Test allowed and denied access",
     "detail": "Copy a sample batch with the ingestion identity, read only approved Bronze with the analytics identity, and prove an ordinary report user cannot read raw files."
    }
   ],
   "accessControls": [
    {
     "principal": "Approved rejection writers",
     "role": "Scoped storage write permissions",
     "scope": "Quarantine container or paths",
     "note": "Grant only the identity used by the rejection activity. A Bronze read identity does not automatically receive quarantine access."
    },
    {
     "principal": "Authorized remediation operators",
     "role": "Approved read / replay permissions",
     "scope": "Restricted quarantine area",
     "note": "Audit access and replay. Report audiences and general analysts receive no quarantine access."
    }
   ],
   "branchBoxes": [
    "dqm",
    "dqp",
    "cls"
   ],
   "unit": "SDGU-E",
   "owner": "Proposed: SDGU-E operates the reject path; SDGU-G owns quality thresholds and DPU resolves source issues.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Restricted storage for rejected files or batches with failure reasons, remediation ownership and controlled retention.",
   "why": "Separates invalid or unapproved data from data eligible for curation.",
   "iac": "na",
   "docs": [
    {
     "label": "ADLS access control",
     "href": "https://learn.microsoft.com/en-us/azure/storage/blobs/data-lake-storage-access-control"
    }
   ],
   "upstream": [
    "i-adf",
    "p-spark"
   ],
   "downstream": [],
   "homeNode": "bronze",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "pl-vnet",
   "tag": "PLAT",
   "title": "Azure Virtual Network",
   "subtitle": "Approved client access · network boundary",
   "parent": "azure",
   "resourceKind": "azure-resource",
   "resourceType": "Microsoft.Network/virtualNetworks",
   "architectureNotes": [
    "Microsoft Fabric is a SaaS service outside this VNet.",
    "ADF managed VNet and Fabric managed networking are separate service-managed boundaries; customer private endpoints do not automatically secure their traffic."
   ],
   "setupSteps": [
    {
     "title": "Confirm the enterprise network plan",
     "detail": "Agree approved address space, connectivity, subnet ownership and routing with the network team."
    },
    {
     "title": "Create a private endpoint subnet",
     "detail": "Provision private endpoint interfaces for the Azure services that approved clients must reach. ADLS and Key Vault remain PaaS resources outside this VNet."
    },
    {
     "title": "Link DNS and test a client path",
     "detail": "Link private DNS zones, verify resolution from an approved client, and test both allowed and denied routes. ADF managed VNet and Fabric access need separate validation."
    }
   ],
   "accessControls": [
    {
     "principal": "Network operations",
     "role": "Network Contributor",
     "scope": "Approved network resources",
     "note": "Separate network changes from data permissions and endpoint approval."
    },
    {
     "principal": "Approved workload identities",
     "role": "Service-specific data permissions",
     "scope": "Target storage or vault",
     "note": "A private IP does not grant permission to read data or secrets."
    }
   ],
   "branchBoxes": [
    "access",
    "policy"
   ],
   "unit": "SDGU-E",
   "owner": "Proposed: Enterprise network team owns routing; SDGU-E defines data-platform connectivity.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Customer-managed network for approved private access to Azure PaaS endpoints and enterprise connectivity.",
   "why": "Provides controlled network paths for operators and clients that require private Azure access.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Azure Virtual Network overview",
     "href": "https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-overview"
    }
   ],
   "upstream": [
    "pl-dns"
   ],
   "downstream": [],
   "homeNode": "ops",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "pl-subnet",
   "tag": "PLAT",
   "title": "Private endpoint subnet",
   "subtitle": "Reserved for private endpoint interfaces",
   "parent": "pl-vnet",
   "resourceKind": "azure-resource",
   "resourceType": "Microsoft.Network/virtualNetworks/subnets",
   "architectureNotes": [],
   "setupSteps": [
    {
     "title": "Reserve the endpoint subnet",
     "detail": "Create the approved subnet and validate service-specific network-policy requirements with the enterprise network team."
    },
    {
     "title": "Create a private endpoint subnet",
     "detail": "Provision private endpoint interfaces for the Azure services that approved clients must reach. ADLS and Key Vault remain PaaS resources outside this VNet."
    },
    {
     "title": "Link DNS and test a client path",
     "detail": "Link private DNS zones, verify resolution from an approved client, and test both allowed and denied routes. ADF managed VNet and Fabric access need separate validation."
    }
   ],
   "accessControls": [
    {
     "principal": "Network operations",
     "role": "Network Contributor",
     "scope": "Approved network resources",
     "note": "Separate network changes from data permissions and endpoint approval."
    },
    {
     "principal": "Approved workload identities",
     "role": "Service-specific data permissions",
     "scope": "Target storage or vault",
     "note": "A private IP does not grant permission to read data or secrets."
    }
   ],
   "branchBoxes": [
    "access"
   ],
   "unit": "SDGU-E",
   "owner": "Proposed: Enterprise network team provisions the subnet and applicable controls.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "A subnet reserved for private endpoint network interfaces, following enterprise addressing and network policy standards.",
   "why": "Makes the location of private connectivity explicit without placing PaaS services inside a subnet.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Private endpoint overview",
     "href": "https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-overview"
    }
   ],
   "upstream": [],
   "downstream": [],
   "homeNode": "ops",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "pl-network",
   "tag": "PLAT",
   "title": "Storage & vault endpoints",
   "subtitle": "ADLS dfs + blob · Key Vault vault",
   "parent": "pl-subnet",
   "resourceKind": "azure-resource",
   "resourceType": "Microsoft.Network/privateEndpoints",
   "architectureNotes": [
    "Provision both dfs and blob endpoints for ADLS operations that require them, plus a vault endpoint for Key Vault.",
    "These endpoints do not by themselves provide connectivity for OneLake shortcuts or ADF managed integration runtimes."
   ],
   "setupSteps": [
    {
     "title": "Create endpoint connections",
     "detail": "Create the required storage dfs/blob and Key Vault vault private endpoints in the approved subnet. Approve each resource connection."
    },
    {
     "title": "Verify DNS and effective routing",
     "detail": "Associate the correct service DNS zones and resolve names from the approved client network."
    },
    {
     "title": "Test the service identity",
     "detail": "Verify the workload can authenticate after the route works; a successful network connection alone is insufficient."
    }
   ],
   "accessControls": [
    {
     "principal": "Network operators",
     "role": "Network Contributor",
     "scope": "Private endpoint and subnet",
     "note": "Target-resource owners separately approve connections."
    },
    {
     "principal": "Workload identity",
     "role": "Target data-plane role",
     "scope": "Storage container or Key Vault",
     "note": "Endpoint connectivity never substitutes for service authorization."
    }
   ],
   "branchBoxes": [
    "access",
    "ingest"
   ],
   "unit": "SDGU-E",
   "owner": "Proposed: Enterprise network team owns endpoints; SDGU-E approves target resource connections.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Separate private endpoint resources connect approved network clients to ADLS storage and Key Vault subresources.",
   "why": "Supports private data-plane access from the connected customer network.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Private endpoints for Azure Storage",
     "href": "https://learn.microsoft.com/en-us/azure/storage/common/storage-private-endpoints"
    },
    {
     "label": "Key Vault private link",
     "href": "https://learn.microsoft.com/en-us/azure/key-vault/general/private-link-service"
    }
   ],
   "upstream": [],
   "downstream": [
    "st-adls",
    "pl-kv"
   ],
   "homeNode": "ops",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "pl-dns",
   "tag": "PLAT",
   "title": "Azure Private DNS zones",
   "subtitle": "Private endpoint resolution · VNet links",
   "parent": "azure",
   "resourceKind": "azure-resource",
   "resourceType": "Microsoft.Network/privateDnsZones",
   "architectureNotes": [
    "DNS zones are subscription resources linked to the VNet, not resources deployed inside its subnet.",
    "Reuse centrally managed zones and forwarding when available."
   ],
   "setupSteps": [
    {
     "title": "Create service-specific zones",
     "detail": "Use the documented private DNS zones for storage blob/dfs and Key Vault private endpoints."
    },
    {
     "title": "Link the required VNets",
     "detail": "Configure VNet links and any enterprise DNS forwarding with the network team. Check split-horizon behavior from approved clients."
    }
   ],
   "accessControls": [
    {
     "principal": "DNS operations",
     "role": "Private DNS Zone Contributor",
     "scope": "Approved private DNS zones",
     "note": "Limit changes to the required zones; audit record and VNet-link changes."
    }
   ],
   "branchBoxes": [
    "access"
   ],
   "unit": "SDGU-E",
   "owner": "Proposed: Enterprise network team manages DNS zones, links and forwarding.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Private DNS zones and VNet links resolve the storage and vault private endpoints for authorized clients.",
   "why": "Makes private endpoints usable with normal service names and enterprise DNS forwarding.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Private endpoint DNS configuration",
     "href": "https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-dns"
    }
   ],
   "upstream": [],
   "downstream": [
    "pl-vnet"
   ],
   "homeNode": "ops",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "pl-kv",
   "tag": "PLAT",
   "title": "Azure Key Vault",
   "subtitle": "Remaining connector secrets · controlled access",
   "parent": "azure",
   "resourceKind": "azure-resource",
   "resourceType": "Microsoft.KeyVault/vaults",
   "architectureNotes": [
    "Prefer managed identities where supported. ADF linked services can reference Key Vault.",
    "Key Vault is not an automatic secret backend for every Fabric item; verify each Fabric connection and authentication method."
   ],
   "setupSteps": [
    {
     "title": "Provision a vault",
     "detail": "Use an approved region, Azure RBAC authorization, soft delete and purge protection consistent with enterprise policy."
    },
    {
     "title": "Store only remaining integration secrets",
     "detail": "Use managed identities where supported. Configure an ADF Key Vault linked service for connectors that still need credentials."
    },
    {
     "title": "Restrict and exercise access",
     "detail": "Apply the approved network route, configure diagnostics and rotation, and test that only the intended workload identity can retrieve the required secret."
    }
   ],
   "accessControls": [
    {
     "principal": "ADF managed identity",
     "role": "Key Vault Secrets User",
     "scope": "Required secret or vault scope",
     "note": "Reads secret values for supported linked services; does not manage them."
    },
    {
     "principal": "Secret custodians",
     "role": "Key Vault Secrets Officer",
     "scope": "Approved vault scope",
     "note": "Own rotation and lifecycle; separate this role from ordinary data engineers."
    },
    {
     "principal": "Fabric workloads",
     "role": "Explicitly supported authentication path",
     "scope": "Connector or notebook integration",
     "note": "Do not assume every Fabric connection natively uses Key Vault. Verify support for the selected workload."
    }
   ],
   "branchBoxes": [
    "access",
    "policy"
   ],
   "unit": "SDGU-E",
   "owner": "Proposed: Enterprise security team defines policy; SDGU-E operates approved data-platform bindings.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Stores the remaining credentials needed by supported connectors, with scoped access, rotation and audit logging.",
   "why": "Keeps required secrets outside pipeline definitions and source control.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Key Vault overview",
     "href": "https://learn.microsoft.com/en-us/azure/key-vault/general/overview"
    },
    {
     "label": "Use Key Vault in Azure Data Factory",
     "href": "https://learn.microsoft.com/en-us/azure/data-factory/store-credentials-in-key-vault"
    }
   ],
   "upstream": [
    "pl-network"
   ],
   "downstream": [
    "i-adf"
   ],
   "homeNode": "iam",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "m-logs",
   "tag": "MON",
   "title": "Azure Monitor / Log Analytics",
   "subtitle": "Azure diagnostics · alerts · audit queries",
   "parent": "azure",
   "resourceKind": "azure-resource",
   "resourceType": "Microsoft.OperationalInsights/workspaces",
   "architectureNotes": [
    "Configure diagnostic settings and alert rules explicitly; provisioning a workspace alone does not collect logs.",
    "Fabric execution and capacity use are covered by Fabric monitoring; export integration is a separate design decision."
   ],
   "setupSteps": [
    {
     "title": "Configure diagnostic settings",
     "detail": "Send supported Azure resource logs and metrics to the approved Log Analytics workspace."
    },
    {
     "title": "Define alerts and retention",
     "detail": "Set actionable failure, access and cost signals with runbooks and named responders. Verify a controlled test event is received."
    }
   ],
   "accessControls": [
    {
     "principal": "Operations",
     "role": "Monitoring Reader / Log Analytics Reader as appropriate",
     "scope": "Approved monitoring scopes",
     "note": "Logs can reveal sensitive metadata; scope access and retention accordingly."
    },
    {
     "principal": "Monitoring administrators",
     "role": "Scoped configuration permissions",
     "scope": "Diagnostic settings and workspace",
     "note": "Separate alert configuration from broad subscription control."
    }
   ],
   "branchBoxes": [
    "dqm",
    "access",
    "perf"
   ],
   "unit": "SDGU-E",
   "owner": "Proposed: SDGU-E owns alert response with the enterprise monitoring team.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "A Log Analytics workspace receives supported diagnostic logs from Azure ingestion, storage, networking and Key Vault resources.",
   "why": "Gives engineers operational alerts and auditable evidence for the Azure landing zone.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Log Analytics workspace overview",
     "href": "https://learn.microsoft.com/en-us/azure/azure-monitor/logs/log-analytics-workspace-overview"
    },
    {
     "label": "Azure diagnostic settings",
     "href": "https://learn.microsoft.com/en-us/azure/azure-monitor/platform/diagnostic-settings"
    }
   ],
   "upstream": [
    "i-adf"
   ],
   "downstream": [],
   "homeNode": "ops",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "fabric",
   "tag": "PLAT",
   "title": "Microsoft Fabric",
   "subtitle": "SaaS tenant · analytics and Power BI",
   "parent": null,
   "resourceKind": "boundary",
   "resourceType": "Microsoft Fabric SaaS tenant boundary",
   "architectureNotes": [
    "Shown separately from Azure resources and the customer VNet.",
    "The screenshot establishes branch functions and responsibilities; it does not establish deployed Fabric or Azure services."
   ],
   "setupSteps": [
    {
     "title": "Confirm tenant and capacity",
     "detail": "Confirm Fabric is enabled for the approved security groups, an appropriate capacity/region is available, and tenant settings meet ministry requirements."
    },
    {
     "title": "Create separated workspaces",
     "detail": "Define workspace boundaries by environment and product. Assign capacity and accountable administrators."
    },
    {
     "title": "Validate the Azure connection",
     "detail": "Test the selected ADLS shortcut or connector route with the actual workload identity. Record network and feature prerequisites."
    },
    {
     "title": "Exercise the whole path",
     "detail": "Run a sample Bronze-to-Gold workload and confirm the report audience can access only the intended semantic model and report."
    }
   ],
   "accessControls": [
    {
     "principal": "Tenant administrators",
     "role": "Fabric administrator",
     "scope": "Tenant settings",
     "note": "Use controlled administrator groups and limit broad feature enablement."
    },
    {
     "principal": "Engineering teams",
     "role": "Contributor or scoped item permissions",
     "scope": "Development workspace / items",
     "note": "Separate authoring from production consumers and controlled deployment identities."
    },
    {
     "principal": "Consumers",
     "role": "App audience or workspace Viewer when required",
     "scope": "Approved analytics products",
     "note": "Do not give Member, Contributor or Admin merely to view reports."
    }
   ],
   "branchBoxes": [
    "integ",
    "rpt",
    "access",
    "procimp"
   ],
   "unit": "SDGU-E",
   "owner": "Proposed: Tenant administrators govern the service; SDGU-E and BIRU operate their assigned workspaces.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Fabric hosts the analytics workspaces, lakehouses, orchestration, notebooks and Power BI items. It is a Microsoft-managed SaaS boundary.",
   "why": "Groups the processing and reporting services used to turn branch data into governed products.",
   "iac": "na",
   "docs": [
    {
     "label": "Microsoft Fabric overview",
     "href": "https://learn.microsoft.com/en-us/fabric/fundamentals/microsoft-fabric-overview"
    }
   ],
   "upstream": [],
   "downstream": [],
   "homeNode": "env",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "st-onelake",
   "tag": "STORE",
   "title": "OneLake",
   "subtitle": "Tenant-wide storage foundation for Fabric",
   "parent": "fabric",
   "resourceKind": "saas-service",
   "resourceType": "Microsoft Fabric OneLake",
   "architectureNotes": [
    "OneLake is the storage foundation for the workspace items shown below, not a separately provisioned Azure storage account.",
    "External ADLS data stays in its source account when accessed through a shortcut."
   ],
   "setupSteps": [
    {
     "title": "Use Fabric-managed storage",
     "detail": "OneLake is provided by Fabric; do not provision another Azure storage account to represent it."
    },
    {
     "title": "Organize workspace items",
     "detail": "Create lakehouses and tables in the appropriate workspace; define approved shortcuts and retention expectations."
    },
    {
     "title": "Validate every read path",
     "detail": "Check access through Fabric items, SQL endpoints, shortcuts and semantic models independently."
    }
   ],
   "accessControls": [
    {
     "principal": "Workload authors",
     "role": "Workspace / item permissions",
     "scope": "Relevant lakehouse items",
     "note": "Use supported OneLake security controls for the selected workload."
    },
    {
     "principal": "Report audiences",
     "role": "Semantic model and app permissions",
     "scope": "Published products",
     "note": "Avoid direct OneLake/raw permissions when report consumption is sufficient."
    }
   ],
   "branchBoxes": [
    "integ",
    "dict"
   ],
   "unit": "SDGU-E",
   "owner": "Proposed: Fabric administrators govern tenant settings; SDGU-E manages workspace data.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Fabric-managed logical data lake backing the workspace lakehouses and their Delta tables.",
   "why": "Provides shared storage for Silver and Gold without provisioning another Azure storage account.",
   "iac": "na",
   "docs": [
    {
     "label": "OneLake overview",
     "href": "https://learn.microsoft.com/en-us/fabric/onelake/onelake-overview"
    }
   ],
   "upstream": [],
   "downstream": [],
   "homeNode": "silver",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "m-hub",
   "tag": "MON",
   "title": "Fabric monitoring",
   "subtitle": "Run history · capacity metrics · alert response",
   "parent": "fabric",
   "resourceKind": "saas-service",
   "resourceType": "Fabric Monitoring hub / Capacity Metrics app",
   "architectureNotes": [
    "Configure workspace monitoring and notifications where required and supported.",
    "Fabric run telemetry and Azure resource diagnostics have distinct collection paths."
   ],
   "setupSteps": [
    {
     "title": "Configure operational views",
     "detail": "Use Fabric Monitoring hub and supported capacity metrics for the selected items."
    },
    {
     "title": "Exercise failure response",
     "detail": "Trigger a controlled pipeline failure, confirm visibility, assign alert escalation and link the operational runbook."
    }
   ],
   "accessControls": [
    {
     "principal": "Fabric operations",
     "role": "Relevant workspace / item monitoring permissions",
     "scope": "Managed workspaces",
     "note": "Visibility follows Fabric permissions; it is not automatically the same as Azure Monitor."
    },
    {
     "principal": "Capacity operators",
     "role": "Capacity metrics permissions",
     "scope": "Assigned capacity",
     "note": "Separate capacity-wide visibility from ordinary report consumers."
    }
   ],
   "branchBoxes": [
    "dqm",
    "perf",
    "procimp"
   ],
   "unit": "SDGU-E",
   "owner": "Proposed: SDGU-E owns pipeline response; BIRU owns report and semantic-model health.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Fabric monitoring surfaces pipeline and notebook run status; the Capacity Metrics app supports capacity utilization and throttling analysis.",
   "why": "Connects failed loads and resource pressure to named operational responders.",
   "iac": "na",
   "docs": [
    {
     "label": "Fabric Monitoring hub",
     "href": "https://learn.microsoft.com/en-us/fabric/monitoring/monitoring-hub"
    },
    {
     "label": "Capacity Metrics app",
     "href": "https://learn.microsoft.com/en-us/fabric/enterprise/metrics-app"
    }
   ],
   "upstream": [
    "i-fabric"
   ],
   "downstream": [],
   "homeNode": "ops",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "pl-workspaces",
   "tag": "PLAT",
   "title": "Data workspaces",
   "subtitle": "Repeat the pattern for Dev / Test / Pre-Prod / Prod",
   "parent": "fabric",
   "resourceKind": "boundary",
   "resourceType": "Fabric workspace boundary",
   "architectureNotes": [
    "One workspace pattern is shown; it is not a claim that four workspaces already exist.",
    "Use separate engineering/reporting workspaces when audience isolation requires it.",
    "Workspace identity, supported connections, capacity assignment and permissions must be configured for each environment."
   ],
   "setupSteps": [
    {
     "title": "Create workspaces by environment",
     "detail": "Provision Dev, Test and production workspaces as approved; associate the intended capacity and named owner."
    },
    {
     "title": "Create and connect items",
     "detail": "Add lakehouses, pipelines, notebooks and semantic models. Use environment-specific connections and identities."
    },
    {
     "title": "Configure release promotion",
     "detail": "Connect supported items to Git/deployment pipelines, manage environment bindings, and verify unsupported items have an explicit release process."
    }
   ],
   "accessControls": [
    {
     "principal": "Workspace administrators",
     "role": "Admin",
     "scope": "Single workspace",
     "note": "Keep the administrator group small and audited."
    },
    {
     "principal": "SDGU engineering",
     "role": "Contributor",
     "scope": "Authoring workspace",
     "note": "Validate item-level and OneLake permissions for the access pattern; avoid granting users access to unrelated products."
    },
    {
     "principal": "BIRU / report consumers",
     "role": "Viewer or app audience",
     "scope": "Published analytics scope",
     "note": "RLS protection is not a substitute for keeping consumers out of edit-capable workspace roles."
    }
   ],
   "branchBoxes": [
    "access",
    "change",
    "projmgmt"
   ],
   "unit": "SDGU-E",
   "owner": "Proposed: SDGU-E manages engineering workspaces; BIRU owns reporting access; enterprise admins govern tenant settings.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Environment-specific workspaces hold the Fabric items below and are assigned to approved Fabric capacity.",
   "why": "Separates development, validation and production permissions while preserving a repeatable deployment pattern.",
   "iac": "na",
   "docs": [
    {
     "label": "Fabric workspaces",
     "href": "https://learn.microsoft.com/en-us/fabric/fundamentals/workspaces"
    },
    {
     "label": "Workspace identity",
     "href": "https://learn.microsoft.com/en-us/fabric/security/workspace-identity"
    }
   ],
   "upstream": [
    "pl-capacity",
    "pl-entra",
    "g-catalog",
    "pl-repo"
   ],
   "downstream": [],
   "homeNode": "env",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "i-fabric",
   "tag": "ING",
   "title": "Fabric Data Factory pipelines",
   "subtitle": "Orchestrate validation, curation and publication",
   "parent": "pl-workspaces",
   "resourceKind": "fabric-item",
   "resourceType": "Fabric Data Factory data pipeline",
   "architectureNotes": [
    "This is a Fabric workspace item, not the Azure Data Factory resource shown in the Azure boundary.",
    "Process only completed approved batches; use idempotent run identifiers and record output versions."
   ],
   "setupSteps": [
    {
     "title": "Create a Data Factory pipeline in Fabric",
     "detail": "Use environment-specific connections and parameters for the approved batch handoff."
    },
    {
     "title": "Orchestrate the notebook sequence",
     "detail": "Run validation, Silver conformance and Gold curation with explicit dependency and failure branches."
    },
    {
     "title": "Record and monitor runs",
     "detail": "Log batch identifiers, quality gates and failure outcomes; test replay without duplicating published records."
    }
   ],
   "accessControls": [
    {
     "principal": "Pipeline authors",
     "role": "Workspace Contributor / supported item permissions",
     "scope": "Pipeline and linked items",
     "note": "Authoring permission does not automatically authorize every source connection."
    },
    {
     "principal": "Connection identity",
     "role": "Least-privilege read and write grants",
     "scope": "Approved source and lakehouse destinations",
     "note": "Select an authentication mode supported by the connection and activity."
    }
   ],
   "branchBoxes": [
    "ingest",
    "clean",
    "xform",
    "integ"
   ],
   "unit": "SDGU-E",
   "owner": "Proposed: SDGU-E owns dependencies, retries, schedules and service-level response.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Fabric pipelines orchestrate Spark notebooks and the quality gates that move completed batches from Bronze access to Silver and Gold.",
   "why": "Keeps analytics orchestration close to Fabric execution while Azure Data Factory owns source ingestion.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Data pipelines in Fabric",
     "href": "https://learn.microsoft.com/en-us/fabric/data-factory/data-pipeline-overview"
    }
   ],
   "upstream": [
    "i-adf"
   ],
   "downstream": [
    "p-spark",
    "m-hub"
   ],
   "homeNode": "silver",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "p-spark",
   "tag": "PROC",
   "title": "Spark notebooks",
   "subtitle": "Clean · conform · match · aggregate",
   "parent": "pl-workspaces",
   "resourceKind": "fabric-item",
   "resourceType": "Fabric notebook / Spark runtime",
   "architectureNotes": [
    "Use a controlled Fabric environment for runtime and library dependencies.",
    "Apply approved personal-field handling and small-cell suppression where required; these are explicit transformation rules."
   ],
   "setupSteps": [
    {
     "title": "Attach the intended lakehouses",
     "detail": "Configure the notebook environment, dependencies and data connections for each stage."
    },
    {
     "title": "Implement explicit transformation rules",
     "detail": "Version schema checks, reference matching, approved field exclusions and disclosure rules. Write quality results and route rejects deliberately."
    },
    {
     "title": "Test and schedule",
     "detail": "Exercise valid, invalid and repeat batches; fail the publish gate when required rules fail. Orchestrate promotion through a Fabric pipeline."
    }
   ],
   "accessControls": [
    {
     "principal": "SDGU engineering",
     "role": "Notebook author / workspace Contributor",
     "scope": "Approved engineering workspace",
     "note": "Separate development access from production execution."
    },
    {
     "principal": "Execution identity",
     "role": "Approved input reads and output writes",
     "scope": "Specific lakehouse / connection scopes",
     "note": "Validate the actual notebook execution identity; do not assume the author identity is used for every connection."
    }
   ],
   "branchBoxes": [
    "clean",
    "xform",
    "integ",
    "std",
    "dqm"
   ],
   "unit": "SDGU-E",
   "owner": "Proposed: SDGU-E implements transformations; SDGU-G approves quality and reference rules; DPU approves disclosure rules.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Versioned notebooks read Bronze shortcut files, apply quality and standardization rules, and write Silver and Gold Delta tables.",
   "why": "Implements reusable data engineering logic for the branch pipeline and data-quality functions.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Fabric notebooks",
     "href": "https://learn.microsoft.com/en-us/fabric/data-engineering/how-to-use-notebook"
    }
   ],
   "upstream": [
    "i-fabric",
    "st-shortcut",
    "st-ref"
   ],
   "downstream": [
    "st-silver",
    "p-dq",
    "st-quarantine"
   ],
   "homeNode": "silver",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "st-bronze-view",
   "tag": "STORE",
   "title": "Bronze access lakehouse",
   "subtitle": "External raw data · accessed through a shortcut",
   "parent": "pl-workspaces",
   "resourceKind": "fabric-item",
   "resourceType": "Fabric lakehouse",
   "architectureNotes": [
    "This is an access layer; the physical Bronze landing container is inside ADLS Gen2.",
    "Use Spark to read raw shortcut files. An arbitrary file shortcut does not become a queryable Delta table."
   ],
   "setupSteps": [
    {
     "title": "Create an access lakehouse",
     "detail": "Create a dedicated Fabric lakehouse for approved external Bronze references."
    },
    {
     "title": "Add an ADLS shortcut",
     "detail": "Point the shortcut at the approved raw area. Use the Files area for raw files; use a table shortcut only for supported Delta tables."
    },
    {
     "title": "Verify scope and networking",
     "detail": "Configure the supported connection identity and trusted workspace access where applicable. Confirm it cannot read quarantine or unrelated source areas."
    }
   ],
   "accessControls": [
    {
     "principal": "Fabric connection identity",
     "role": "Storage Blob Data Reader",
     "scope": "Approved external Bronze scope",
     "note": "A shortcut is a reference, not a copy. Source authorization and Fabric permissions must both be considered."
    },
    {
     "principal": "Data engineers",
     "role": "Scoped lakehouse read access",
     "scope": "Bronze access lakehouse",
     "note": "Do not expose raw source areas to report consumers."
    }
   ],
   "branchBoxes": [
    "ingest",
    "dict"
   ],
   "unit": "SDGU-E",
   "owner": "Proposed: SDGU-E configures the lakehouse and source connection.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "A Fabric lakehouse provides the namespace for an ADLS shortcut in its Files area; raw files remain in Azure storage.",
   "why": "Lets Fabric processing read the retained Bronze source without maintaining a second raw copy.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Lakehouse overview",
     "href": "https://learn.microsoft.com/en-us/fabric/data-engineering/lakehouse-overview"
    },
    {
     "label": "OneLake shortcuts",
     "href": "https://learn.microsoft.com/en-us/fabric/onelake/onelake-shortcuts"
    }
   ],
   "upstream": [],
   "downstream": [],
   "homeNode": "bronze",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "st-shortcut",
   "tag": "STORE",
   "title": "ADLS Bronze shortcut",
   "subtitle": "Reference existing files · no raw-data copy",
   "parent": "st-bronze-view",
   "resourceKind": "fabric-item",
   "resourceType": "OneLake shortcut to ADLS Gen2",
   "architectureNotes": [
    "Proposed default: trusted workspace access with workspace identity and scoped storage permissions for firewall-restricted ADLS.",
    "Trusted workspace access is not a customer-VNet private endpoint. Validate capacity, tenant, region and connector support before provisioning.",
    "If policy requires public network access disabled, validate a supported private route for this specific shortcut workload before adopting the design."
   ],
   "setupSteps": [
    {
     "title": "Create and verify the shortcut",
     "detail": "Select the approved ADLS path and connection. Verify files are referenced, not copied, and denied paths remain inaccessible."
    },
    {
     "title": "Add an ADLS shortcut",
     "detail": "Point the shortcut at the approved raw area. Use the Files area for raw files; use a table shortcut only for supported Delta tables."
    },
    {
     "title": "Verify scope and networking",
     "detail": "Configure the supported connection identity and trusted workspace access where applicable. Confirm it cannot read quarantine or unrelated source areas."
    }
   ],
   "accessControls": [
    {
     "principal": "Fabric connection identity",
     "role": "Storage Blob Data Reader",
     "scope": "Approved external Bronze scope",
     "note": "A shortcut is a reference, not a copy. Source authorization and Fabric permissions must both be considered."
    },
    {
     "principal": "Data engineers",
     "role": "Scoped lakehouse read access",
     "scope": "Bronze access lakehouse",
     "note": "Do not expose raw source areas to report consumers."
    }
   ],
   "branchBoxes": [
    "ingest",
    "dict",
    "access"
   ],
   "unit": "SDGU-E",
   "owner": "Proposed: SDGU-E configures the connection; enterprise security approves the storage access route.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "An ADLS Gen2 shortcut exposes the approved Bronze container to the Fabric lakehouse.",
   "why": "Preserves one source of raw data while allowing Fabric notebooks to process it.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Create an ADLS Gen2 shortcut",
     "href": "https://learn.microsoft.com/en-us/fabric/onelake/create-adls-shortcut"
    },
    {
     "label": "Trusted workspace access",
     "href": "https://learn.microsoft.com/en-us/fabric/security/security-trusted-workspace-access"
    }
   ],
   "upstream": [
    "st-bronze"
   ],
   "downstream": [
    "p-spark"
   ],
   "homeNode": "bronze",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "st-silver",
   "tag": "STORE",
   "title": "Silver lakehouse",
   "subtitle": "Validated, standardized Delta tables",
   "parent": "pl-workspaces",
   "resourceKind": "fabric-item",
   "resourceType": "Fabric lakehouse / Delta tables in OneLake",
   "architectureNotes": [
    "Only batches meeting agreed gates progress to Gold; retained failure evidence supports source remediation."
   ],
   "setupSteps": [
    {
     "title": "Create the Silver lakehouse",
     "detail": "Store validated and conformed Delta tables in OneLake under the correct environment workspace."
    },
    {
     "title": "Define schema and quality gates",
     "detail": "Version accepted schemas, reference tables and quality-result structures; assign stewardship for changes."
    },
    {
     "title": "Publish only accepted records",
     "detail": "Use tested notebooks to write idempotently, preserve provenance, and prevent rejected rows from flowing to Gold."
    }
   ],
   "accessControls": [
    {
     "principal": "Engineering execution identity",
     "role": "Approved lakehouse write access",
     "scope": "Silver tables",
     "note": "Keep writes within the controlled processing path."
    },
    {
     "principal": "Stewards and analysts",
     "role": "Scoped read permissions",
     "scope": "Approved Silver items",
     "note": "Grant review access without blanket production editing; evaluate raw and curated sensitivity separately."
    }
   ],
   "branchBoxes": [
    "clean",
    "xform",
    "std",
    "mdm",
    "dqm"
   ],
   "unit": "SDGU-E",
   "owner": "Proposed: SDGU-E runs the layer; SDGU-G stewards definitions and quality acceptance.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Conformed datasets, approved reference dimensions and quality results are materialized as Delta tables in OneLake.",
   "why": "Provides reusable, quality-checked data for analytics products and reconciliation.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Medallion lakehouse architecture",
     "href": "https://learn.microsoft.com/en-us/fabric/onelake/onelake-medallion-lakehouse-architecture"
    }
   ],
   "upstream": [
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
   "id": "st-ref",
   "tag": "STORE",
   "title": "Reference & master tables",
   "subtitle": "Approved codes · aliases · version history",
   "parent": "st-silver",
   "resourceKind": "logical-layer",
   "resourceType": "Lakehouse Delta tables",
   "architectureNotes": [],
   "setupSteps": [
    {
     "title": "Steward reference and master tables",
     "detail": "Version approved codes, matching thresholds and effective dates. Require steward approval before changing canonical identifiers."
    },
    {
     "title": "Define schema and quality gates",
     "detail": "Version accepted schemas, reference tables and quality-result structures; assign stewardship for changes."
    },
    {
     "title": "Publish only accepted records",
     "detail": "Use tested notebooks to write idempotently, preserve provenance, and prevent rejected rows from flowing to Gold."
    }
   ],
   "accessControls": [
    {
     "principal": "Engineering execution identity",
     "role": "Approved lakehouse write access",
     "scope": "Silver tables",
     "note": "Keep writes within the controlled processing path."
    },
    {
     "principal": "Stewards and analysts",
     "role": "Scoped read permissions",
     "scope": "Approved Silver items",
     "note": "Grant review access without blanket production editing; evaluate raw and curated sensitivity separately."
    }
   ],
   "branchBoxes": [
    "mdm",
    "std",
    "dict"
   ],
   "unit": "SDGU-G",
   "owner": "Proposed: SDGU-G approves reference changes; SDGU-E loads and versions the tables.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Steward-controlled municipality and partner dimensions, code lists and matching reference data stored as Silver tables.",
   "why": "Implements the branch master-data and standardization functions without assuming a separate MDM product.",
   "iac": "na",
   "docs": [
    {
     "label": "Lakehouse tables",
     "href": "https://learn.microsoft.com/en-us/fabric/data-engineering/lakehouse-overview"
    }
   ],
   "upstream": [],
   "downstream": [
    "p-spark"
   ],
   "homeNode": "svc-match",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "p-dq",
   "tag": "PROC",
   "title": "Quality rules & results",
   "subtitle": "Rule versions · pass/fail counts · reject reasons",
   "parent": "st-silver",
   "resourceKind": "logical-layer",
   "resourceType": "Rule metadata and quality-result Delta tables",
   "architectureNotes": [
    "These are tables and implemented checks, not a turnkey Azure quality service.",
    "Rejected source files are held in the restricted ADLS quarantine area; only approved results feed published metrics."
   ],
   "setupSteps": [
    {
     "title": "Implement quality rules and results",
     "detail": "Store versioned checks, outcomes and rejection reasons. Make critical failures block Gold publication; these rules must be implemented, not assumed built in."
    },
    {
     "title": "Define schema and quality gates",
     "detail": "Version accepted schemas, reference tables and quality-result structures; assign stewardship for changes."
    },
    {
     "title": "Publish only accepted records",
     "detail": "Use tested notebooks to write idempotently, preserve provenance, and prevent rejected rows from flowing to Gold."
    }
   ],
   "accessControls": [
    {
     "principal": "Engineering execution identity",
     "role": "Approved lakehouse write access",
     "scope": "Silver tables",
     "note": "Keep writes within the controlled processing path."
    },
    {
     "principal": "Stewards and analysts",
     "role": "Scoped read permissions",
     "scope": "Approved Silver items",
     "note": "Grant review access without blanket production editing; evaluate raw and curated sensitivity separately."
    }
   ],
   "branchBoxes": [
    "dqp",
    "dqm",
    "fact"
   ],
   "unit": "SDGU-G",
   "owner": "Proposed: SDGU-G owns thresholds and exception approval; SDGU-E implements checks and logs outcomes.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Versioned rule definitions and recorded validation results support completeness, schema, code-list and reconciliation checks.",
   "why": "Turns the branch data-quality program into measurable gates and evidence.",
   "iac": "na",
   "docs": [
    {
     "label": "Fabric notebook execution",
     "href": "https://learn.microsoft.com/en-us/fabric/data-engineering/how-to-use-notebook"
    }
   ],
   "upstream": [
    "p-spark"
   ],
   "downstream": [],
   "homeNode": "silver",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "st-gold",
   "tag": "STORE",
   "title": "Gold lakehouse",
   "subtitle": "Curated products · approved metrics · Delta tables",
   "parent": "pl-workspaces",
   "resourceKind": "fabric-item",
   "resourceType": "Fabric lakehouse / Delta tables in OneLake",
   "architectureNotes": [],
   "setupSteps": [
    {
     "title": "Create curated product tables",
     "detail": "Define stable grains, dimensions, measures, refresh expectations and approved disclosure rules."
    },
    {
     "title": "Gate publication",
     "detail": "Materialize accepted Silver data through notebooks only after quality and business checks pass."
    },
    {
     "title": "Connect serving interfaces",
     "detail": "Expose the intended SQL analytics endpoint and semantic models, then test data freshness and consumer permissions."
    }
   ],
   "accessControls": [
    {
     "principal": "Engineering execution identity",
     "role": "Controlled write access",
     "scope": "Gold lakehouse",
     "note": "Use a release-controlled pipeline for production writes."
    },
    {
     "principal": "BIRU model authors",
     "role": "Approved source read and model authoring",
     "scope": "Gold tables and semantic model",
     "note": "Grant only the products needed for analytics; configure consumer security separately."
    }
   ],
   "branchBoxes": [
    "integ",
    "rpt",
    "kpi",
    "fact"
   ],
   "unit": "SDGU-E",
   "owner": "Proposed: SDGU-E publishes tables; BIRU approves analytical definitions; DPU and SDGU-G approve relevant policy controls.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Curated facts, dimensions and aggregates are shaped for approved analytics products, with quality and disclosure rules applied.",
   "why": "Provides a governed source for consistent Power BI metrics and branch fact checking.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Medallion lakehouse architecture",
     "href": "https://learn.microsoft.com/en-us/fabric/onelake/onelake-medallion-lakehouse-architecture"
    }
   ],
   "upstream": [
    "st-silver"
   ],
   "downstream": [
    "sv-sql",
    "sv-model"
   ],
   "homeNode": "gold",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "sv-sql",
   "tag": "SERVE",
   "title": "SQL analytics endpoint",
   "subtitle": "Read-only T-SQL over Gold Delta tables",
   "parent": "st-gold",
   "resourceKind": "fabric-item",
   "resourceType": "Lakehouse SQL analytics endpoint",
   "architectureNotes": [
    "Automatically associated with the lakehouse; it is not a separately provisioned Azure SQL database.",
    "Gold data updates happen through supported lakehouse write paths, not T-SQL DML on this endpoint."
   ],
   "setupSteps": [
    {
     "title": "Use the lakehouse SQL analytics endpoint",
     "detail": "Check that the required Delta tables appear. This endpoint queries lakehouse tables; it is not a SQL write interface for those tables."
    },
    {
     "title": "Grant and test SQL access",
     "detail": "Configure the supported SQL permissions and test with a read-only analyst identity, separately from OneLake access."
    }
   ],
   "accessControls": [
    {
     "principal": "Approved SQL analysts",
     "role": "Read / SELECT as configured",
     "scope": "Approved SQL endpoint objects",
     "note": "SQL controls do not automatically secure every direct OneLake or semantic-model access path."
    }
   ],
   "branchBoxes": [
    "adhoc",
    "fact",
    "rpt"
   ],
   "unit": "BIRU",
   "owner": "Proposed: SDGU-E manages table access; BIRU owns analytical queries.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "The Gold lakehouse SQL analytics endpoint exposes supported Delta tables for read-only T-SQL analysis and validation.",
   "why": "Supports analyst exploration and fact checking without adding a Fabric warehouse by default.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Lakehouse SQL analytics endpoint",
     "href": "https://learn.microsoft.com/en-us/fabric/data-engineering/lakehouse-sql-analytics-endpoint"
    }
   ],
   "upstream": [
    "st-gold"
   ],
   "downstream": [],
   "homeNode": "gold",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "sv-model",
   "tag": "SERVE",
   "title": "Power BI semantic model",
   "subtitle": "Measures · relationships · RLS / OLS",
   "parent": "pl-workspaces",
   "resourceKind": "fabric-item",
   "resourceType": "Power BI semantic model",
   "architectureNotes": [
    "Evaluate Direct Lake for Gold Delta tables; select Import or DirectQuery when workload, permissions or capacity constraints require it.",
    "RLS and OLS protect semantic-model consumption; direct lakehouse or SQL access needs its own permissions."
   ],
   "setupSteps": [
    {
     "title": "Build an explicit semantic model",
     "detail": "Connect the Gold source using a supported mode, define relationships and measures, and confirm connection/identity behavior."
    },
    {
     "title": "Define RLS and OLS where needed",
     "detail": "Configure row and object permissions for approved groups. Test effective identities and Direct Lake / fallback behavior for the chosen model."
    },
    {
     "title": "Validate and publish",
     "detail": "Check totals, refresh/freshness and consumer-role behavior before publishing reports or apps."
    }
   ],
   "accessControls": [
    {
     "principal": "BIRU model authors",
     "role": "Model authoring / appropriate workspace role",
     "scope": "Analytics workspace",
     "note": "Keep authors separate from consumer groups; edit-capable roles are not restricted like Viewers by RLS."
    },
    {
     "principal": "Report consumers",
     "role": "Read; Build only for approved self-service",
     "scope": "Semantic model / app audience",
     "note": "Apply and test RLS/OLS. App access alone is not proof that row restrictions are correct."
    }
   ],
   "branchBoxes": [
    "kpi",
    "rpt",
    "access"
   ],
   "unit": "BIRU",
   "owner": "Proposed: BIRU owns measures and report access; SDGU-E supports data contracts and model operation.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "An explicitly created semantic model defines approved measures, relationships and row/object-level security for Gold data.",
   "why": "Makes KPI meaning and authorized reporting access consistent across products.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Direct Lake overview",
     "href": "https://learn.microsoft.com/en-us/fabric/fundamentals/direct-lake-overview"
    },
    {
     "label": "Row-level security in Power BI",
     "href": "https://learn.microsoft.com/en-us/fabric/security/service-admin-row-level-security"
    }
   ],
   "upstream": [
    "st-gold",
    "pl-entra"
   ],
   "downstream": [
    "sv-pbi"
   ],
   "homeNode": "gold",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "sv-pbi",
   "tag": "SERVE",
   "title": "Power BI reports & apps",
   "subtitle": "Dashboards · KPI monitoring · governed audiences",
   "parent": "pl-workspaces",
   "resourceKind": "fabric-item",
   "resourceType": "Power BI reports / published app",
   "architectureNotes": [
    "Reports live in workspaces; published apps distribute selected content to approved audiences.",
    "Confirm consumer licensing and capacity requirements; public publication is not assumed."
   ],
   "setupSteps": [
    {
     "title": "Create reports from the governed model",
     "detail": "Use approved measures and product definitions instead of reimplementing business logic in each report."
    },
    {
     "title": "Publish an app to approved audiences",
     "detail": "Use security groups, explicit audiences and an agreed release workflow."
    },
    {
     "title": "Test as a consumer",
     "detail": "Verify permitted and denied records, exports, sharing and freshness using a real test consumer account."
    }
   ],
   "accessControls": [
    {
     "principal": "BIRU report authors",
     "role": "Contributor / publishing permissions",
     "scope": "Analytics workspace",
     "note": "Authoring and app publishing should be limited to the delivery team."
    },
    {
     "principal": "Business audiences",
     "role": "App audience / report Read",
     "scope": "Approved reports",
     "note": "Avoid edit-capable workspace roles for consumers; enforce model security and tenant sharing policy."
    }
   ],
   "branchBoxes": [
    "rpt",
    "kpi",
    "perf",
    "adhoc",
    "literacy"
   ],
   "unit": "BIRU",
   "owner": "Proposed: BIRU owns report design, accessibility, audience approval and user guidance.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Reports and published apps present governed analytics through approved semantic models and audience permissions.",
   "why": "Delivers the branch reporting, performance monitoring and one-off analysis capabilities.",
   "iac": "tbd",
   "docs": [
    {
     "label": "Power BI in Microsoft Fabric",
     "href": "https://learn.microsoft.com/en-us/fabric/fundamentals/power-bi-overview"
    },
    {
     "label": "Publish Power BI apps",
     "href": "https://learn.microsoft.com/en-us/power-bi/collaborate-share/service-create-distribute-apps"
    }
   ],
   "upstream": [
    "sv-model"
   ],
   "downstream": [],
   "homeNode": "gold",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "governance",
   "tag": "GOV",
   "title": "Identity, governance & delivery",
   "subtitle": "Shared controls across Azure and Fabric",
   "parent": null,
   "resourceKind": "boundary",
   "resourceType": "Cross-platform control boundary",
   "architectureNotes": [
    "This is a logical grouping of shared services, not a physical network or an Azure resource group."
   ],
   "setupSteps": [
    {
     "title": "Assign accountable owners",
     "detail": "Agree the division of responsibility across DPU, SDGU governance, SDGU engineering, BIRU and enterprise teams."
    },
    {
     "title": "Implement cross-platform controls",
     "detail": "Bind approved groups to resource roles, register metadata and enforce reviewed infrastructure releases. Test the controls on both Azure and Fabric."
    }
   ],
   "accessControls": [
    {
     "principal": "DAB owners and enterprise teams",
     "role": "Proposed responsibility model",
     "scope": "Cross-platform controls",
     "note": "Confirm this proposal as an operating model before provisioning; it is not an approved access inventory."
    }
   ],
   "branchBoxes": [
    "council",
    "access",
    "policy",
    "procimp",
    "change"
   ],
   "unit": "SDGU-G",
   "owner": "Proposed: SDGU-G coordinates governance; DPU owns policy; SDGU-E operates controls with enterprise teams.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Shared identity, metadata governance and delivery controls span Azure infrastructure and Fabric analytics.",
   "why": "Maps the branch governance and change-management bands to concrete supporting services.",
   "iac": "na",
   "docs": [],
   "upstream": [],
   "downstream": [],
   "homeNode": "iam",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "pl-entra",
   "tag": "PLAT",
   "title": "Microsoft Entra ID",
   "subtitle": "Groups · managed identities · access policy",
   "parent": "governance",
   "resourceKind": "saas-service",
   "resourceType": "Microsoft Entra tenant / identities",
   "architectureNotes": [
    "Apply Azure RBAC/ADLS ACLs, Fabric workspace and item permissions, and Power BI model/audience rules at their respective boundaries.",
    "Use Conditional Access and privileged-access controls under enterprise policy."
   ],
   "setupSteps": [
    {
     "title": "Create role-based security groups",
     "detail": "Separate administrators, engineers, stewards, report authors and report consumers; assign accountable group owners."
    },
    {
     "title": "Use managed or workload identities",
     "detail": "Configure supported identities for automation instead of embedding user credentials in pipelines."
    },
    {
     "title": "Review access regularly",
     "detail": "Apply enterprise conditional access and privileged-access procedures, and remove access when duties change."
    }
   ],
   "accessControls": [
    {
     "principal": "Identity operations",
     "role": "Approved identity administrator roles",
     "scope": "Required tenant tasks",
     "note": "Use least privilege and controlled elevation; exact roles follow enterprise policy."
    },
    {
     "principal": "Application groups",
     "role": "Resource-specific grants",
     "scope": "Azure RBAC, Fabric roles and app audiences",
     "note": "Group membership alone is not a data permission until a resource grants a role."
    }
   ],
   "branchBoxes": [
    "access",
    "policy"
   ],
   "unit": "SDGU-G",
   "owner": "Proposed: Enterprise identity team operates the tenant; SDGU-G defines access roles; service owners approve grants.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Entra groups and supported workload identities establish authentication for Azure and Fabric. Each service still requires scoped authorization.",
   "why": "Aligns access with branch roles and reduces long-lived credentials.",
   "iac": "na",
   "docs": [
    {
     "label": "Microsoft Entra fundamentals",
     "href": "https://learn.microsoft.com/en-us/entra/fundamentals/what-is-entra"
    },
    {
     "label": "Fabric workspace identity",
     "href": "https://learn.microsoft.com/en-us/fabric/security/workspace-identity"
    }
   ],
   "upstream": [],
   "downstream": [
    "st-adls",
    "pl-workspaces",
    "sv-model"
   ],
   "homeNode": "iam",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "g-catalog",
   "tag": "GOV",
   "title": "Microsoft Purview",
   "subtitle": "Catalog · glossary · classification · lineage",
   "parent": "governance",
   "resourceKind": "saas-service",
   "resourceType": "Microsoft Purview Data Map / Unified Catalog",
   "architectureNotes": [
    "Reuse an enterprise catalog when available; confirm account, licensing, scan scope and supported lineage coverage.",
    "Register sources, grant scan access and configure supported connections; coverage is not automatic.",
    "Purview classification and catalog permissions do not replace storage, Fabric or Power BI authorization."
   ],
   "setupSteps": [
    {
     "title": "Confirm Purview scope and licensing",
     "detail": "Establish the Data Map and catalog governance model, ownership domains and supported scanning scope."
    },
    {
     "title": "Register and authorize sources",
     "detail": "Configure supported Azure/Fabric integrations and grant the scanner only the access needed for the selected source."
    },
    {
     "title": "Curate and verify metadata",
     "detail": "Assign owners and classifications, document glossary terms, and validate actual lineage coverage. Custom processing may need additional lineage work."
    }
   ],
   "accessControls": [
    {
     "principal": "Catalog stewards",
     "role": "Relevant catalog / collection stewardship roles",
     "scope": "Owned governance domain",
     "note": "Metadata stewardship does not grant source data access."
    },
    {
     "principal": "Scanning identity",
     "role": "Source-specific scan permissions",
     "scope": "Registered sources",
     "note": "Use least privilege; validate scan coverage and classification visibility."
    }
   ],
   "branchBoxes": [
    "dict",
    "cls",
    "council",
    "dqp"
   ],
   "unit": "SDGU-G",
   "owner": "Proposed: SDGU-G stewards catalog and glossary; enterprise Purview admins manage the service and connections.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Purview connects technical assets to approved glossary terms, owners, classifications and available lineage across the platform.",
   "why": "Supports the branch metadata-management and governance functions with a shared catalog.",
   "iac": "na",
   "docs": [
    {
     "label": "Microsoft Purview Data Map",
     "href": "https://learn.microsoft.com/en-us/purview/data-map"
    },
    {
     "label": "Fabric source in Purview",
     "href": "https://learn.microsoft.com/en-us/purview/register-scan-fabric-tenant"
    }
   ],
   "upstream": [],
   "downstream": [
    "st-adls",
    "pl-workspaces"
   ],
   "homeNode": "catalogue",
   "deeper": [],
   "statusNote": ""
  },
  {
   "id": "pl-repo",
   "tag": "PLAT",
   "title": "Azure DevOps / GitHub",
   "subtitle": "Git · infrastructure delivery · Fabric deployment",
   "parent": "governance",
   "resourceKind": "saas-service",
   "resourceType": "Source control and CI/CD service",
   "architectureNotes": [
    "Prefer the existing enterprise Git platform. Use Bicep or the approved IaC tool for Azure resources and supported Fabric deployment tooling for workspace items.",
    "Rebind environment-specific connections, identities and settings; Git integration alone does not deploy every dependency.",
    "No repository paths, deployment pipelines or infrastructure state are claimed to exist yet."
   ],
   "setupSteps": [
    {
     "title": "Choose the delivery platform",
     "detail": "Use Azure DevOps or GitHub consistently with enterprise standards; establish protected branches and review rules."
    },
    {
     "title": "Version infrastructure and supported Fabric items",
     "detail": "Separate environment configuration from secrets. Confirm which items support Git integration and deployment pipelines."
    },
    {
     "title": "Test deployment gates",
     "detail": "Validate infrastructure plans, quality checks, identity bindings and rollback procedures before production promotion."
    }
   ],
   "accessControls": [
    {
     "principal": "Contributors",
     "role": "Repository contribution with protected branches",
     "scope": "Project repositories",
     "note": "Require review for infrastructure and access-policy changes."
    },
    {
     "principal": "Deployment identity",
     "role": "Scoped Azure / Fabric deployment permissions",
     "scope": "Target environment",
     "note": "Use a supported workload identity or approved secret binding; never commit credentials."
    }
   ],
   "branchBoxes": [
    "procimp",
    "projmgmt",
    "change",
    "policy"
   ],
   "unit": "SDGU-E",
   "owner": "Proposed: SDGU-E owns build and deployment; BIRU approves reporting releases; DPU supports project/change governance.",
   "phase": "v1",
   "status": "planned",
   "statusSource": "Proposed architecture; no deployment inventory or runtime evidence supplied.",
   "statusByEnv": [
    "p",
    "p",
    "p",
    "p"
   ],
   "summary": "Use the approved Git platform for reviewed infrastructure definitions, Fabric item source, tests and environment promotion.",
   "why": "Makes platform changes repeatable and reviewable under branch change-management controls.",
   "iac": "na",
   "docs": [
    {
     "label": "Fabric lifecycle management",
     "href": "https://learn.microsoft.com/en-us/fabric/cicd/cicd-overview"
    },
    {
     "label": "Fabric Git integration",
     "href": "https://learn.microsoft.com/en-us/fabric/cicd/git-integration/intro-to-git-integration"
    },
    {
     "label": "Azure Bicep",
     "href": "https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/overview"
    }
   ],
   "upstream": [],
   "downstream": [
    "azure",
    "pl-workspaces"
   ],
   "homeNode": "gate-preprod-prod",
   "deeper": [],
   "statusNote": ""
  }
 ],
 "edges": [
  {
   "from": "s-muni",
   "to": "i-adf",
   "type": "primary",
   "label": "approved ingestion"
  },
  {
   "from": "s-sm",
   "to": "i-adf",
   "type": "primary",
   "label": "approved ingestion"
  },
  {
   "from": "s-list",
   "to": "i-adf",
   "type": "primary",
   "label": "approved ingestion"
  },
  {
   "from": "i-adf",
   "to": "st-bronze",
   "type": "primary",
   "label": "copy original files"
  },
  {
   "from": "i-adf",
   "to": "st-quarantine",
   "type": "return",
   "label": "rejected intake"
  },
  {
   "from": "i-adf",
   "to": "i-fabric",
   "type": "request",
   "label": "completed batch handoff"
  },
  {
   "from": "st-bronze",
   "to": "st-shortcut",
   "type": "primary",
   "label": "reference files; no copy"
  },
  {
   "from": "i-fabric",
   "to": "p-spark",
   "type": "request",
   "label": "run notebooks"
  },
  {
   "from": "st-shortcut",
   "to": "p-spark",
   "type": "primary",
   "label": "read raw files"
  },
  {
   "from": "p-spark",
   "to": "st-silver",
   "type": "primary",
   "label": "validate and conform"
  },
  {
   "from": "p-spark",
   "to": "p-dq",
   "type": "request",
   "label": "record quality results"
  },
  {
   "from": "p-spark",
   "to": "st-quarantine",
   "type": "return",
   "label": "route rejects"
  },
  {
   "from": "st-ref",
   "to": "p-spark",
   "type": "request",
   "label": "approved matching rules"
  },
  {
   "from": "st-silver",
   "to": "st-gold",
   "type": "primary",
   "label": "curate through notebooks"
  },
  {
   "from": "st-gold",
   "to": "sv-sql",
   "type": "request",
   "label": "read-only SQL access"
  },
  {
   "from": "st-gold",
   "to": "sv-model",
   "type": "primary",
   "label": "governed model source"
  },
  {
   "from": "sv-model",
   "to": "sv-pbi",
   "type": "primary",
   "label": "measures and secured views"
  },
  {
   "from": "pl-capacity",
   "to": "pl-workspaces",
   "type": "request",
   "label": "workspace assignment"
  },
  {
   "from": "pl-dns",
   "to": "pl-vnet",
   "type": "request",
   "label": "DNS VNet links"
  },
  {
   "from": "pl-network",
   "to": "st-adls",
   "type": "request",
   "label": "storage private connections"
  },
  {
   "from": "pl-network",
   "to": "pl-kv",
   "type": "request",
   "label": "vault private connection"
  },
  {
   "from": "pl-kv",
   "to": "i-adf",
   "type": "request",
   "label": "supported credential references"
  },
  {
   "from": "i-adf",
   "to": "m-logs",
   "type": "return",
   "label": "configured diagnostic logs"
  },
  {
   "from": "i-fabric",
   "to": "m-hub",
   "type": "return",
   "label": "Fabric run status"
  },
  {
   "to": "st-adls",
   "type": "request",
   "label": "RBAC / data permissions",
   "from": "pl-entra"
  },
  {
   "to": "pl-workspaces",
   "type": "request",
   "label": "groups / workspace roles",
   "from": "pl-entra"
  },
  {
   "to": "sv-model",
   "type": "request",
   "label": "consumer identity",
   "from": "pl-entra"
  },
  {
   "to": "st-adls",
   "type": "request",
   "label": "authorized metadata scans",
   "from": "g-catalog"
  },
  {
   "to": "pl-workspaces",
   "type": "request",
   "label": "supported catalog / lineage",
   "from": "g-catalog"
  },
  {
   "to": "azure",
   "type": "request",
   "label": "reviewed infrastructure deployment",
   "from": "pl-repo"
  },
  {
   "to": "pl-workspaces",
   "type": "request",
   "label": "supported item promotion",
   "from": "pl-repo"
  }
 ]
};
