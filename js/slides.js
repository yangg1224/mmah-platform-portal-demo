/* Shared slide component: step pills, Back/Next, arrow keys, state in the URL hash (#step=N, plus optional deck=ID).
   SLIDES.run({ steps: [{nav, html()}], deck?, decks?: [{id, nav}], prev?, next? }) */
window.SLIDES = (function () {
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function param(k) { var m = new RegExp("(?:^|[#&])" + k + "=([^&]+)").exec(location.hash); return m ? decodeURIComponent(m[1]) : null; }
  function run(o) {
    var prog = document.getElementById("wt-progress"), el = document.getElementById("wt-step"), decksEl = document.getElementById("wt-decks");
    var back = document.getElementById("wt-back"), next = document.getElementById("wt-next"), count = document.getElementById("wt-count");
    function state() { var d = o.deck ? o.deck() : null; var steps = o.steps(d); var i = Math.max(0, Math.min(steps.length - 1, +(param("step") || 0))); return { d: d, steps: steps, i: i }; }
    function go(d, i) { location.hash = (d ? "deck=" + d + "&" : "") + "step=" + i; }
    function render() {
      var s = state();
      el.innerHTML = s.steps[s.i].html();
      prog.innerHTML = s.steps.map(function (st, j) { return '<li><button type="button" data-i="' + j + '"' + (j === s.i ? ' aria-current="step"' : "") + ">" + esc(st.nav) + "</button></li>"; }).join("");
      if (decksEl && o.decks) decksEl.innerHTML = o.decks.map(function (d) { return '<li><button type="button" data-d="' + d.id + '"' + (d.id === s.d ? ' aria-current="step"' : "") + ">" + esc(d.nav) + "</button></li>"; }).join("");
      var first = s.i === 0 && !(o.prevDeck && o.prevDeck(s.d)), last = s.i === s.steps.length - 1 && !(o.nextDeck && o.nextDeck(s.d));
      back.disabled = first; next.disabled = last;
      next.textContent = s.i === s.steps.length - 1 && !last ? "Next section →" : "Next →";
      count.textContent = "Step " + (s.i + 1) + " of " + s.steps.length;
      window.scrollTo(0, 0);
    }
    function move(dir) {
      var s = state(), j = s.i + dir;
      if (j >= 0 && j < s.steps.length) return go(s.d, j);
      var nd = dir > 0 ? o.nextDeck && o.nextDeck(s.d) : o.prevDeck && o.prevDeck(s.d);
      if (nd) go(nd, dir > 0 ? 0 : o.steps(nd).length - 1);
    }
    prog.addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) go(state().d, +b.dataset.i); });
    if (decksEl) decksEl.addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) go(b.dataset.d, 0); });
    back.addEventListener("click", function () { move(-1); });
    next.addEventListener("click", function () { move(1); });
    document.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") move(1); if (e.key === "ArrowLeft") move(-1); });
    window.addEventListener("hashchange", render);
    render();
  }
  return { run: run, esc: esc, param: param };
})();
