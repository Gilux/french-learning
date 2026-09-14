# French Letter Pronunciation Trainer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, dependency-free web app with an AZERTY keyboard that opens a sourced pronunciation panel per letter (with French audio and a zhuyin comparison), plus a weighted flashcard game mode. This is a short-lived personal tool (days, not months) — precise, functional, and mobile-friendly matters; a maintained automated test suite does not.

**Architecture:** Plain HTML/CSS/JS, no build step, no framework. Pure logic (bilingual text, keyboard layout, game weighting, TTS voice selection) lives in small dependency-free modules written with a tiny CommonJS/global dual-export pattern, so the same file can be `require()`d for a one-line sanity check and loaded as a classic `<script>` tag in the browser. DOM-rendering code (keyboard, panel, game screen) is thin glue over that logic, verified by hand in a real browser (desktop width and mobile width) — no automated UI test suite, per user instruction.

**Tech Stack:** Vanilla JS (classic scripts, no ES modules — avoids the `file://` CORS restriction on `type="module"`), vanilla CSS, Web Speech API for audio. Zero npm dependencies, no `package.json`, no test framework.

**Spec:** [docs/superpowers/specs/2026-09-14-french-pronunciation-site-design.md](../specs/2026-09-14-french-pronunciation-site-design.md)

## Global Constraints

- No build step, no npm dependencies, no framework (per spec §3).
- No backend, no paid API, no API keys (per spec §3, §11).
- UI is English-first with a Traditional Chinese subtitle under every interface string and every pedagogical explanation (per spec §1, §8).
- Game card weights live only in a JS variable for the current page session — never `localStorage`/`sessionStorage`, discarded on reload (per spec §6, and explicit user instruction).
- Exactly 38 letter units: 26 base + 5 AZERTY-accent + 7 extra-accent (per spec §2). No digraphs/composed sounds.
- Every letter entry must carry at least one source; the UI must show sources as links (per spec §4, §7). Prioritize actual FLE (Français Langue Étrangère) pedagogical resources over pure academic phonology — this is a teaching tool, precision for a learner matters more than linguistic completeness.
- Must work correctly on mobile viewport widths, not just desktop (explicit user instruction) — every UI task below includes a mobile check, not just the final responsive pass.
- No automated test suite (explicit user instruction — this is a short-lived tool). Verification is: a one-line `node -e` sanity check for each pure-logic module (catches typos/syntax errors immediately, costs seconds) plus manual browser verification for anything DOM-related. Do not add `node:test`, a test runner, or a `tests/` directory.

**Note on spec accuracy (fixed here, not a scope change):** the spec's §2/§5 description of "5 accented letters on the digit row" is slightly off for `ù` — on a real AZERTY keyboard, `é è ç à` are on the digit row but `ù` is the last key of the home row (`qsdfghjklm` + `ù`), sharing its key with `%`. Task 2 below places `ù` correctly. This only affects the physical layout mapping, not the data model or scope.

---

### Task 1: Project scaffold + bilingual text helper

**Files:**
- Create: `index.html`
- Create: `style.css`
- Create: `js/i18n.js`

**Interfaces:**
- Produces: `I18n.renderBilingual({en, zh}, opts)` → HTML string. `opts` optional: `{ tag: 'span' (default), enClass: 'lang-en' (default), zhClass: 'lang-zh' (default) }`.

- [ ] **Step 1: Write the implementation**

Create `js/i18n.js`:

```js
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.I18n = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  function renderBilingual(text, opts) {
    const tag = (opts && opts.tag) || 'span';
    const enClass = (opts && opts.enClass) || 'lang-en';
    const zhClass = (opts && opts.zhClass) || 'lang-zh';
    return (
      `<${tag} class="${enClass}">${text.en}</${tag}>` +
      `<${tag} class="${zhClass}">${text.zh}</${tag}>`
    );
  }

  return { renderBilingual };
});
```

- [ ] **Step 2: One-line sanity check**

Run: `node -e "console.log(require('./js/i18n.js').renderBilingual({en:'Play', zh:'播放'}))"`
Expected output: `<span class="lang-en">Play</span><span class="lang-zh">播放</span>`

- [ ] **Step 3: Build the static shell**

Create `style.css`:

```css
:root {
  --key-bg: #f4f4f4;
  --key-border: #cfcfcf;
  --accent-key-bg: #eef3ff;
  --extra-key-bg: #fff6ea;
  --panel-bg: #ffffff;
  --text-main: #1a1a1a;
  --text-sub: #6b6b6b;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 1rem;
  color: var(--text-main);
  background: #fafafa;
}

.lang-zh {
  display: block;
  font-size: 0.8em;
  color: var(--text-sub);
}

header h1 .lang-zh {
  display: inline;
  margin-left: 0.5rem;
}

nav.tabs {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
}

nav.tabs button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--key-border);
  background: var(--key-bg);
  border-radius: 6px;
  cursor: pointer;
}

nav.tabs button.active {
  background: var(--accent-key-bg);
  font-weight: bold;
}

.view {
  display: none;
}

.view.active {
  display: block;
}

.layout {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

@media (max-width: 720px) {
  .layout {
    flex-direction: column;
  }
}
```

Create `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>French Letter Pronunciation Trainer</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header>
    <h1 id="app-title"></h1>
  </header>

  <nav class="tabs">
    <button id="tab-keyboard" class="active"></button>
    <button id="tab-game"></button>
  </nav>

  <main>
    <section id="view-keyboard" class="view active">
      <div class="layout">
        <div id="keyboard-container"></div>
        <div id="panel-container"></div>
      </div>
    </section>

    <section id="view-game" class="view">
      <div id="game-container"></div>
    </section>
  </main>

  <script src="js/i18n.js"></script>
  <script>
    document.getElementById('app-title').innerHTML = I18n.renderBilingual(
      { en: 'French Letter Pronunciation Trainer', zh: '法語字母發音練習' }
    );
    document.getElementById('tab-keyboard').innerHTML = I18n.renderBilingual({ en: 'Keyboard', zh: '鍵盤' });
    document.getElementById('tab-game').innerHTML = I18n.renderBilingual({ en: 'Game', zh: '遊戲' });
  </script>
</body>
</html>
```

- [ ] **Step 4: Manual check (desktop and mobile width)**

Open `index.html` directly in a browser (double-click it, `file://` is fine — no ES modules are used). Confirm the title and two tab buttons render with an English line and a smaller Chinese line underneath, no console errors. Resize the browser window down to ~375px wide (or use devtools device toolbar) and confirm nothing overflows or breaks.

- [ ] **Step 5: Commit**

```bash
git add index.html style.css js/i18n.js
git commit -m "Add static shell and bilingual text helper"
```

---

### Task 2: AZERTY layout data

**Files:**
- Create: `js/layout.js`

**Interfaces:**
- Consumes: nothing (pure data module).
- Produces: `Layout.DIGIT_ROW` (array of `{char, letterId}`), `Layout.ROW2`, `Layout.ROW3`, `Layout.ROW4` (arrays of `{char, letterId}`), `Layout.EXTRA_ACCENTS` (array of `{char, letterId}`), `Layout.getAllLetterIds()` → array of all 38 ids in a fixed order, `Layout.CATEGORY_COUNTS` = `{ base: 26, 'azerty-accent': 5, 'extra-accent': 7 }`.

- [ ] **Step 1: Write the implementation**

Create `js/layout.js`:

