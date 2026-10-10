/* Platform blueprint: resource details, hierarchy and branch responsibility views, toolbar wiring.
   The drawer shell
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

  var selectedTab = 'overview', connectionFocus = null;
  var tabs = [{id:'overview',label:'Inside'},{id:'setup',label:'Set up'},{id:'access',label:'Access'},{id:'connections',label:'Connections'}];
  function resourceIcon(n) { return BP.icon(BP.layouts[n.id] ? BP.layouts[n.id].icon : n.tag === 'STORE' ? 'database' : n.tag === 'EXT' ? 'source' : 'workspace'); }
  function content(n) {
    var members = BP.children[n.id] || [];
    var h = '<div class="inspector-icon">'+resourceIcon(n)+'</div>'+D.head(n.tag, esc(n.resourceType), n.title, n.subtitle);
    h += '<div class="inspector-tabs" role="tablist" aria-label="Component details">'+tabs.map(function(t){
      return '<button type="button" role="tab" id="inspector-tab-'+t.id+'" data-inspector-tab="'+t.id+'" aria-controls="inspector-panel-'+t.id+'" aria-selected="'+(selectedTab===t.id)+'" tabindex="'+(selectedTab===t.id?'0':'-1')+'">'+t.label+'</button>';
    }).join('')+'</div>';
    function panel(id,body) { return '<div role="tabpanel" id="inspector-panel-'+id+'" aria-labelledby="inspector-tab-'+id+'" tabindex="0"'+(selectedTab===id?'':' hidden')+'>'+body+'</div>'; }
    var overview = sec('Location','<nav class="bp-path" aria-label="Resource hierarchy">'+BP.ancestors(n).map(function(item){
      return item.id===n.id?'<span aria-current="location">'+esc(item.title)+'</span>':'<button type="button" class="drawer-goto" data-goto="'+item.id+'">'+esc(item.title)+'</button>';
    }).join('<span class="bp-path-separator" aria-hidden="true"> / </span>')+'</nav>');
    overview += sec('What it does','<p>'+esc(n.summary)+'</p>');
    if(members.length) overview += sec('Inside this component','<div class="inside-grid">'+members.map(function(child){
      return '<button type="button" class="drawer-goto inside-item" data-goto="'+child.id+'">'+resourceIcon(child)+'<span>'+esc(child.title)+'</span><small>Explore component →</small></button>';
    }).join('')+'</div>');
    overview += sec('Ownership','<p>'+esc(n.owner)+'</p><ul class="drawer-rel">'+n.branchBoxes.map(function(id){
      var box=K.boxes.find(function(x){return x.id===id;});
      return '<li><button type="button" class="drawer-goto" data-box="'+id+'" aria-pressed="'+(S.box===id)+'">'+esc(box.label)+'</button></li>';
    }).join('')+'</ul>');
    if(n.architectureNotes.length) overview += sec('Design notes','<ul class="bp-architecture-notes">'+n.architectureNotes.map(function(note){return '<li>'+esc(note)+'</li>';}).join('')+'</ul>');
    overview += '<p class="inspector-note">'+BP.statusHtml(n.status)+' · '+esc(K.asOf)+'. This design has not provisioned a resource.</p>';
    var setup='<p class="inspector-note">Implementation guide for your platform team. Adapt to approved region, tenant capabilities and environment. These steps do not execute changes.</p>';
    setup += '<ol class="setup-steps">'+n.setupSteps.map(function(step){return '<li><strong>'+esc(step.title)+'</strong><p>'+esc(step.detail)+'</p></li>';}).join('')+'</ol>';
    setup += sec('Service documentation',D.links(n.docs));
    var access='<p class="inspector-note">Grant permissions to approved groups and workload identities at the narrowest practical scope. Network reachability and data authorization are separate controls.</p>';
    access += n.accessControls.map(function(a){return '<article class="access-card"><strong>'+esc(a.principal)+'</strong><span class="access-role">'+esc(a.role)+'</span><p class="access-scope">Scope: '+esc(a.scope)+'</p><p>'+esc(a.note)+'</p></article>';}).join('');
    var contained=Object.create(null);
    function include(item){contained[item.id]=true;(BP.children[item.id]||[]).forEach(include);}
    include(n);
    var incoming=K.edges.filter(function(e){return contained[e.to]&&!contained[e.from];}), outgoing=K.edges.filter(function(e){return contained[e.from]&&!contained[e.to];});
    function connectionRows(edges,direction) { return edges.map(function(e){var other=byId[direction==='in'?e.from:e.to];return '<div class="connection-detail"><span class="connection-direction" aria-hidden="true">'+(direction==='in'?'↘':'↗')+'</span><div><small>'+(direction==='in'?'From':'To')+'</small><button type="button" class="drawer-goto" data-goto="'+other.id+'">'+esc(other.title)+'</button><p>'+esc(e.label)+'</p></div></div>';}).join(''); }
    var connections='<p class="inspector-note">Arrows show the direction of data or control in the proposed design. They are illustrative, not evidence of deployed connectivity.</p>';
    if(incoming.length) connections += sec('Incoming',connectionRows(incoming,'in'));
    if(outgoing.length) connections += sec('Outgoing',connectionRows(outgoing,'out'));
    if(!incoming.length&&!outgoing.length) connections += '<p class="inspector-note">This is a containing boundary or logical component. Explore its children for their individual connections.</p>';
    if(members.length) connections += sec('Explore internal connections','<div class="inside-grid">'+members.map(function(child){return '<button type="button" class="drawer-goto inside-item" data-goto="'+child.id+'">'+resourceIcon(child)+esc(child.title)+'</button>';}).join('')+'</div>');
    return h+panel('overview',overview)+panel('setup',setup)+panel('access',access)+panel('connections',connections);
  }
  function activateTab(id,focus) {
    selectedTab=id;
    tabs.forEach(function(t){
      var button=document.getElementById('inspector-tab-'+t.id),panel=document.getElementById('inspector-panel-'+t.id);
      if(!button||!panel)return;
      button.setAttribute('aria-selected',String(t.id===id));button.tabIndex=t.id===id?0:-1;panel.hidden=t.id!==id;
      if(focus&&t.id===id)button.focus();
    });
  }

  var shell = D.create({
    has: function (id) { return !!byId[id]; },
    render: function (id) { return content(byId[id]); },
    select: function (id) { S.node = id; BP.render(); BP.writeHash(); },
    deselect: function () { S.node = null; BP.render(); BP.writeHash(); },
    nodeEl: function (id) { return S.section === 'resources' && S.view === "map" ? document.getElementById("bp-node-" + BP.visibleId(id)) : null; },
    focusTarget: function (id) {
      if(S.section !== 'resources') return document.querySelector('[data-journey-resource="'+id+'"]') || document.getElementById('journey-step-'+S.step);
      if(S.view === 'map' && connectionFocus !== null) {
        var edge=document.querySelector('[data-connection="'+connectionFocus+'"]');
        if(edge)return edge;
      }
      return S.view === "map" ? document.getElementById("bp-node-" + BP.visibleId(id)) : document.querySelector('[data-list-node="' + id + '"]');
    }
  });
  function drawer() { return document.getElementById("map-drawer"); }
  BP.openDrawer = function (id, from, tab) {
    selectedTab=tab || 'overview';
    connectionFocus=from && from.el && from.el.hasAttribute('data-connection') ? from.el.dataset.connection : null;
    if(connectionFocus!==null)from={where:'connection'};
    if (shell) shell.open(id, from);
  };
  BP.closeDrawer = function (silent) { if (shell) shell.close(silent); };

  /* ---- List and branch views (same nodes, badges and drawer) ---- */
  function row(n, i, all, inBranch) {
    // Branch view repeats a resource under each responsibility it serves.
    return '<li class="map-list-item' + (BP.isDim(n) ? " is-dim" : "") + '"><button type="button" class="map-list-btn"' +
      (inBranch === true ? "" : ' id="bp-list-' + n.id + '"') + ' data-list-node="' + n.id +
      '" aria-controls="map-drawer" aria-expanded="' + (S.node === n.id) + '">' + esc(n.title) + "</button> " + BP.phaseHtml(n) +
      ' <span class="bp-chip">' + esc(BP.chipText(n)) + '</span><p class="bp-list-kind">' + esc(n.resourceType || BP.typeName(n.tag)) +
      '</p><p class="drawer-note">' + esc(n.subtitle) + '</p><p class="bp-list-path">' + esc(BP.ancestors(n).map(function (item) { return item.title; }).join(' / ')) + "</p></li>";
  }
  function groupsHtml() {
    return BP.roots.map(function (root) {
      return '<h3 class="bp-list-h">' + esc(root.title) + '</h3><ol class="map-list">' + BP.order.filter(function (n) {
        return BP.ancestors(n)[0].id === root.id;
      }).map(row).join("") + "</ol>";
    }).join("");
  }
  function branchHtml() {
    return K.functions.map(function (f) {
      return '<h3 class="bp-list-h">' + esc(f.label) + ' <span class="drawer-note">' + esc(f.unit) + "</span></h3>" +
        K.boxes.filter(function (b) { return b.fn === f.id; }).map(function (b) {
          var tools = BP.order.filter(function (n) { return n.branchBoxes.indexOf(b.id) > -1; });
          return '<h4 class="bp-box-h">' + esc(b.label) + "</h4>" + (tools.length ? '<ul class="map-list">' + tools.map(function (n) { return row(n, 0, null, true); }).join("") + "</ul>"
            : '<p class="drawer-empty">No technical resource assigned; this responsibility remains a branch activity.</p>');
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
      return '<li><span class="lg-box" style="border-left:5px solid ' + v.color + '" aria-hidden="true"></span>' + esc(v.label) + "</li>";
    }).join("");
    document.getElementById("bp-scroll").hidden = S.view !== "map";
    var lv = document.getElementById("bp-list");
    lv.hidden = S.view === "map";
    lv.innerHTML = S.view === "list" ? '<h2 class="sr-only">Blueprint as a list</h2>' + groupsHtml()
      : S.view === "branch" ? '<h2 class="sr-only">Resources by branch function and responsibility</h2><p class="drawer-note">Proposed technical ownership follows the branch functions. Resource mappings support these responsibilities; they do not replace policy, stewardship or business approval.</p>' + branchHtml() : "";
    if(BP.journeys) BP.journeys.render();
  };

  function update() { BP.render(); BP.writeHash(); }
  function refreshDrawer() { if (shell) shell.refresh(); }

  document.addEventListener("DOMContentLoaded", function () {
    if (!document.getElementById("bp-canvas")) return;
    document.getElementById('bp-asof').textContent = 'Planning baseline · ' + K.asOf;
    document.querySelectorAll('[data-phase]').forEach(function (button) {
      button.textContent = BP.phaseById[button.getAttribute('data-phase')].label;
    });
    document.getElementById('bp-notes').innerHTML = (K.architecture.notes || []).map(function (note) {
      return '<article class="bp-note"><h3>' + esc(note.title) + '</h3><p>' + esc(note.text) + '</p></article>';
    }).join('');
    var banner = document.getElementById("bp-banner");
    banner.querySelector("[data-banner-text]").textContent = K.banner.text;
    var bl = banner.querySelector("[data-banner-link]");
    bl.textContent = K.banner.linkLabel;
    bl.setAttribute("href", K.banner.href);
    document.getElementById("bp-considered").innerHTML = K.considered.map(function (c) {
      return "<li><strong>" + esc(c.name) + "</strong> · " + esc(c.reason) + "</li>";
    }).join("");
    document.getElementById("bp-oq").innerHTML = K.openQuestions.map(function (q) { return "<li>" + esc(q.text) + "</li>"; }).join("");
    bl.addEventListener("click", function () { document.getElementById("open-questions").open = true; });
    if (location.hash === "#open-questions") document.getElementById("open-questions").open = true;

    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-node],[data-list-node],[data-box],[data-colour],[data-value],[data-phase],#bp-view-list,#bp-view-branch");
      if (!t) return;
      if (t.hasAttribute("data-node")) return BP.openDrawer(t.getAttribute("data-node"), { where: "map" });
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
    window.addEventListener("hashchange", function () {
      if (location.hash === '#open-questions') document.getElementById('open-questions').open = true;
      else apply();
    });
    apply();
    BP.setupSceneControls();
    drawer().addEventListener('click',function(e){var button=e.target.closest('[data-inspector-tab]');if(button)activateTab(button.dataset.inspectorTab,false);});
    drawer().addEventListener('keydown',function(e){
      var button=e.target.closest('[data-inspector-tab]');if(!button)return;
      var index=tabs.findIndex(function(t){return t.id===button.dataset.inspectorTab;});
      if(e.key==='ArrowRight'||e.key==='ArrowLeft'||e.key==='Home'||e.key==='End'){
        e.preventDefault();
        index=e.key==='Home'?0:e.key==='End'?tabs.length-1:(index+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
        activateTab(tabs[index].id,true);
      }
    });
  });
})();
