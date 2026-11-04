/* Home process map renderer (MAP-1..MAP-14). Draws node buttons + SVG edges from PORTAL.map.
   Permalink (MAP-10 / NAV-2), restored on load and kept current with history.replaceState:
     index.html#node=<id>&product=<all|mpd|hh>&overlays=<setup,releases>&view=list
   Screenshot alias: index.html?panel=<id>&infra=1&release=1  (node ids are listed in js/map-data.js) */
(function () {
  "use strict";
  var M = window.PORTAL && PORTAL.map;
  if (!M) return;

  var CANVAS_W = 1200;
  var TYPE_NAMES = { EXT: "External source", ZONE: "Storage zone", PIPE: "Pipeline", SVC: "Shared service", PUB: "Publish", ENV: "Environment", IAM: "Identity", OPS: "Operations", GATE: "Release gate" };
  var ICONS = { ok: "✓", warn: "⚠", fail: "✕", info: "◎", tbd: "○" };
  var byId = {};
  M.nodes.forEach(function (n) { byId[n.id] = n; });

  var state = { node: null, product: "all", overlays: { setup: false, releases: false }, view: "map" };

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function size(n) {
    // Heights fit: tag row + up to two title lines + up to two subtitle lines + status.
    if (n.w) return { w: n.w, h: 118 };
    if (n.kind === "svc") return { w: 150, h: 132 };
    if (n.overlay) return { w: 172, h: 118 };
    return { w: 172, h: 134 };
  }
  function bandTop(id) {
    var top = M.baseHeight;
    for (var i = 0; i < M.bands.length; i++) {
      if (M.bands[i].id === id) return top;
      if (state.overlays[M.bands[i].id]) top += M.bands[i].height;
    }
    return top;
  }
  function box(n) {
    var s = size(n), y = n.band ? bandTop(n.band) + n.dy : n.y;
    return { x: n.x, y: y, w: s.w, h: s.h, cx: n.x + s.w / 2, cy: y + s.h / 2, r: n.x + s.w, b: y + s.h };
  }
  function visible(n) { return !n.overlay || state.overlays[n.overlay]; }
  function onPath(n) { return state.product === "all" || n.products.indexOf(state.product) !== -1; }
  function statusFor(n) { return (n.statusBy && n.statusBy[state.product]) || n.status; }
  function statusHtml(s) {
    var cls = s.kind === "tbd" ? "neutral" : s.kind;
    return '<span class="status status-' + cls + '"><span class="icon" aria-hidden="true">' + ICONS[s.kind] + "</span> " + esc(s.word) + "</span>";
  }
  function focalId() {
    if (state.node) return state.node;
    var f = byId[M.focal], k = f && statusFor(f).kind;
    return k === "warn" || k === "fail" ? M.focal : null;
  }
  function edgesOf(id) {
    return M.edges.filter(function (e) {
      return (e.from === id || e.to === id) && visible(byId[e.from]) && visible(byId[e.to]);
    });
  }

  /* Screen-reader label: type, title, status and connections (MAP-9). */
  function ariaLabel(n) {
    var from = [], to = [], back = [], svcs = 0;
    edgesOf(n.id).forEach(function (e) {
      var other = byId[e.from === n.id ? e.to : e.from];
      if (e.type === "return") { if (e.from === n.id && other.kind !== "svc" && n.kind !== "svc") back.push(other.title); return; }
      if (e.from === n.id && other.kind === "svc") { svcs++; return; }
      (e.to === n.id ? from : to).push(other.title);
    });
    var parts = [(TYPE_NAMES[n.tag] || n.tag) + ": " + n.title + ".", statusFor(n).word + "."];
    if (from.length) parts.push("From " + from.join(", ") + (to.length ? ";" : "."));
    if (to.length) parts.push("to " + to.join(", ") + (svcs || back.length ? ";" : "."));
    if (svcs) parts.push("uses " + svcs + " shared services" + (back.length ? ";" : "."));
    if (back.length) parts.push("returns DQ feedback to " + back.join(", ") + ".");
    if (!onPath(n)) parts.push("Not on the selected product's path.");
    return parts.join(" ");
  }

  /* ---- Edge geometry, computed from node boxes ---- */
  function slots() {
    // Service attachments fan out from the parent's bottom edge without crossing.
    var out = {};
    M.nodes.forEach(function (p) {
      if (!visible(p)) return;
      var pb = box(p), kids = M.edges.filter(function (e) {
        return e.from === p.id && e.type === "request" && visible(byId[e.to]) && box(byId[e.to]).y > pb.b;
      }).map(function (e) { return byId[e.to]; });
      var left = kids.filter(function (c) { return box(c).cx < pb.cx; }).sort(function (a, b) { return a.x - b.x; });
      var right = kids.filter(function (c) { return box(c).cx >= pb.cx; }).sort(function (a, b) { return b.x - a.x; });
      left.forEach(function (c, i) { out[c.id] = { p: pb, c: box(c), dir: -1, sx: pb.x + 12 + i * 30, bus: pb.b + 32 + i * 32 }; });
      right.forEach(function (c, i) { out[c.id] = { p: pb, c: box(c), dir: 1, sx: pb.r - 12 - i * 30, bus: pb.b + 32 + i * 32 }; });
    });
    return out;
  }
  function route(e, sl) {
    var a = box(byId[e.from]), b = box(byId[e.to]);
    if (sl[e.to] && e.type !== "return") {
      var s = sl[e.to], ex = s.c.cx + 8 * s.dir;
      return { pts: [[s.sx, s.p.b], [s.sx, s.bus], [ex, s.bus], [ex, s.c.y]], lx: (s.sx + ex) / 2, ly: s.bus };
    }
    if (sl[e.from] && e.type === "return") {
      var t = sl[e.from], rx = t.sx - 10 * t.dir, cx = t.c.cx - 8 * t.dir;
      return { pts: [[cx, t.c.y], [cx, t.bus + 10], [rx, t.bus + 10], [rx, t.p.b]] };
    }
    if (b.x < a.x) { // return to an earlier step: up and over the containers
      var sx = a.x + 24, top = a.y - 56;
      return { pts: [[sx, a.y], [sx, top], [b.cx, top], [b.cx, b.y]], lx: (sx + b.cx) / 2, ly: top };
    }
    return { pts: [[a.r, a.cy], [b.x, b.cy]], lx: (a.r + b.x) / 2, ly: a.cy - 12 };
  }
  function pathD(pts) {
    var d = "M" + pts[0][0] + " " + pts[0][1], r = 6;
    for (var i = 1; i < pts.length; i++) {
      var p = pts[i], prev = pts[i - 1], next = pts[i + 1];
      if (!next) { d += " L" + p[0] + " " + p[1]; break; }
      var inX = Math.sign(p[0] - prev[0]), inY = Math.sign(p[1] - prev[1]);
      var outX = Math.sign(next[0] - p[0]), outY = Math.sign(next[1] - p[1]);
      d += " L" + (p[0] - inX * r) + " " + (p[1] - inY * r) + " Q" + p[0] + " " + p[1] + " " + (p[0] + outX * r) + " " + (p[1] + outY * r);
    }
    return d;
  }
  function edgeSvg(e, sl) {
    var g = route(e, sl), dim = !onPath(byId[e.from]) || !onPath(byId[e.to]);
    var html = '<g class="edge edge-' + e.type + (dim ? " is-dim" : "") + '">' +
      '<path d="' + pathD(g.pts) + '" marker-end="url(#arrow-' + e.type + ')"/>';
    if (e.type === "gate") {
      var mx = (g.pts[0][0] + g.pts[1][0]) / 2, my = g.pts[0][1];
      html += '<line class="gate-bar" x1="' + mx + '" y1="' + (my - 7) + '" x2="' + mx + '" y2="' + (my + 7) + '"/>';
    }
    if (e.labelPos === "below") { // promotion arrows are short: label sits under the gap between environments
      var lb = Math.max(box(byId[e.from]).b, box(byId[e.to]).b);
      g.lx = (g.pts[0][0] + g.pts[g.pts.length - 1][0]) / 2; g.ly = lb + 10;
    }
    if (e.label && g.lx != null) {
      var txt = e.label.toUpperCase(), w = txt.length * 6.8 + 10;
      html += '<rect class="edge-label-bg" x="' + (g.lx - w / 2) + '" y="' + (g.ly - 8) + '" width="' + w + '" height="15" rx="2"/>' +
        '<text class="edge-label" x="' + g.lx + '" y="' + (g.ly + 3.5) + '" text-anchor="middle">' + esc(txt) + "</text>";
    }
    return html + "</g>";
  }
  /* MAP-4 Platform setup overlay: one thin dashed "applies to" line each from ENV, IAM and OPS to a
     dashed outline around all three zones (Bronze / Silver / Gold), with a single label. Drawn only
     while that overlay is on; lines run through the gaps between the shared services. Not part of
     M.edges (the drawer and list already show "applies to"). */
  var APPLY_CORRIDOR = [385, 620, 855];
  function appliesSvg() {
    if (!state.overlays.setup) return "";
    var zs = ["bronze", "silver", "gold"].map(function (id) { return byId[id]; }).filter(function (z) { return z && visible(z); });
    if (!zs.length) return "";
    var bs = zs.map(box), x = Math.min.apply(null, bs.map(function (b) { return b.x; })) - 8, y = Math.min.apply(null, bs.map(function (b) { return b.y; })) - 8;
    var r = Math.max.apply(null, bs.map(function (b) { return b.r; })) + 8, bt = Math.max.apply(null, bs.map(function (b) { return b.b; })) + 8;
    var html = '<g class="edge edge-applies" data-applies="zones"><rect class="applies-outline" x="' + x + '" y="' + y + '" width="' + (r - x) + '" height="' + (bt - y) + '" rx="6"/></g>';
    ["env", "iam", "ops"].forEach(function (id, i) {
      var n = byId[id]; if (!n || !visible(n)) return;
      var a = box(n), cx = APPLY_CORRIDOR[i], bus = M.baseHeight - 22;
      var pts = Math.abs(a.cx - cx) < 1 ? [[cx, a.y], [cx, bt]] : [[a.cx, a.y], [a.cx, bus], [cx, bus], [cx, bt]];
      html += '<g class="edge edge-applies" data-applies="' + id + '"><path d="' + pathD(pts) + '" marker-end="url(#arrow-applies)"/></g>';
    });
    var txt = "APPLIES TO ALL ZONES", w = txt.length * 6.8 + 10, lx = APPLY_CORRIDOR[1], ly = bt + 70;
    html += '<g class="edge edge-applies"><rect class="edge-label-bg" x="' + (lx - w / 2) + '" y="' + (ly - 8) + '" width="' + w + '" height="15" rx="2"/>' +
      '<text class="edge-label" x="' + lx + '" y="' + (ly + 3.5) + '" text-anchor="middle">' + txt + "</text></g>";
    return html;
  }
  function markers() {
    return "<defs>" + ["primary", "request", "return", "gate", "applies"].map(function (t) {
      return '<marker id="arrow-' + t + '" class="marker-' + t + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z"/></marker>';
    }).join("") + "</defs>";
  }

  /* ---- Containers from ownerTag; split into runs when another group's node sits between ---- */
  function containerFrames() {
    var vis = M.nodes.filter(visible), frames = [];
    M.containers.forEach(function (c) {
      if (c.overlay && !state.overlays[c.overlay]) return;
      var mem = vis.filter(function (n) { return n.ownerTag === c.ownerTag; }).sort(function (a, b) { return a.x - b.x; });
      var runs = [], cur = [];
      mem.forEach(function (n, i) {
        if (i && vis.some(function (o) {
          var ob = box(o), nb = box(n), pb = box(mem[i - 1]);
          return o.ownerTag !== c.ownerTag && ob.x > pb.r && ob.r < nb.x && ob.y < nb.b && ob.b > nb.y;
        })) { runs.push(cur); cur = []; }
        cur.push(n);
      });
      if (cur.length) runs.push(cur);
      runs.forEach(function (run) {
        var bs = run.map(box);
        var x = Math.min.apply(null, bs.map(function (b) { return b.x; })) - 16;
        var low = c.capPos === "bottom";
        var y = Math.min.apply(null, bs.map(function (b) { return b.y; })) - (low ? 16 : 28);
        var r = Math.max.apply(null, bs.map(function (b) { return b.r; })) + 16;
        var bt = Math.max.apply(null, bs.map(function (b) { return b.b; })) + (low ? 28 : 16);
        frames.push('<div class="map-container' + (low ? " cap-bottom" : "") + '" aria-hidden="true" style="left:' + x + "px;top:" + y + "px;width:" + (r - x) + "px;height:" + (bt - y) + 'px"><span class="map-container-cap">' + esc(c.caption) + "</span></div>");
      });
    });
    return frames.join("");
  }

  function nodeHtml(n) {
    var b = box(n), dim = !onPath(n);
    return '<button type="button" class="map-node kind-' + n.kind + (dim ? " is-dim" : "") + '" id="map-node-' + n.id + '" data-node="' + n.id +
      '" aria-controls="map-drawer" aria-expanded="false" aria-label="' + esc(ariaLabel(n)) + '" style="left:' + b.x + "px;top:" + b.y + "px;width:" + b.w + "px;height:" + b.h + 'px">' +
      '<span class="map-tag">' + esc(n.tag) + "</span>" +
      '<span class="map-title">' + esc(n.title) + "</span>" +
      '<span class="map-sub">' + esc(n.subtitle) + "</span>" +
      '<span class="map-status">' + statusHtml(statusFor(n)) + "</span>" +
      (/^\d+$/.test(n.step || "") ? '<span class="map-step" aria-hidden="true">' + n.step + "</span>" : "") +
      "</button>";
  }

  function render() {
    var canvas = document.getElementById("map-canvas");
    if (!canvas) return;
    // Extra 40px lets the last row scroll clear of the pinned legend.
    var h = M.baseHeight + 40;
    M.bands.forEach(function (b) { if (state.overlays[b.id]) h += b.height; });
    var sl = slots(), vis = M.nodes.filter(visible);
    var edges = M.edges.filter(function (e) { return visible(byId[e.from]) && visible(byId[e.to]); });
    canvas.style.width = CANVAS_W + "px";
    canvas.style.height = h + "px";
    // Nodes are emitted in model order, which is flow order: 01, 02, 03, 03a-d, 04, 05, then overlays (MAP-9 tab order).
    canvas.innerHTML = containerFrames() +
      '<svg class="map-edges" aria-hidden="true" focusable="false" width="' + CANVAS_W + '" height="' + h + '" viewBox="0 0 ' + CANVAS_W + " " + h + '">' +
      markers() + edges.map(function (e) { return edgeSvg(e, sl); }).join("") + appliesSvg() + "</svg>" +
      vis.map(nodeHtml).join("");
    document.querySelectorAll("[data-legend-overlay]").forEach(function (el) {
      el.hidden = !(state.overlays.setup || state.overlays.releases);
    });
    if (PORTAL.mapUI.renderList) PORTAL.mapUI.renderList();
    updateSelection();
    // Layout guard: flag any node whose content no longer fits its fixed box.
    canvas.querySelectorAll(".map-node").forEach(function (el) {
      if (el.scrollHeight > el.clientHeight + 1 && window.console) console.warn("Map node content overflows:", el.id);
    });
  }

  function updateSelection() {
    var f = focalId();
    document.querySelectorAll(".map-node").forEach(function (el) {
      var id = el.getAttribute("data-node");
      el.classList.toggle("is-focal", id === f);
      el.classList.toggle("is-selected", id === state.node);
      el.setAttribute("aria-expanded", id === state.node ? "true" : "false");
    });
  }

  function syncControls() {
    document.querySelectorAll("[data-product]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-product") === state.product ? "true" : "false");
    });
    document.querySelectorAll("[data-overlay]").forEach(function (b) {
      b.setAttribute("aria-pressed", state.overlays[b.getAttribute("data-overlay")] ? "true" : "false");
    });
    var lb = document.getElementById("view-list-toggle"), wrap = document.getElementById("map-scroll"), list = document.getElementById("map-list");
    if (lb && wrap && list) {
      lb.setAttribute("aria-pressed", state.view === "list" ? "true" : "false");
      wrap.hidden = state.view === "list";
      list.hidden = state.view !== "list";
    }
  }

  /* ---- Permalink ---- */
  function writeHash() {
    var p = [], ov = M.bands.map(function (b) { return b.id; }).filter(function (id) { return state.overlays[id]; });
    if (state.node) p.push("node=" + state.node);
    if (state.product !== "all") p.push("product=" + state.product);
    if (ov.length) p.push("overlays=" + ov.join(","));
    if (state.view === "list") p.push("view=list");
    try {
      history.replaceState(null, "", location.pathname + location.search.replace(/[?&](panel|infra|release)=[^&]*/g, "").replace(/^&/, "?") + (p.length ? "#" + p.join("&") : ""));
    } catch (err) { /* some browsers block replaceState on file:// — the map still works */ }
  }
  function readState() {
    var raw = location.hash.slice(1), q = new URLSearchParams(location.search), s = { node: null, product: "all", overlays: { setup: false, releases: false }, view: "map" };
    var h = raw.indexOf("=") > -1 ? new URLSearchParams(raw) : new URLSearchParams("");
    var node = h.get("node") || q.get("node") || q.get("panel");
    if (node && byId[node]) s.node = node;
    var prod = h.get("product") || q.get("product");
    if (prod && M.products.some(function (p) { return p.id === prod; })) s.product = prod;
    (h.get("overlays") || q.get("overlays") || "").split(",").forEach(function (o) { if (o in s.overlays) s.overlays[o] = true; });
    if (q.get("infra") === "1") s.overlays.setup = true;
    if (q.get("release") === "1") s.overlays.releases = true;
    if ((h.get("view") || q.get("view")) === "list") s.view = "list";
    if (s.node && byId[s.node].overlay) s.overlays[byId[s.node].overlay] = true;
    return s;
  }
  function applyState(s) {
    state.product = s.product; state.overlays = s.overlays; state.view = s.view;
    syncControls();
    render();
    if (s.node) PORTAL.mapUI.openDrawer(s.node, null);
    else if (state.node) PORTAL.mapUI.closeDrawer(true);
    writeHash();
  }

  /* Opening a node whose overlay is off switches that overlay on first. */
  function ensureVisible(id) {
    var n = byId[id];
    if (n && n.overlay && !state.overlays[n.overlay]) {
      state.overlays[n.overlay] = true;
      syncControls();
      render();
    }
  }

  PORTAL.mapUI = {
    state: state, byId: byId, esc: esc, statusHtml: statusHtml, statusFor: statusFor, onPath: onPath, visible: visible,
    typeName: function (tag) { return TYPE_NAMES[tag] || tag; },
    render: render, updateSelection: updateSelection, writeHash: writeHash, ensureVisible: ensureVisible, edgesOf: edgesOf
  };

  document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("map-canvas")) return;
    document.getElementById("map-canvas").addEventListener("click", function (e) {
      var btn = e.target.closest(".map-node");
      if (btn) PORTAL.mapUI.openDrawer(btn.getAttribute("data-node"), { where: "map" });
    });
    document.querySelectorAll("[data-product]").forEach(function (b) {
      b.addEventListener("click", function () { state.product = b.getAttribute("data-product"); syncControls(); render(); writeHash(); });
    });
    document.querySelectorAll("[data-overlay]").forEach(function (b) {
      b.addEventListener("click", function () {
        var o = b.getAttribute("data-overlay");
        state.overlays[o] = !state.overlays[o];
        if (!state.overlays[o] && state.node && byId[state.node].overlay === o) PORTAL.mapUI.closeDrawer(true);
        syncControls(); render(); writeHash();
      });
    });
    var lb = document.getElementById("view-list-toggle");
    if (lb) lb.addEventListener("click", function () { state.view = state.view === "list" ? "map" : "list"; syncControls(); writeHash(); });
    var attn = document.getElementById("attn-items");
    if (attn && M.attention) {
      attn.innerHTML = M.attention.map(function (a) {
        return '<li><button type="button" class="attn-btn" data-attn-node="' + a.node + '" aria-controls="map-drawer">' +
          statusHtml(a.status) + ' <span class="attn-text">' + esc(a.text) + "</span></button></li>";
      }).join("");
      attn.addEventListener("click", function (e) {
        var b = e.target.closest("[data-attn-node]");
        if (b) PORTAL.mapUI.openDrawer(b.getAttribute("data-attn-node"), { el: b });
      });
    }
    window.addEventListener("hashchange", function () {
      if (location.hash.indexOf("=") > -1) applyState(readState());
    });
    applyState(readState());
  });
})();
