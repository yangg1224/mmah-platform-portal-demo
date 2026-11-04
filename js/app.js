/* Shared portal behaviour: search, tabs, as-of, lineage interaction */
(function () {
  "use strict";

  function pathPrefix() {
    // pages/* need ../ for assets and catalog hrefs that start with pages/
    var path = window.location.pathname.replace(/\\/g, "/");
    return /\/pages\//.test(path) ? "../" : "";
  }

  function resolveHref(href) {
    var prefix = pathPrefix();
    if (!href) return "#";
    // If we're already under pages/ and href starts with pages/, drop that segment
    if (prefix === "../" && href.indexOf("pages/") === 0) {
      return href.slice("pages/".length);
    }
    // If we're at root and href is a page-relative (no pages/), leave it
    if (prefix === "" && href.indexOf("pages/") !== 0 && href.indexOf("http") !== 0 && href[0] !== "#") {
      // root linking to sibling in pages — catalog already uses pages/
      return href;
    }
    if (prefix === "../" && (href === "index.html" || href === "./" || href === "/")) {
      return "../index.html";
    }
    return prefix + href;
  }

  /* ---- As-of stamp ---- */
  function fillAsOf() {
    document.querySelectorAll("[data-as-of]").forEach(function (el) {
      var label = (window.PORTAL && PORTAL.asOfLabel) || "—";
      var iso = (window.PORTAL && PORTAL.asOf) || "";
      el.innerHTML = 'Metadata as of <time datetime="' + iso + '">' + label + "</time> · mock sample data only";
    });
  }

  /* ---- Global search ---- */
  function initSearch() {
    var input = document.getElementById("global-search");
    var panel = document.getElementById("search-results");
    if (!input || !panel || !window.PORTAL) return;

    var catalog = PORTAL.catalog || [];
    var debounce = null;

    function render(q) {
      var query = (q || "").trim().toLowerCase();
      if (!query) {
        panel.classList.remove("open");
        panel.innerHTML = "";
        panel.hidden = true;
        return;
      }
      var hits = catalog.filter(function (item) {
        var hay = [
          item.name,
          item.nameFr || "",
          item.tech || "",
          (item.keywords || []).join(" "),
          item.type
        ].join(" ").toLowerCase();
        return hay.indexOf(query) !== -1;
      }).slice(0, 12);

      if (!hits.length) {
        panel.innerHTML = '<p class="empty">No matches for “' + escapeHtml(q) + '”.</p>';
      } else {
        var html = "<ul role=\"listbox\">";
        hits.forEach(function (item) {
          var href = resolveHref(item.href);
          var type = PORTAL.typeLabels[item.type] || item.type;
          var mapNode = PORTAL.mapNodeFor && PORTAL.mapNodeFor[item.id];
          html +=
            '<li role="option"><a href="' + href + '">' +
            '<span class="type-tag">' + escapeHtml(type) + "</span>" +
            escapeHtml(item.name) +
            (item.tech ? '<span class="meta">' + escapeHtml(item.tech) + "</span>" : "") +
            "</a>" +
            (mapNode ? '<a class="map-link" href="' + pathPrefix() + "index.html#node=" + mapNode + '">Show on map →</a>' : "") +
            "</li>";
        });
        html += "</ul>";
        panel.innerHTML = html;
      }
      panel.hidden = false;
      panel.classList.add("open");
    }

    input.addEventListener("input", function () {
      clearTimeout(debounce);
      debounce = setTimeout(function () { render(input.value); }, 120);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        panel.classList.remove("open");
        panel.hidden = true;
        input.blur();
      }
    });
    document.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest(".search-results .map-link")) {
        panel.classList.remove("open");
        panel.hidden = true;
        return;
      }
      if (!panel.contains(e.target) && e.target !== input) {
        panel.classList.remove("open");
        panel.hidden = true;
      }
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ---- Tabs ---- */
  function initTabs() {
    document.querySelectorAll("[data-tabs]").forEach(function (root) {
      var buttons = root.querySelectorAll('[role="tab"]');
      var panels = root.querySelectorAll('[role="tabpanel"]');
      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var id = btn.getAttribute("aria-controls");
          buttons.forEach(function (b) {
            b.setAttribute("aria-selected", b === btn ? "true" : "false");
            b.tabIndex = b === btn ? 0 : -1;
          });
          panels.forEach(function (p) {
            p.hidden = p.id !== id;
          });
        });
        btn.addEventListener("keydown", function (e) {
          var keys = { ArrowRight: 1, ArrowLeft: -1 };
          if (!(e.key in keys)) return;
          e.preventDefault();
          var list = Array.prototype.slice.call(buttons);
          var i = list.indexOf(btn);
          var next = list[(i + keys[e.key] + list.length) % list.length];
          next.focus();
          next.click();
        });
      });
    });

    // Deep links into a hidden tab panel (e.g. #dq) open that tab first
    function revealHash() {
      var id = (window.location.hash || "").slice(1);
      var target = id && document.getElementById(id);
      var panel = target && target.closest('[role="tabpanel"]');
      if (!panel || !panel.hidden) return;
      var tab = document.querySelector('[role="tab"][aria-controls="' + panel.id + '"]');
      if (tab) tab.click();
      target.scrollIntoView();
    }
    revealHash();
    window.addEventListener("hashchange", revealHash);
  }

  /* ---- Lineage node selection ---- */
  function initLineage() {
    var detail = document.getElementById("node-detail");
    var nodes = document.querySelectorAll(".node[data-node]");
    if (!detail || !nodes.length) return;

    var details = {
      "mpd-bronze": {
        title: "Municipal quarterly submissions",
        summary: "Raw (as received) quarterly housing-supply submissions from municipalities. Load step only — no transforms yet.",
        tech: "bronze.municipal_planning.raw_submissions",
        status: "Passing",
        statusClass: "status-ok",
        links: [
          { label: "Run history", href: "#runs" },
          { label: "Data contract", href: "rules.html#rule-contract-mpd" }
        ]
      },
      "mpd-clean": {
        title: "Clean / validate (shared service)",
        summary: "Shared cleaning and validation applied to municipal submissions: schema check, code-list conformance, null handling.",
        tech: "svc.clean_validate → edge into silver",
        status: "Warnings: 12",
        statusClass: "status-warn",
        links: [
          { label: "Shared service", href: "shared-services.html#svc-clean" },
          { label: "DQ rule (schema / code-list)", href: "rules.html#rule-schema-mpd" },
          { label: "Open exceptions (12)", href: "data-product-municipal.html#dq" }
        ]
      },
      "mpd-silver": {
        title: "Conformed municipal planning tables",
        summary: "Standardized and conformed tables after municipality-name matching and cleaning. Ready for Gold measures.",
        tech: "silver.municipal_planning.conform_tables",
        status: "Passing",
        statusClass: "status-ok",
        links: [
          { label: "Municipality matching service", href: "shared-services.html#svc-muni-match" },
          { label: "Matching threshold rule", href: "rules.html#rule-match-muni" }
        ]
      },
      "mpd-gold": {
        title: "Municipal Planning Data — published measures",
        summary: "Published (trusted) Gold outputs for municipal planning / O. Reg. 73/23 reporting. Trust card on the product page.",
        tech: "gold.municipal_planning.published_measures",
        status: "Passing",
        statusClass: "status-ok",
        links: [
          { label: "Product page & trust card", href: "data-product-municipal.html" },
          { label: "Business rule: housing starts", href: "rules.html#rule-biz-housing-starts" }
        ]
      },
      "hh-bronze": {
        title: "Aggregated housing / homelessness extracts",
        summary: "Raw aggregated extracts from program systems. No person-level By-Name List data enters this portal path.",
        tech: "bronze.housing_hh.agg_extracts",
        status: "Passing",
        statusClass: "status-ok",
        links: [
          { label: "Personal-field drop service", href: "shared-services.html#svc-pi-drop" }
        ]
      },
      "hh-silver": {
        title: "Standardized housing / homelessness aggregates",
        summary: "Conformed aggregates after cleaning and personal-field drop. Small-cell suppression applied before Gold.",
        tech: "silver.housing_hh.standard_agg",
        status: "Passing",
        statusClass: "status-ok",
        links: [
          { label: "Suppression service", href: "shared-services.html#svc-suppress" }
        ]
      },
      "hh-gold": {
        title: "Housing & Homelessness — published aggregates",
        summary: "Published Gold aggregates (Medium sensitivity or lower). Bilingual titles on the product trust card.",
        tech: "gold.housing_hh.published_agg",
        status: "Passing",
        statusClass: "status-ok",
        links: [
          { label: "Product page & trust card", href: "data-product-housing.html" },
          { label: "Small-cell rule", href: "rules.html#rule-small-cell" }
        ]
      }
    };

    function show(id) {
      var d = details[id];
      if (!d) return;
      nodes.forEach(function (n) {
        n.classList.toggle("selected", n.getAttribute("data-node") === id);
      });
      var links = d.links.map(function (l) {
        return '<a href="' + l.href + '">' + l.label + "</a>";
      }).join(" · ");
      detail.hidden = false;
      detail.innerHTML =
        "<h3>" + escapeHtml(d.title) + "</h3>" +
        "<p>" + escapeHtml(d.summary) + "</p>" +
        '<p class="muted mono">' + escapeHtml(d.tech) + "</p>" +
        '<p><span class="status ' + d.statusClass + '"><span class="icon" aria-hidden="true">' +
        (d.statusClass === "status-warn" ? "⚠" : d.statusClass === "status-ok" ? "✓" : "•") +
        "</span> " + escapeHtml(d.status) + "</span></p>" +
        "<p>" + links + "</p>";
      detail.focus();
    }

    nodes.forEach(function (n) {
      n.addEventListener("click", function () {
        show(n.getAttribute("data-node"));
      });
      n.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          show(n.getAttribute("data-node"));
        }
      });
    });

    // Deep-link from hash
    var hash = (window.location.hash || "").replace(/^#node-/, "");
    if (hash && details[hash]) show(hash);
  }

  /* ---- View toggle (graph / table) ---- */
  function initViewToggle() {
    var graph = document.getElementById("lineage-graph");
    var table = document.getElementById("lineage-table");
    var btnGraph = document.getElementById("view-graph");
    var btnTable = document.getElementById("view-table");
    if (!graph || !table || !btnGraph || !btnTable) return;

    function setView(mode) {
      var isGraph = mode === "graph";
      graph.hidden = !isGraph;
      table.hidden = isGraph;
      btnGraph.setAttribute("aria-pressed", isGraph ? "true" : "false");
      btnTable.setAttribute("aria-pressed", isGraph ? "false" : "true");
    }
    btnGraph.addEventListener("click", function () { setView("graph"); });
    btnTable.addEventListener("click", function () { setView("table"); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    fillAsOf();
    initSearch();
    initTabs();
    initLineage();
    initViewToggle();
  });
})();