```js
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.Layout = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  function key(char, letterId) {
    return { char, letterId: letterId || null };
  }

  function baseKey(char) {
    return key(char, char);
  }

  // Real AZERTY unshifted digit row: & é " ' ( - è _ ç à ) =
  const DIGIT_ROW = [
    key('&', null),
    key('é', 'e-acute'),
    key('"', null),
    key("'", null),
    key('(', null),
    key('-', null),
    key('è', 'e-grave'),
    key('_', null),
    key('ç', 'c-cedilla'),
    key('à', 'a-grave'),
    key(')', null),
    key('=', null),
  ];

  const ROW2 = ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map(baseKey);
  const ROW3 = ['q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm']
    .map(baseKey)
    .concat([key('ù', 'u-grave')]);
  const ROW4 = ['w', 'x', 'c', 'v', 'b', 'n'].map(baseKey);

  const EXTRA_ACCENTS = [
    key('â', 'a-circumflex'),
    key('ê', 'e-circumflex'),
    key('î', 'i-circumflex'),
    key('ô', 'o-circumflex'),
    key('û', 'u-circumflex'),
    key('ï', 'i-diaeresis'),
    key('ë', 'e-diaeresis'),
  ];

  const CATEGORY_COUNTS = { base: 26, 'azerty-accent': 5, 'extra-accent': 7 };

  function getAllLetterIds() {
    const ids = [];
    [...ROW2, ...ROW3, ...ROW4].forEach((k) => ids.push(k.letterId));
    DIGIT_ROW.filter((k) => k.letterId).forEach((k) => ids.push(k.letterId));
    EXTRA_ACCENTS.forEach((k) => ids.push(k.letterId));
    return ids;
  }

  return { DIGIT_ROW, ROW2, ROW3, ROW4, EXTRA_ACCENTS, CATEGORY_COUNTS, getAllLetterIds };
});
```

- [ ] **Step 2: One-line sanity check**

Run: `node -e "const L=require('./js/layout.js'); const ids=L.getAllLetterIds(); console.log(ids.length, new Set(ids).size)"`
Expected output: `38 38`

- [ ] **Step 3: Commit**

```bash
git add js/layout.js
git commit -m "Add AZERTY layout data"
```

---

### Task 3: Weighted flashcard game-state logic

**Files:**
- Create: `js/game.js`

**Interfaces:**
- Consumes: nothing (pure, takes a plain array of ids).
- Produces:
  - `Game.createGameState(letterIds)` → `{ weights: { [id]: 1 }, history: [] }`
  - `Game.drawNext(state, rng)` → `{ id, state: newState }` (`rng` optional, defaults to `Math.random`; `newState.history` keeps at most the last 5 drawn ids; excludes the last 2 drawn ids from candidates unless that would empty the pool)
  - `Game.rateCard(state, id, rating)` → `newState` (`rating` is `'easy' | 'hard' | 'missed'`; `easy` subtracts 1 (floor 0.5), `hard` adds 1.5, `missed` adds 3; throws on unknown rating)

- [ ] **Step 1: Write the implementation**

Create `js/game.js`:

```js
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.Game = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  const HISTORY_LIMIT = 5;
  const RECENT_EXCLUDE = 2;

  function createGameState(letterIds) {
    const weights = {};
    letterIds.forEach((id) => {
      weights[id] = 1;
    });
    return { weights, history: [] };
  }

  function drawNext(state, rng) {
    rng = rng || Math.random;
    const allIds = Object.keys(state.weights);
    const recentlyExcluded = state.history.slice(-RECENT_EXCLUDE);
    let candidates = allIds.filter((id) => !recentlyExcluded.includes(id));
    if (candidates.length === 0) candidates = allIds;

    const total = candidates.reduce((sum, id) => sum + state.weights[id], 0);
    const threshold = rng() * total;

    let cumulative = 0;
    let chosen = candidates[candidates.length - 1];
    for (const id of candidates) {
      cumulative += state.weights[id];
      if (threshold < cumulative) {
        chosen = id;
        break;
      }
    }

    const newHistory = [...state.history, chosen].slice(-HISTORY_LIMIT);
    return { id: chosen, state: { weights: state.weights, history: newHistory } };
  }

  function rateCard(state, id, rating) {
    const deltas = { easy: -1, hard: 1.5, missed: 3 };
    if (!(rating in deltas)) {
      throw new Error(`Unknown rating: ${rating}`);
    }
    const current = state.weights[id] || 1;
    const next = Math.max(0.5, current + deltas[rating]);
    return { weights: { ...state.weights, [id]: next }, history: state.history };
  }

  return { createGameState, drawNext, rateCard };
});
```

- [ ] **Step 2: One-line sanity check**

Run:

```bash
node -e "
const G = require('./js/game.js');
let s = G.createGameState(['a', 'b', 'c']);
const r = G.drawNext(s);
console.log('drew:', r.id, 'history:', r.state.history);
s = G.rateCard(r.state, r.id, 'missed');
console.log('weight after missed:', s.weights[r.id]);
"
```

Expected: prints a drawn id from `a/b/c` with a matching one-item history array, then a weight of `4` for that id (1 + 3).

- [ ] **Step 3: Commit**

```bash
git add js/game.js
git commit -m "Add weighted flashcard game-state logic"
```

---

### Task 4: TTS voice-selection logic

**Files:**
- Create: `js/tts.js`

**Interfaces:**
- Produces:
  - `Tts.pickVoice(voices)` → best `voice` object from a list of `{name, lang}`-shaped objects, or `null` if the list is empty. Preference order: (1) `lang` starts with `fr` (case-insensitive) AND `name` contains `google` (case-insensitive); (2) any `lang` starting with `fr`; (3) the first voice in the list; (4) `null` for an empty list.
  - `Tts.speak(letterUnit)` — browser-only wrapper (verified manually in Task 8), reads `window.speechSynthesis.getVoices()`, calls `pickVoice`, builds a `SpeechSynthesisUtterance` for `letterUnit.ttsText` with `lang = 'fr-FR'` and the picked voice, and calls `window.speechSynthesis.speak(utterance)`.

- [ ] **Step 1: Write the implementation**

Create `js/tts.js`:

```js
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.Tts = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  function pickVoice(voices) {
    if (!voices || voices.length === 0) return null;
    const isFrench = (v) => v.lang && v.lang.toLowerCase().startsWith('fr');
    const isGoogle = (v) => v.name && v.name.toLowerCase().includes('google');

    const googleFrench = voices.find((v) => isFrench(v) && isGoogle(v));
    if (googleFrench) return googleFrench;

    const anyFrench = voices.find(isFrench);
    if (anyFrench) return anyFrench;

    return voices[0];
  }

  function speak(letterUnit) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices();
    const voice = pickVoice(voices);
    const utterance = new SpeechSynthesisUtterance(letterUnit.ttsText);
    utterance.lang = 'fr-FR';
    if (voice) utterance.voice = voice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  return { pickVoice, speak };
});
```

- [ ] **Step 2: One-line sanity check**

Run: `node -e "const T=require('./js/tts.js'); console.log(T.pickVoice([{name:'Google français',lang:'fr-FR'},{name:'x',lang:'en-US'}]).name)"`
Expected output: `Google français`

- [ ] **Step 3: Commit**

```bash
git add js/tts.js
git commit -m "Add TTS voice-selection logic"
```

---

### Task 5: Sourced pronunciation & zhuyin research (FLE resources first)

**Files:**
- Create: `docs/research/sources.md`

**Interfaces:**
- Produces: a Markdown reference file with one section per of the 38 letter ids from Task 2 (`Layout.getAllLetterIds()`), each carrying the facts Task 6 will transcribe into `data/letters.js`.

This task is content research, not code. Use web search. **Priority order for sources: (1) FLE (Français Langue Étrangère) pedagogical resources aimed at learners — these give the clearest, most learner-appropriate articulation descriptions; (2) Taiwanese French-pedagogy material specifically for the zhuyin comparisons; (3) general academic French-phonology references only to fill gaps the FLE resources don't cover in enough articulatory detail (tongue/lips/airflow).** Good FLE-resource starting points: `lepointdufle.net` (phonétique section), `lawlessfrench.com/pronunciation`, `frenchtoday.com`, TV5Monde's "Apprendre le français" pronunciation pages, RFI Savoirs "Le français des relations européennes/phonétique" pages, Université du Maine's interactive FLE phonetics site (`phonetique.free.fr`), Bonjour de France.

