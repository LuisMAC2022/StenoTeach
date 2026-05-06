export function normalizeOutline(raw = '') {
  return raw.toUpperCase().replace(/\s+/g, '').replace(/\//g, '');
}

export function parseOutline(outline) {
  const s = normalizeOutline(outline);
  const initial = [];
  const vowels = [];
  const finals = [];
  const active = new Set();

  const initialsSet = new Set(['S', 'T', 'K', 'P', 'W', 'H', 'R']);
  const vowelsSet = new Set(['A', 'O', '*', 'E', 'U']);
  const finalsSet = new Set(['F', 'R', 'P', 'B', 'L', 'G', 'T', 'S', 'D', 'Z']);

  let stage = 'initial';
  for (const ch of s) {
    if (ch === '-') { stage = 'final'; continue; }
    if (vowelsSet.has(ch)) {
      vowels.push(ch);
      if (ch === '*') { active.add('*L'); active.add('*R'); } else { active.add(ch); }
      if (stage !== 'final') stage = 'vowel';
      continue;
    }
    if (stage === 'initial' && initialsSet.has(ch)) { initial.push(ch); active.add(`${ch}-`); continue; }
    if (finalsSet.has(ch)) { finals.push(ch); active.add(`-${ch}`); stage = 'final'; }
  }
  return { initial, vowels, finals, active, normalized: s };
}

export function formatOutlineForDisplay(outline) {
  const parsed = parseOutline(outline);
  return [
    parsed.initial.join(''),
    parsed.vowels.join(''),
    parsed.finals.map((ch) => `-${ch}`).join('')
  ].join('');
}
