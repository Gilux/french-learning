// Sanity check for the numbers generator: trap-number table + exhaustive invariants.
// Run: node scripts/check-numbers.js
const Numbers = require('../js/numbers.js');
const NumberRules = require('../data/number-rules.js');
const NumbersQuiz = require('../js/numbers-quiz.js');

const errors = [];
const fail = (msg) => errors.push(msg);

// [n, words (1990 spelling), IPA without slashes] — see docs/research/numbers-sources.md
const EXPECTED = [
  [0, 'zéro', 'ze.ʁo'],
  [1, 'un', 'œ̃'],
  [4, 'quatre', 'katʁ'],
  [5, 'cinq', 'sɛ̃k'],
  [6, 'six', 'sis'],
  [8, 'huit', 'ɥit'],
  [10, 'dix', 'dis'],
  [16, 'seize', 'sɛz'],
  [17, 'dix-sept', 'di.sɛt'],
  [18, 'dix-huit', 'di.z‿ɥit'],
  [19, 'dix-neuf', 'diz.nœf'],
  [20, 'vingt', 'vɛ̃'],
  [21, 'vingt-et-un', 'vɛ̃.t‿e.œ̃'],
  [22, 'vingt-deux', 'vɛ̃t.dø'],
  [24, 'vingt-quatre', 'vɛ̃t.katʁ'],
  [28, 'vingt-huit', 'vɛ̃.t‿ɥit'],
  [31, 'trente-et-un', 'tʁɑ̃.t‿e.œ̃'],
  [38, 'trente-huit', 'tʁɑ̃.t‿ɥit'],
  [41, 'quarante-et-un', 'ka.ʁɑ̃.t‿e.œ̃'],
  [56, 'cinquante-six', 'sɛ̃.kɑ̃t.sis'],
  [61, 'soixante-et-un', 'swa.sɑ̃.t‿e.œ̃'],
  [68, 'soixante-huit', 'swa.sɑ̃.t‿ɥit'],
  [70, 'soixante-dix', 'swa.sɑ̃t.dis'],
  [71, 'soixante-et-onze', 'swa.sɑ̃.t‿e.ɔ̃z'],
  [72, 'soixante-douze', 'swa.sɑ̃t.duz'],
  [77, 'soixante-dix-sept', 'swa.sɑ̃t.di.sɛt'],
  [78, 'soixante-dix-huit', 'swa.sɑ̃t.di.z‿ɥit'],
  [79, 'soixante-dix-neuf', 'swa.sɑ̃t.diz.nœf'],
  [80, 'quatre-vingts', 'ka.tʁə.vɛ̃'],
  [81, 'quatre-vingt-un', 'ka.tʁə.vɛ̃.œ̃'],
  [88, 'quatre-vingt-huit', 'ka.tʁə.vɛ̃.ɥit'],
  [90, 'quatre-vingt-dix', 'ka.tʁə.vɛ̃.dis'],
  [91, 'quatre-vingt-onze', 'ka.tʁə.vɛ̃.ɔ̃z'],
  [97, 'quatre-vingt-dix-sept', 'ka.tʁə.vɛ̃.di.sɛt'],
  [99, 'quatre-vingt-dix-neuf', 'ka.tʁə.vɛ̃.diz.nœf'],
  [100, 'cent', 'sɑ̃'],
  [101, 'cent-un', 'sɑ̃.œ̃'],
  [108, 'cent-huit', 'sɑ̃.ɥit'],
  [111, 'cent-onze', 'sɑ̃.ɔ̃z'],
  [180, 'cent-quatre-vingts', 'sɑ̃.ka.tʁə.vɛ̃'],
  [200, 'deux-cents', 'dø.sɑ̃'],
  [201, 'deux-cent-un', 'dø.sɑ̃.œ̃'],
  [300, 'trois-cents', 'tʁwa.sɑ̃'],
  [400, 'quatre-cents', 'ka.tʁə.sɑ̃'],
  [500, 'cinq-cents', 'sɛ̃.sɑ̃'],
  [600, 'six-cents', 'si.sɑ̃'],
  [700, 'sept-cents', 'sɛt.sɑ̃'],
  [800, 'huit-cents', 'ɥi.sɑ̃'],
  [1000, 'mille', 'mil'],
  [1001, 'mille-un', 'mi.l‿œ̃'],
  [1008, 'mille-huit', 'mi.l‿ɥit'],
  [1011, 'mille-onze', 'mi.l‿ɔ̃z'],
  [1080, 'mille-quatre-vingts', 'mil.ka.tʁə.vɛ̃'],
  [1427, 'mille-quatre-cent-vingt-sept', 'mil.ka.tʁə.sɑ̃.vɛ̃t.sɛt'],
  [1500, 'mille-cinq-cents', 'mil.sɛ̃.sɑ̃'],
  [2000, 'deux-mille', 'dø.mil'],
  [4000, 'quatre-mille', 'ka.tʁə.mil'],
  [5000, 'cinq-mille', 'sɛ̃.mil'],
  [6000, 'six-mille', 'si.mil'],
  [10000, 'dix-mille', 'di.mil'],
  [18000, 'dix-huit-mille', 'di.z‿ɥi.mil'],
  [20000, 'vingt-mille', 'vɛ̃.mil'],
  [21000, 'vingt-et-un-mille', 'vɛ̃.t‿e.œ̃.mil'],
  [21080, 'vingt-et-un-mille-quatre-vingts', 'vɛ̃.t‿e.œ̃.mil.ka.tʁə.vɛ̃'],
  [22000, 'vingt-deux-mille', 'vɛ̃t.dø.mil'],
  [25000, 'vingt-cinq-mille', 'vɛ̃t.sɛ̃.mil'],
  [26000, 'vingt-six-mille', 'vɛ̃t.si.mil'],
  [70000, 'soixante-dix-mille', 'swa.sɑ̃t.di.mil'],
  [80000, 'quatre-vingt-mille', 'ka.tʁə.vɛ̃.mil'],
  [80080, 'quatre-vingt-mille-quatre-vingts', 'ka.tʁə.vɛ̃.mil.ka.tʁə.vɛ̃'],
  [90000, 'quatre-vingt-dix-mille', 'ka.tʁə.vɛ̃.di.mil'],
  [100000, 'cent-mille', 'sɑ̃.mil'],
  [101000, 'cent-un-mille', 'sɑ̃.œ̃.mil'],
  [200000, 'deux-cent-mille', 'dø.sɑ̃.mil'],
  [200200, 'deux-cent-mille-deux-cents', 'dø.sɑ̃.mil.dø.sɑ̃'],
  [300000, 'trois-cent-mille', 'tʁwa.sɑ̃.mil'],
  [999999, 'neuf-cent-quatre-vingt-dix-neuf-mille-neuf-cent-quatre-vingt-dix-neuf', 'nœf.sɑ̃.ka.tʁə.vɛ̃.diz.nœf.mil.nœf.sɑ̃.ka.tʁə.vɛ̃.diz.nœf'],
  [1000000, 'un million', 'œ̃.mi.ljɔ̃'],
];