- [ ] **Step 1: Research the base vowels**

For ids `a, e, i, o, u, y`: search FLE pronunciation guides first (e.g. `lepointdufle.net voyelles françaises phonétique`, `lawlessfrench.com French vowels pronunciation`), then general phonology sources if needed for articulatory depth. Record the IPA symbol for the *letter name* pronunciation (e.g. "u" as a letter is said as /y/), a plain-English articulation description (tongue height/position, lip rounding, airflow — all French oral vowels here are non-nasal, continuous, voiced), an example word, and at least one source URL per vowel.

- [ ] **Step 2: Research the base consonants**

For ids `b, c, d, f, g, h, j, k, l, m, n, p, q, r, s, t, v, w, x, z`: search FLE resources for how each letter *name* is pronounced (e.g. "h" is silent as a sound but named /aʃ/; "w" is named "double vé") and the articulation of the consonant sound the letter most commonly represents (place/manner, voicing, airflow — e.g. "r" is a uvular fricative/approximant, voiced, airflow through a narrow gap at the back of the throat). Useful queries: `lawlessfrench.com French alphabet pronunciation`, `lepointdufle.net consonnes françaises`, `how to pronounce the French R FLE`.

- [ ] **Step 3: Research the accented letters, prioritizing Taiwanese French-pedagogy sources for zhuyin**

For the 12 accented ids (`e-acute, e-grave, c-cedilla, a-grave, u-grave, a-circumflex, e-circumflex, i-circumflex, o-circumflex, u-circumflex, i-diaeresis, e-diaeresis`): first search specifically for Taiwanese French-teaching material that maps French sounds to zhuyin, e.g. `法文 發音 注音符號 對照`, `法語 母音 注音`, `台灣 法文系 發音教學`, `輔仁大學 法文系 發音`, `淡江大學 法文系 發音教學`, `教育部 法語 發音`. Record the closest zhuyin symbol and its source when genuine Taiwanese-pedagogy material is found. For the articulation facts (tongue/lips/airflow), fall back to the same FLE resources as Steps 1-2.

If no zhuyin source can be found for a given sound, do not invent a mapping — mark `hasEquivalent: false` in Task 6 and cite a general French-phonetics or FLE source instead for the articulation facts.

- [ ] **Step 4: Compile `docs/research/sources.md`**

Write the file with one section per id, in this exact template (fill in real findings, no placeholders):

```markdown
# Pronunciation & Zhuyin Research

## <id> — <grapheme>

- IPA: <symbol>
- Sound description: <plain-English articulation: tongue, lips, airflow, voicing, nasal or not>
- Zhuyin: <closest symbol, or "No close equivalent">
- Zhuyin source note: <why this is/isn't a good match, and whether the source is Taiwanese French-pedagogy material or general phonetics>
- Example word(s): <1-2 French words using this sound>
- Sources:
  - <Title> — <URL>
  - <Title> — <URL>
```

- [ ] **Step 5: Self-check coverage**

Confirm the file has exactly 38 `##` sections, one per id from `Layout.getAllLetterIds()` (run `node -e "console.log(require('./js/layout.js').getAllLetterIds().join('\n'))"` to list them), and that every section has at least one source URL.

- [ ] **Step 6: Commit**

```bash
git add docs/research/sources.md
git commit -m "Add sourced pronunciation and zhuyin research"
```

---

### Task 6: Author the letter data file

**Files:**
- Create: `data/letters.js`
- Create: `scripts/check-data.js`

**Interfaces:**
- Consumes: `Layout.getAllLetterIds`/`Layout.CATEGORY_COUNTS` (Task 2), `docs/research/sources.md` (Task 5).
- Produces: `data/letters.js` exporting an array of 38 objects. Attaches to `module.exports` under Node and `window.LETTERS_DATA` in the browser. Each object has this shape:

```
{
  id: string,                      // matches an id from Layout.getAllLetterIds()
  grapheme: string,                // e.g. "É"
  category: 'base' | 'azerty-accent' | 'extra-accent',
  ipa: string,                     // e.g. "/e/"
  soundLabel: { en: string, zh: string },
  articulation: {
    tongue: { en: string, zh: string },
    lips: { en: string, zh: string },
    airflow: { en: string, zh: string },
    voicing: 'voiced' | 'voiceless',
    nasal: boolean,
  },
  zhuyin: {
    hasEquivalent: boolean,
    symbol: string | null,         // required non-empty when hasEquivalent is true
    caveat: { en: string, zh: string },
  },
  examples: string[],              // at least one French example word
  ttsText: string,                 // text passed to speechSynthesis, e.g. an example word
  sources: [{ title: string, url: string }],  // at least one, url starts with "http"
}
```

- [ ] **Step 1: Write `data/letters.js`**

Using `docs/research/sources.md`, write all 38 entries matching the schema above. Write concise, plain-language `en` text and a natural (not machine-translated-sounding) Traditional Chinese `zh` subtitle for every bilingual field. Example shape for one entry (repeat for all 38, each grounded in its own research section):

```js
const LETTERS = [
  {
    id: 'a',
    grapheme: 'A',
    category: 'base',
    ipa: '/a/',
    soundLabel: { en: 'open a', zh: '開口a' },
    articulation: {
      tongue: { en: 'Tongue low and central in the mouth.', zh: '舌頭放低,置於口腔中央。' },
      lips: { en: 'Lips relaxed, neutral, not rounded.', zh: '嘴唇放鬆,自然不圓唇。' },
      airflow: { en: 'Continuous voiced airflow, no obstruction.', zh: '氣流持續且有聲,沒有阻礙。' },
      voicing: 'voiced',
      nasal: false,
    },
    zhuyin: {
      hasEquivalent: true,
      symbol: 'ㄚ',
      caveat: { en: 'Very close match to Mandarin ㄚ.', zh: '與國語的ㄚ非常接近。' },
    },
    examples: ['papa', 'chat'],
    ttsText: 'papa',
    sources: [
      { title: 'Le Point du FLE — Phonétique', url: 'https://www.lepointdufle.net/phonetique.htm' },
    ],
  },
  // ... 37 more entries, one per id from js/layout.js's getAllLetterIds()
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = LETTERS;
} else {
  window.LETTERS_DATA = LETTERS;
}
```

- [ ] **Step 2: Write the data sanity-check script**

Create `scripts/check-data.js` (a quick guard against a missing field or duplicate id across 38 hand-written entries — not a test suite):

```js
const { CATEGORY_COUNTS, getAllLetterIds } = require('../js/layout.js');
const letters = require('../data/letters.js');

const REQUIRED_FIELDS = ['id', 'grapheme', 'category', 'ipa', 'soundLabel', 'articulation', 'zhuyin', 'examples', 'ttsText', 'sources'];

const errors = [];
const seenIds = new Set();

letters.forEach((entry, index) => {
  const label = `letters[${index}] (id=${entry && entry.id})`;
  REQUIRED_FIELDS.forEach((field) => {
    if (entry[field] === undefined || entry[field] === null) errors.push(`${label}: missing ${field}`);
  });
  if (!Array.isArray(entry.sources) || entry.sources.length === 0) {
    errors.push(`${label}: needs at least one source`);
  }
  if (entry.zhuyin && entry.zhuyin.hasEquivalent && !entry.zhuyin.symbol) {
    errors.push(`${label}: zhuyin.hasEquivalent is true but symbol is empty`);
  }
  if (seenIds.has(entry.id)) errors.push(`Duplicate id: ${entry.id}`);
  seenIds.add(entry.id);
});

const expectedIds = new Set(getAllLetterIds());
for (const id of expectedIds) {
  if (!seenIds.has(id)) errors.push(`Missing letter id from layout: ${id}`);
}

const counts = {};
letters.forEach((l) => {
  counts[l.category] = (counts[l.category] || 0) + 1;
});
for (const [category, expected] of Object.entries(CATEGORY_COUNTS)) {
  if (counts[category] !== expected) {
    errors.push(`Expected ${expected} letters in category "${category}", found ${counts[category] || 0}`);
  }
}

if (errors.length > 0) {
  console.error(`FAILED: ${errors.length} error(s)`);
  errors.forEach((e) => console.error(' -', e));
  process.exit(1);
} else {
  console.log(`OK: ${letters.length} letters, 0 errors`);
}
```

