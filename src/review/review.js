/* Review build only: outline every field that was filled from the drafted scripts. */
'use strict';
var filledEl = document.getElementById('cf-filled');
var filled = filledEl ? JSON.parse(filledEl.textContent) : [];
function mark() {
  document.querySelectorAll('[data-path]').forEach(function (el) {
    var p = el.getAttribute('data-path');
    var hit = filled.some(function (f) { return f === p || f.indexOf(p + '.') === 0; });
    el.classList.toggle('cf-filled', hit);
  });
}
mark();
new MutationObserver(mark).observe(document.getElementById('main'), { childList: true, subtree: true });