EXPECTED.forEach(([n, words, ipa]) => {
  const a = Numbers.analyze(n);
  if (a.words !== words) fail(`${n}: words "${a.words}", expected "${words}"`);
  if (a.ipa !== `/${ipa}/`) fail(`${n}: ipa "${a.ipa}", expected "/${ipa}/"`);
});

// Rules a learner must see for the classic traps.
const EXPECTED_RULES = [
  [21, ['et', 'et-sound', 'une']],
  [22, ['vingt-t']],
  [81, ['no-et', 'vingt-no-s', 'quatre-e', 'vingt-80s', 'no-liaison', 'une', 'region-80']],
  [80, ['vingts-plural', 'quatre-e', 'vingt-80s', 'region-80']],
  [71, ['et', 'soixante-x', 'et-sound', 'region-70']],
  [97, ['vingt-no-s', 'dix-sept', 'sept-p', 'region-90']],
  [201, ['cent-no-s', 'no-et', 'no-liaison', 'une']],
  [500, ['cents-plural', 'cinq-q']],
  [600, ['cents-plural', 'x-silent']],
  [800, ['huit-silent']],
  [6, ['x-end']],
  [18, ['dix-huit']],
  [19, ['dix-neuf']],
  [1000, ['mille-alone', 'mille-ll']],
  [1500, ['hundreds-oral']],
  [21000, ['mille-invariable']],
  [1000000, ['million-noun', 'million-ll']],
];
EXPECTED_RULES.forEach(([n, ids]) => {
  const got = Numbers.analyze(n).rules.map((r) => r.id);
  ids.forEach((id) => got.includes(id) || fail(`${n}: missing rule "${id}" (got ${got.join(', ')})`));
});