- [ ] **Step 3: Run the check**

Run: `node scripts/check-data.js`
Expected: `OK: 38 letters, 0 errors` — fix any reported error in `data/letters.js` and re-run until this passes.

- [ ] **Step 4: Commit**

```bash
git add data/letters.js scripts/check-data.js
git commit -m "Author sourced letter data and add a data sanity check"
```

---

### Task 7: Keyboard rendering

**Files:**
- Create: `js/keyboard.js`
- Modify: `index.html` (add script tags and container wiring)
- Modify: `style.css` (keyboard styling)

**Interfaces:**
- Consumes: `Layout` (Task 2), `data/letters.js` → `window.LETTERS_DATA` (Task 6).
- Produces: `Keyboard.render(container, letters)` — sets `container.innerHTML` to the full keyboard markup (digit row, rows 2-4, extra-accents strip), each interactive key carrying `data-letter-id="<id>"`; inert digit-row keys (no `letterId`) get no `data-letter-id`. `Keyboard.onKeyPress(container, callback)` — attaches one delegated `click` listener on `container` that calls `callback(letterId)` when a key with a `data-letter-id` is clicked.

- [ ] **Step 1: Write the implementation**

Create `js/keyboard.js`:

```js
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.Keyboard = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  function findLetter(letters, id) {
    return letters.find((l) => l.id === id);
  }

  function renderKey(k, letters) {
    if (!k.letterId) {
      return `<span class="key key-inert">${k.char}</span>`;
    }
    const letter = findLetter(letters, k.letterId);
    const label = letter ? letter.grapheme : k.char;
    return `<button type="button" class="key" data-letter-id="${k.letterId}">${label}</button>`;
  }

  function renderRow(keys, letters, extraClass) {
    const cls = extraClass ? ` ${extraClass}` : '';
    return `<div class="kb-row${cls}">${keys.map((k) => renderKey(k, letters)).join('')}</div>`;
  }

  function render(container, letters) {
    const Layout = typeof window !== 'undefined' ? window.Layout : require('./layout.js');
    const html =
      renderRow(Layout.DIGIT_ROW, letters, 'kb-row-digits') +
      renderRow(Layout.ROW2, letters) +
      renderRow(Layout.ROW3, letters) +
      renderRow(Layout.ROW4, letters) +
      `<div class="kb-extra-note">Extra accents (need a dead-key combo on a real keyboard)<br>還需要複合鍵才能在真實鍵盤上打出的重音字母</div>` +
      renderRow(Layout.EXTRA_ACCENTS, letters, 'kb-row-extra');
    container.innerHTML = html;
  }

  function onKeyPress(container, callback) {
    container.addEventListener('click', (event) => {
      const key = event.target.closest('[data-letter-id]');
      if (key) callback(key.getAttribute('data-letter-id'));
    });
  }

  return { render, onKeyPress };
});
```

- [ ] **Step 2: Wire it into `index.html`**

Add before the closing `</body>` in `index.html`, after the existing `js/i18n.js` script tag, replacing the previous inline `<script>` block:

```html
  <script src="js/i18n.js"></script>
  <script src="js/layout.js"></script>
  <script src="data/letters.js"></script>
  <script src="js/keyboard.js"></script>
  <script>
    document.getElementById('app-title').innerHTML = I18n.renderBilingual(
      { en: 'French Letter Pronunciation Trainer', zh: '法語字母發音練習' }
    );
    document.getElementById('tab-keyboard').innerHTML = I18n.renderBilingual({ en: 'Keyboard', zh: '鍵盤' });
    document.getElementById('tab-game').innerHTML = I18n.renderBilingual({ en: 'Game', zh: '遊戲' });

    const keyboardContainer = document.getElementById('keyboard-container');
    Keyboard.render(keyboardContainer, window.LETTERS_DATA);
    Keyboard.onKeyPress(keyboardContainer, (letterId) => {
      console.log('key pressed:', letterId);
    });
  </script>
```

Add matching CSS to `style.css` (mobile-first sizing so small screens fit without horizontal scroll):

```css
.kb-row {
  display: flex;
  gap: 3px;
  margin-bottom: 3px;
  flex-wrap: wrap;
}

.key {
  min-width: 1.8rem;
  height: 1.8rem;
  border-radius: 4px;
  border: 1px solid var(--key-border);
  background: var(--key-bg);
  cursor: pointer;
  font-size: 0.9rem;
}

.key:hover {
  filter: brightness(0.95);
}

.key-inert {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.8rem;
  height: 1.8rem;
  color: #b0b0b0;
  border: 1px dashed var(--key-border);
  border-radius: 4px;
}

.kb-row-digits .key {
  background: var(--accent-key-bg);
}

.kb-row-extra {
  margin-top: 0.5rem;
}

.kb-row-extra .key {
  background: var(--extra-key-bg);
}

.kb-extra-note {
  font-size: 0.75rem;
  color: var(--text-sub);
  margin: 0.5rem 0 0.25rem;
}

@media (min-width: 480px) {
  .key,
  .key-inert {
    min-width: 2.2rem;
    height: 2.2rem;
    font-size: 1rem;
  }
}
```

- [ ] **Step 3: Manual check (desktop and mobile width)**

Open `index.html` in a browser. Confirm the digit row shows `& é " ' ( - è _ ç à ) =` with `é è ç à` clickable and the rest visually inert; row 2/3/4 show the 26 letters in AZERTY order with `ù` at the end of row 3; the extra-accents strip shows `â ê î ô û ï ë` below a bilingual note. Open the browser console, click several keys (including `é`, `ù`, and an extra-accent key), and confirm each logs its correct id (e.g. `e-acute`, `u-grave`). Then resize to ~375px wide (or use devtools device toolbar) and confirm every key is still tappable and nothing overflows the screen width.

- [ ] **Step 4: Commit**

```bash
git add js/keyboard.js index.html style.css
git commit -m "Render the AZERTY keyboard"
```

---

### Task 8: Info panel + audio wiring

**Files:**
- Create: `js/panel.js`
- Modify: `index.html`
- Modify: `style.css`

**Interfaces:**
- Consumes: `Tts.speak` (Task 4), letter unit objects (Task 6 shape).
- Produces: `Panel.render(container, letterUnit)` — sets `container.innerHTML` to the panel markup for one letter unit (grapheme, IPA, sound label, articulation, zhuyin + caveat, examples, a `<button data-action="play">` play button, and a list of source links). `Panel.onPlay(container, callback)` — delegated click listener calling `callback()` when the play button is clicked.

- [ ] **Step 1: Write the implementation**

Create `js/panel.js`:

