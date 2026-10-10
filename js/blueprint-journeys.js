/* Guided platform flows. Content is authored in architecture.journeys in toolkit.yaml. */
(function () {
  'use strict';
  var BP = window.PORTAL && PORTAL.blueprint;
  if (!BP) return;
  var S = BP.state, esc = BP.esc, journeys = BP.K.architecture.journeys;
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var playing = !motion.matches, detailTab = 'setup', exceptionOpen = false, lastFlow = '';
  var width = 1320, stride = 262, cardWidth = 220;
  function x(i) { return 26 + i * stride; }
  function current() { return journeys.find(function(j) { return j.id === S.section; }); }
  function button(label, attrs, cls) { return '<button type="button" class="'+(cls || 'journey-button')+'" '+attrs+'>'+label+'</button>'; }

  function navigation() {
    document.getElementById('bp-sections').innerHTML = journeys.map(function(j, i) {
      return button('<span class="section-icon">'+BP.icon(j.icon)+'</span><span class="section-copy"><small>0'+(i+1)+' / '+esc(j.subtitle)+'</small><strong>'+esc(j.title)+'</strong><span class="section-mini-flow" aria-hidden="true">'+j.steps.map(function(s){return '<i class="mini-'+esc(s.tone||j.id)+'"></i>';}).join('<b>→</b>')+'</span></span><span class="section-open" aria-hidden="true">→</span>',
        'data-section="'+j.id+'" aria-pressed="'+(S.section===j.id)+'" aria-controls="bp-journey"', 'section-card section-'+j.id);
    }).join('');
  }
  function wires(j, selected) {
    var h='<svg class="journey-wires" viewBox="0 0 1320 390" aria-hidden="true"><defs><marker id="journey-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10Z"/></marker><marker id="journey-return" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10Z"/></marker></defs>';
    j.steps.slice(0,-1).forEach(function(s,i) {
      var d='M'+(x(i)+cardWidth)+' 181 H'+(x(i+1)-3);
      h+='<g class="journey-wire'+(i===selected?' is-current':'')+'"><path class="journey-line" d="'+d+'" marker-end="url(#journey-arrow)"/><path class="journey-pulse" d="'+d+'"/><title>'+esc(s.title+' → '+j.steps[i+1].title+': '+s.handoff)+'</title></g>';
    });
    var from=x(j.exception.from)+cardWidth/2, to=x(j.exception.to)+cardWidth/2;
    h+='<path class="journey-return" d="M'+from+' 284 V311 Q'+from+' 321 '+(from-10)+' 321 H'+(to+10)+' Q'+to+' 321 '+to+' 311 V286" marker-end="url(#journey-return)"/>';
    return h+'</svg>';
  }
  function map(j, selected) {
    return '<div class="journey-scroll" id="journey-scroll" role="region" tabindex="0" aria-label="'+esc(j.title)+': five steps from left to right. Scroll horizontally to explore."><div id="journey-canvas"><div id="journey-world" class="journey-world'+(playing?'':' is-paused')+'">'+
      j.lanes.map(function(l){return '<div class="journey-lane" style="left:'+(x(l.start)-12)+'px;width:'+((l.end-l.start)*stride+cardWidth+24)+'px"><span>'+esc(l.label)+'</span></div>';}).join('')+wires(j, selected)+
      '<ol class="journey-nodes">'+j.steps.map(function(s,i){
        return '<li style="left:'+x(i)+'px">'+button('<span class="step-top">'+BP.icon(s.icon)+'<span class="step-number">0'+(i+1)+'</span></span><strong>'+esc(s.title)+'</strong><span class="step-caption">'+esc(s.caption)+'</span><span class="step-items">'+s.items.map(function(item){return '<span>'+esc(item)+'</span>';}).join('')+'</span><span class="step-open">'+(i===selected?'Viewing this step':'Explore step')+' <span aria-hidden="true">→</span></span>',
          'id="journey-step-'+s.id+'" data-journey-step="'+s.id+'" aria-pressed="'+(i===selected)+'" aria-controls="journey-guide"', 'journey-node journey-tone-'+(s.tone||j.id))+'</li>';
      }).join('')+'</ol>'+button('<span aria-hidden="true">↶</span> '+esc(j.exception.label)+' <span aria-hidden="true">'+(exceptionOpen?'−':'+')+'</span>', 'id="journey-exception" aria-expanded="'+exceptionOpen+'" aria-controls="journey-exception-detail"', 'journey-exception')+'</div></div></div>';
  }
  function guide(j, index) {
    var s=j.steps[index];
    var resources=s.resources.map(function(id) {
      var n=BP.byId[id], layout=BP.layouts[id];
      return button(BP.icon(layout?layout.icon:'workspace')+'<span>'+esc(n.title)+'</span><span aria-hidden="true">→</span>', 'data-journey-resource="'+id+'" aria-controls="map-drawer" aria-expanded="'+(S.node===id)+'"', 'journey-resource');
    }).join('');
    return '<div class="guide-heading"><div><p class="bp-eyebrow" role="status">STEP 0'+(index+1)+' OF 05 · '+esc(j.title)+'</p><h3 id="journey-guide-title">'+esc(s.title)+'</h3><p>'+esc(s.summary)+'</p></div><div class="guide-paging">'+button('← Previous', 'data-step-direction="-1"'+(index===0?' disabled':''))+button(index===j.steps.length-1?'End of flow':'Next step →', 'data-step-direction="1"'+(index===j.steps.length-1?' disabled':''))+'</div></div>'+
      '<div class="guide-tabs" role="tablist" aria-label="Step guidance">'+['setup','access'].map(function(t){return button(t==='setup'?'How to move this step':'Access & controls', 'role="tab" id="guide-tab-'+t+'" data-guide-tab="'+t+'" aria-controls="guide-panel-'+t+'" aria-selected="'+(detailTab===t)+'" tabindex="'+(detailTab===t?0:-1)+'"');}).join('')+'</div>'+
      '<div role="tabpanel" id="guide-panel-setup" aria-labelledby="guide-tab-setup" tabindex="0"'+(detailTab==='setup'?'':' hidden')+'><div class="guide-grid"><div class="guide-input"><span class="guide-label">01 / Start with</span><p>'+esc(s.input)+'</p><span class="guide-label">Components in this step</span><div class="journey-resources">'+resources+'</div></div><div class="guide-actions"><span class="guide-label">02 / Move it forward</span><ol>'+s.actions.map(function(a){return '<li>'+esc(a)+'</li>';}).join('')+'</ol></div><div class="guide-output"><span class="guide-label">03 / Ready for the next step</span><p>'+esc(s.output)+'</p><div class="guide-gate">'+BP.icon('shield')+'<div><strong>Gate to continue</strong><p>'+esc(s.gate)+'</p></div></div></div></div></div>'+
      '<div role="tabpanel" id="guide-panel-access" aria-labelledby="guide-tab-access" tabindex="0"'+(detailTab==='access'?'':' hidden')+'><div class="guide-access">'+s.access.map(function(a){return '<article>'+BP.icon('identity')+'<p>'+esc(a)+'</p></article>';}).join('')+'</div><p class="guide-access-hint">Open a component under “How to move this step” for service-specific setup, roles and permission scopes.</p></div>';
  }
  function resize() {
    var viewport=document.getElementById('journey-scroll'), canvas=document.getElementById('journey-canvas'), world=document.getElementById('journey-world');
    if(!viewport || !viewport.clientWidth) return;
    var scale=Math.max(.85, Math.min(1, viewport.clientWidth/width));
    canvas.style.width=width*scale+'px';canvas.style.height=390*scale+'px';
    world.style.transform='scale('+scale+')';
  }
  function render() {
    navigation();
    var j=current(), host=document.getElementById('bp-journey'), resourceView=document.getElementById('bp-resource-view');
    host.hidden=!j;resourceView.hidden=!!j;
    if(!j) { lastFlow='';return; }
    var index=j.steps.findIndex(function(s){return s.id===S.step;});
    if(index<0) { index=0;S.step=j.steps[0].id; }
    // Preserve canvas position when a step or its component inspector is selected.
    var old=document.getElementById('journey-scroll'), left=old&&lastFlow===j.id?old.scrollLeft:0;
    host.dataset.journey=j.id;
    host.innerHTML='<div class="journey-heading"><div><p class="bp-eyebrow">'+esc(j.subtitle)+' · 5 connected steps</p><h2>'+esc(j.title)+'</h2><p>'+esc(j.intro)+'</p></div><div class="journey-tools">'+button('View resource architecture →', 'data-section="resources"', 'journey-text-button')+button(motion.matches?'Motion reduced':playing?'Pause flow':'Play flow', 'id="journey-play" aria-pressed="'+playing+'"'+(motion.matches?' disabled':''))+'</div></div>'+map(j,index)+
      '<div id="journey-exception-detail" class="journey-exception-detail"'+(exceptionOpen?'':' hidden')+'>'+BP.icon('shield')+'<p>'+esc(j.exception.detail)+'</p></div>'+
      '<div class="journey-map-footer"><span><i aria-hidden="true"></i> '+esc(j.outcome)+'</span><small>Illustrative flow · select any step to explore</small></div>'+
      '<section class="journey-guide" id="journey-guide" aria-labelledby="journey-guide-title">'+guide(j,index)+'</section>'+
      (j.note?'<p class="journey-note">'+esc(j.note)+'</p>':'');
    lastFlow=j.id;resize();document.getElementById('journey-scroll').scrollLeft=left;
  }
  function selectStep(id) {
    BP.closeDrawer(true);S.step=id;exceptionOpen=false;BP.render();BP.writeHash();
    var step=document.getElementById('journey-step-'+id);
    if(step) { step.focus({preventScroll:true});step.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'}); }
  }
  function selectSection(id) {
    BP.closeDrawer(true);S.node=null;S.section=id;S.step='';exceptionOpen=false;detailTab='setup';BP.render();BP.writeHash();
    var selected=document.querySelector('[data-section="'+id+'"]');
    if(id==='resources') document.querySelector('.resource-view-heading h2').scrollIntoView({block:'nearest'});
    else if(selected) selected.focus({preventScroll:true});
  }
  function tab(id, focus) {
    detailTab=id;
    document.querySelectorAll('[data-guide-tab]').forEach(function(b){var active=b.dataset.guideTab===id;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;document.getElementById('guide-panel-'+b.dataset.guideTab).hidden=!active;if(active&&focus)b.focus();});
  }
  document.addEventListener('DOMContentLoaded',function(){
    document.addEventListener('click',function(e){
      var b=e.target.closest('[data-section],[data-journey-step],[data-step-direction],[data-journey-resource],[data-guide-tab],#journey-play,#journey-exception');
      if(!b)return;
      if(b.hasAttribute('data-section')) return selectSection(b.dataset.section);
      if(b.hasAttribute('data-journey-step')) return selectStep(b.dataset.journeyStep);
      if(b.hasAttribute('data-step-direction')) { var j=current(),i=j.steps.findIndex(function(s){return s.id===S.step;})+Number(b.dataset.stepDirection);if(j.steps[i])selectStep(j.steps[i].id);return; }
      if(b.hasAttribute('data-journey-resource')) return BP.openDrawer(b.dataset.journeyResource,{where:'journey'},'overview');
      if(b.hasAttribute('data-guide-tab')) return tab(b.dataset.guideTab,false);
      if(b.id==='journey-play') { playing=!playing;document.getElementById('journey-world').classList.toggle('is-paused',!playing);b.textContent=playing?'Pause flow':'Play flow';b.setAttribute('aria-pressed',String(playing)); }
      if(b.id==='journey-exception') { exceptionOpen=!exceptionOpen;document.getElementById('journey-exception-detail').hidden=!exceptionOpen;b.setAttribute('aria-expanded',String(exceptionOpen));b.lastElementChild.textContent=exceptionOpen?'−':'+'; }
    });
    document.addEventListener('keydown',function(e){
      if(e.target.matches('[data-guide-tab]') && ['ArrowLeft','ArrowRight','Home','End'].indexOf(e.key)>-1) { e.preventDefault();tab(e.key==='Home'?'setup':e.key==='End'?'access':detailTab==='setup'?'access':'setup',true); }
    });
    window.addEventListener('resize',resize);
    motion.addEventListener('change',function(){playing=!motion.matches;render();});
  });
  BP.journeys={render:render};
})();
