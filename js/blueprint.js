/* Platform blueprint / Toolkit renderer (TKT-1, TKT-5, TKT-6, TKT-13). Renders PORTAL.toolkit.
   Permalink (restored on load, kept current with replaceState):
     blueprint.html#node=<id>&colour=<function|unit|none>&value=<fn or unit>&box=<branch box>&phases=v1,next,future&view=<list|branch>
   Data: js/toolkit-manifest.generated.js, built from config/toolkit.yaml (node ids are listed there). */
(function () {
  "use strict";
  var K = window.PORTAL && PORTAL.toolkit;
  if (!K) return;

  var GAPS = [60, 60, 80, 60, 60], NODE_W = 140, NODE_H = 104, PITCH = 130;
  var TOP_Y = 34, COL_TOP = 192, BAR_START = 860, BAR_H = 140, BAR_GAP = 10, W = 1190;
  var TYPE = { EXT: "Source", ING: "Ingest tool", STORE: "Store", PROC: "Process tool", SERVE: "Serve tool", ENR: "Enrich tool",
    SVC: "Reusable service", GOV: "Governance tool", MON: "Monitoring tool", PLAT: "Platform tool", PORTAL: "Platform Portal" };
  var byId = {}, colX = {}, boxFn = {}, fnById = {}, unitById = {}, phaseById = {};
  K.nodes.forEach(function (n) { byId[n.id] = n; });
  K.boxes.forEach(function (b) { boxFn[b.id] = b.fn; });
  K.functions.forEach(function (f) { fnById[f.id] = f; });
  K.units.forEach(function (u) { unitById[u.id] = u; });
  K.phases.forEach(function (p) { phaseById[p.id] = p; });
  var x = 12;
  K.columns.forEach(function (c, i) { colX[c.id] = x; x += NODE_W + (GAPS[i] || 0); });
  // Bars span exactly from the first column frame's left edge to the last column frame's right edge (TKT-1).
  var BAR_L = colX[K.columns[0].id] - 10, BAR_R = colX[K.columns[K.columns.length - 1].id] + NODE_W + 10;

  var state = { node: null, colour: "none", value: "", box: "", phases: { v1: true, next: true, future: true }, view: "map" };

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  /* ---- Layout from the manifest: column + row, container slot, or bar slot ---- */
  var order = [];
  K.columns.forEach(function (c) {
    order = order.concat(K.nodes.filter(function (n) { return n.column === c.id; }).sort(function (a, b) { return a.row - b.row; }));
  });
  K.containers.forEach(function (c) { order = order.concat(K.nodes.filter(function (n) { return n.container === c.id; })); });
  K.bars.forEach(function (b) { order = order.concat(K.nodes.filter(function (n) { return n.bar === b.id; })); });

  function barTop(id) {
    for (var i = 0; i < K.bars.length; i++) if (K.bars[i].id === id) return BAR_START + i * (BAR_H + BAR_GAP);
    return 0;
  }
  var boxes = {};
  order.forEach(function (n) {
    var b;
    if (n.column) b = { x: colX[n.column], y: COL_TOP + n.row * PITCH, w: NODE_W, h: NODE_H };
    else if (n.container) {
      var c = K.containers.filter(function (k) { return k.id === n.container; })[0];
      var idx = K.nodes.filter(function (m) { return m.container === c.id; }).indexOf(n);
      b = { x: c.slots[idx], y: TOP_Y, w: c.nodeW, h: NODE_H };
    } else {
      var mem = K.nodes.filter(function (m) { return m.bar === n.bar; }), slot = (BAR_R - BAR_L - 24) / mem.length;
      var w = Math.min(Math.round(slot - 12), 210), i = mem.indexOf(n);
      b = { x: Math.round(BAR_L + 12 + i * slot + (slot - w) / 2), y: barTop(n.bar) + 26, w: w, h: NODE_H };
    }
    b.r = b.x + b.w; b.b = b.y + b.h; b.cx = b.x + b.w / 2; b.cy = b.y + b.h / 2;
    boxes[n.id] = b;
  });
  function frameOf(containerId) {
    var bs = K.nodes.filter(function (n) { return n.container === containerId; }).map(function (n) { return boxes[n.id]; });
    var l = Math.min.apply(null, bs.map(function (b) { return b.x; })) - 14, r = Math.max.apply(null, bs.map(function (b) { return b.r; })) + 14;
    var t = TOP_Y - 26, bt = TOP_Y + NODE_H + 12;
    return { x: l, y: t, w: r - l, h: bt - t, b: bt };
  }

  /* ---- Filters ---- */
  function allPhases() { return state.phases.v1 && state.phases.next && state.phases.future; }
  function matches(n) {
    if (state.colour === "function" && state.value) return n.branchBoxes.some(function (b) { return boxFn[b] === state.value; });
    if (state.colour === "unit" && state.value) return n.unit === state.value;
    return true;
  }
  function phaseOn(n) { return !!state.phases[n.phase]; }
  function isDim(n) { return !matches(n) || !phaseOn(n); }
  function isSoft(n) { return allPhases() && n.phase !== "v1"; }
  function fnOf(n) {
    if (state.colour === "function" && state.value && matches(n)) return fnById[state.value];
    return fnById[boxFn[n.branchBoxes[0]]];
  }
  function chipText(n) { return state.colour === "function" ? fnOf(n).short : unitById[n.unit].label; }
  function colourOf(n) {
    if (state.colour === "function") return fnOf(n).color;
    if (state.colour === "unit") return unitById[n.unit].color;
    return null;
  }
  function phaseHtml(n) {
    var p = phaseById[n.phase];
    return '<span class="badge-phase phase-' + p.id + '"><span aria-hidden="true">' + p.icon + "</span> " + esc(p.label) + "</span>";
  }
  function statusHtml(key) {
    var s = K.statuses[key];
    return '<span class="status status-' + s.cls + '"><span class="icon" aria-hidden="true">' + s.icon + "</span> " + esc(s.word) + "</span>";
  }
  function titlesOf(ids) { return ids.filter(function (id) { return byId[id]; }).map(function (id) { return byId[id].title; }); }
  function ariaLabel(n) {
    var parts = [(TYPE[n.tag] || n.tag) + ": " + n.title + " (" + n.subtitle + ").", "Phase " + phaseById[n.phase].label + ".",
      K.statuses[n.status].word + ".", "Owner " + n.unit + "."];
    var up = titlesOf(n.upstream), down = titlesOf(n.downstream);
    if (up.length) parts.push("From " + up.join(", ") + ".");
    if (down.length) parts.push("To " + down.join(", ") + ".");
    if (isDim(n)) parts.push("Outside the current filter.");
    return parts.join(" ");
  }

  /* ---- Edges ---- */
  function route(e) {
    var a = boxes[e.from];
    if (e.to.indexOf("container:") === 0) {
      var f = frameOf(e.to.slice(10));
      return { pts: [[a.cx, a.y], [a.cx, f.b]], lx: a.cx + 6, ly: (a.y + f.b) / 2, side: true };
    }
    var b = boxes[e.to], na = byId[e.from], nb = byId[e.to];
    if (na.column && na.column === nb.column) {
      var down = b.y > a.y, p = down ? [[a.cx, a.b], [a.cx, b.y]] : [[a.cx, a.y], [a.cx, b.b]];
      return { pts: p, lx: a.cx + 6, ly: (p[0][1] + p[1][1]) / 2, side: true };
    }
    if (Math.abs(a.cy - b.cy) < 1) {
      var fwd = b.x > a.x, s = fwd ? [[a.r, a.cy], [b.x, b.cy]] : [[a.x, a.cy], [b.r, b.cy]];
      return { pts: s, lx: (s[0][0] + s[1][0]) / 2, ly: a.cy };
    }
    var dir = b.cy > a.cy ? 1 : -1, ya = a.cy + 18 * dir, yb = b.cy - 18 * dir, lane;
    if (b.x > a.r) {
      var adjacent = b.x - a.r < 100;
      lane = adjacent ? a.r + 22 : b.x - 22;
      return { pts: [[a.r, ya], [lane, ya], [lane, yb], [b.x, yb]],
        lx: adjacent ? (lane + b.x) / 2 : (a.r + lane) / 2, ly: adjacent ? yb : ya };
    }
    lane = a.x - 22;
    return { pts: [[a.x, ya], [lane, ya], [lane, yb], [b.r, yb]], lx: (lane + b.r) / 2, ly: yb };
  }
  function pathD(pts) {
    var d = "M" + pts[0][0] + " " + pts[0][1], r = 6;
    for (var i = 1; i < pts.length; i++) {
      var p = pts[i], prev = pts[i - 1], next = pts[i + 1];
      if (!next) { d += " L" + p[0] + " " + p[1]; break; }
      d += " L" + (p[0] - Math.sign(p[0] - prev[0]) * r) + " " + (p[1] - Math.sign(p[1] - prev[1]) * r) +
        " Q" + p[0] + " " + p[1] + " " + (p[0] + Math.sign(next[0] - p[0]) * r) + " " + (p[1] + Math.sign(next[1] - p[1]) * r);
    }
    return d;
  }
  function edgesSvg() {
    var seen = {};
    return K.edges.map(function (e) {
      var g = route(e), na = byId[e.from], nb = byId[e.to];
      var dim = isDim(na) || (nb && isDim(nb));
      var html = '<g class="edge edge-' + e.type + (dim ? " is-dim" : "") + '"><path d="' + pathD(g.pts) + '" marker-end="url(#arrow-' + e.type + ')"/>';
      var key = e.to + "|" + e.label; // one label per target + action (e.g. both "upload" edges)
      if (e.label && !seen[key]) {
        seen[key] = true;
        var t = e.label.toUpperCase(), w = t.length * 5.9 + 8;
        var rx = g.side ? g.lx : g.lx - w / 2;
        html += '<rect class="edge-label-bg" x="' + rx + '" y="' + (g.ly - 7) + '" width="' + w + '" height="13" rx="2"/>' +
          '<text class="edge-label bp-edge-label" x="' + (rx + w / 2) + '" y="' + (g.ly + 3) + '" text-anchor="middle">' + esc(t) + "</text>";
      }
      return html + "</g>";
    }).join("");
  }
  function markers() {
    return "<defs>" + ["primary", "request", "return"].map(function (t) {
      return '<marker id="arrow-' + t + '" class="marker-' + t + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z"/></marker>';
    }).join("") + "</defs>";
  }

  /* ---- Frames: columns, side containers, full-width bars ---- */
  function framesHtml() {
    // Column captions sit on the bottom edge so connectors entering from above never cross them.
    var h = "", colH = 4 * PITCH + NODE_H + 38;
    K.columns.forEach(function (c) {
      h += '<div class="map-container bp-col cap-bottom" aria-hidden="true" style="left:' + (colX[c.id] - 10) + "px;top:" + (COL_TOP - 12) + "px;width:" + (NODE_W + 20) + "px;height:" + colH +
        'px"><span class="map-container-cap">' + c.step + " · " + esc(c.label) + "</span></div>";
    });
    K.containers.forEach(function (c) {
      var f = frameOf(c.id);
      h += '<div class="map-container bp-side" aria-hidden="true" style="left:' + f.x + "px;top:" + f.y + "px;width:" + f.w + "px;height:" + f.h +
        'px"><span class="map-container-cap">' + esc(c.label) + "</span></div>";
    });
    K.bars.forEach(function (b) {
      h += '<div class="map-container bp-bar" aria-hidden="true" style="left:' + BAR_L + "px;top:" + barTop(b.id) + "px;width:" + (BAR_R - BAR_L) + "px;height:" + BAR_H +
        'px"><span class="map-container-cap">' + esc(b.label) + " · spans every column</span></div>";
    });
    return h;
  }

  function nodeHtml(n) {
    var b = boxes[n.id], col = colourOf(n);
    var cls = "map-node bp-node kind-" + n.tag.toLowerCase() + (isDim(n) ? " is-dim" : isSoft(n) ? " is-soft" : "") +
      (state.box && n.branchBoxes.indexOf(state.box) > -1 ? " is-traced" : "") + (state.node === n.id ? " is-focal is-selected" : "");
    return '<button type="button" class="' + cls + '" id="bp-node-' + n.id + '" data-node="' + n.id + '" aria-controls="map-drawer" aria-expanded="' +
      (state.node === n.id) + '" aria-label="' + esc(ariaLabel(n)) + '" style="left:' + b.x + "px;top:" + b.y + "px;width:" + b.w + "px;height:" + b.h + "px" +
      (col ? ";border-left:5px solid " + col : "") + '">' +
      '<span class="bp-top"><span class="map-tag">' + esc(n.tag) + '</span><span class="bp-chip">' + esc(chipText(n)) + "</span></span>" +
      '<span class="map-title">' + esc(n.title) + '</span><span class="map-sub bp-sub">' + esc(n.subtitle) + "</span>" +
      '<span class="bp-badges">' + phaseHtml(n) + statusHtml(n.status) + "</span></button>";
  }

  function render() {
    var canvas = document.getElementById("bp-canvas");
    if (!canvas) return;
    var h = BAR_START + K.bars.length * (BAR_H + BAR_GAP) + 40;
    canvas.style.width = W + "px";
    canvas.style.height = h + "px";
    canvas.innerHTML = framesHtml() + '<svg class="map-edges" aria-hidden="true" focusable="false" width="' + W + '" height="' + h + '" viewBox="0 0 ' + W + " " + h + '">' +
      markers() + edgesSvg() + "</svg>" + order.map(nodeHtml).join("");
    canvas.querySelectorAll(".bp-node").forEach(function (el) {
      if (el.scrollHeight > el.clientHeight + 1 && window.console) console.warn("Blueprint node content overflows:", el.id);
    });
    if (BP.afterRender) BP.afterRender();
  }

  /* ---- Permalink ---- */
  function writeHash() {
    var p = [];
    if (state.node) p.push("node=" + state.node);
    if (state.colour !== "none") p.push("colour=" + state.colour);
    if (state.value) p.push("value=" + encodeURIComponent(state.value));
    if (state.box) p.push("box=" + state.box);
    if (!allPhases()) p.push("phases=" + ["v1", "next", "future"].filter(function (k) { return state.phases[k]; }).join(","));
    if (state.view !== "map") p.push("view=" + state.view);
    try { history.replaceState(null, "", location.pathname + location.search + (p.length ? "#" + p.join("&") : "")); } catch (err) { /* file:// */ }
  }
  function readState() {
    var raw = location.hash.slice(1), h = new URLSearchParams(raw.indexOf("=") > -1 ? raw : "");
    var colour = h.get("colour"), phases = h.get("phases"), view = h.get("view");
    state.colour = colour === "function" || colour === "unit" ? colour : "none";
    state.value = h.get("value") || "";
    if (state.colour === "function" && !fnById[state.value]) state.value = "";
    if (state.colour === "unit" && !unitById[state.value]) state.value = "";
    state.box = boxFn[h.get("box")] ? h.get("box") : "";
    state.phases = { v1: true, next: true, future: true };
    if (phases) Object.keys(state.phases).forEach(function (k) { state.phases[k] = phases.split(",").indexOf(k) > -1; });
    state.view = view === "list" || view === "branch" ? view : "map";
    var node = h.get("node");
    return node && byId[node] ? node : null;
  }

  var BP = PORTAL.blueprint = {
    K: K, state: state, byId: byId, boxFn: boxFn, fnById: fnById, unitById: unitById, phaseById: phaseById,
    esc: esc, statusHtml: statusHtml, phaseHtml: phaseHtml, isDim: isDim, typeName: function (t) { return TYPE[t] || t; },
    order: order, render: render, writeHash: writeHash, readState: readState, chipText: chipText
  };
})();