```js
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.Panel = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  function bilingual(text) {
    const I18n = typeof window !== 'undefined' ? window.I18n : require('./i18n.js');
    return I18n.renderBilingual(text);
  }

  function render(container, letterUnit) {
    if (!letterUnit) {
      container.innerHTML = '';
      return;
    }
    const zhuyinLine = letterUnit.zhuyin.hasEquivalent
      ? `<p><strong>Zhuyin / 注音:</strong> ${letterUnit.zhuyin.symbol}</p>`
      : `<p><strong>Zhuyin / 注音:</strong> <em>No close equivalent / 沒有接近的音</em></p>`;

    container.innerHTML = `
      <div class="panel">
        <h2>${letterUnit.grapheme} <span class="ipa">${letterUnit.ipa}</span></h2>
        <p class="sound-label">${bilingual(letterUnit.soundLabel)}</p>
        <ul class="articulation">
          <li><strong>Tongue / 舌位:</strong> ${bilingual(letterUnit.articulation.tongue)}</li>
          <li><strong>Lips / 嘴唇:</strong> ${bilingual(letterUnit.articulation.lips)}</li>
          <li><strong>Airflow / 氣流:</strong> ${bilingual(letterUnit.articulation.airflow)}</li>
        </ul>
        ${zhuyinLine}
        <p class="zhuyin-caveat">${bilingual(letterUnit.zhuyin.caveat)}</p>
        <p><strong>Examples / 範例:</strong> ${letterUnit.examples.join(', ')}</p>
        <button type="button" class="play-btn" data-action="play">🔊 Play / 播放</button>
        <ul class="sources">
          ${letterUnit.sources.map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.title}</a></li>`).join('')}
        </ul>
      </div>
    `;
  }

  function onPlay(container, callback) {
    container.addEventListener('click', (event) => {
      if (event.target.closest('[data-action="play"]')) callback();
    });
  }

  return { render, onPlay };
});
```

- [ ] **Step 2: Wire keyboard clicks to the panel and audio**

In `index.html`, add `js/tts.js` and `js/panel.js` script tags after `js/keyboard.js`, and replace the whole final inline `<script>` block with this version (it tracks the currently-selected letter in a variable so `Panel.onPlay`'s callback knows what to speak):

```html
  <script src="js/i18n.js"></script>
  <script src="js/layout.js"></script>
  <script src="data/letters.js"></script>
  <script src="js/keyboard.js"></script>
  <script src="js/tts.js"></script>
  <script src="js/panel.js"></script>
  <script>
    document.getElementById('app-title').innerHTML = I18n.renderBilingual(
      { en: 'French Letter Pronunciation Trainer', zh: '法語字母發音練習' }
    );
    document.getElementById('tab-keyboard').innerHTML = I18n.renderBilingual({ en: 'Keyboard', zh: '鍵盤' });
    document.getElementById('tab-game').innerHTML = I18n.renderBilingual({ en: 'Game', zh: '遊戲' });

    const keyboardContainer = document.getElementById('keyboard-container');
    const panelContainer = document.getElementById('panel-container');
    Keyboard.render(keyboardContainer, window.LETTERS_DATA);

    function findLetter(id) {
      return window.LETTERS_DATA.find((l) => l.id === id);
    }

    let currentLetter = null;
    Keyboard.onKeyPress(keyboardContainer, (letterId) => {
      currentLetter = findLetter(letterId);
      Panel.render(panelContainer, currentLetter);
    });
    Panel.onPlay(panelContainer, () => {
      if (currentLetter) Tts.speak(currentLetter);
    });
  </script>
```

Add panel styling to `style.css` (mobile-first: full width by default, capped on wider screens):

```css
.panel {
  width: 100%;
  background: var(--panel-bg);
  border: 1px solid var(--key-border);
  border-radius: 8px;
  padding: 1rem;
}

.panel .ipa {
  color: var(--text-sub);
  font-weight: normal;
}

.panel .articulation {
  padding-left: 1.2rem;
}

.play-btn {
  margin: 0.5rem 0;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  border: 1px solid var(--key-border);
  background: var(--accent-key-bg);
  cursor: pointer;
  font-size: 1rem;
}

.panel .sources {
  font-size: 0.8rem;
  padding-left: 1.2rem;
}

@media (min-width: 720px) {
  .panel {
    max-width: 360px;
  }
}
```

- [ ] **Step 3: Manual check (desktop and mobile width, use a Chromium-based browser for the "Google" voice)**

Open `index.html`. Click several keys across all three key categories (a base letter, `é`, and an extra accent like `ê`). Confirm the panel shows the grapheme, IPA, bilingual sound label, tongue/lips/airflow lines, the zhuyin line (including at least one letter that correctly shows "No close equivalent" if your research found one), example words, and clickable source links that open the right pages. Click "🔊 Play" and confirm you hear the example word spoken in French. Open the browser console and run `speechSynthesis.getVoices().map(v => v.name)` to confirm whether a "Google" voice was available and, if so, that it was the one used (no error either way if it falls back). Repeat the key-click + play check at a ~375px width to confirm the panel and play button are still usable with a thumb.

- [ ] **Step 4: Commit**

```bash
git add js/panel.js index.html style.css
git commit -m "Add info panel with sourced content and audio playback"
```

---

### Task 9: Game mode UI

**Files:**
- Create: `js/game-ui.js`
- Modify: `index.html`
- Modify: `style.css`

**Interfaces:**
- Consumes: `Game.createGameState`/`drawNext`/`rateCard` (Task 3), `Panel.render`/`onPlay` (Task 8), `Tts.speak` (Task 4).
- Produces: `GameUI.init(rootEl, letters)` — renders the flashcard screen into `rootEl` (big grapheme, a "Reveal" button, and after reveal, the full panel plus Easy/Hard/Missed buttons and a session counter), and manages its own `Game` state internally, redrawing a new card after each rating.

- [ ] **Step 1: Write the implementation**

Create `js/game-ui.js`:

```js
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.GameUI = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  function init(rootEl, letters) {
    const Game = typeof window !== 'undefined' ? window.Game : require('./game.js');
    const Panel = typeof window !== 'undefined' ? window.Panel : require('./panel.js');
    const Tts = typeof window !== 'undefined' ? window.Tts : require('./tts.js');

    let gameState = Game.createGameState(letters.map((l) => l.id));
    let reviewed = 0;
    let easyStreak = 0;
    let currentId = null;
    let currentLetter = null;

    rootEl.innerHTML = `
      <div class="game-screen">
        <p class="game-counter"></p>
        <div class="game-card"></div>
        <div class="game-reveal-area"></div>
      </div>
    `;

    const counterEl = rootEl.querySelector('.game-counter');
    const cardEl = rootEl.querySelector('.game-card');
    const revealAreaEl = rootEl.querySelector('.game-reveal-area');

    function findLetter(id) {
      return letters.find((l) => l.id === id);
    }

    function updateCounter() {
      counterEl.textContent = `Reviewed / 已複習: ${reviewed} — Easy streak / 連續簡單: ${easyStreak}`;
    }

    function drawCard() {
      const result = Game.drawNext(gameState);
      gameState = result.state;
      currentId = result.id;
      currentLetter = findLetter(currentId);
      cardEl.innerHTML = `<div class="flashcard">${currentLetter.grapheme}</div>`;
      revealAreaEl.innerHTML = `<button type="button" class="reveal-btn">Reveal / 顯示答案</button>`;
      revealAreaEl.querySelector('.reveal-btn').addEventListener('click', showAnswer);
    }

    function showAnswer() {
      revealAreaEl.innerHTML = `
        <div class="panel-container"></div>
        <div class="rating-buttons">
          <button type="button" data-rating="easy">Easy / 簡單</button>
          <button type="button" data-rating="hard">Hard / 困難</button>
          <button type="button" data-rating="missed">Missed / 沒答對</button>
        </div>
      `;
      const panelContainer = revealAreaEl.querySelector('.panel-container');
      Panel.render(panelContainer, currentLetter);
      Panel.onPlay(panelContainer, () => Tts.speak(currentLetter));

      revealAreaEl.querySelector('.rating-buttons').addEventListener('click', (event) => {
        const btn = event.target.closest('[data-rating]');
        if (!btn) return;
        const rating = btn.getAttribute('data-rating');
        gameState = Game.rateCard(gameState, currentId, rating);
        reviewed += 1;
        easyStreak = rating === 'easy' ? easyStreak + 1 : 0;
        updateCounter();
        drawCard();
      });
    }

    updateCounter();
    drawCard();
  }

  return { init };
});
```

- [ ] **Step 2: Wire the Game tab**

In `index.html`, add `js/game.js` and `js/game-ui.js` script tags (after `js/tts.js` and `js/panel.js`), and add tab-switching plus game init logic to the final inline script block:

```html
  <script src="js/i18n.js"></script>
  <script src="js/layout.js"></script>
  <script src="data/letters.js"></script>
  <script src="js/keyboard.js"></script>
  <script src="js/tts.js"></script>
  <script src="js/panel.js"></script>
  <script src="js/game.js"></script>
  <script src="js/game-ui.js"></script>
  <script>
    document.getElementById('app-title').innerHTML = I18n.renderBilingual(
      { en: 'French Letter Pronunciation Trainer', zh: '法語字母發音練習' }
    );
    document.getElementById('tab-keyboard').innerHTML = I18n.renderBilingual({ en: 'Keyboard', zh: '鍵盤' });
    document.getElementById('tab-game').innerHTML = I18n.renderBilingual({ en: 'Game', zh: '遊戲' });

    const keyboardContainer = document.getElementById('keyboard-container');
    const panelContainer = document.getElementById('panel-container');
    Keyboard.render(keyboardContainer, window.LETTERS_DATA);

    function findLetter(id) {
      return window.LETTERS_DATA.find((l) => l.id === id);
    }

    let currentLetter = null;
    Keyboard.onKeyPress(keyboardContainer, (letterId) => {
      currentLetter = findLetter(letterId);
      Panel.render(panelContainer, currentLetter);
    });
    Panel.onPlay(panelContainer, () => {
      if (currentLetter) Tts.speak(currentLetter);
    });

    const tabKeyboardBtn = document.getElementById('tab-keyboard');
    const tabGameBtn = document.getElementById('tab-game');
    const viewKeyboard = document.getElementById('view-keyboard');
    const viewGame = document.getElementById('view-game');
    let gameStarted = false;

    function activateTab(name) {
      tabKeyboardBtn.classList.toggle('active', name === 'keyboard');
      tabGameBtn.classList.toggle('active', name === 'game');
      viewKeyboard.classList.toggle('active', name === 'keyboard');
      viewGame.classList.toggle('active', name === 'game');
      if (name === 'game' && !gameStarted) {
        gameStarted = true;
        GameUI.init(document.getElementById('game-container'), window.LETTERS_DATA);
      }
    }

    tabKeyboardBtn.addEventListener('click', () => activateTab('keyboard'));
    tabGameBtn.addEventListener('click', () => activateTab('game'));
  </script>
