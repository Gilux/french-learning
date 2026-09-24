(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.Numbers = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  const MAX = 1000000;
  const NNBSP = '\u202f';

  // Lexicon. Each form is [spelling, ipa]. In the spelling, (letters) are silent and
  // {letters} carry a sound worth noticing. IPA uses syllable dots like Wiktionnaire.
  // Form keys: end (default), mult (before cent / mille / million), plus the
  // composition-assigned forms documented where they are used.
  const LEX = {
    zero: { end: ['zéro', 'ze.ʁo'] },
    un: { end: ['un', 'œ̃'] },
    deux: { end: ['deu(x)', 'dø'] },
    trois: { end: ['troi(s)', 'tʁwa'] },
    // Before a consonant-initial numeral the e is heard: quatre-vingts, quatre-cents, quatre-mille.
    quatre: { end: ['quatr(e)', 'katʁ'], mult: ['quatr{e}', 'ka.tʁə'], vingt: ['quatr{e}', 'ka.tʁə'] },
    cinq: { end: ['cin{q}', 'sɛ̃k'], mult: ['cin(q)', 'sɛ̃'] },
    six: { end: ['si{x}', 'sis'], mult: ['si(x)', 'si'] },
    sept: { end: ['se(p)t', 'sɛt'] },
    huit: { end: ['(h)uit', 'ɥit'], mult: ['(h)ui(t)', 'ɥi'] },
    neuf: { end: ['neuf', 'nœf'] },
    dix: {
      end: ['di{x}', 'dis'],
      mult: ['di(x)', 'di'],
      // dix-sept: the x merges with the s of sept into one [s]
      teenSept: ['di{x}', 'di'],
      teenHuit: ['di{x}', 'diz'],
      teenNeuf: ['di{x}', 'diz'],
    },
    onze: { end: ['onz(e)', 'ɔ̃z'] },
    douze: { end: ['douz(e)', 'duz'] },
    treize: { end: ['treiz(e)', 'tʁɛz'] },
    quatorze: { end: ['quatorz(e)', 'ka.tɔʁz'] },
    quinze: { end: ['quinz(e)', 'kɛ̃z'] },
    seize: { end: ['seiz(e)', 'sɛz'] },
    // vingt: end = 20 on its own; unit = 21–29 (t sounded); eighty / eighties = inside quatre-vingt(s)
    vingt: { end: ['vin(gt)', 'vɛ̃'], unit: ['vin(g){t}', 'vɛ̃t'], eighty: ['vin(gt)', 'vɛ̃'], eighties: ['vin(gts)', 'vɛ̃'] },
    trente: { end: ['trent(e)', 'tʁɑ̃t'] },
    quarante: { end: ['quarant(e)', 'ka.ʁɑ̃t'] },
    cinquante: { end: ['cinquant(e)', 'sɛ̃.kɑ̃t'] },
    soixante: { end: ['soi{x}ant(e)', 'swa.sɑ̃t'] },
    et: { end: ['e(t)', 'e'] },
    cent: { end: ['cen(t)', 'sɑ̃'], plural: ['cen(ts)', 'sɑ̃'] },
    mille: { end: ['mi{ll}(e)', 'mil'] },
    million: { end: ['mi{ll}ion', 'mi.ljɔ̃'] },
  };

  const UNITS = ['zero', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix',
    'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize'];
  const TENS = { 2: 'vingt', 3: 'trente', 4: 'quarante', 5: 'cinquante', 6: 'soixante' };
  const MULTIPLIERS = new Set(['cent', 'mille', 'million']);
  // The only vowel-initial numeral words.
  const VOWEL_INITIAL = new Set(['un', 'huit', 'onze', 'et']);
  // Their latent t never links into un / huit / onze: cent-un, quatre-vingt-huit, et-onze.
  const NO_LINK_AFTER = (t) => t.lemma === 'cent' || t.lemma === 'et' || (t.lemma === 'vingt' && t.form !== 'unit');
  const ENDS_IN_CONSONANT = /[bdfgklmnpstvzʁʃʒɲ]$/;

  function tok(lemma, form) {
    return { lemma, form: form || null };
  }

  // 1–99. `final` = nothing follows this group in the whole number (quatre-vingts plural).
  function below100(n, final) {
    if (n < 17) return [tok(UNITS[n])];
    if (n < 20) {
      const unit = UNITS[n - 10];
      const form = { sept: 'teenSept', huit: 'teenHuit', neuf: 'teenNeuf' }[unit];
      return [tok('dix', form), tok(unit)];
    }
    if (n < 70) {
      const tens = TENS[Math.floor(n / 10)];
      const u = n % 10;
      const head = tok(tens, tens === 'vingt' ? (u ? 'unit' : 'end') : null);
      if (u === 0) return [head];
      if (u === 1) return [head, tok('et'), tok('un')];
      return [head].concat(below100(u, final));
    }
    if (n < 80) {
      if (n === 71) return [tok('soixante'), tok('et'), tok('onze')];
      return [tok('soixante')].concat(below100(n - 60, final));
    }
    const r = n - 80;
    const vingt = tok('vingt', r === 0 && final ? 'eighties' : 'eighty');
    return [tok('quatre', 'vingt'), vingt].concat(r ? below100(r, final) : []);
  }

  function below1000(n, final) {
    const h = Math.floor(n / 100);
    const r = n % 100;
    let out = [];
    if (h > 0) {
      if (h > 1) out = out.concat(below100(h, false));
      out.push(tok('cent', h > 1 && r === 0 && final ? 'plural' : 'end'));
    }
    if (r > 0) out = out.concat(below100(r, final));
    return out;
  }

  function rawTokens(n) {
    if (n === 0) return [tok('zero')];
    if (n === MAX) return [tok('un'), tok('million')];
    const t = Math.floor(n / 1000);
    const r = n % 1000;
    let out = [];
    if (t > 0) {
      if (t > 1) out = out.concat(below1000(t, false));
      out.push(tok('mille'));
    }
    if (r > 0) out = out.concat(below1000(r, true));
    return out;
  }

  function parseSpelling(notation) {
    const segments = [];
    const re = /\(([^)]*)\)|\{([^}]*)\}|([^({]+)/g;
    let m;
    while ((m = re.exec(notation))) {
      if (m[1] !== undefined) segments.push({ text: m[1], mark: 'mute' });
      else if (m[2] !== undefined) segments.push({ text: m[2], mark: 'sound' });
      else segments.push({ text: m[3], mark: null });
    }
    return segments;
  }

  // Resolve every token's form, spelling segments and in-context IPA.
  function resolve(tokens) {
    return tokens.map((t, i) => {
      const next = tokens[i + 1];
      const entry = LEX[t.lemma];
      let form = t.form;
      if (!form) form = entry.mult && next && MULTIPLIERS.has(next.lemma) ? 'mult' : 'end';
      const [notation, ipa] = entry[form];
      const segments = parseSpelling(notation);
      return { lemma: t.lemma, form, text: segments.map((s) => s.text).join(''), segments, ipa };
    });
  }

  // link = liaison or enchaînement (a sounded final consonant runs into the next vowel):
  // vingt-et-un, dix-huit, trente-huit, mille-un. nolink = the trap non-liaisons.
  function jointBetween(a, b) {
    if (b.lemma === 'million') return 'space';
    if (!VOWEL_INITIAL.has(b.lemma)) return 'hyphen';
    if (NO_LINK_AFTER(a)) return 'nolink';
    return ENDS_IN_CONSONANT.test(a.ipa) ? 'link' : 'hyphen';
  }

  function joinWords(tokens, joints) {
    return tokens.reduce((s, t, i) => (i === 0 ? t.text : s + (joints[i - 1] === 'space' ? ' ' : '-') + t.text), '');
  }

  // Full IPA: syllables joined by dots; a link joint moves the final consonant onto the next word.
  function joinIpa(tokens, joints) {
    let s = '';
    tokens.forEach((t, i) => {
      if (i === 0) {
        s = t.ipa;
      } else if (joints[i - 1] === 'link') {
        s = s.slice(0, -1) + '.' + s.slice(-1) + '‿' + t.ipa;
      } else {
        s += '.' + t.ipa;
      }
    });
    return s;
  }

  function build(n) {
    const tokens = resolve(rawTokens(n));
    const joints = tokens.slice(1).map((t, i) => jointBetween(tokens[i], t));
    return { tokens, joints };
  }

  function toWords(n) {
    const { tokens, joints } = build(n);
    return joinWords(tokens, joints);
  }

  function toIpa(n) {
    const { tokens, joints } = build(n);
    return '/' + joinIpa(tokens, joints) + '/';
  }

  function formatDigits(n) {
    const s = String(n);
    if (n < 10000) return s;
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, NNBSP);
  }

  // Accepts "21080" and thousands grouped by a space, dot or apostrophe ("21 080", "21.080",
  // "21'080"); full-width digits from a Chinese keyboard count too. Returns { status, value }.
  function parse(input) {
    const text = String(input == null ? '' : input)
      .replace(/[０-９]/g, (d) => String.fromCharCode(d.charCodeAt(0) - 0xfee0))
      .trim();
    if (text === '') return { status: 'empty', value: null };
    if (!/^(\d+|\d{1,3}([\s.'’]\d{3})+)$/.test(text)) return { status: 'invalid', value: null };
    const value = Number(text.replace(/\D/g, ''));
    if (value > MAX) return { status: 'invalid', value: null };
    return { status: 'ok', value };
  }

  // ---------- structure: one level of decomposition ----------
  function part(n, words) {
    return { n, words };
  }

  function structure(n) {
    if (n === MAX) return null;
    if (n >= 1000) {
      const t = Math.floor(n / 1000);
      const r = n % 1000;
      if (t === 1 && r === 0) return null;
      const head = t === 1 ? part('1000', 'mille') : part(`${formatDigits(t)} × 1000`, toWords(t * 1000));
      return r ? [head, '+', part(formatDigits(r), toWords(r))] : [head];
    }
    if (n >= 100) {
      const h = Math.floor(n / 100);
      const r = n % 100;
      if (h === 1 && r === 0) return null;
      // Inside a longer number the hundreds keep no s: 201 = deux-cent + un.
      const head = h === 1 ? part('100', 'cent') : part(`${h} × 100`, r ? `${toWords(h)}-cent` : toWords(h * 100));
      return r ? [head, '+', part(String(r), toWords(r))] : [head];
    }
    if (n >= 17 && n <= 19) return [part('10', 'dix'), '+', part(String(n - 10), toWords(n - 10))];
    if (n >= 21 && n < 70 && n % 10 !== 0) {
      const tens = n - (n % 10);
      return [part(String(tens), toWords(tens)), '+', part(String(n % 10), toWords(n % 10))];
    }
    if (n >= 70 && n < 80) return [part('60', 'soixante'), '+', part(String(n - 60), toWords(n - 60))];
    if (n === 80) return [part('4 × 20', 'quatre-vingts')];
    if (n > 80 && n < 100) return [part('4 × 20', 'quatre-vingt'), '+', part(String(n - 80), toWords(n - 80))];
    return null;
  }

  function halves(n) {
    if (n < 1000 || n >= MAX || n % 1000 === 0) return null;
    const head = n - (n % 1000);
    return [
      { words: toWords(head), speak: String(head) },
      { words: toWords(n % 1000), speak: String(n % 1000) },
    ];
  }

  // ---------- rules triggered by this number ----------
  function rulesFor(n, tokens, joints) {
    const found = [];
    const seen = new Set();
    const add = (id, ctx) => {
      if (seen.has(id)) return;
      seen.add(id);
      found.push({ id, ctx: ctx || {} });
    };
    const wordsOf = (from, to) => joinWords(tokens.slice(from, to), joints.slice(from, to - 1));
    const ipaOf = (from, to) => joinIpa(tokens.slice(from, to), joints.slice(from, to - 1));
    const lemmaAt = (i) => (tokens[i] ? tokens[i].lemma : null);

    tokens.forEach((t, i) => {
      const next = tokens[i + 1];
      const prev = tokens[i - 1];
      // Spelling
      if (t.lemma === 'et') add('et', { words: wordsOf(i - 1, i + 2) });
      if ((t.lemma === 'un' || t.lemma === 'onze') && prev && lemmaAt(i - 1) !== 'et') {
        if (prev.lemma === 'vingt') add('no-et', { words: wordsOf(i - 2, i + 1) });
        else if ((prev.lemma === 'cent' || prev.lemma === 'mille') && t.lemma === 'un') add('no-et', { words: wordsOf(i - 1, i + 1) });
      }
      if (t.lemma === 'vingt' && t.form === 'eighties') add('vingts-plural', { words: wordsOf(i - 1, i + 1) });
      if (t.lemma === 'vingt' && t.form === 'eighty' && next) add('vingt-no-s', { words: wordsOf(i - 1, i + 2) });
      const multiplied = t.lemma === 'cent' && prev && prev.lemma !== 'mille';
      if (multiplied && t.form === 'plural') add('cents-plural', { words: wordsOf(i - 1, i + 1) });
      if (multiplied && t.form === 'end' && next) add('cent-no-s', { words: wordsOf(i - 1, i + 2) });
      // Sound
      if (t.lemma === 'vingt' && t.form === 'unit' && next.lemma !== 'et') add('vingt-t', { words: wordsOf(i, i + 2), ipa: ipaOf(i, i + 2) });
      if (t.lemma === 'vingt' && (t.form === 'eighty' || t.form === 'eighties')) add('vingt-80s', {});
      if (t.lemma === 'et') add('et-sound', { words: wordsOf(i - 1, i + 2), ipa: ipaOf(i - 1, i + 2) });
      if (joints[i] === 'nolink' && t.lemma !== 'et') {
        const right = joinIpa([t, next], ['hyphen']);
        add('no-liaison', { words: wordsOf(i, i + 2), ipa: right, wrong: `${t.ipa}.t‿${next.ipa}` });
      }
      if ((t.lemma === 'six' || t.lemma === 'dix') && t.form === 'end') add('x-end', { words: t.text, ipa: t.ipa });
      if (t.lemma === 'dix' && t.form === 'teenSept') add('dix-sept', {});
      if ((t.lemma === 'six' || t.lemma === 'dix') && t.form === 'mult') add('x-silent', { words: wordsOf(i, i + 2), ipa: ipaOf(i, i + 2) });
      if (t.lemma === 'dix' && t.form === 'teenHuit') add('dix-huit', {});
      if (t.lemma === 'dix' && t.form === 'teenNeuf') add('dix-neuf', {});
      if (t.lemma === 'huit' && t.form === 'mult') add('huit-silent', { words: wordsOf(i, i + 2), ipa: ipaOf(i, i + 2) });
      if (t.lemma === 'cinq' && t.form === 'mult') add('cinq-q', { words: wordsOf(i, i + 2), ipa: ipaOf(i, i + 2) });
      if (t.lemma === 'quatre' && t.form !== 'end') add('quatre-e', { words: wordsOf(i, i + 2), ipa: ipaOf(i, i + 2) });
      if (t.lemma === 'sept') add('sept-p', {});
      if (t.lemma === 'soixante') add('soixante-x', {});
      if (t.lemma === 'mille') add('mille-ll', {});
      if (t.lemma === 'million') add('million-ll', {});
    });
    if (n >= 2000 && n < MAX) add('mille-invariable', { words: toWords(n - (n % 1000)) });
    if (n >= 1000 && n < 2000) add('mille-alone', {});
    if (n === MAX) add('million-noun', {});
    if (n >= 1100 && n <= 1699) add('hundreds-oral', { oral: hundredsOral(n) });
    if (tokens[tokens.length - 1].lemma === 'un') {
      const une = joinWords(tokens, joints).replace(/un$/, 'une');
      add('une', { example: n === 1 ? 'une page' : `${une} pages` });
    }

    // Region: look at the last two digits of each group (thousands, remainder).
    const groups = n >= 1000 && n < MAX ? [Math.floor(n / 1000), n % 1000] : [n];
    groups.forEach((g) => {
      const r = g % 100;
      if (r >= 70 && r <= 79) add('region-70', { france: toWords(r), local: regional('septante', r - 70) });
      if (r >= 80 && r <= 89) add('region-80', { france: toWords(r), local: regional('huitante', r - 80) });
      if (r >= 90 && r <= 99) add('region-90', { france: toWords(r), local: regional('nonante', r - 90) });
    });

    const order = { spell: 0, sound: 1, usage: 2, region: 3 };
    return found.sort((a, b) => order[RULE_KIND[a.id]] - order[RULE_KIND[b.id]]);
  }

  // 1500 is also said quinze-cents (1100–1699).
  function hundredsOral(n) {
    const h = Math.floor(n / 100);
    const r = n % 100;
    return r ? `${toWords(h)}-cent-${toWords(r)}` : `${toWords(h)}-cents`;
  }

  function regional(tens, u) {
    if (u === 0) return tens;
    if (u === 1) return `${tens}-et-un`;
    return `${tens}-${toWords(u)}`;
  }

  const RULE_KIND = {
    et: 'spell', 'no-et': 'spell', 'vingts-plural': 'spell', 'vingt-no-s': 'spell', 'cents-plural': 'spell',
    'cent-no-s': 'spell', 'mille-invariable': 'spell', 'mille-alone': 'spell', 'million-noun': 'spell',
    'vingt-t': 'sound', 'vingt-80s': 'sound', 'et-sound': 'sound', 'no-liaison': 'sound', 'x-end': 'sound',
    'x-silent': 'sound', 'dix-sept': 'sound', 'dix-huit': 'sound', 'dix-neuf': 'sound', 'huit-silent': 'sound',
    'cinq-q': 'sound', 'quatre-e': 'sound', 'sept-p': 'sound',
    'soixante-x': 'sound', 'mille-ll': 'sound', 'million-ll': 'sound',
    une: 'usage', 'hundreds-oral': 'usage',
    'region-70': 'region', 'region-80': 'region', 'region-90': 'region',
  };

  function analyze(n) {
    const { tokens, joints } = build(n);
    const marks = new Set();
    tokens.forEach((t) => t.segments.forEach((s) => s.mark && marks.add(s.mark)));
    joints.forEach((j) => (j === 'link' || j === 'nolink') && marks.add(j));
    return {
      n,
      digits: formatDigits(n),
      speak: String(n),
      words: joinWords(tokens, joints),
      ipa: '/' + joinIpa(tokens, joints) + '/',
      tiles: tokens.map((t) => ({
        text: t.text,
        headword: LEX[t.lemma].end[0].replace(/[(){}]/g, ''),
        segments: t.segments,
        ipa: t.ipa.replace(/\./g, ''),
      })),
      joints,
      legend: ['mute', 'sound', 'link', 'nolink'].filter((k) => marks.has(k)),
      structure: structure(n),
      halves: halves(n),
      rules: rulesFor(n, tokens, joints),
    };
  }

  return { MAX, NNBSP, RULE_KIND, toWords, toIpa, formatDigits, parse, analyze };
});
