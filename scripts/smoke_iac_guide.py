"""Browser regression checks. Requires Playwright and Chromium; starts its own local server.

    python3 scripts/smoke_iac_guide.py --screenshots /tmp/blueprint-review
"""
import argparse
import functools
import json
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import shutil
import threading

from playwright.sync_api import expect, sync_playwright

ROOT = Path(__file__).resolve().parent.parent


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


def smoke(base, screenshot_dir):
    checks, errors = [], []

    def passed(message):
        checks.append(message)
        print("PASS:", message, flush=True)

    with sync_playwright() as playwright:
        executable = shutil.which("chromium") or shutil.which("google-chrome")
        browser = playwright.chromium.launch(**({"executable_path": executable} if executable else {}))
        page = browser.new_page(viewport={"width": 1600, "height": 1160})
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.on("requestfailed", lambda request: errors.append(request.url + ": " + str(request.failure)))
        page.on("response", lambda response: errors.append(f"HTTP {response.status}: {response.url}") if response.status >= 400 else None)
        page.goto(base + "/pages/iac-guide.html", wait_until="networkidle")
        expect(page.locator(".section-card")).to_have_count(3)
        expect(page.locator("#bp-resource-view")).to_be_hidden()
        expect(page.locator("#bp-journey")).to_have_attribute("data-journey", "iac")
        expect(page.locator('[data-step-direction="-1"]')).to_be_disabled()
        expect(page.locator(".journey-node")).to_have_count(5)
        pulse = page.locator(".journey-pulse").first
        offset = pulse.evaluate("el=>getComputedStyle(el).strokeDashoffset")
        page.wait_for_function("old=>getComputedStyle(document.querySelector('.journey-pulse')).strokeDashoffset!==old", arg=offset)
        page.locator("#journey-play").click()
        assert pulse.evaluate("el=>getComputedStyle(el).animationPlayState") == "paused"
        page.locator('[data-step-direction="1"]').click()
        expect(page.locator("#journey-guide-title")).to_have_text("Codify the platform")
        expect(page.locator("#journey-step-codify")).to_be_focused()
        expect(page.locator("#journey-play")).to_have_text("Play flow")
        page.locator("#journey-play").click()

        journeys = page.evaluate("PORTAL.toolkit.architecture.journeys")
        for journey in journeys:
            page.locator('.section-card[data-section="' + journey["id"] + '"]').click()
            expect(page.locator(".journey-line[marker-end]")).to_have_count(4)
            expect(page.locator(".journey-return[marker-end]")).to_have_count(1)
            for step in journey["steps"]:
                page.locator('[data-journey-step="' + step["id"] + '"]').click()
                expect(page.locator("#journey-guide-title")).to_have_text(step["title"])
                expect(page.locator(".guide-actions li")).to_have_count(len(step["actions"]))
                expect(page.locator(".guide-gate")).to_contain_text(step["gate"])
                expect(page.locator(".journey-resource")).to_have_count(len(step["resources"]))
            expect(page.locator('[data-step-direction="1"]')).to_be_disabled()
            page.locator("#journey-exception").click()
            expect(page.locator("#journey-exception-detail")).to_contain_text(journey["exception"]["detail"])
            page.locator("#journey-exception").click()
            expect(page.locator("#journey-exception-detail")).to_be_hidden()
            page.locator("#guide-tab-setup").focus()
            page.keyboard.press("ArrowRight")
            expect(page.locator("#guide-tab-access")).to_be_focused()
            expect(page.locator("#guide-panel-access")).to_contain_text(journey["steps"][-1]["access"][0])
            page.keyboard.press("Home")
            expect(page.locator("#guide-tab-setup")).to_be_focused()
            page.locator('[data-journey-step="' + journey["steps"][1]["id"] + '"]').click()
            if screenshot_dir:
                page.screenshot(path=str(screenshot_dir / (journey["id"] + ".png")), full_page=True)
        passed("Three visual guides, all 15 steps, input/action/output gates, exception paths, animation and keyboard access tabs")

        page.locator('[data-journey-step="silver"]').click()
        page.locator('[data-journey-resource="st-silver"]').click()
        page.get_by_role("tab", name="Set up", exact=True).click()
        expect(page.locator(".setup-steps")).to_be_visible()
        page.keyboard.press("Escape")
        expect(page.locator('[data-journey-resource="st-silver"]')).to_be_focused()
        page.reload(wait_until="networkidle")
        expect(page.locator("#journey-guide-title")).to_have_text("Silver")
        expect(page.locator('.section-card[data-section="medallion"]')).to_have_attribute("aria-pressed", "true")
        page.locator('[data-journey-resource="p-spark"]').click()
        page.reload(wait_until="networkidle")
        expect(page.locator("#drawer-title")).to_have_text("Spark notebooks")
        expect(page.locator("#journey-guide-title")).to_have_text("Silver")
        page.keyboard.press("Escape")
        page.goto(base + "/pages/iac-guide.html#section=unknown&step=missing", wait_until="networkidle")
        expect(page.locator("#journey-guide-title")).to_have_text("Define environments")
        page.emulate_media(reduced_motion="reduce")
        expect(page.locator("#journey-play")).to_be_disabled()
        assert page.locator(".journey-pulse").first.evaluate("el=>getComputedStyle(el).animationName") == "none"
        page.emulate_media(reduced_motion="no-preference")
        page.set_viewport_size({"width": 390, "height": 844})
        page.locator('[data-section="medallion"]').click()
        assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
        assert page.locator("#journey-scroll").evaluate("el=>el.scrollWidth>el.clientWidth")
        page.locator('[data-journey-step="serve"]').click()
        expect(page.locator("#journey-guide-title")).to_have_text("Power BI")
        assert page.locator("#journey-scroll").evaluate("el=>el.scrollLeft>0")
        page.locator('[data-journey-resource="sv-pbi"]').click()
        expect(page.locator("#drawer-title")).to_have_text("Power BI reports & apps")
        page.keyboard.press("Escape")
        expect(page.locator('[data-journey-resource="sv-pbi"]')).to_be_focused()
        if screenshot_dir:
            page.evaluate("window.scrollTo(0, 0)")
            page.screenshot(path=str(screenshot_dir / "journey-mobile.png"), full_page=True)
        passed("Step and resource permalinks, invalid-link fallback, inspector focus, mobile scroll and reduced motion")
        page.set_viewport_size({"width": 1600, "height": 1160})
        page.locator('[data-section="resources"]').click()
        expect(page.locator("#bp-journey")).to_be_hidden()
        expect(page.locator("#bp-resource-view")).to_be_visible()
        nodes = page.evaluate("PORTAL.toolkit.nodes.length")
        overview = page.evaluate("PORTAL.toolkit.architecture.diagram.nodes.length")
        expect(page.locator("#bp-canvas [data-node]")).to_have_count(overview)
        expect(page.locator('[data-boundary="azure"]')).to_be_visible()
        expect(page.locator('[data-boundary="fabric"]')).to_be_visible()
        assert page.evaluate("""() => {
          const box=id=>document.querySelector('[data-boundary="'+id+'"]').getBoundingClientRect();
          const node=id=>document.getElementById('bp-node-'+id).getBoundingClientRect();
          const inside=(a,b)=>a.x>=b.x&&a.y>=b.y&&a.right<=b.right&&a.bottom<=b.bottom;
          return inside(node('st-bronze'),box('st-adls')) && inside(box('st-adls'),box('azure')) &&
            inside(node('pl-network'),box('pl-vnet')) && inside(node('st-silver'),box('pl-workspaces')) &&
            !inside(box('fabric'),box('azure'));
        }""")
        data_edges = page.locator(".bp-connection").count()
        assert data_edges > 5
        assert page.locator('.wire-base[marker-end]').count() == data_edges
        # The resource map stays paused after a reduced-motion preference is removed.
        # Resume explicitly before checking animation, as a user would.
        if page.locator("#bp-play").get_attribute("aria-pressed") == "false":
            page.locator("#bp-play").click()
        offset = page.locator(".flow-pulse").first.evaluate("el=>getComputedStyle(el).strokeDashoffset")
        page.wait_for_function("old=>getComputedStyle(document.querySelector('.flow-pulse')).strokeDashoffset!==old", arg=offset)
        page.locator("#bp-play").click()
        expect(page.locator("#bp-world")).to_have_class("bp-world is-paused")
        assert page.locator(".flow-pulse").first.evaluate("el=>getComputedStyle(el).animationPlayState") == "paused"
        page.locator("#bp-play").click()
        passed("Subscription and service nesting, directed arrows, animated flow and pause control")

        page.locator('[data-connection-mode="access"]').click()
        assert page.locator(".connection-access").count() >= 7
        assert page.locator(".bp-connection:not(.connection-access)").count() == 0
        page.locator('[data-connection-mode="all"]').click()
        assert page.locator(".bp-connection").count() > data_edges
        page.locator('[data-connection-mode="data"]').click()
        page.locator("#bp-node-st-adls").hover()
        assert page.locator(".bp-connection.is-active").count() >= 2
        passed("Data / access / all connection views and parent-service connection tracing")

        page.locator("#bp-node-st-adls").click()
        expect(page.locator("#drawer-title")).to_have_text("Azure Data Lake Storage Gen2")
        expect(page.locator("#inspector-panel-overview .inside-item")).to_have_count(2)
        page.get_by_role("tab", name="Set up", exact=True).click()
        assert page.locator(".setup-steps li").count() >= 3
        expect(page.locator("#inspector-panel-setup")).to_contain_text("hierarchical namespace")
        if screenshot_dir:
            page.screenshot(path=str(screenshot_dir / "setup.png"))
        page.get_by_role("tab", name="Access", exact=True).click()
        expect(page.locator("#inspector-panel-access")).to_contain_text("Storage Blob Data Contributor")
        page.keyboard.press("ArrowRight")
        expect(page.get_by_role("tab", name="Connections", exact=True)).to_be_focused()
        expect(page.locator("#inspector-panel-connections")).to_contain_text("Azure Data Factory")
        expect(page.locator("#inspector-panel-connections")).to_contain_text("ADLS Bronze shortcut")
        page.get_by_role("tab", name="Inside", exact=True).click()
        page.locator('#inspector-panel-overview [data-goto="st-quarantine"]').click()
        page.get_by_role("tab", name="Access", exact=True).click()
        expect(page.locator("#inspector-panel-access")).to_contain_text("no quarantine access")
        page.keyboard.press("Escape")
        expect(page.locator("#map-drawer")).to_be_hidden()
        expect(page.locator("#bp-node-st-quarantine")).to_be_focused()
        passed("Component interiors, setup instructions, scoped access, aggregate connections and keyboard tabs")

        edge = page.locator('.bp-connection[data-from="i-adf"][data-to="st-bronze"]')
        edge.focus()
        page.keyboard.press("Enter")
        expect(page.locator("#drawer-title")).to_have_text("Azure Data Factory")
        expect(page.get_by_role("tab", name="Connections", exact=True)).to_have_attribute("aria-selected", "true")
        page.keyboard.press("Escape")
        expect(edge).to_be_focused()
        original_zoom = page.locator("#bp-zoom-label").inner_text()
        page.locator('[data-zoom="in"]').click()
        assert page.locator("#bp-zoom-label").inner_text() != original_zoom
        viewport = page.locator("#bp-scroll").bounding_box()
        page.mouse.move(viewport["x"] + 450, viewport["y"] + 8)
        page.mouse.down()
        page.mouse.move(viewport["x"] + 150, viewport["y"] + 8, steps=5)
        page.mouse.up()
        assert page.locator("#bp-scroll").evaluate("el=>el.scrollLeft") > 0
        page.locator('[data-zoom="fit"]').click()
        expect(page.locator("#bp-zoom-label")).to_have_text(original_zoom)
        passed("Keyboard-activated connections, zoom, fit and drag-to-pan")

        page.locator(".bp-options summary").click()
        page.locator('[data-colour="unit"]').click()
        page.locator('[data-value="BIRU"]').click()
        page.locator("#bp-view-list").click()
        expect(page.locator("#bp-list [data-list-node]")).to_have_count(nodes)
        page.locator('#bp-list [data-list-node="st-shortcut"]').click()
        expect(page.locator("#drawer-title")).to_have_text("ADLS Bronze shortcut")
        page.keyboard.press("Escape")
        page.locator("#bp-view-branch").click()
        assert page.locator("#bp-list [data-list-node]").count() > nodes
        page.goto(base + "/pages/iac-guide.html#node=st-ref&colour=unit&value=SDGU-G&phases=", wait_until="networkidle")
        expect(page.locator("#drawer-title")).to_have_text("Reference & master tables")
        assert not any(page.evaluate("PORTAL.blueprint.state.phases").values())
        page.keyboard.press("Escape")
        passed("Complete resource list, branch view and deep links to components inside services")

        page.emulate_media(reduced_motion="reduce")
        page.goto(base + "/pages/iac-guide.html#section=resources", wait_until="networkidle")
        expect(page.locator("#bp-play")).to_be_disabled()
        assert page.locator(".flow-pulse").first.evaluate("el=>getComputedStyle(el).animationName") == "none"
        page.emulate_media(reduced_motion="no-preference")
        if screenshot_dir:
            page.screenshot(path=str(screenshot_dir / "architecture.png"), full_page=True)
            page.locator('[data-connection-mode="access"]').click()
            page.screenshot(path=str(screenshot_dir / "access-network.png"), full_page=True)
        page.set_viewport_size({"width": 390, "height": 844})
        page.goto(base + "/pages/iac-guide.html#section=resources", wait_until="networkidle")
        assert page.evaluate("document.documentElement.scrollWidth <= innerWidth")
        assert page.locator("#bp-scroll").evaluate("el=>el.scrollWidth>el.clientWidth")
        page.locator("#bp-node-sv-pbi").click()
        page.get_by_role("tab", name="Access", exact=True).click()
        expect(page.locator("#inspector-panel-access")).to_contain_text("App audience")
        if screenshot_dir:
            page.screenshot(path=str(screenshot_dir / "mobile.png"))
        page.keyboard.press("Escape")
        expect(page.locator("#map-drawer")).to_be_hidden()
        passed("Reduced-motion preference, mobile canvas scrolling and mobile permissions inspector")

        page.set_viewport_size({"width": 1440, "height": 1000})
        page.goto(base + "/", wait_until="networkidle")
        page.locator("#map-node-silver").click()
        expect(page.locator("#drawer-title")).to_contain_text("Standardize")
        page.keyboard.press("Escape")
        page.locator("#global-search").fill("Key Vault")
        expect(page.locator("#search-results")).to_contain_text("Infrastructure-as-code guide")
        for path in sorted((ROOT / "pages").glob("*.html")):
            response = page.goto(base + "/pages/" + path.name, wait_until="networkidle")
            assert response.status == 200
            assert page.locator("h1").count() == 1
        assert not errors, errors
        passed("Home navigation and all content pages render without script or request failures")
        browser.close()
    return {"checks": checks, "errors": errors}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--screenshots", type=Path)
    parser.add_argument("--site-dir", type=Path, default=ROOT, help="Serve the source tree or a built static site directory")
    args = parser.parse_args()
    if args.screenshots:
        args.screenshots.mkdir(parents=True, exist_ok=True)
    server = ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(QuietHandler, directory=str(args.site_dir.resolve())))
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        print(json.dumps(smoke(f"http://127.0.0.1:{server.server_port}", args.screenshots), indent=2))
    finally:
        server.shutdown()
        server.server_close()
        thread.join()
