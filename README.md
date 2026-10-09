# MMAH Platform Portal — static demo

Polished **mock** UI for the MMAH Data Platform Portal (working name: Platform Portal). It illustrates the v1 information architecture from `mmah-platform-portal-prd.md`: engineer-first home, two data products with trust cards, Bronze→Silver→Gold lineage swimlanes, platform setup, rules/config, shared services, and a read-only Releases & gates view.

**All data is fictional mock metadata.** There is no live backend, no personal information, and no High Sensitivity / By-Name List content. Sensitivity tags are Public / Low / Medium only. Vocabulary is vendor-neutral (storage zone, pipeline, run, role) — not Fabric/Databricks/Azure product branding.

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

## Demo story — pages to click

1. **Home** (`index.html`) — clickable process map (decision #9): Sources → Landing / Raw (Bronze) → Standardize and conform (Silver, with 4 shared services) → Published / trusted (Gold) → Catalogue / publish. Click a node for its drawer. Product filter, **Platform setup** and **Releases and gates** overlays, **View as list**. Map state is in the URL, e.g. `index.html#node=silver&product=mpd&overlays=setup,releases` (screenshot alias: `index.html?panel=silver&infra=1&release=1`).
1b. **Platform blueprint** (`pages/blueprint.html`, via the `Process map · Platform blueprint` switcher) — the team's toolkit as a process map rendered from a toolkit manifest: columns Sources → Ingest → Store → Process → Serve → Enrich, full-width Governance / Monitoring / Platform bars, Reusable services and Platform Portal side containers. Colour by DAB function / owning unit, phase toggle, list and branch views, "Considered, not on the blueprint". Fabric is shown as *intended per Yang 2026-10-07, not yet ministry-confirmed*. Permalink e.g. `pages/blueprint.html#node=st-silver&colour=function&value=pipe`. Rendered from `config/toolkit.yaml` (see below).
2. **Flows / lineage** (`pages/flows.html`) — visual centerpiece. Municipal Planning path with DQ warning on clean/validate; Housing & HH happy path. Toggle **Table** for the accessible graph equivalent. Click nodes for detail.
3. **Data products** → **Municipal Planning Data** — tabs Overview (trust card EN+FR) · Lineage · Quality (rule results + open DQ exceptions, deep-linkable as `#dq`) · Definitions · Releases.
4. **Releases & gates** — promotion board; Release 0.4 gate checklist with CAB link missing and TRA “Not yet defined”; Release 0.3 complete in Prod.
5. **Platform setup** — Dev / Test / Pre-Prod / Prod side by side; untagged zone on Test; roles by name/purpose; “Defined in: repo/path@commit”.
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
  .github/workflows/validate-toolkit.yml  # Example CI job running both scripts (optional; folder isn't a repo yet)
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
  js/blueprint-drawer.js             # Blueprint drawer fields (TKT-4 order), list / branch views, considered list
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

`config/toolkit.yaml` is the only place to edit blueprint content: tools (id, title, subtitle, column / bar / container, branch boxes, owning unit, phase, status + status source, per-environment status, why-we-use-it, docs, IaC reference, upstream / downstream, home-map node), edges, the context-banner text, the "Considered, not on the blueprint" list and the open questions. The page stays static: a build step turns the YAML into plain JS, so there is no YAML parsing or CDN at runtime. Both scripts need PyYAML (`pip install --user pyyaml`).

```bash
python3 scripts/build_toolkit.py            # regenerate js/toolkit-manifest.generated.js after editing the YAML
python3 scripts/build_toolkit.py --check    # exit 1 if the generated file is stale
python3 scripts/validate_toolkit.py         # exit 1 on any problem (run in CI on every pull request)
```

`validate_toolkit.py` fails when a tool has no branch box, names a box or band that isn't on the Data and Analytics Branch chart (the allowed list is kept in the script, taken from `mmah-dab-current-structure.png` and §3 of the ideal-state toolkit doc), breaks the schema (missing fields, duplicate ids, unknown unit / phase / status / column, dangling upstream / downstream or edge ids), contains anything that looks like an IP range, GUID, connection string or secret (TKT-11), or when the generated JS no longer matches the YAML. `.github/workflows/validate-toolkit.yml` shows the CI job.

## Shared drawer

Both map views use one drawer component, `js/drawer.js` (open / close, focus to the title on open and back to the node or list row on close, Esc, the close button, upstream / downstream links, "Not applicable" / "Not yet defined"). Each page passes only its own field renderer: `js/map-drawer.js` (A4 sections: Summary · Status · Owner · Last run · DQ counts · Rules / config used · Upstream / downstream · Links deeper) and `js/blueprint-drawer.js` (TKT-4: Summary · Why we use it · Status · Owner · Branch box · Phase · Defined in · Linked docs · Upstream / downstream · Links deeper).

Single-folder deployable: copy the directory behind any static host or open via `python3 -m http.server`.

## Intentional gaps vs PRD

This is a **UI demo**, not a production portal. Notably omitted or mocked:

- No OPS identity / sign-in (ACC-*)
- No real Git, CAB, or IaC links (placeholders / example.ontario.ca). Commit hashes, IaC paths and tool statuses in the blueprint manifest are mock values
- No live pipeline or open-lineage ingestion
- English UI chrome only; bilingual titles/descriptions on selected Gold items
- Column-level lineage, drift detection, cost views, AI assistant — out of v1 / Later per PRD
- Role-limited infra detail not simulated (all mock content is visible)

Aligned with locked decisions: **#2** engineers = primary v1 audience (home default); **#5** Releases and gates in v1, read-only, CAB-style links.

## CI example
`ci-example/validate-toolkit.yml` is a GitHub Actions workflow that runs `scripts/validate_toolkit.py`. To turn it on, move it to `.github/workflows/`.
