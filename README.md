# MMAH Platform Portal — static demo

Polished **mock** UI for the MMAH Data Platform Portal (working name: Platform Portal). It illustrates the v1 information architecture from `mmah-platform-portal-prd.md`: engineer-first home, two data products with trust cards, Bronze→Silver→Gold lineage swimlanes, platform setup, rules/config, shared services, and a read-only Releases & gates view.

**All data is fictional mock metadata.** There is no live backend, no personal information, and no High Sensitivity / By-Name List content. Sensitivity tags are Public / Low / Medium only. The process map uses business capabilities; the Platform blueprint follows the PRD TKT layout, and the separate **infrastructure-as-code guide (`pages/iac-guide.html`) names concrete Azure and Microsoft Fabric resources** in a proposed architecture (outside TKT scope, PRD decision #11). All statuses shown are sample statuses, not real infrastructure. The branch chart establishes responsibilities, not evidence of provisioned resources.

## How to preview

From this directory:

```bash
cd /workspace/mmah-platform-portal-demo
python3 -m http.server 8766 --bind 127.0.0.1
```

Then open in a browser:

- http://127.0.0.1:8766/ (process map)
- http://127.0.0.1:8766/pages/blueprint.html (Platform blueprint / Toolkit)

Stop the server with `Ctrl+C` in that terminal.

You can also open `index.html` directly as a file, but using `http.server` avoids quirks with some browsers and matches how the demo was smoke-tested.

## Deploy with Vercel

Import `yangg1224/mmah-platform-portal-demo` into Vercel and choose the account or team that should own the site. Use `main` as the production branch, framework preset **Other**, and the repository root as the root directory. The committed `vercel.json` supplies the build command (`node scripts/build_site.mjs`) and output directory (`dist`); no dependencies or environment variables are required for this static demo.

[Import this repository into Vercel](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fyangg1224%2Fmmah-platform-portal-demo)

Authorize the Vercel GitHub integration for this repository if prompted, then select **Deploy**. Vercel provides the deployment URL; successful pushes to the configured production branch trigger new deployments. The blueprint is at `/pages/blueprint.html`, including its section and step links. A custom domain can be added later in the project's Domains settings.

To verify the publishable files locally:

```bash
node scripts/build_site.mjs
python3 scripts/smoke_blueprint.py --site-dir dist
```

The build copies only `index.html`, `css/`, `js/`, and `pages/` to `dist/`. Keep the generated toolkit JavaScript current using the manifest commands below before pushing changes. Vercel configuration in Git prepares deployment; an account must still import/link the repository and complete its first deployment.

## Demo story — pages to click

1. **Home** (`index.html`) — clickable process map (decision #9): Sources → Landing / Raw (Bronze) → Standardize and conform (Silver, with 4 shared services) → Published / trusted (Gold) → Catalogue / publish. Click a node for its drawer. Product filter, **Platform setup** and **Releases and gates** overlays, **View as list**. Map state is in the URL, e.g. `index.html#node=silver&product=mpd&overlays=setup,releases` (screenshot alias: `index.html?panel=silver&infra=1&release=1`).
1b. **Platform blueprint** (`pages/blueprint.html`, via the `Process map · Platform blueprint` switcher) — PRD §6.6 TKT layout: columns Sources → Ingest → Store → Process → Serve → Enrich, Reusable services and Platform Portal side containers, full-width Governance / Monitoring / Platform bars along the bottom. Colour by DAB function / owning unit, v1 · Next · Future phase toggles, sample status badges, list and branch views, and the shared drawer. Rendered from `config/toolkit.yaml` via `scripts/build_toolkit.py`.

1c. **Infrastructure-as-code guide** (`pages/iac-guide.html`, linked from the blueprint header; rendered from `config/iac-guide.yaml` via `scripts/build_iac_guide.py`) — three visual guides: **Infrastructure as Code**, **Open Data Contract** (governance), and **Bronze / Silver / Gold**. Each guide has five numbered, clickable steps, animated directional arrows, a failure/rework path, input/action/output guidance, handoff gates, access controls and links to component details. Use Previous / Next to walk the sequence or select any step. Example: `pages/iac-guide.html#section=medallion&step=silver`. The resource architecture remains available from every guide: an interactive Azure / Fabric architecture canvas with a large subscription boundary, service icons and directed, animated arrows. Switch between Data flow, Access & network and All connections; pause motion, zoom or drag empty space to pan. Follow sources → Azure Data Factory → ADLS Gen2 Bronze → Fabric Silver / Gold → Power BI. Select a service to open Inside, Set up, Access and Connections tabs. Internal components remain explorable from their parent; setup steps and scoped permission guidance are authored in the manifest. Animation illustrates the proposed design and is not live telemetry. Reduced-motion preferences disable animation by default. Colour by DAB function / owning unit, use phase toggles, or switch to resource list / branch views. All resource deployment statuses are planned. Permalink e.g. `pages/iac-guide.html#node=st-silver`.
2. **Flows / lineage** (`pages/flows.html`) — visual centerpiece. Municipal Planning path with DQ warning on clean/validate; Housing & HH happy path. Toggle **Table** for the accessible graph equivalent. Click nodes for detail.
3. **Data products** → **Municipal Planning Data** — tabs Overview (trust card EN+FR) · Lineage · Quality (rule results + open DQ exceptions, deep-linkable as `#dq`) · Definitions · Releases.
4. **Releases & gates** — promotion board; Release 0.4 gate checklist with CAB link missing and TRA “Not yet defined”; Release 0.3 complete in Prod.
5. **Platform setup** — Dev / Test / Pre-Prod / Prod side by side; untagged zone on Test; roles by name/purpose; “Defined in: path/file.ext@<sha of last commit touching it> (stamped by scripts/build_refs.py)”.
6. **Rules / config** and **Shared services** — config-as-code style entries with used-by / consumer links.
7. **Global search** — search box on every page (try `housing`, `CAB`, `scratch`, `municipality`).

## Layout

```
mmah-platform-portal-demo/
  index.html                         # Home = process map
  README.md
  config/toolkit.yaml                # Toolkit manifest: SOURCE OF TRUTH for the blueprint page (TKT-2)
  scripts/build_toolkit.py           # config/toolkit.yaml -> js/toolkit-manifest.generated.js
  scripts/validate_toolkit.py        # CI check: branch-box traceability + schema (TKT-3)
  scripts/test_toolkit.py             # Blueprint manifest regression tests (TKT-2/3)
  config/iac-guide.yaml              # IaC guide manifest (schema v2: resources, journeys)
  scripts/build_iac_guide.py         # config/iac-guide.yaml -> js/iac-guide-manifest.generated.js
  scripts/validate_iac_guide.py      # IaC guide schema / hierarchy checks
  scripts/test_iac_guide.py          # IaC guide resource hierarchy regression tests
  scripts/smoke_iac_guide.py         # IaC guide browser walkthrough checks
  ci-example/validate-toolkit.yml     # Optional GitHub Actions example
  css/styles.css                     # Shared styles (OPS-ish government look)
  css/map.css                        # Process map, legend, drawer (both map views)
  css/blueprint.css                  # Platform blueprint additions (blueprint page only)
  js/data.js                         # Mock catalog for search (+ catalog -> map node mapping)
  js/app.js                          # Search, tabs, lineage interaction
  js/drawer.js                       # Shared click-to-expand drawer component (both map views)
  js/map-data.js                     # Map model: nodes, edges, containers (node ids listed here)
  js/map-data-overlays.js            # Platform setup + Releases and gates overlay nodes
  js/map.js                          # Map renderer, filter, overlays, permalink
  js/map-drawer.js                   # Home drawer fields (same 8 sections for every node) + list view
  js/toolkit-manifest.generated.js   # GENERATED from config/toolkit.yaml - do not edit
  js/blueprint.js                    # Blueprint renderer, filters, permalink
  js/blueprint-drawer.js             # Blueprint drawer fields (TKT-4), list / branch views
  js/iac-guide*.js, css/iac-guide.css # IaC guide renderer, journeys, inspector
  pages/
    data-products.html
    data-product-municipal.html
    data-product-housing.html
    flows.html
    platform-setup.html
    rules.html
    shared-services.html
    releases.html
    blueprint.html                   # Platform blueprint / Toolkit (reached from the view switcher)
```

## Toolkit manifest: build and validate

`config/toolkit.yaml` (schema v1: columns, containers, bars, tools) is the only place to edit blueprint content. `config/iac-guide.yaml` is the IaC guide's source; its schema v2 describes resources with `parent` containment, `resource_kind`, `resource_type`, architecture notes, branch boxes, proposed owners, phase, deployment status, documentation and upstream / downstream relationships. A null parent defines a top-level boundary. Containment is distinct from the data-flow `edges`; a private endpoint can sit inside a VNet while its storage account sits outside it. `architecture.journeys` supplies the three guides, their ordered steps, lane ranges, backward exception paths and linked resource IDs. The current guide layout expects five steps per guide; validation catches broken links, missing guidance, duplicate step IDs and invalid bounds. Open Data Contract denotes a proposed shared contract specification, not public data access or a claim of conformance to a selected standard. `architecture.diagram` supplies overview node bounds, icons and labels; `architecture` also contains design decisions. `setup_steps` and `access_controls` provide implementation guidance for every component. Child relationships omitted from the overview remain available through the inspector and full resource list. Connection routes are drawn in `js/blueprint.js`; edges use their declared direction and map to the nearest visible ancestor. The page stays static: a build step turns the YAML into plain JS, so there is no YAML parsing or CDN at runtime. Python scripts need PyYAML (`pip install --user pyyaml`).

```bash
python3 scripts/build_toolkit.py            # regenerate js/toolkit-manifest.generated.js after editing the YAML
python3 scripts/build_toolkit.py --check    # exit 1 if the generated file is stale
python3 scripts/validate_toolkit.py         # exit 1 on any problem (run in CI on every pull request)
python3 -m unittest discover -s scripts -p 'test_*.py'  # hierarchy and generator regression checks
```

The interactive diagram also has a browser regression check. With Python Playwright and Chromium installed, run `python3 scripts/smoke_blueprint.py --screenshots /tmp/blueprint-review`. It starts and stops its own local server, exercises all three guides, step navigation and permalinks, setup/access guidance, exception paths, component drill-down, connection modes, animation controls, nested details, permissions, keyboard navigation, zoom/pan and mobile/reduced-motion behavior, and optionally saves screenshots outside the checkout.

`validate_toolkit.py` fails when a resource has no branch box, names a box or band outside the Data and Analytics Branch chart, breaks the schema (missing fields, duplicate ids, unknown unit / phase / status / resource kind, missing parents, containment cycles or dangling relationship / flow ids), contains anything that looks like an IP range, GUID, connection string or secret (TKT-11), or when generated JS no longer matches the YAML. `ci-example/validate-toolkit.yml` shows the optional CI job.

## Architecture choices

- **Azure landing zone:** Azure Data Factory handles source ingestion into a hierarchical-namespace ADLS Gen2 account. Bronze / raw and quarantine are logical storage areas, not standalone Azure services.
- **Fabric analytics:** a separate SaaS boundary contains workspaces, Data Factory pipelines, Spark notebooks, lakehouses backed by OneLake, SQL analytics endpoints, and Power BI semantic models / reports. A Bronze shortcut references ADLS rather than making a second authoritative raw copy. Silver standardizes data; Gold publishes curated models.
- **Networking and security:** Fabric is not deployed inside the customer's VNet. Customer private endpoints and DNS, ADF managed private connectivity, and supported Fabric access routes are distinct concerns. Validate workload support and ministry policy before choosing a private-only path. Key Vault holds supported integration secrets; Entra ID provides identity and access groups.
- **Branch accountability:** DPU owns acquisition agreements and source stewardship; SDGU engineering owns ingestion and processing; SDGU governance owns standards, classification and quality policy; BIRU owns semantic models and reporting. Enterprise infrastructure responsibilities need confirmation. These are proposed mappings from the supplied branch chart, not an approved RACI.
- **Separate environments:** the diagram is a reusable pattern for Dev / Test / Pre-Prod / Prod. Capacity sizing, region, network routes, access controls and promotion gates remain design decisions. No cloud resources are provisioned by this demo.

## Shared drawer

Both map views use one drawer component, `js/drawer.js` (open / close, focus to the title on open and back to the node or list row on close, Esc, the close button, upstream / downstream links, "Not applicable" / "Not yet defined"). Each page passes only its own field renderer: `js/map-drawer.js` (A4 sections: Summary · Status · Owner · Last run · DQ counts · Rules / config used · Upstream / downstream · Links deeper) and `js/blueprint-drawer.js` (Inside · Set up · Access · Connections, with keyboard-navigable tabs and internal component links).

Single-folder deployable: copy the directory behind any static host or open via `python3 -m http.server`.

## Intentional gaps vs PRD

This is a **UI demo**, not a production portal. Notably omitted or mocked:

- No OPS identity / sign-in (ACC-*)
- No real Git, CAB, or IaC integration (other pages contain placeholders / example.ontario.ca). Blueprint deployment statuses are proposed; infrastructure definitions are not yet supplied. Microsoft documentation links describe services, not deployed assets
- No live pipeline or open-lineage ingestion
- English UI chrome only; bilingual titles/descriptions on selected Gold items
- Column-level lineage, drift detection, cost views, AI assistant — out of v1 / Later per PRD
- Role-limited infra detail not simulated (all mock content is visible)

Aligned with locked decisions: **#2** engineers = primary v1 audience (home default); **#5** Releases and gates in v1, read-only, CAB-style links.

## CI example
`ci-example/validate-toolkit.yml` is a GitHub Actions workflow that runs `scripts/validate_toolkit.py`. To turn it on, move it to `.github/workflows/`.
