/* Home process map: drawer field renderer (A4 drawer spec, MAP-3, NAV-3) and list alternative
   (MAP-9, FLW-4). The drawer shell (open / close, focus, Esc, goto links) is the shared component in
   js/drawer.js, also used by the Platform blueprint. Every node type uses the same 8 sections in the
   same order. Read-only: no actions. */
(function () {
  "use strict";
  var UI = window.PORTAL && PORTAL.mapUI, D = window.PORTAL && PORTAL.drawer;
  if (!UI || !D) return;
  var M = PORTAL.map, esc = UI.esc, link = D.link, section = D.section, value = D.value;
  var NOT_APPLICABLE = D.NOT_APPLICABLE;
  var EDGE_NAMES = M.edgeTypes;
  var CHECK = { pass: ["ok", "✓", "Pass"], fail: ["fail", "✕", "Missing · blocking"], tbd: ["neutral", "○", "Not yet defined"] };

  function relations(n) {
    var up = [], down = [];
    UI.edgesOf(n.id).forEach(function (e) {
      var otherId = e.from === n.id ? e.to : e.from, other = UI.byId[otherId];
      var how = (e.label ? e.label + " · " : "") + EDGE_NAMES[e.type].toLowerCase();
      var item = { id: otherId, title: other.title, how: how };
      if (e.type === "return") { if (e.from === n.id && n.kind !== "svc" && other.kind !== "svc") down.push(item); return; }
      (e.to === n.id ? up : down).push(item);
    });
    (n.appliesTo || []).forEach(function (id) { down.push({ id: id, title: UI.byId[id].title, how: "applies to" }); });
    return { up: up, down: down };
  }
  function relList(items, arrow) {
    return items.map(function (r) {
      return '<li><button type="button" class="drawer-goto" data-goto="' + r.id + '">' + arrow + " " + esc(r.title) + '</button> <span class="drawer-how">' + esc(r.how) + "</span></li>";
    }).join("");
  }

  function content(n) {
    var s = UI.statusFor(n);
    var html = D.head(n.tag, esc(UI.typeName(n.tag)) + (n.step ? " · step " + esc(n.step) : ""), n.title, n.subtitle);

    html += section("Summary", "<p>" + esc(n.summary) + "</p>");
    html += section("Status", "<p>" + UI.statusHtml(s) + ' <span class="drawer-asof">as of ' + esc(M.asOf) + "</span></p>" +
      (n.statusNote ? '<p class="drawer-note">' + esc(n.statusNote) + "</p>" : ""));
    html += section("Owner", "<p>" + esc(n.owner) + "</p>" + (n.steward ? '<p class="drawer-note">Steward: ' + esc(n.steward) + "</p>" : ""));
    html += section("Last run", value(n.lastRun, function (runs) {
      return '<ul class="drawer-list">' + runs.map(function (r) {
        return "<li><strong>" + esc(r.flow) + "</strong> " + UI.statusHtml(r.result) + '<br><span class="drawer-note">' + esc(r.start) + " → " + esc(r.end) + " · " + esc(r.rows) + "</span></li>";
      }).join("") + '</ul><p><a href="pages/flows.html#runs">Run history</a></p>';
    }));
    html += section("DQ counts", value(n.dq, function (d) {
      return '<ul class="drawer-counts">' +
        '<li><span class="status status-ok"><span class="icon" aria-hidden="true">✓</span> Passing</span> ' + d.pass + " rules</li>" +
        '<li><span class="status status-warn"><span class="icon" aria-hidden="true">⚠</span> Warning</span> ' + d.warn + " rules</li>" +
        '<li><span class="status ' + (d.fail ? "status-fail" : "status-neutral") + '"><span class="icon" aria-hidden="true">✕</span> Failing</span> ' + d.fail + " rules</li>" +
        "<li>Open exceptions: <strong>" + d.open + "</strong></li></ul>" +
        (d.note ? '<p class="drawer-note">' + esc(d.note) + "</p>" : "") + '<p class="drawer-note">Counts only; small-cell suppression applied.</p>';
    }));

    var rules = "";
    if (n.checklist) {
      rules += '<h4 class="drawer-h4">Gate checklist</h4><ul class="drawer-list">' + n.checklist.map(function (c) {
        var k = CHECK[c.state];
        return '<li><span class="status status-' + k[0] + '"><span class="icon" aria-hidden="true">' + k[1] + "</span> " + k[2] + "</span> <strong>" + esc(c.item) + '</strong><br><span class="drawer-note">' + esc(c.note) + "</span></li>";
      }).join("") + "</ul>";
    }
    rules += value(n.rules, function (list) {
      return '<ul class="drawer-list">' + list.map(function (r) {
        if (r.path === "tbd") return "<li><strong>" + esc(r.label) + '</strong><br><span class="drawer-note">Defined in: ○ Not yet defined</span></li>';
        return "<li><strong>" + (r.href ? link({ label: r.label, href: r.href }) : esc(r.label)) + "</strong>" +
          '<br><span class="drawer-note">Defined in: <code class="defined-in">' + esc(r.path) + "</code></span>" +
          '<br><span class="drawer-note">Version: ' + esc(r.version || "Not yet defined") + " · Approver: " + esc(r.approver === "tbd" ? "Not yet defined" : r.approver) + "</span></li>";
      }).join("") + "</ul>";
    });
    html += section("Rules / config used", rules);

    var rel = relations(n);
    html += section("Upstream / downstream", rel.up.length || rel.down.length
      ? '<ul class="drawer-rel">' + relList(rel.up, "←") + relList(rel.down, "→") + "</ul>"
      : NOT_APPLICABLE);
    html += section("Links deeper", D.links(n.links));
    return html;
  }

  var drawer = D.create({
    has: function (id) { return !!UI.byId[id]; },
    render: function (id) { return content(UI.byId[id]); },
    beforeOpen: function (id) { UI.ensureVisible(id); },
    select: function (id) { UI.state.node = id; UI.updateSelection(); UI.writeHash(); },
    deselect: function () { UI.state.node = null; UI.updateSelection(); UI.writeHash(); },
    nodeEl: function (id) { return UI.state.view === "map" ? document.getElementById("map-node-" + id) : null; },
    focusTarget: function (id) { return document.getElementById((UI.state.view === "list" ? "list-node-" : "map-node-") + id); }
  });
  UI.openDrawer = function (id, from) { if (drawer) drawer.open(id, from); };
  UI.closeDrawer = function (silent) { if (drawer) drawer.close(silent); };

  /* ---- List alternative: same nodes, edges, statuses; each row opens the same drawer ---- */
  UI.renderList = function () {
    var root = document.getElementById("map-list");
    if (!root) return;
    var items = M.nodes.filter(UI.visible).map(function (n) {
      var rel = relations(n), conn = rel.up.map(function (r) { return "from " + r.title + " (" + r.how + ")"; })
        .concat(rel.down.map(function (r) { return "to " + r.title + " (" + r.how + ")"; }));
      var first = (n.links || []).filter(function (l) { return l.href; })[0];
      return '<li class="map-list-item' + (UI.onPath(n) ? "" : " is-dim") + '">' +
        '<button type="button" class="map-list-btn" id="list-node-' + n.id + '" data-list-node="' + n.id + '" aria-controls="map-drawer">' +
        '<span class="map-tag">' + esc(n.tag) + "</span> " + (n.step ? '<span class="map-list-step">' + esc(n.step) + "</span> " : "") + esc(n.title) + "</button> " +
        UI.statusHtml(UI.statusFor(n)) + (UI.onPath(n) ? "" : ' <span class="drawer-note">(not on selected product path)</span>') +
        '<p class="drawer-note">' + esc(n.subtitle) + (conn.length ? " · " + esc(conn.join("; ")) : "") + "</p>" +
        (first ? '<p class="drawer-note">' + link(first) + "</p>" : "") + "</li>";
    });
    root.innerHTML = '<h2 class="sr-only" id="map-list-h">Process map as a list</h2><ol class="map-list" aria-labelledby="map-list-h">' + items.join("") + "</ol>";
  };

  document.addEventListener("DOMContentLoaded", function () {
    var list = document.getElementById("map-list");
    if (list) list.addEventListener("click", function (e) {
      var b = e.target.closest("[data-list-node]");
      if (b) UI.openDrawer(b.getAttribute("data-list-node"), { where: "list" });
    });
  });
})();
