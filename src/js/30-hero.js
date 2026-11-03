/* Beat 1: the contradiction. Nothing to read before it, nothing to click before it. */
CF.defineSection('hero', (d) => {
  const x = d.hero;
  if (!x || !has(x.headline)) return null;
  const head = x.headline.split(/(324|19)/).map((p) => p === '324' ? h('span', { class: 'n324', text: p }) : p === '19' ? h('span', { class: 'n19', text: p }) : p);
  return h('section', { class: 'sheet hero', id: 'case', 'aria-labelledby': 'case-h' },
    h('i', { class: 'corner', 'aria-hidden': 'true' }),
    has(x.title) ? h('h1', { class: 'hero-title', id: 'case-h', text: x.title }) : null,
    has(x.byline) ? h('p', { class: 'byline', text: x.byline }) : null,
    h('h2', { class: 'headline' }, head),
    has(x.question) ? h('p', { class: 'shipit', text: x.question }) : null,
    has(x.lede) ? h('p', { class: 'lede', text: x.lede }) : null,
    has(x.intro) ? h('p', { class: 'intro-p', text: x.intro }) : null,
    h('div', { class: 'cta-row' },
      has(x.ctaOpen) ? h('a', { class: 'btn primary', href: '#exhibitA', text: x.ctaOpen }) : null,
      has(x.ctaSixty) && d.sixty ? h('button', { class: 'btn', type: 'button', text: x.ctaSixty, onclick: (e) => CF.openSixty(e.currentTarget) }) : null));
});