```

Add game styling to `style.css` (mobile-first flashcard sizing):

```css
.game-screen {
  max-width: 480px;
  margin: 0 auto;
  text-align: center;
}

.flashcard {
  font-size: 4rem;
  border: 2px solid var(--key-border);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
  background: var(--panel-bg);
}

.reveal-btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid var(--key-border);
  background: var(--accent-key-bg);
  cursor: pointer;
}

.rating-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 0.75rem;
  flex-wrap: wrap;
}

.rating-buttons button {
  padding: 0.6rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--key-border);
  cursor: pointer;
  font-size: 0.95rem;
}

.game-counter {
  color: var(--text-sub);
  font-size: 0.9rem;
}

@media (min-width: 480px) {
  .flashcard {
    font-size: 6rem;
    padding: 2rem;
  }
}
```

- [ ] **Step 3: Manual check (desktop and mobile width)**

Open `index.html`, click the "Game" tab, and confirm a random letter card appears. Click "Reveal", confirm the full info panel (with working Play button) plus three rating buttons appear. Click through all three ratings across several draws and confirm: the counter increments, the easy streak resets on non-easy ratings, the same card never appears twice in a row, and clicking "Keyboard" then back to "Game" keeps the game running (state isn't reset by tab switching — only by a full page reload). Repeat at ~375px width and confirm the flashcard, reveal button, and all three rating buttons are comfortably tappable without horizontal scrolling.

- [ ] **Step 4: Commit**

```bash
git add js/game-ui.js index.html style.css
git commit -m "Add weighted flashcard game mode UI"
```

---

### Task 10: Final mobile/responsive pass and full walkthrough

**Files:**
- Modify: `style.css`

**Interfaces:** none (styling + manual verification only).

- [ ] **Step 1: Tighten narrow-viewport styling**

Review every screen at a ~360-390px width (common phone width) and fix anything cramped or overflowing. In particular, extend `style.css` so long panel text wraps properly and tap targets stay comfortable:

```css
@media (max-width: 480px) {
  body {
    padding: 0.75rem;
  }

  nav.tabs button {
    flex: 1;
  }

  .panel h2 {
    font-size: 1.3rem;
  }

  .sources a {
    word-break: break-word;
  }
}
```

- [ ] **Step 2: Full manual verification pass**

In a Chromium-based browser, check both a typical desktop width (e.g. 1280px) and a phone width (e.g. 375px, via devtools device toolbar or an actual phone on the same network hitting a quick `python3 -m http.server` in the project folder). Run through:

- [ ] Every key on the keyboard (26 base + 4 digit-row accents + `ù` + 7 extra accents = 38) opens a panel with correct, precise content and at least one working source link.
- [ ] Audio plays correctly for at least 5 different letters across different categories, at both widths.
- [ ] A full game session runs cleanly through at least 10 draws, exercising all three ratings, at both widths.
- [ ] EN/ZH subtitles render everywhere text appears (title, tabs, panel fields, game screen).
- [ ] `node scripts/check-data.js` prints `OK: 38 letters, 0 errors`.
- [ ] No horizontal scrolling or overlapping elements at the phone width, on either tab.

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "Final mobile responsive pass"
```

---

## Scope addition (approved by user after Task 10): letter-name audio + richer examples

The user asked for two additions, with priority: (1) also let the user hear the letter's own NAME spoken aloud (not just an example word), and (2) more example words per letter, and a simple example sentence for some letters. Tasks 11-12 implement this on top of the completed Tasks 1-10, using the same data-then-UI sequencing as Tasks 6-9.

### Task 11: Letter-name audio data + expanded examples/sentences

**Files:**
- Modify: `data/letters.js` (add `letterName` to every entry, expand `examples`, add `exampleSentence` to the 26 base letters)
- Modify: `scripts/check-data.js` (validate the new `letterName` field)

**Interfaces:**
- Consumes: nothing new.
- Produces: every letter unit gains `letterName: string` (the letter's own name as said aloud in French, e.g. `"ache"` for h) and `examples: string[]` with at least 2 items where natural. The 26 `base`-category entries also gain `exampleSentence: string` (a simple, grammatically correct A1-level French sentence using a word from that letter's own `examples`); accented letters may omit `exampleSentence` (skip it — do not force an unnatural sentence).

- [ ] **Step 1: Add `letterName` to every one of the 38 entries**

These are standard French alphabet/orthography names — not a phonetic claim needing a new citation, so no new research is required. Use exactly these values, matched by `id`:

Base letters: `a`→"a", `b`→"bé", `c`→"cé", `d`→"dé", `e`→"e", `f`→"effe", `g`→"gé", `h`→"ache", `i`→"i", `j`→"ji", `k`→"ka", `l`→"elle", `m`→"emme", `n`→"enne", `o`→"o", `p`→"pé", `q`→"ku", `r`→"erre", `s`→"esse", `t`→"té", `u`→"u", `v`→"vé", `w`→"double vé", `x`→"iks", `y`→"i grec", `z`→"zède".

Accented letters: `e-acute`→"e accent aigu", `e-grave`→"e accent grave", `c-cedilla`→"c cédille", `a-grave`→"a accent grave", `u-grave`→"u accent grave", `a-circumflex`→"a accent circonflexe", `e-circumflex`→"e accent circonflexe", `i-circumflex`→"i accent circonflexe", `o-circumflex`→"o accent circonflexe", `u-circumflex`→"u accent circonflexe", `i-diaeresis`→"i tréma", `e-diaeresis`→"e tréma".

