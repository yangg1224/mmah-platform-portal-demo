/* Platform blueprint: drawer field renderer for tool nodes (TKT-4 field order), list and branch
   views (TKT-8, TKT-10), considered list (TKT-12), open questions, toolbar wiring. The drawer shell
   (open / close, focus, Esc, goto links) is the shared component in js/drawer.js, the same one the
   home process map uses. Read-only. */
(function () {
  "use strict";
  var BP = window.PORTAL && PORTAL.blueprint, D = window.PORTAL && PORTAL.drawer;
  if (!BP || !D) return;
  var K = BP.K, S = BP.state, esc = BP.esc, byId = BP.byId, sec = D.section, link = D.link;
  var ENV_KEY = { p: "planned", v: "prov", l: "live", n: "na" };
  var NOT_APPLICABLE = D.NOT_APPLICABLE, NOT_DEFINED = D.NOT_DEFINED;

  function homeTitle(id) {
    var m = PORTAL.map && PORTAL.map.nodes.filter(function (n) { return n.id === id; })[0];
    return m ? m.title : id;
  }
  function rel(ids, arrow) {
    return ids.filter(function (id) { return byId[id]; }).map(function (id) {
      return '<li><button type="button" class="drawer-goto" data-goto="' + id + '">' + arrow + " " + esc(byId[id].title) + "</button></li>";
    }).join("");
  }

  function content(n) {
    var u = BP.unitById[n.unit], p = BP.phaseById[n.phase];
    var h = D.head(n.tag, esc(BP.typeName(n.tag)), n.title, n.subtitle);
    h += sec("Summary", "<p>" + esc(n.summary) + "</p>");
    h += sec("Why we use it", "<p>" + esc(n.why) + "</p>");
    h += sec("Status", "<p>" + BP.statusHtml(n.status) + ' <span class="drawer-asof">(sample) as of ' + esc(K.asOf) + "</span></p>" +
      '<p class="drawer-note bp-sample-note">Sample statuses, not real infrastructure.</p>' +
      '<ul class="drawer-counts">' + K.envs.map(function (e, i) {
        return "<li>" + esc(e) + " " + BP.statusHtml(ENV_KEY[n.statusByEnv[i]] || "planned") + ' <span class="drawer-asof">(sample)</span></li>';
      }).join("") + "</ul>" + (n.statusNote ? '<p class="drawer-note">' + esc(n.statusNote) + "</p>" : "") +
      '<p class="drawer-note">Status source: ' + esc(n.statusSource || "manifest only") + " · manifest " + esc(K.manifest) + ".</p>");
    h += sec("Owner", "<p>" + esc(n.owner) + '</p><p class="drawer-note">Owning unit: ' + esc(u.label) + " · " + esc(u.name) + "</p>");
    h += sec("Branch box", '<ul class="drawer-rel">' + n.branchBoxes.map(function (id) {
      var b = K.boxes.filter(function (x) { return x.id === id; })[0], f = BP.fnById[b.fn];
      return '<li><button type="button" class="drawer-goto" data-box="' + id + '" aria-pressed="' + (S.box === id) + '">' + esc(b.label) +
        '</button> <span class="drawer-how">' + esc(f.label) + "</span></li>";
    }).join("") + '</ul><p class="drawer-note">Choosing a box filters the map to its DAB function and highlights every tool that traces to it.</p>');
    h += sec("Phase", "<p>" + BP.phaseHtml(n) + ' <span class="drawer-note">' + esc(p.why) + "</span></p>");
    h += sec("Defined in", n.iac === "na" ? NOT_APPLICABLE : n.iac === "tbd" ? NOT_DEFINED : '<p><code class="defined-in">' + esc(n.iac) + "</code></p>");
    h += sec("Linked docs", '<ul class="drawer-links">' + n.docs.map(function (d) { return "<li>" + link(d) + "</li>"; }).join("") + "</ul>");
    h += sec("Upstream / downstream", n.upstream.length || n.downstream.length
      ? '<ul class="drawer-rel">' + rel(n.upstream, "←") + rel(n.downstream, "→") + "</ul>" : NOT_APPLICABLE);
    var deeper = (n.homeNode ? [{ label: "Process map: " + homeTitle(n.homeNode), href: "../index.html#node=" + n.homeNode }] : []).concat(n.deeper);
    h += sec("Links deeper", D.links(deeper));
    return h;
  }

  var shell = D.create({
    has: function (id) { return !!byId[id]; },
    render: function (id) { return content(byId[id]); },
    select: function (id) { S.node = id; BP.render(); BP.writeHash(); },
    deselect: function () { S.node = null; BP.render(); BP.writeHash(); },
    nodeEl: function (id) { return S.view === "map" ? document.getElementById("bp-node-" + id) : null; },
    focusTarget: function (id) {
      return S.view === "map" ? document.getElementById("bp-node-" + id) : document.querySelector('[data-list-node="' + id + '"]');
    }
  });
  function drawer() { return document.getElementById("map-drawer"); }
  BP.openDrawer = function (id, from) { if (shell) shell.open(id, from); };
  BP.closeDrawer = function (silent) { if (shell) shell.close(silent); };

  /* ---- List and branch views (same nodes, badges and drawer) ---- */
  function row(n, i, all, inBranch) {
    // Branch view repeats a tool under each box it serves, so only the list view carries ids.
    return '<li class="map-list-item' + (BP.isDim(n) ? " is-dim" : "") + '"><button type="button" class="map-list-btn"' +
      (inBranch === true ? "" : ' id="bp-list-' + n.id + '"') + ' data-list-node="' + n.id +
      '" aria-controls="map-drawer"><span class="map-tag">' + esc(n.tag) + "</span> " + esc(n.title) + "</button> " + BP.phaseHtml(n) + " " + BP.statusHtml(n.status) +
      ' <span class="bp-chip">' + esc(BP.chipText(n)) + '</span><p class="drawer-note">' + esc(n.subtitle) + "</p></li>";
  }
  function groupsHtml() {
    var g = K.columns.map(function (c) { return { label: c.step + " " + c.label, test: function (n) { return n.column === c.id; } }; })
      .concat(K.containers.map(function (c) { return { label: c.label, test: function (n) { return n.container === c.id; } }; }))
      .concat(K.bars.map(function (b) { return { label: b.label + " bar", test: function (n) { return n.bar === b.id; } }; }));
    return g.map(function (x) {
      return '<h3 class="bp-list-h">' + esc(x.label) + '</h3><ol class="map-list">' + BP.order.filter(x.test).map(row).join("") + "</ol>";
    }).join("");
  }
  function branchHtml() {
    return K.functions.map(function (f) {
      return '<h3 class="bp-list-h">' + esc(f.label) + ' <span class="drawer-note">' + esc(f.unit) + "</span></h3>" +
        K.boxes.filter(function (b) { return b.fn === f.id; }).map(function (b) {
          var tools = BP.order.filter(function (n) { return n.branchBoxes.indexOf(b.id) > -1; });
          return '<h4 class="bp-box-h">' + esc(b.label) + "</h4>" + (tools.length ? '<ul class="map-list">' + tools.map(function (n) { return row(n, 0, null, true); }).join("") + "</ul>"
            : '<p class="drawer-empty">No tools on the blueprint yet</p>');
        }).join("");
    }).join("");
  }

  function pressed(sel, test) {
    document.querySelectorAll(sel).forEach(function (b) { b.setAttribute("aria-pressed", test(b) ? "true" : "false"); });
  }
  BP.afterRender = function () {
    pressed("[data-colour]", function (b) { return b.getAttribute("data-colour") === S.colour; });
    pressed("[data-phase]", function (b) { return S.phases[b.getAttribute("data-phase")]; });
    pressed("#bp-view-list", function () { return S.view === "list"; });
    pressed("#bp-view-branch", function () { return S.view === "branch"; });
    var vals = document.getElementById("bp-values"), leg = document.getElementById("bp-legend-colour");
    var list = S.colour === "function" ? K.functions : S.colour === "unit" ? K.units : [];
    vals.hidden = !list.length;
    vals.innerHTML = list.length ? '<span class="ctl-label" id="bp-values-cap">Filter</span><span class="seg" role="group" aria-labelledby="bp-values-cap">' +
      [{ id: "", label: "All" }].concat(list).map(function (v) {
        return '<button type="button" class="chip-btn" data-value="' + esc(v.id) + '" aria-pressed="' + (S.value === v.id) + '">' + esc(v.label) + "</button>";
      }).join("") + "</span>" : "";
    leg.hidden = !list.length;
    leg.innerHTML = list.map(function (v) {
      return '<li><span class="lg-box" style="border-left:5px solid ' + v.color + '" aria-hidden="true"></span>' + esc(v.legend_label || v.label) + "</li>";
    }).join("");
    document.getElementById("bp-scroll").hidden = S.view !== "map";
    var lv = document.getElementById("bp-list");
    lv.hidden = S.view === "map";
    lv.innerHTML = S.view === "list" ? '<h2 class="sr-only">Blueprint as a list</h2>' + groupsHtml()
      : S.view === "branch" ? '<h2 class="sr-only">Branch view: tools by DAB function and box</h2>' + branchHtml() : "";
  };

  function update() { BP.render(); BP.writeHash(); }
  function refreshDrawer() { if (shell) shell.refresh(); }

  document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("bp-canvas")) return;
    var banner = document.getElementById("bp-banner");
    banner.querySelector("[data-banner-text]").textContent = K.banner.text;
    var bl = banner.querySelector("[data-banner-link]");
    bl.textContent = K.banner.linkLabel;
    bl.setAttribute("href", K.banner.href);
    function pin() { var hd = document.querySelector(".site-header"); banner.style.top = (hd ? hd.offsetHeight : 0) + "px"; }
    pin();
    window.addEventListener("resize", pin);
    document.getElementById("bp-considered").innerHTML = K.considered.map(function (c) {
      return "<li><strong>" + esc(c.name) + "</strong> · " + esc(c.reason) + "</li>";
    }).join("");
    document.getElementById("bp-oq").innerHTML = K.openQuestions.map(function (q) { return "<li>" + esc(q.text) + "</li>"; }).join("");
    bl.addEventListener("click", function () { document.getElementById("open-questions").open = true; });
    if (location.hash === "#open-questions") document.getElementById("open-questions").open = true;

    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-node],[data-list-node],[data-box],[data-colour],[data-value],[data-phase],#bp-view-list,#bp-view-branch");
      if (!t) return;
      if (t.hasAttribute("data-node") && t.classList.contains("bp-node")) return BP.openDrawer(t.getAttribute("data-node"), { where: "map" });
      if (t.hasAttribute("data-list-node")) return BP.openDrawer(t.getAttribute("data-list-node"), { where: "list" });
      if (t.hasAttribute("data-box")) {
        var box = t.getAttribute("data-box");
        S.colour = "function"; S.value = BP.boxFn[box]; S.box = S.box === box ? "" : box;
        update(); refreshDrawer();
        var again = drawer().querySelector('[data-box="' + box + '"]');
        if (again) again.focus();
        return;
      }
      if (t.hasAttribute("data-colour")) { S.colour = t.getAttribute("data-colour"); S.value = ""; S.box = ""; return update(); }
      if (t.hasAttribute("data-value")) { S.value = t.getAttribute("data-value"); S.box = ""; update(); var v = document.querySelector('[data-value="' + S.value + '"]'); if (v) v.focus(); return; }
      if (t.hasAttribute("data-phase")) { var k = t.getAttribute("data-phase"); S.phases[k] = !S.phases[k]; return update(); }
      if (t.id === "bp-view-list") { S.view = S.view === "list" ? "map" : "list"; return update(); }
      if (t.id === "bp-view-branch") { S.view = S.view === "branch" ? "map" : "branch"; return update(); }
    });
    function apply() {
      var node = BP.readState();
      BP.render();
      if (node) BP.openDrawer(node, null); else BP.closeDrawer(true);
      BP.writeHash();
    }
    window.addEventListener("hashchange", function () { if (location.hash.indexOf("=") > -1) apply(); });
    apply();
  });
})();
