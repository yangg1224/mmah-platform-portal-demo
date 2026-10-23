(function () {
  var TOTAL = 5;
  var screens = document.querySelectorAll('.mm-screen');
  var prevBtn = document.getElementById('mm-prev');
  var nextBtn = document.getElementById('mm-next');
  var indicator = document.getElementById('mm-indicator');
  if (!screens.length || !prevBtn || !nextBtn || !indicator) return;

  function currentScreen() {
    var m = /screen=(\d+)/.exec(window.location.hash);
    var n = m ? parseInt(m[1], 10) : 1;
    if (!n || n < 1) n = 1;
    if (n > TOTAL) n = TOTAL;
    return n;
  }

  function render(n) {
    screens.forEach(function (section) {
      var sn = parseInt(section.getAttribute('data-screen'), 10);
      if (sn === n) section.removeAttribute('hidden');
      else section.setAttribute('hidden', '');
    });
    prevBtn.disabled = n <= 1;
    nextBtn.disabled = n >= TOTAL;
    indicator.textContent = n + ' of ' + TOTAL;
  }

  function goTo(n) {
    n = Math.max(1, Math.min(TOTAL, n));
    if (n === currentScreen()) {
      render(n);
    } else {
      window.location.hash = 'screen=' + n;
    }
  }

  prevBtn.addEventListener('click', function () { goTo(currentScreen() - 1); });
  nextBtn.addEventListener('click', function () { goTo(currentScreen() + 1); });

  window.addEventListener('hashchange', function () { render(currentScreen()); });

  document.addEventListener('keydown', function (e) {
    var el = document.activeElement;
    var tag = el && el.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      e.preventDefault();
      goTo(currentScreen() + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      goTo(currentScreen() - 1);
    }
  });

  render(currentScreen());
})();