Add each as a new `letterName: '<value>'` field on the matching entry object (place it right after `grapheme`/`category`, before `ipa`, for readability — exact position doesn't matter functionally).

- [ ] **Step 2: Expand `examples` to at least 2 words for every entry that currently has only 1**

Pull a second (or third) genuinely French word that illustrates the same sound already documented in that entry's `soundLabel`/`articulation` text. This is ordinary vocabulary, not a new phonetic claim, so it does not need its own citation — the entry's existing `sources[]` already covers the sound itself. Keep words simple and common (A1/A2 level).

- [ ] **Step 3: Add `exampleSentence` to the 26 `base`-category entries**

Write one simple, natural, grammatically correct French sentence per base letter (3-7 words, present tense, common vocabulary — A1 level), ideally reusing one of that entry's own `examples` words so the sentence and the word list stay coherent. Do not add `exampleSentence` to the 12 accented entries (azerty-accent/extra-accent) — omit the field there entirely (leave it undefined), since forcing a sentence around an accented letter specifically is unnatural and out of scope.

Example shape (illustrative only — write your own sentence for each of the 26 base letters, don't copy this one elsewhere):

```js
{
  id: 'a',
  grapheme: 'A',
  category: 'base',
  letterName: 'a',
  ipa: '/a/',
  soundLabel: { en: 'open a', zh: '開口a' },
  articulation: { /* unchanged from Task 6 */ },
  zhuyin: { /* unchanged from Task 6 */ },
  examples: ['papa', 'chat', 'ami'],
  exampleSentence: "Le chat est ami avec papa.",
  ttsText: 'papa',
  sources: [ /* unchanged from Task 6 */ ],
}
```

- [ ] **Step 4: Update `scripts/check-data.js` to validate `letterName`**

In the `REQUIRED_FIELDS` array, add `'letterName'`:

```js
const REQUIRED_FIELDS = ['id', 'grapheme', 'category', 'letterName', 'ipa', 'soundLabel', 'articulation', 'zhuyin', 'examples', 'ttsText', 'sources'];
```

No other change to that script is needed (`exampleSentence` stays optional/unchecked since only base letters carry it).

- [ ] **Step 5: Run the check**

Run: `node scripts/check-data.js`
Expected: `OK: 38 letters, 0 errors` — fix any reported error and re-run until this passes. Also spot-check by eye that all 26 base entries have a non-empty `exampleSentence` and the 12 accented entries do not error despite lacking one (since `exampleSentence` isn't in `REQUIRED_FIELDS`).

- [ ] **Step 6: Commit**

```bash
git add data/letters.js scripts/check-data.js
git commit -m "Add letter-name audio data and richer examples"
```

---

### Task 12: Per-item audio playback UI (letter name, each example word, example sentence)

**Files:**
- Modify: `js/tts.js` (replace the single-purpose `speak(letterUnit)` with a general `speakText(text)`)
- Modify: `js/panel.js` (render a play button next to the letter name, each example word, and the example sentence, instead of one big Play button tied to `ttsText`)
- Modify: `index.html` (update the `Panel.onPlay` wiring to speak whatever text the clicked button carries)
- Modify: `js/game-ui.js` (same `Panel.onPlay` wiring update, inside `showAnswer()`)
- Modify: `style.css` (small play-icon-button styling, remove the now-unused big `.play-btn` rule)

**Interfaces:**
- Consumes: `letterUnit.letterName`/`examples`/`exampleSentence` (Task 11).
- Produces: `Tts.speakText(text)` — speaks any string via the browser's Web Speech API using the same voice-selection logic as before (`Tts.pickVoice` unchanged). `Tts.speak(letterUnit)` is removed — there are no other callers of it once this task updates index.html and game-ui.js. `Panel.onPlay(container, callback)` now calls `callback(text)` with the exact string from the clicked button's `data-speak` attribute, instead of taking no arguments.

- [ ] **Step 1: Update `js/tts.js`**

Replace the file's contents with:

```js
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.Tts = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  function pickVoice(voices) {
    if (!voices || voices.length === 0) return null;
    const isFrench = (v) => v.lang && v.lang.toLowerCase().startsWith('fr');
    const isGoogle = (v) => v.name && v.name.toLowerCase().includes('google');

    const googleFrench = voices.find((v) => isFrench(v) && isGoogle(v));
    if (googleFrench) return googleFrench;

    const anyFrench = voices.find(isFrench);
    if (anyFrench) return anyFrench;

    return voices[0];
  }

  function speakText(text) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices();
    const voice = pickVoice(voices);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    if (voice) utterance.voice = voice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  return { pickVoice, speakText };
});
```

(`pickVoice`'s logic and the one-line sanity check from Task 4 are unchanged — `node -e "const T=require('./js/tts.js'); console.log(T.pickVoice([{name:'Google français',lang:'fr-FR'},{name:'x',lang:'en-US'}]).name)"` should still print `Google français`.)

- [ ] **Step 2: Update `js/panel.js`**

Replace the file's contents with:

```js
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.Panel = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  function bilingual(text) {
    const I18n = typeof window !== 'undefined' ? window.I18n : require('./i18n.js');
    return I18n.renderBilingual(text);
  }

  function playBtn(text) {
    return `<button type="button" class="play-btn-sm" data-speak="${text}" title="Play">🔊</button>`;
  }

  function render(container, letterUnit) {
    if (!letterUnit) {
      container.innerHTML = '';
      return;
    }
    const zhuyinLine = letterUnit.zhuyin.hasEquivalent
      ? `<p><strong>Zhuyin / 注音:</strong> ${letterUnit.zhuyin.symbol}</p>`
      : `<p><strong>Zhuyin / 注音:</strong> <em>No close equivalent / 沒有接近的音</em></p>`;

    const examplesHtml = letterUnit.examples
      .map((word) => `<li>${word} ${playBtn(word)}</li>`)
      .join('');

    const sentenceHtml = letterUnit.exampleSentence
      ? `<p class="example-sentence">${letterUnit.exampleSentence} ${playBtn(letterUnit.exampleSentence)}</p>`
      : '';

    container.innerHTML = `
      <div class="panel">
        <h2>${letterUnit.grapheme} <span class="ipa">${letterUnit.ipa}</span></h2>
        <p class="letter-name">Letter name / 字母名稱: <strong>${letterUnit.letterName}</strong> ${playBtn(letterUnit.letterName)}</p>
        <p class="sound-label">${bilingual(letterUnit.soundLabel)}</p>
        <ul class="articulation">
          <li><strong>Tongue / 舌位:</strong> ${bilingual(letterUnit.articulation.tongue)}</li>
          <li><strong>Lips / 嘴唇:</strong> ${bilingual(letterUnit.articulation.lips)}</li>
          <li><strong>Airflow / 氣流:</strong> ${bilingual(letterUnit.articulation.airflow)}</li>
        </ul>
        ${zhuyinLine}
        <p class="zhuyin-caveat">${bilingual(letterUnit.zhuyin.caveat)}</p>
        <p><strong>Examples / 範例:</strong></p>
        <ul class="examples">${examplesHtml}</ul>
        ${sentenceHtml}
        <ul class="sources">
          ${letterUnit.sources.map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.title}</a></li>`).join('')}
        </ul>
      </div>
    `;
  }

  function onPlay(container, callback) {
    container.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-speak]');
      if (btn) callback(btn.getAttribute('data-speak'));
    });
  }

  return { render, onPlay };
});
```

Note the removed big "🔊 Play / 播放" button tied to `ttsText` — it's replaced by the small per-item buttons next to the letter name, each example word, and the sentence.

- [ ] **Step 3: Update the keyboard-tab wiring in `index.html`**

Find the final inline `<script>` block (added in Task 9) and replace the keyboard-tab section — the part that reads:

```js
let currentLetter = null;
Keyboard.onKeyPress(keyboardContainer, (letterId) => {
  currentLetter = findLetter(letterId);
  Panel.render(panelContainer, currentLetter);
});
Panel.onPlay(panelContainer, () => {
  if (currentLetter) Tts.speak(currentLetter);
});
```

with:

```js
Keyboard.onKeyPress(keyboardContainer, (letterId) => {
  const letter = findLetter(letterId);
  Panel.render(panelContainer, letter);
});
Panel.onPlay(panelContainer, (text) => Tts.speakText(text));
```

(The `currentLetter` variable is no longer needed for the keyboard tab's panel — `Panel.onPlay`'s callback now receives the exact text to speak directly from the clicked button, so there is nothing left to track. Leave the rest of the script block — the tab-switching logic — unchanged.)

- [ ] **Step 4: Update `js/game-ui.js`'s `showAnswer()`**

Inside `showAnswer()`, find:

```js
Panel.render(panelContainer, currentLetter);
Panel.onPlay(panelContainer, () => Tts.speak(currentLetter));
```

and replace with:

```js
Panel.render(panelContainer, currentLetter);
Panel.onPlay(panelContainer, (text) => Tts.speakText(text));
```

(`currentLetter` is still used elsewhere in `game-ui.js` for the flashcard/rating logic — only this one line changes.)

- [ ] **Step 5: Update `style.css`**

Remove the now-unused big Play button rule:

```css
.play-btn {
  margin: 0.5rem 0;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  border: 1px solid var(--key-border);
  background: var(--accent-key-bg);
  cursor: pointer;
  font-size: 1rem;
}
```

and add in its place:

```css
.play-btn-sm {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  padding: 0 0.25rem;
  vertical-align: middle;
}

