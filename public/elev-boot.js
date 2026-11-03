(function (d) {
  var r = d.documentElement;
  r.setAttribute('data-elev', '1');
  // E3.1/E3.7: decide the opening before first paint. cold = full film, rest = reduced motion (rest frame), done = deep link.
  var h = location.hash, rm = false;
  try { rm = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var deep = h && h !== '#' && h !== '#night' && !/^#v1\./.test(h);
  var mode = rm ? 'rest' : deep ? 'done' : 'cold';
  r.setAttribute('data-open', mode);
  r.setAttribute('data-wake', mode === 'cold' ? 'pre' : 'done');
  // the event itself is queued behind the JS bundle on a slow CPU; the animation's own timeline start (plus its delay) is when the spark is really drawn
  d.addEventListener('animationstart', function (e) { if (e.target && e.target.className === 'p-spark') { var t = performance.now(); try { var a = e.target.getAnimations()[0]; if (a && a.startTime != null) t = a.startTime + 90; } catch (x) {} performance.mark('ek:spark', { startTime: t }); } }, true);
  // failsafe: if the elevation chunk never starts, the page must not stay dark
  setTimeout(function () { if (r.getAttribute('data-open') === 'cold' && !r.hasAttribute('data-live')) { r.setAttribute('data-open', 'done'); r.setAttribute('data-wake', 'done'); } }, 3500);
})(document);
