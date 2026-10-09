/* Shared click-to-expand drawer (A4 drawer layout, MAP-3, TKT-4, NAV-3). One component for every map
   view: the home process map (js/map-drawer.js) and the Platform blueprint (js/blueprint-drawer.js)
   each pass only their own field renderer and selection hooks. The shell handles open / close, focus
   (title on open, back to the opener on close), Esc, the close button, [data-goto] links inside the
   drawer and the "Not applicable" / "Not yet defined" rules. Read-only: no actions.

   PORTAL.drawer.create({
     render(id)      -> drawer body HTML (required)
     has(id)         -> true if the id is a node on this page (required)
     select(id)      -> page marks the node selected, re-renders, writes the permalink
     deselect()      -> page clears the selection
     beforeOpen(id)  -> optional, e.g. switch on the overlay a node lives in
     nodeEl(id)      -> optional element to scroll into view on open
     focusTarget(id) -> element that gets focus back on close (map node or list row)
   }) -> { open(id, from), close(silent), refresh(), current() }
   `from`: null when restoring from the permalink (no focus move), { el } to return focus to a specific
   element, or any other object for a node / list click. */
(function () {
  "use strict";
  window.PORTAL = window.PORTAL || {};

  var NOT_APPLICABLE = '<p class="drawer-empty">Not applicable</p>';
  var NOT_DEFINED = '<p class="drawer-empty">○ Not yet defined</p>';

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function section(title, body) { return '<section class="drawer-sec"><h3>' + title + "</h3>" + body + "</section>"; }
  function link(l) {
    if (!l.href) return '<span class="drawer-nolink">' + esc(l.label) + "</span>";
    var ext = /^https?:/.test(l.href);
    return '<a href="' + esc(l.href) + '"' + (ext ? ' rel="noopener noreferrer"' : "") + ">" + esc(l.label) + (ext ? " ↗" : "") + "</a>";
  }
  function links(list) {
    return list && list.length ? '<ul class="drawer-links">' + list.map(function (l) { return "<li>" + link(l) + "</li>"; }).join("") + "</ul>" : NOT_DEFINED;
  }
  /* "na" (or missing) -> Not applicable; "tbd" -> Not yet defined; anything else -> fn(v). Never hidden. */
  function value(v, fn) {
    if (v === "na" || v == null) return NOT_APPLICABLE;
    if (v === "tbd") return NOT_DEFINED;
    return fn(v);
  }
  function head(tag, typeLine, title, subtitle) {
    return '<header class="drawer-head"><span class="map-tag">' + esc(tag) + '</span><p class="drawer-type">' + typeLine +
      '</p><h2 id="drawer-title" tabindex="-1">' + esc(title) + '</h2><p class="drawer-sub">' + esc(subtitle) + "</p></header>";
  }

  function create(o) {
    var el = document.getElementById(o.elementId || "map-drawer");
    var opener = null, current = null;
    if (!el) return null;
    var body = el.querySelector(".drawer-body");
    function noop() {}
    var select = o.select || noop, deselect = o.deselect || noop;

    var api = {
      current: function () { return current; },
      open: function (id, from) {
        if (!o.has(id)) return;
        if (o.beforeOpen) o.beforeOpen(id);
        if (from && from.el) opener = { el: from.el };
        else if (from || !opener) opener = { id: id };
        if (!opener.el) opener.id = id;
        current = id;
        select(id);
        body.innerHTML = o.render(id);
        el.hidden = false;
        requestAnimationFrame(function () { el.classList.add("is-open"); });
        var n = o.nodeEl && o.nodeEl(id);
        if (n) n.scrollIntoView({ block: "nearest", inline: "nearest" });
        if (from) el.querySelector("#drawer-title").focus();
      },
      close: function (silent) {
        if (el.hidden) return;
        current = null;
        el.classList.remove("is-open");
        el.hidden = true;
        deselect();
        var w = opener;
        opener = null;
        if (silent || !w) return;
        var t = w.el && document.contains(w.el) ? w.el : o.focusTarget && o.focusTarget(w.id);
        if (t) t.focus();
      },
      refresh: function () { if (current) body.innerHTML = o.render(current); }
    };

    el.querySelector(".drawer-close").addEventListener("click", function () { api.close(false); });
    el.addEventListener("click", function (e) {
      var g = e.target.closest("[data-goto]");
      if (g) api.open(g.getAttribute("data-goto"), { goto: true });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || el.hidden || e.target.id === "global-search") return;
      api.close(false);
    });
    return api;
  }

  PORTAL.drawer = {
    create: create, esc: esc, section: section, link: link, links: links, value: value, head: head,
    NOT_APPLICABLE: NOT_APPLICABLE, NOT_DEFINED: NOT_DEFINED
  };
})();