.panel .examples {
  list-style: none;
  padding-left: 0;
  margin: 0.25rem 0;
}

.panel .examples li {
  margin: 0.15rem 0;
}

.example-sentence {
  font-style: italic;
  margin: 0.5rem 0;
}
```

- [ ] **Step 6: Manual check (desktop and mobile width) — use a real browser**

Open `index.html`. Click a base letter (e.g. 'a') and confirm the panel shows a "Letter name" line with its own 🔊 button, a list of 2+ example words each with their own 🔊 button, and an italicized example sentence with its own 🔊 button. Click each of these 🔊 buttons in turn and confirm each speaks the correct, different text (not always the same word) — e.g. open the console and log `speechSynthesis speaking` events, or at minimum confirm no JS errors and that repeated clicks on different buttons don't get "stuck" on the first text clicked. Click an accented letter (e.g. 'é') and confirm its letter-name line reads "e accent aigu" with a working play button, and that it has NO example-sentence line (since accented letters don't get one). Switch to the Game tab, reveal a card, and confirm the same per-item play buttons work there too (reusing `js/panel.js`). Resize to ~375px and confirm the small play buttons remain tappable and nothing overflows.

- [ ] **Step 7: Commit**

```bash
git add js/tts.js js/panel.js js/game-ui.js index.html style.css
git commit -m "Add per-item audio playback for letter name, examples, and sentences"
```

---

## Bug fix (user-reported after Task 12): letter-name TTS mispronunciation

The user tested the live site and reported that the letter 'q's spoken letter-name ("ku") sounds wrong — like "kou" (/ku/) instead of the correct French /ky/. `letterName: 'ku'` (Task 11) is linguistically correct as *written* French phonetic spelling (French reading rules: "u" alone is /y/, so "ku" should read /ky/), but it isn't a real French word, and neural TTS models are known to mispronounce out-of-vocabulary short nonsense syllables even when standard spelling rules would predict the correct sound. The same risk applies to every other invented consonant-name spelling (bé, cé, dé, effe, gé, ka, elle, emme, enne, pé, erre, esse, té, vé, zède) — only 'q' has been confirmed bad so far, since that's what the user happened to test first.

**Important limitation, stated plainly for whoever executes this task:** nobody in this pipeline — controller or reviewer — can literally listen to the audio this produces. Verification is limited to confirming the right text is queued to `speechSynthesis` and that the reasoning behind the text choice is sound; actual pronunciation correctness can only be confirmed by a human listening. Say so explicitly in your report rather than claiming the fix "sounds correct."

### Task 13: Use the raw grapheme for base-letter TTS, not the invented spelling

**Files:**
- Modify: `data/letters.js` (add a `letterNameTts` field to every entry)
- Modify: `js/panel.js` (letter-name play button speaks `letterNameTts`, not `letterName`)

**Interfaces:**
- Consumes: nothing new.
- Produces: every letter unit gains `letterNameTts: string` — for `category: 'base'` entries, this equals `grapheme` (e.g. `'Q'`, `'B'`, `'H'`); for `category: 'azerty-accent'`/`'extra-accent'` entries, this equals the existing `letterName` value unchanged (e.g. `'e accent aigu'`), since those are already built from real French words and aren't suspected of the same failure mode. `letterName` itself is untouched and still used for the visible display text next to the button.

Rationale for using the raw grapheme for base letters: most speech-synthesis engines (including the ones behind the Web Speech API) have dedicated logic for pronouncing an isolated single Latin letter as that letter's name in the utterance's target locale — this is the same mechanism screen readers rely on to "spell" text. Feeding the engine the actual character it already knows how to name, instead of an invented two/three-letter phonetic approximation it has to guess at, sidesteps the out-of-vocabulary mispronunciation risk entirely for the 26 base letters.

- [ ] **Step 1: Add `letterNameTts` to all 38 entries in `data/letters.js`**

For each of the 26 `base` entries, set `letterNameTts` equal to that entry's own `grapheme` value (not a hardcoded re-typed letter — copy the actual field so there's no risk of a typo introducing a mismatch, e.g. for the `q` entry: `letterNameTts: 'Q'` matching its `grapheme: 'Q'`).

For each of the 12 `azerty-accent`/`extra-accent` entries, set `letterNameTts` equal to that entry's own existing `letterName` value (e.g. for `e-acute`: `letterNameTts: 'e accent aigu'`, matching `letterName: 'e accent aigu'`).

Place the new field right after `letterName` in each entry for readability.

- [ ] **Step 2: Update `js/panel.js`'s letter-name button to speak `letterNameTts`**

Find this line (added in Task 12):

```js
<p class="letter-name">Letter name / 字母名稱: <strong>${letterUnit.letterName}</strong> ${playBtn(letterUnit.letterName)}</p>
```

Replace with:

```js
<p class="letter-name">Letter name / 字母名稱: <strong>${letterUnit.letterName}</strong> ${playBtn(letterUnit.letterNameTts)}</p>
```

(The visible text — `letterUnit.letterName` — is unchanged; only the button's `data-speak` value changes, from `letterUnit.letterName` to `letterUnit.letterNameTts`. Every other line in `panel.js` — examples, sentence, sources, etc. — is untouched.)

- [ ] **Step 3: Verify the wiring (not the audio)**

Run `node scripts/check-data.js` — it does not yet validate `letterNameTts`, so this only confirms nothing else broke; expect `OK: 38 letters, 0 errors`. Then open `index.html` in a real browser, click the 'q' key, and — with `speechSynthesis.speak` instrumented/logged (e.g. monkey-patch it in the console before clicking, or inspect `speechSynthesis.pending`/queued utterances) — click the letter-name 🔊 button and confirm the queued text is now `"Q"` (the raw grapheme), not `"ku"`. Repeat for one accented letter (e.g. 'é') and confirm its letter-name button still queues `"e accent aigu"` (unchanged behavior). You cannot verify the actual pronunciation sounds correct — say so plainly in your report; that confirmation has to come from the user.

- [ ] **Step 4: Commit**

```bash
git add data/letters.js js/panel.js
git commit -m "Speak the raw grapheme for base-letter names, fixing TTS mispronunciation risk"
```