// Parsing
const PARSE = [
  ['21 080', 21080], ['21.080', 21080], ["21'080", 21080], ['1 000 000', 1000000], ['1000000', 1000000],
  ['１２３', 123], [' 97 ', 97],
  ['', null], ['12a', null], ['1000001', null], ['1.5', null], ['2.50', null], ['7 1', null], ['21 08', null],
];
PARSE.forEach(([input, value]) => {
  const p = Numbers.parse(input);
  if (p.value !== value) fail(`parse("${input}") = ${p.value}, expected ${value}`);
});

// Every emitted rule must have text and real sources; every source must be defined.
Object.entries(NumberRules.RULES).forEach(([id, rule]) => {
  if (!rule.sources.length) fail(`rule "${id}" has no source`);
  rule.sources.forEach((k) => NumberRules.SOURCES[k] || fail(`rule "${id}" cites unknown source "${k}"`));
});

// Exhaustive invariants over 0–1 000 000.
const seenRules = new Set();
for (let n = 0; n <= Numbers.MAX; n++) {
  const a = Numbers.analyze(n);
  const w = a.words;
  if (!/^[a-zé]+(-[a-zé]+)*( million)?$/.test(w)) fail(`${n}: malformed words "${w}"`);
  if (/(vingts|cents)-/.test(w)) fail(`${n}: plural before another numeral "${w}"`);
  if (/milles|millions/.test(w)) fail(`${n}: mille/million plural "${w}"`);
  if (/(^|-)un-mille$/.test(w) && n === 1000) fail(`${n}: "un-mille"`);
  if (a.tiles.length !== a.joints.length + 1) fail(`${n}: tiles/joints mismatch`);
  if (a.tiles.map((t) => t.text).join('') !== w.replace(/[- ]/g, '')) fail(`${n}: tiles do not spell the words`);
  a.rules.forEach((r) => {
    seenRules.add(r.id);
    const text = NumberRules.RULES[r.id].text(r.ctx);
    if (/undefined/.test(text.zh + text.en)) fail(`${n}: rule "${r.id}" renders "undefined"`);
  });
  if (errors.length > 20) break;
}
Object.keys(NumberRules.RULES).forEach((id) => seenRules.has(id) || fail(`rule "${id}" is never triggered`));

// Quiz draw: stays in range, never repeats immediately.
NumbersQuiz.RANGES.forEach((range) => {
  let prev = null;
  for (let i = 0; i < 2000; i++) {
    const n = NumbersQuiz.draw(range.max, prev);
    if (n < 0 || n > range.max || n === prev) fail(`draw(${range.max}) gave ${n} after ${prev}`);
    prev = n;
  }
});

if (errors.length) {
  console.error(`FAILED: ${errors.length} error(s)`);
  errors.slice(0, 40).forEach((e) => console.error(' -', e));
  process.exit(1);
}
console.log(`OK: ${EXPECTED.length} trap numbers, ${EXPECTED_RULES.length} rule sets, 0–${Numbers.MAX} swept, 0 errors`);
