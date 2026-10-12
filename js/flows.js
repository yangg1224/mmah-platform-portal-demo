/* Flow page (ELT stage bands): node detail, upstream/downstream impact (depth 1-2, expandable)
   and a one-click "Trace to source" link from every Transform item (FLW-4, FLW-5). Mock metadata. */
(function () {
  "use strict";
  var N = {
    "mpd-src":    { t: "Municipal planning portal submissions", s: "extract", up: [], s1: "Quarterly municipal submissions under data contract mpd_ingest_v2." },
    "hh-src":     { t: "Program-system aggregate extracts", s: "extract", up: [], s1: "Aggregated extracts only; no person-level By-Name List data." },
    "mpd-bronze": { t: "Municipal quarterly submissions", s: "load", up: ["mpd-src"], s1: "Raw (as received). 47 / 47 orgs landed." },
    "hh-bronze":  { t: "Aggregated housing / homelessness extracts", s: "load", up: ["hh-src"], s1: "Raw (as received). 12 / 12 regions landed." },
    "mpd-clean":  { t: "Clean / validate (shared service)", s: "transform", up: ["mpd-bronze"], s1: "Schema and code-list checks: 12 warnings open." },
    "mpd-silver": { t: "Conformed municipal planning tables", s: "transform", up: ["mpd-clean"], s1: "After municipality-name matching." },
    "hh-silver":  { t: "Standardized housing / HH aggregates", s: "transform", up: ["hh-bronze"], s1: "After personal-field drop and cleaning." },
    "mpd-gold":   { t: "Municipal Planning Data — published measures", s: "transform", up: ["mpd-silver"], s1: "Published (trusted) Gold measures." },
    "hh-gold":    { t: "Housing & Homelessness — published aggregates", s: "transform", up: ["hh-silver"], s1: "Gold aggregates after small-cell suppression." },
    "mpd-cat":    { t: "Catalogue: Municipal Planning Data", s: "transform", up: ["mpd-gold"], s1: "Catalogue entry and trust card.", href: "data-product-municipal.html" },
    "hh-cat":     { t: "Catalogue: Housing & Homelessness", s: "transform", up: ["hh-gold"], s1: "Catalogue entry and trust card.", href: "data-product-housing.html" }
  };
  function down(id) { return Object.keys(N).filter(function (k) { return N[k].up.indexOf(id) >= 0; }); }
  function walk(id, f, depth) { var out = [], cur = [id]; for (var d = 0; d < depth; d++) { var nx = []; cur.forEach(function (c) { f(c).forEach(function (x) { if (out.indexOf(x) < 0) { out.push(x); nx.push(x); } }); }); cur = nx; } return out; }
  function source(id) { var c = id; while (N[c] && N[c].up.length) c = N[c].up[0]; return c; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function link(id) { return '<a href="#node-' + id + '">' + esc(N[id].t) + "</a>"; }

  document.addEventListener("DOMContentLoaded", function () {
    var panel = document.getElementById("flow-detail");
    var nodes = document.querySelectorAll(".stage-band .node[data-node]");
    if (!panel) return;
    var depth = 2, current = null;
    function show(id, focus) {
      if (!N[id]) return;
      current = id;
      var ups = walk(id, function (k) { return N[k].up; }, depth), dns = walk(id, down, depth);
      nodes.forEach(function (n) {
        var k = n.getAttribute("data-node");
        n.classList.toggle("selected", k === id);
        n.classList.toggle("upstream", ups.indexOf(k) >= 0);
        n.classList.toggle("downstream", dns.indexOf(k) >= 0);
      });
      var d = N[id], src = source(id), html = "<h3>" + esc(d.t) + "</h3><p>" + esc(d.s1) + "</p>";
      html += "<p>Stage: " + d.s.charAt(0).toUpperCase() + d.s.slice(1) + "</p>";
      if (src !== id) html += '<p><a class="trace-source" href="#node-' + src + '">Trace to source: ' + esc(N[src].t) + " →</a></p>";
      html += "<p>Upstream (depth " + depth + "): " + (ups.map(link).join(" · ") || "none") + "</p>";
      html += "<p>Downstream (depth " + depth + "): " + (dns.map(link).join(" · ") || "none") + "</p>";
      html += '<p><button type="button" class="view-toggle" id="flow-depth">' + (depth === 2 ? "Show full lineage" : "Show depth 2") + "</button>";
      if (d.href) html += ' · <a href="' + d.href + '">Product page &amp; trust card</a>';
      html += ' · <a href="#runs">Run history</a></p>';
      panel.hidden = false;
      panel.innerHTML = html;
      document.getElementById("flow-depth").addEventListener("click", function () { depth = depth === 2 ? 9 : 2; show(current, false); document.getElementById("flow-depth").focus(); });
      if (focus !== false) panel.focus();
    }
    nodes.forEach(function (n) { n.addEventListener("click", function () { show(n.getAttribute("data-node")); }); });
    function fromHash() { var h = (location.hash || "").replace(/^#node-/, ""); if (N[h]) { show(h); var el = document.getElementById("node-" + h); if (el) el.scrollIntoView({ block: "nearest" }); } }
    window.addEventListener("hashchange", fromHash);
    fromHash();
  });
})();
