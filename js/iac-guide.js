/* Resource hierarchy from config/toolkit.yaml, generated as PORTAL.toolkit.
   Permalinks preserve resource selection, branch ownership, delivery phases and alternative views. */
(function () {
  "use strict";
  var K = window.PORTAL && PORTAL.toolkit;
  if (!K) return;

  var TYPE = { EXT: "Source", ING: "Ingestion", STORE: "Data storage", PROC: "Processing", SERVE: "Analytics",
    ENR: "Enrichment", SVC: "Shared service", GOV: "Governance", MON: "Monitoring", PLAT: "Platform", PORTAL: "Portal" };
  var KIND = { boundary: "Boundary", "azure-resource": "Azure resource", "fabric-item": "Fabric item",
    "logical-layer": "Logical layer", external: "External source", "saas-service": "Shared service" };
  var byId = Object.create(null), children = Object.create(null), boxFn = Object.create(null),
    fnById = Object.create(null), unitById = Object.create(null), phaseById = Object.create(null), roots = [];
  K.nodes.forEach(function (n) {
    byId[n.id] = n;
    if (n.parent == null) roots.push(n);
    else (children[n.parent] = children[n.parent] || []).push(n);
  });
  K.boxes.forEach(function (b) { boxFn[b.id] = b.fn; });
  K.functions.forEach(function (f) { fnById[f.id] = f; });
  K.units.forEach(function (u) { unitById[u.id] = u; });
  K.phases.forEach(function (p) { phaseById[p.id] = p; });
  var order = [];
  function walk(n) { order.push(n); (children[n.id] || []).forEach(walk); }
  roots.forEach(walk);
  var state = { node: null, section: "iac", step: "", colour: "none", value: "", box: "", phases: { v1: true, next: true, future: true }, view: "map" };

  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function ancestors(n) {
    var path = [], seen = Object.create(null);
    while (n && !seen[n.id]) { seen[n.id] = true; path.unshift(n); n = n.parent == null ? null : byId[n.parent]; }
    return path;
  }
  function allPhases() { return Object.keys(state.phases).every(function (p) { return state.phases[p]; }); }
  function matches(n) {
    if (state.colour === "function" && state.value) return n.branchBoxes.some(function (b) { return boxFn[b] === state.value; });
    if (state.colour === "unit" && state.value) return n.unit === state.value;
    return true;
  }
  function isDim(n) { return !matches(n) || !state.phases[n.phase]; }
  function fnOf(n) { return fnById[state.colour === "function" && state.value && matches(n) ? state.value : boxFn[n.branchBoxes[0]]]; }
  function chipText(n) {
    var item = state.colour === "function" ? fnOf(n) : unitById[n.unit];
    return item ? item.short || item.label : n.unit;
  }
  function colourOf(n) {
    var item = state.colour === "function" ? fnOf(n) : state.colour === "unit" ? unitById[n.unit] : null;
    return item ? item.color : null;
  }
  function phaseHtml(n) {
    var p = phaseById[n.phase];
    return '<span class="badge-phase phase-' + p.id + '"><span aria-hidden="true">' + p.icon + '</span> ' + esc(p.label) + '</span>';
  }
  function statusHtml(key) {
    var s = K.statuses[key];
    return '<span class="status status-' + s.cls + '"><span class="icon" aria-hidden="true">' + s.icon + '</span> ' + esc(s.word) + '</span>';
  }
  function ariaLabel(n) {
    return (n.resourceType || TYPE[n.tag]) + ': ' + n.title + '. ' + n.subtitle + '. Phase ' + phaseById[n.phase].label +
      '. ' + K.statuses[n.status].word + '. Proposed owner ' + n.unit + '.' + (isDim(n) ? ' Outside the current filter.' : '');
  }
  var diagram = K.architecture.diagram, layouts = Object.create(null);
  diagram.nodes.forEach(function (p) { layouts[p.id] = p; });
  var connectionMode = 'data', scale = 1, fitted = true;
  var reducedMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var running = !reducedMotion.matches;
  var icons = {
    azure:'<path d="m16 3-9 20h7l5-7-4-1 3-8 7 17H7l5-4"/>',
    fabric:'<path d="M5 9 17 3l10 5-12 6Zm0 6 10 5 12-6M5 21l10 5 12-6M5 9v12M15 14v12M27 8v12"/>',
    lake:'<ellipse cx="16" cy="7" rx="10" ry="4"/><path d="M6 7v17c0 5 20 5 20 0V7M6 15c0 5 20 5 20 0M6 22c0 5 20 5 20 0"/>',
    database:'<ellipse cx="16" cy="7" rx="9" ry="4"/><path d="M7 7v17c0 5 18 5 18 0V7M7 15c0 5 18 5 18 0"/>',
    pipeline:'<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="21" y="20" width="8" height="8" rx="2"/><path d="M7 11v13h14M21 20l4-4 4 4M21 7h7M25 3l4 4-4 4"/>',
    network:'<path d="m16 3 12 7v13l-12 7-12-7V10ZM4 10l12 7 12-7M16 17v13"/>',
    key:'<circle cx="11" cy="11" r="7"/><path d="m16 16 12 12M21 21l4-4M25 25l4-4"/>',
    identity:'<circle cx="12" cy="10" r="5"/><path d="M3 26v-4c0-7 18-7 18 0v4M23 6l6 3v7c0 5-6 8-6 8"/>',
    shield:'<path d="m16 3 11 4v10c0 7-11 12-11 12S5 24 5 17V7ZM10 15l4 4 8-9"/>',
    catalog:'<path d="M4 5h10l3 3h11v20H4ZM9 14h14M9 19h14M9 24h8"/>',
    code:'<path d="m10 7-7 9 7 9M22 7l7 9-7 9M19 4l-6 24"/>',
    monitor:'<rect x="3" y="4" width="26" height="19" rx="2"/><path d="m6 17 5-6 5 7 6-9 4 4M16 23v6M10 29h12"/>',
    powerbi:'<rect x="5" y="17" width="5" height="12" rx="1"/><rect x="13" y="10" width="5" height="19" rx="1"/><rect x="21" y="3" width="5" height="26" rx="1"/>',
    model:'<rect x="11" y="2" width="10" height="7" rx="1"/><rect x="2" y="23" width="10" height="7" rx="1"/><rect x="21" y="23" width="10" height="7" rx="1"/><path d="M16 9v8M7 23v-6h19v6"/>',
    capacity:'<rect x="8" y="8" width="16" height="16" rx="2"/><path d="M12 2v6M20 2v6M12 24v6M20 24v6M2 12h6M2 20h6M24 12h6M24 20h6M13 13h6v6h-6Z"/>',
    workspace:'<rect x="3" y="6" width="26" height="23" rx="2"/><path d="M11 6V2h10v4M3 14h26M11 14v15"/>',
    source:'<path d="M5 3h16l6 6v20H5ZM21 3v7h6M10 16h12M10 22h12"/>',
    link:'<path d="m12 8 3-3c7-7 17 3 10 10l-3 3M10 14l-3 3c-7 7 3 17 10 10l3-3M11 21l10-10"/>'
  };
  function icon(kind) { return '<svg class="service-icon" viewBox="0 0 32 32" aria-hidden="true">' + (icons[kind] || icons.workspace) + '</svg>'; }
  function visibleId(id) {
    var n = byId[id];
    while (n && !layouts[n.id]) n = n.parent == null ? null : byId[n.parent];
    return n ? n.id : null;
  }
  function category(e) {
    if (/^(pl-entra|pl-network|pl-dns|pl-kv|g-catalog)$/.test(e.from)) return 'access';
    if (/^(m-logs|m-hub|pl-workspaces|azure)$/.test(e.to) && /^(pl-capacity|pl-repo|i-adf|i-fabric)$/.test(e.from)) return 'ops';
    if (e.type === 'return') return 'ops';
    return e.type === 'primary' ? 'data' : 'control';
  }
  var connections = [];
  K.edges.forEach(function (edge) {
    var a = visibleId(edge.from), b = visibleId(edge.to), type = category(edge);
    if (!a || !b || a === b) return;
    var existing = connections.find(function (e) { return e.from === a && e.to === b; });
    if (existing) { existing.edges.push(edge); if(type==='data')existing.kind='data'; return; }
    connections.push({ from:a, to:b, kind:type, label:edge.label, edges:[edge] });
  });
  function shown(e) { return connectionMode === 'all' || (connectionMode === 'access' ? e.kind === 'access' : e.kind === 'data' || e.kind === 'control'); }
  var routes = {
    'sources>i-adf': [[185,398],[215,398],[215,352],[250,352]],
    'i-adf>st-bronze': [[415,352],[445,352],[445,388],[485,388]],
    'i-adf>st-quarantine': [[333,405],[333,450],[715,450],[715,433]],
    'i-adf>i-fabric': [[333,300],[333,220],[860,220],[860,385],[1015,385],[1015,403]],
    'st-bronze>st-bronze-view': [[558,433],[558,480],[847,480],[847,598],[925,598]],
    'i-fabric>p-spark': [[1105,445],[1250,445]],
    'st-bronze-view>p-spark': [[1000,550],[1000,520],[1215,520],[1215,445],[1250,445]],
    'p-spark>st-silver': [[1357,488],[1357,520],[1190,520],[1190,550]],
    'st-silver>p-spark': [[1190,550],[1190,503],[1230,503],[1230,463],[1250,463]],
    'st-silver>st-gold': [[1265,598],[1305,598]],
    'st-gold>sv-model': [[1385,645],[1385,679],[1190,679],[1190,703]],
    'sv-model>sv-pbi': [[1265,739],[1305,739]],
    'pl-network>st-adls': [[270,742],[235,742],[235,455],[465,455]],
    'pl-network>pl-kv': [[505,742],[550,742],[550,681],[590,681]],
    'pl-dns>pl-vnet': [[590,770],[525,770]],
    'pl-kv>i-adf': [[590,681],[550,681],[550,612],[435,612],[435,275],[333,275],[333,300]],
    'pl-entra>st-adls': [[779,102],[779,135],[847,135],[847,232],[780,232],[780,248]],
    'pl-entra>pl-workspaces': [[795,102],[795,130],[864,130],[864,367],[900,367]],
    'pl-entra>sv-model': [[820,102],[820,126],[1536,126],[1536,685],[1190,685],[1190,703]],
    'g-catalog>st-adls': [[1030,102],[1030,138],[842,138],[842,235],[620,235],[620,248]],
    'g-catalog>pl-workspaces': [[1050,102],[1050,134],[1530,134],[1530,363],[1495,363]],
    'i-adf>m-logs': [[333,405],[333,448],[450,448],[450,548],[535,548]],
    'i-fabric>m-hub': [[1105,423],[1168,423],[1168,309],[1345,309],[1345,296]],
    'pl-capacity>pl-workspaces': [[415,545],[440,545],[440,608],[860,608],[860,749],[900,749]],
    'pl-repo>azure': [[1300,102],[1300,143],[500,143],[500,155]],
    'pl-repo>pl-workspaces': [[1400,102],[1400,133],[1545,133],[1545,380],[1495,380]],
    'p-spark>st-quarantine': [[1465,445],[1506,445],[1506,812],[818,812],[818,448],[715,448],[715,433]]
  };
  var labels = {
    'sources>i-adf':[145,287,'Approved feeds'],
    'i-adf>st-bronze':[438,334,'Copy'],
    'i-adf>i-fabric':[605,212,'Batch handoff'],
    'st-bronze>st-bronze-view':[714,497,'Shortcut · no copy'],
    'i-fabric>p-spark':[1175,436,'Run notebook'],
    'st-bronze-view>p-spark':[1080,512,'Read raw'],
    'p-spark>st-silver':[1340,538,'Validate'],
    'st-silver>st-gold':[1285,585,'Curate'],
    'st-gold>sv-model':[1320,672,'Model source'],
    'pl-network>st-adls':[330,446,'Private connection'],
    'pl-network>pl-kv':[560,729,'Private link'],
    'pl-kv>i-adf':[484,604,'Secret reference'],
    'pl-entra>st-adls':[702,228,'Data permissions'],
    'pl-entra>pl-workspaces':[865,312,'Workspace roles'],
    'g-catalog>pl-workspaces':[1430,133,'Metadata / lineage'],
    'pl-capacity>pl-workspaces':[681,622,'Assign capacity']
  };
  function pathFor(e) {
    var pts = routes[e.from + '>' + e.to], a = layouts[e.from], b = layouts[e.to];
    if (!pts) {
      var ax=a.x+a.w, ay=a.y+a.h/2, bx=b.x, by=b.y+b.h/2, mid=(ax+bx)/2;
      pts=[[ax,ay],[mid,ay],[mid,by],[bx,by]];
    }
    // Rounded orthogonal corners keep crossing routes legible.
    var d='M'+pts[0].join(' ');
    for (var i=1;i<pts.length;i++) {
      var p=pts[i], prev=pts[i-1], next=pts[i+1];
      if (!next) { d+=' L'+p.join(' '); break; }
      var r=Math.min(9,Math.hypot(p[0]-prev[0],p[1]-prev[1])/2,Math.hypot(next[0]-p[0],next[1]-p[1])/2);
      d+=' L'+(p[0]-Math.sign(p[0]-prev[0])*r)+' '+(p[1]-Math.sign(p[1]-prev[1])*r)+' Q'+p.join(' ')+' '+(p[0]+Math.sign(next[0]-p[0])*r)+' '+(p[1]+Math.sign(next[1]-p[1])*r);
    }
    return d;
  }
  function edgesSvg() {
    var h='<svg class="bp-wires" width="'+diagram.width+'" height="'+diagram.height+'" aria-label="Directed service connections"><defs>';
    ['data','control','access','ops'].forEach(function (type) {
      h+='<marker id="arrow-'+type+'" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z" class="arrow-'+type+'"/></marker>';
    });
    h+='</defs>';
    connections.forEach(function (e,i) {
      if (!shown(e)) return;
      var label=labels[e.from+'>'+e.to], d=pathFor(e), description=byId[e.from].title+' → '+byId[e.to].title+': '+e.edges.map(function(x){return x.label;}).join('; ');
      h+='<g class="bp-connection connection-'+e.kind+'" data-connection="'+i+'" data-from="'+e.from+'" data-to="'+e.to+'" role="button" tabindex="0" aria-label="'+esc(description)+'"><title>'+esc(description)+'</title>'+
        '<path class="wire-hit" d="'+d+'"/><path class="wire-base" d="'+d+'" marker-end="url(#arrow-'+e.kind+')"/><path class="flow-pulse" d="'+d+'"/>';
      if(label) h+='<text class="wire-label" x="'+label[0]+'" y="'+label[1]+'" text-anchor="middle">'+esc(label[2])+'</text>';
      h+='</g>';
    });
    return h+'</svg>';
  }
  function nodeHtml(p) {
    var n=byId[p.id], col=colourOf(n), members=children[n.id] || [];
    var tone=/bronze/.test(n.id)?'bronze':n.id==='st-silver'?'silver':n.id==='st-gold'?'gold':p.icon==='powerbi'?'bi':'';
    var clazz='bp-node '+(p.boundary?'bp-boundary-head':'bp-service')+(isDim(n)?' is-dim':'')+(state.node===n.id?' is-selected':'');
    if(state.box && n.branchBoxes.indexOf(state.box)>-1) clazz+=' is-traced';
    var style='left:'+p.x+'px;top:'+p.y+'px;width:'+p.w+'px;height:'+(p.boundary?70:p.h)+'px;'+(col?'--ownership-color:'+col+';':'');
    return '<button type="button" id="bp-node-'+n.id+'" class="'+clazz+' tone-'+tone+' service-'+p.icon+'" data-node="'+n.id+'" style="'+style+'" aria-label="'+esc(ariaLabel(n))+'" aria-controls="map-drawer" aria-expanded="'+(state.node===n.id)+'">'+icon(p.icon)+
      '<span class="service-copy"><strong>'+esc(p.label)+'</strong><span>'+esc(p.caption)+'</span></span>'+
      (members.length?'<span class="inside-count" aria-label="'+members.length+' components inside">'+members.length+' inside</span>':'')+
      '<svg class="node-open" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M4 4h8v8"/></svg></button>';
  }
  function render() {
    var canvas=document.getElementById('bp-canvas');
    if(!canvas) return;
    var boundaries=diagram.nodes.filter(function(p){return p.boundary;}).map(function(p){
      return '<div class="bp-boundary boundary-'+p.id+'" data-boundary="'+p.id+'" style="left:'+p.x+'px;top:'+p.y+'px;width:'+p.w+'px;height:'+p.h+'px" aria-hidden="true"></div>';
    }).join('');
    canvas.innerHTML='<div class="bp-world'+(running?'':' is-paused')+'" id="bp-world">'+boundaries+edgesSvg()+diagram.nodes.map(nodeHtml).join('')+
      '<div class="diagram-footnote" style="left:240px;top:846px">Azure PaaS services sit outside the customer VNet. Fabric is a connected SaaS service.</div></div>';
    var active=order.filter(function(n){return !isDim(n);}).length;
    document.getElementById('bp-filter-status').textContent=active===order.length?'Select a component to explore inside. Hover to trace connections.':active+' of '+order.length+' components match your filters.';
    if(BP.afterRender) BP.afterRender();
    resizeScene();
    highlight(state.node);
  }
  function resizeScene() {
    var viewport=document.getElementById('bp-scroll'), world=document.getElementById('bp-world'), canvas=document.getElementById('bp-canvas');
    if(!world || !viewport.clientWidth) return;
    if(fitted) scale=Math.max(0.65,Math.min(1.12,(viewport.clientWidth-24)/diagram.width));
    world.style.width=diagram.width+'px';world.style.height=diagram.height+'px';world.style.transform='scale('+scale+')';
    canvas.style.width=diagram.width*scale+'px';canvas.style.height=diagram.height*scale+'px';
    var label=document.getElementById('bp-zoom-label');if(label) label.textContent=Math.round(scale*100)+'%';
  }
  function highlight(id) {
    var selected=visibleId(id), related=Object.create(null), focusIds=Object.create(null);
    function include(n) { if(!n)return; var visible=visibleId(n.id); if(visible){focusIds[visible]=true;related[visible]=true;} (children[n.id]||[]).forEach(include); }
    include(byId[id]);
    connections.filter(shown).forEach(function(e){if(focusIds[e.from] || focusIds[e.to]){related[e.from]=true;related[e.to]=true;}});
    document.querySelectorAll('.bp-connection').forEach(function(el){
      var relevant=focusIds[el.dataset.from] || focusIds[el.dataset.to];
      el.classList.toggle('is-muted',!!selected && !relevant);el.classList.toggle('is-active',!!selected && relevant);
    });
    document.querySelectorAll('#bp-canvas .bp-service').forEach(function(el){
      el.classList.toggle('is-unrelated',!!selected && !related[el.dataset.node]);el.classList.toggle('is-connected',!!selected && !!related[el.dataset.node]);
    });
  }
  function setupSceneControls() {
    document.querySelectorAll('[data-connection-mode]').forEach(function(button){button.addEventListener('click',function(){
      connectionMode=button.dataset.connectionMode;
      document.querySelectorAll('[data-connection-mode]').forEach(function(b){b.setAttribute('aria-pressed',String(b===button));});
      render();
    });});
    var play=document.getElementById('bp-play');
    function animationLabel(){play.disabled=reducedMotion.matches;play.textContent=reducedMotion.matches?'Motion reduced':running?'Pause flow':'Play flow';play.setAttribute('aria-pressed',String(running));}
    play.addEventListener('click',function(){running=!running;document.getElementById('bp-world').classList.toggle('is-paused',!running);animationLabel();});
    animationLabel();
    if(reducedMotion.addEventListener) reducedMotion.addEventListener('change',function(e){if(e.matches){running=false;document.getElementById('bp-world').classList.add('is-paused');}animationLabel();});
    document.querySelectorAll('[data-zoom]').forEach(function(button){button.addEventListener('click',function(){
      var action=button.dataset.zoom; fitted=action==='fit';
      if(!fitted) scale=Math.max(0.45,Math.min(1.6,scale+(action==='in'?0.15:-0.15)));
      resizeScene();
    });});
    var viewport=document.getElementById('bp-scroll');
    viewport.addEventListener('pointerover',function(e){var b=e.target.closest('[data-node]');if(b)highlight(b.dataset.node);});
    viewport.addEventListener('pointerout',function(e){if(e.target.closest('[data-node]'))highlight(state.node);});
    viewport.addEventListener('focusin',function(e){var b=e.target.closest('[data-node]');if(b)highlight(b.dataset.node);});
    viewport.addEventListener('focusout',function(){highlight(state.node);});
    function openConnection(e){var edge=e.target.closest('[data-connection]');if(!edge)return;var c=connections[Number(edge.dataset.connection)];BP.openDrawer(c.edges[0].from,{el:edge},'connections');}
    viewport.addEventListener('click',openConnection);
    viewport.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&e.target.closest('[data-connection]')){e.preventDefault();openConnection(e);}});
    // Drag blank space to pan; touch users retain native scrolling and pinch zoom.
    var drag=null;
    viewport.addEventListener('pointerdown',function(e){if(e.pointerType==='touch'||e.button!==0||e.target.closest('button,[data-connection]'))return;drag={x:e.clientX,y:e.clientY,left:viewport.scrollLeft,top:viewport.scrollTop};viewport.setPointerCapture(e.pointerId);viewport.classList.add('is-panning');});
    viewport.addEventListener('pointermove',function(e){if(drag){viewport.scrollLeft=drag.left-(e.clientX-drag.x);viewport.scrollTop=drag.top-(e.clientY-drag.y);}});
    function stopDrag(){drag=null;viewport.classList.remove('is-panning');}
    viewport.addEventListener('pointerup',stopDrag);viewport.addEventListener('pointercancel',stopDrag);
    window.addEventListener('resize',resizeScene);
  }

  function writeHash() {
    var p = [];
    if (state.section !== 'iac' || state.node) p.push('section=' + state.section);
    if (state.step && state.section !== 'resources') p.push('step=' + encodeURIComponent(state.step));
    if (state.node) p.push('node=' + encodeURIComponent(state.node));
    if (state.colour !== 'none') p.push('colour=' + state.colour);
    if (state.value) p.push('value=' + encodeURIComponent(state.value));
    if (state.box) p.push('box=' + encodeURIComponent(state.box));
    if (!allPhases()) p.push('phases=' + Object.keys(state.phases).filter(function (k) { return state.phases[k]; }).join(','));
    if (state.view !== 'map') p.push('view=' + state.view);
    try { history.replaceState(null, '', location.pathname + location.search + (p.length ? '#' + p.join('&') : '')); } catch (err) { /* file:// preview */ }
  }
  function readState() {
    var raw = location.hash.slice(1), h = new URLSearchParams(raw.indexOf('=') > -1 ? raw : '');
    var colour = h.get('colour'), phases = h.get('phases'), view = h.get('view');
    state.colour = colour === 'function' || colour === 'unit' ? colour : 'none';
    state.value = h.get('value') || '';
    if (state.colour === 'function' && !fnById[state.value] || state.colour === 'unit' && !unitById[state.value] || state.colour === 'none') state.value = '';
    state.box = boxFn[h.get('box')] ? h.get('box') : '';
    state.phases = { v1: true, next: true, future: true };
    if (h.has('phases')) Object.keys(state.phases).forEach(function (k) { state.phases[k] = phases.split(',').indexOf(k) > -1; });
    state.view = view === 'list' || view === 'branch' ? view : 'map';
    var node = h.get('node');
    var section = h.get('section');
    state.section = section === 'resources' || K.architecture.journeys.some(function(j){return j.id === section;}) ? section :
      (byId[node] || h.has('view') || h.has('colour') || h.has('phases') ? 'resources' : 'iac');
    var journey = K.architecture.journeys.find(function(j){return j.id === state.section;});
    state.step = journey && journey.steps.some(function(s){return s.id === h.get('step');}) ? h.get('step') : journey ? journey.steps[0].id : '';
    return node && byId[node] ? node : null;
  }
  var BP = PORTAL.blueprint = {
    K: K, state: state, byId: byId, boxFn: boxFn, fnById: fnById, unitById: unitById, phaseById: phaseById,
    esc: esc, statusHtml: statusHtml, phaseHtml: phaseHtml, isDim: isDim, typeName: function (t) { return TYPE[t] || t; },
    icon: icon, layouts: layouts, visibleId: visibleId, setupSceneControls: setupSceneControls, resizeScene: resizeScene, order: order, roots: roots, children: children, ancestors: ancestors, render: render, writeHash: writeHash, readState: readState, chipText: chipText
  };
})();
