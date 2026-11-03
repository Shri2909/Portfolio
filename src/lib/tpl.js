// Template filler: replaces {token} with a value. Plain text only, never markup.
export const tpl = (s, vars = {}) =>
  String(s ?? '').replace(/\{(\w+)\}/g, (m, k) => (vars[k] === undefined || vars[k] === null ? '' : String(vars[k])));
// Remove copy markup (**bold**, <hi>) for aria labels and titles.
export const plain = (s) => String(s ?? '').replace(/<\/?hi>/g, '').replace(/\*\*/g, '');
// The nth <hi>…</hi> phrase of a copy paragraph, still wrapped, so a device can reuse a caption word for word.
export const hiOf = (text, n = 0) => { const m = [...String(text || '').matchAll(/<hi>(.*?)<\/hi>/g)][n]; return m ? '<hi>' + m[1] + '</hi>' : ''; };
