"""Browser regression checks for the restored Platform blueprint (PRD §6.6 TKT-1..14), the home map
(MAP-11 / sample statuses) and the IaC guide page. Requires Playwright + Chromium; starts its own server.

    python3 scripts/smoke_blueprint.py [--site-dir dist] [--screenshots DIR]
The detailed IaC guide walkthrough checks live in scripts/smoke_iac_guide.py.
"""
import argparse
import functools
import re
import shutil
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
PRODUCTS = re.compile(r"\b(azure|fabric|entra|purview|databricks|onelake|power ?bi|key vault|log analytics|"
                      r"ontario data catalogue|private endpoints?|synapse)\b", re.I)
IPISH = re.compile(r"\b\d{1,3}(\.\d{1,3}){3}\b|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}", re.I)


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


def smoke(base, shots):
    errors, results = [], []

    def ok(cond, msg):
        results.append((bool(cond), msg))
        print(("PASS: " if cond else "FAIL: ") + msg, flush=True)

    with sync_playwright() as p:
        exe = shutil.which("chromium") or shutil.which("google-chrome")
        browser = p.chromium.launch(**({"executable_path": exe} if exe else {}))
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("console", lambda m: errors.append("console " + m.type + ": " + m.text) if m.type in ("error", "warning") else None)
        page.on("response", lambda r: errors.append(f"HTTP {r.status}: {r.url}") if r.status >= 400 else None)

        # Home map: MAP-11 and the sample-status rule.
        page.goto(base + "/index.html#overlays=setup,releases", wait_until="networkidle")
        ok(not PRODUCTS.search(page.inner_text("body")), "MAP-11 home map + overlays show no product names")
        sts = page.eval_on_selector_all('[data-node^="lane-"] .map-status', "els=>els.map(e=>e.innerText.replace(/\\s+/g,' '))")
        ok(sts and all("Sample:" in s for s in sts), "Releases lane statuses all carry 'Sample:' " + str(sts))
        ok("SAMPLE STATUSES, NOT REAL INFRASTRUCTURE" in page.inner_text("#map-canvas").upper(), "Releases overlay label says sample statuses")
        for nid in page.eval_on_selector_all(".map-node", "els=>els.map(e=>e.dataset.node)"):
            page.goto(base + "/index.html#overlays=setup,releases&node=" + nid, wait_until="networkidle")
            page.reload(wait_until="networkidle")
            t = page.inner_text("#map-drawer")
            if PRODUCTS.search(t):
                ok(False, f"MAP-11 drawer {nid} names a product: {PRODUCTS.search(t).group(0)}")
        ok(True, "Home drawers opened")
        if shots:
            page.goto(base + "/index.html#overlays=releases", wait_until="networkidle")
            page.screenshot(path=str(shots / "home-releases.png"))

        # Blueprint layout (TKT-1).
        page.goto(base + "/pages/blueprint.html", wait_until="networkidle")
        caps = page.eval_on_selector_all(".bp-col .map-container-cap", "els=>els.map(e=>e.textContent)")
        ok([c.split("·")[-1].strip() for c in caps] == ["Sources", "Ingest", "Store", "Process", "Serve", "Enrich"], "TKT-1 columns " + str(caps))
        geo = page.evaluate("""(()=>{const r=e=>e.getBoundingClientRect();
          const cols=[...document.querySelectorAll('.bp-col')].map(r), bars=[...document.querySelectorAll('.bp-bar')].map(r);
          const cv=r(document.getElementById('bp-canvas'));
          return {colBottom:Math.max(...cols.map(b=>b.bottom)), barTops:bars.map(b=>b.top), barW:bars.map(b=>b.width),
                  colSpan:Math.max(...cols.map(b=>b.right))-Math.min(...cols.map(b=>b.left)), n:bars.length,
                  barText:[...document.querySelectorAll('.bp-bar .map-container-cap')].map(e=>e.innerText)}})()""")
        ok(geo["n"] == 3 and all(t >= geo["colBottom"] for t in geo["barTops"]) and all(w >= geo["colSpan"] - 2 for w in geo["barW"]),
           f"TKT-1 three full-width bars under the columns {geo}")
        sides = page.eval_on_selector_all(".bp-side .map-container-cap", "els=>els.map(e=>e.textContent)")
        ok(sides == ["Reusable services", "Platform Portal"], "TKT-1 side containers " + str(sides))
        store = page.inner_text("#bp-canvas")
        ok(all(w in store for w in ("Bronze", "Silver", "Gold")) and page.locator("#bp-node-st-ref").count() == 1, "TKT-1 Store lakehouses + reference table")

        nodes = page.locator("#bp-canvas .bp-node")
        n = nodes.count()
        badges = page.evaluate("""[...document.querySelectorAll('#bp-canvas .bp-node')].map(e=>({chip:!!e.querySelector('.bp-chip')&&e.querySelector('.bp-chip').innerText.trim().length>0,
            phase:!!e.querySelector('.badge-phase'), status:/(Planned|Provisioned|Live)/.test(e.innerText)}))""")
        ok(n >= 40 and all(b["chip"] and b["phase"] and b["status"] for b in badges), f"TKT-5/6/7 every node ({n}) has unit chip, phase badge and status badge")
        ok(page.locator('[data-phase="v1"]').inner_text().strip() == "v1", "TKT-6 phase toggle reads v1 · Next · Future")
        page.locator('[data-colour="unit"]').click()
        vals = page.eval_on_selector_all("#bp-values button", "els=>els.map(e=>e.innerText.trim())")
        ok(all(v in " ".join(vals) for v in ("BIRU", "SDGU-G", "SDGU-E", "DPU", "CLUSTER?")), "TKT-5 owning-unit values " + str(vals))
        ok(page.locator("#bp-legend-colour").is_visible(), "TKT-5 legend updates with the colour toggle")
        page.locator('[data-colour="none"]').click()
        banner = page.inner_text("#bp-banner")
        ok("Intended platform: Microsoft Fabric" in banner and page.locator("#bp-banner a[href='#open-questions']").count() == 1, "TKT-9 banner")
        ok("Sample statuses, not real infrastructure" in page.inner_text(".map-legend"), "Sample-status note in legend")
        ok(page.locator(".map-legend .lg-gate").count() == 1, "TKT-13 legend has MAP-4 edge types incl. gate")
        ok(page.locator("a[href='iac-guide.html']").count() >= 1, "IaC guide link on blueprint")

        # Drawer (TKT-4 order, TKT-7 per-env sample status, TKT-14 back link).
        page.locator("#bp-node-st-silver").click()
        heads = page.eval_on_selector_all("#map-drawer .drawer-body h3, #map-drawer .drawer-body .drawer-h", "els=>els.map(e=>e.innerText.trim().toUpperCase())")
        want = ["SUMMARY", "WHY WE USE IT", "STATUS", "OWNER", "BRANCH BOX", "PHASE", "DEFINED IN", "LINKED DOCS", "UPSTREAM / DOWNSTREAM", "LINKS DEEPER"]
        ok([h for h in heads if h in want] == want, "TKT-4 drawer order " + str(heads))
        dt = page.inner_text("#map-drawer")
        ok("as of" in dt and dt.count("(sample)") >= 5 and "Sample statuses, not real infrastructure" in dt, "TKT-7 per-environment sample status with as-of")
        ok(page.locator("#map-drawer a[href*='index.html#node=']").count() >= 1, "TKT-14 blueprint node links back to the home map")
        if shots:
            page.screenshot(path=str(shots / "blueprint-panel.png"))
        page.keyboard.press("Escape")

        # TKT-3 branch-box filter + TKT-8 branch view + TKT-10 list view.
        page.goto(base + "/pages/blueprint.html#box=ingest", wait_until="networkidle")
        ok(page.locator("#bp-canvas .bp-node.is-traced").count() > 0, "TKT-3 branch-box permalink filters the map")
        page.goto(base + "/pages/blueprint.html#view=branch", wait_until="networkidle")
        ok(page.locator("#bp-list").is_visible() and "BIRU" in page.inner_text("#bp-list"), "TKT-8 branch view")
        page.goto(base + "/pages/blueprint.html#view=list", wait_until="networkidle")
        rows = page.locator("#bp-list [data-list-node]")
        lt = page.inner_text("#bp-list")
        ok(rows.count() == n and all(w in lt for w in ("Planned", "v1")), f"TKT-10 list has all {rows.count()} nodes with status and phase")
        order = page.eval_on_selector_all("#bp-list h3.bp-list-h", "els=>els.map(e=>e.textContent)")
        ok(order[:1] and "Sources" in order[0] and any("Governance" in o for o in order[-3:]), "TKT-10 list order columns → containers → bars " + str(order))
        ok(not IPISH.search(page.content()), "TKT-11 no IPs / GUID-like identifiers on the blueprint")

        # TKT-14: home SVC / ENV / IAM / OPS drawers link to blueprint nodes.
        for nid in ("svc-clean", "env", "iam", "ops"):
            page.goto(base + "/index.html#overlays=setup&node=" + nid, wait_until="networkidle")
            page.reload(wait_until="networkidle")
            ok(page.locator("#map-drawer a[href*='blueprint.html#node=']").count() >= 1, f"TKT-14 home {nid} links to a blueprint node")

        # IaC guide page.
        page.goto(base + "/pages/iac-guide.html", wait_until="networkidle")
        ok(page.locator("h1").inner_text().startswith("Infrastructure-as-code guide") and page.locator(".section-card").count() == 3
           and page.locator("a[href='blueprint.html']").count() >= 1 and page.locator("#global-search").count() == 1,
           "IaC guide loads with its guides, nav, search and a link back to the blueprint")
        txt = page.inner_text("body")
        ok(not IPISH.search(page.content()) and not re.search(r"\bLive\b", txt), "IaC guide: no IPs/IDs and no 'Live' status claims")

        for path in sorted((ROOT / "pages").glob("*.html")):
            r = page.goto(base + "/pages/" + path.name, wait_until="networkidle")
            ok(r.status == 200 and page.locator("h1").count() == 1, "page loads: " + path.name)
            for href in page.eval_on_selector_all("a[href]", "els=>els.map(e=>e.getAttribute('href'))"):
                if href.startswith(("http", "#", "mailto")) or "://" in href:
                    continue
                target = (ROOT / "pages" / href.split("#")[0]).resolve() if href.split("#")[0] else path
                if not target.exists():
                    ok(False, f"broken link in {path.name}: {href}")
        ok(not errors, "no console errors / failed requests " + str(errors[:5]))
        browser.close()
    return results


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--site-dir", type=Path, default=ROOT)
    ap.add_argument("--screenshots", type=Path)
    a = ap.parse_args()
    if a.screenshots:
        a.screenshots.mkdir(parents=True, exist_ok=True)
    srv = ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(QuietHandler, directory=str(a.site_dir.resolve())))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    try:
        res = smoke(f"http://127.0.0.1:{srv.server_port}", a.screenshots)
    finally:
        srv.shutdown()
    failed = [m for good, m in res if not good]
    print(f"\n{len(res) - len(failed)} passed, {len(failed)} failed")
    raise SystemExit(1 if failed else 0)
