# French Letter Pronunciation Trainer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, dependency-free web app with an AZERTY keyboard that opens a sourced pronunciation panel per letter (with French audio and a zhuyin comparison), plus a weighted flashcard game mode.

**Architecture:** Plain HTML/CSS/JS, no build step, no framework. Pure logic (bilingual text, keyboard layout, game weighting, data validation, TTS voice selection) lives in small dependency-free modules written with a tiny CommonJS/global dual-export pattern, so the exact same files run under Node's built-in test runner (`node --test`) and as classic `<script>` tags in the browser. DOM-rendering code (keyboard, panel, game screen) is thin glue over that logic and is verified manually in a real browser per the spec, since there is no bundler/jsdom in scope.

**Tech Stack:** Vanilla JS (classic scripts, no ES modules — avoids the `file://` CORS restriction on `type="module"`), vanilla CSS, Node.js built-in test runner (`node:test`, `node:assert/strict`) for pure-logic unit tests, Web Speech API for audio. Zero npm dependencies, no `package.json` needed.

**Spec:** [docs/superpowers/specs/2026-09-14-french-pronunciation-site-design.md](../specs/2026-09-14-french-pronunciation-site-design.md)

## Global Constraints

- No build step, no npm dependencies, no framework (per spec §3).
- No backend, no paid API, no API keys (per spec §3, §11).
- UI is English-first with a Traditional Chinese subtitle under every interface string and every pedagogical explanation (per spec §1, §8).
- Game card weights live only in a JS variable for the current page session — never `localStorage`/`sessionStorage`, discarded on reload (per spec §6, and explicit user follow-up instruction).
- Exactly 38 letter units: 26 base + 5 AZERTY-accent + 7 extra-accent (per spec §2). No digraphs/composed sounds.
- Every letter entry must carry at least one source; the UI must show sources as links (per spec §4, §7).
- Test tooling is Node's built-in `node --test` only — no test framework dependency.

**Note on spec accuracy (fixed here, not a scope change):** the spec's §2/§5 description of "5 accented letters on the digit row" is slightly off for `ù` — on a real AZERTY keyboard, `é è ç à` are on the digit row but `ù` is the last key of the home row (`qsdfghjklm` + `ù`), sharing its key with `%`. Task 2 below places `ù` correctly. This only affects the physical layout mapping, not the data model or scope.

---

### Task 1: Project scaffold + bilingual text helper

**Files:**
- Create: `index.html`
- Create: `style.css`
- Create: `js/i18n.js`
- Test: `tests/i18n.test.js`

**Interfaces:**
- Produces: `I18n.renderBilingual({en, zh}, opts)` → HTML string. `opts` optional: `{ tag: 'span' (default), enClass: 'lang-en' (default), zhClass: 'lang-zh' (default) }`.

- [ ] **Step 1: Write the failing test**

Create `tests/i18n.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { renderBilingual } = require('../js/i18n.js');

test('renders english then chinese span with default classes', () => {
  const html = renderBilingual({ en: 'Play', zh: '播放' });
  assert.equal(
    html,
    '<span class="lang-en">Play</span><span class="lang-zh">播放</span>'
  );
});

test('respects a custom tag and class names', () => {
  const html = renderBilingual(
    { en: 'Easy', zh: '簡單' },
    { tag: 'div', enClass: 'btn-en', zhClass: 'btn-zh' }
  );
  assert.equal(
    html,
    '<div class="btn-en">Easy</div><div class="btn-zh">簡單</div>'
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/i18n.test.js`
Expected: FAIL — `Cannot find module '../js/i18n.js'`

- [ ] **Step 3: Write the implementation**

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

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/i18n.test.js`
Expected: PASS (2 tests)

- [ ] **Step 5: Build the static shell**

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
      { en: 'French Letter Pronunciation Trainer', zh: '法語字母發音練習' },
      { tag: 'span' }
    );
    document.getElementById('tab-keyboard').innerHTML = I18n.renderBilingual({ en: 'Keyboard', zh: '鍵盤' });
    document.getElementById('tab-game').innerHTML = I18n.renderBilingual({ en: 'Game', zh: '遊戲' });
  </script>
</body>
</html>
```

- [ ] **Step 6: Manual check**

Open `index.html` directly in a browser (double-click it, `file://` is fine — no ES modules are used). Confirm: the title and two tab buttons render with an English line and a smaller Chinese line underneath, no console errors.

- [ ] **Step 7: Commit**

```bash
git add index.html style.css js/i18n.js tests/i18n.test.js
git commit -m "Add static shell and bilingual text helper"
```

---

### Task 2: AZERTY layout data

**Files:**
- Create: `js/layout.js`
- Test: `tests/layout.test.js`

**Interfaces:**
- Consumes: nothing (pure data module).
- Produces: `Layout.DIGIT_ROW` (array of `{char, letterId}`), `Layout.ROW2`, `Layout.ROW3`, `Layout.ROW4` (arrays of `{char, letterId}`), `Layout.EXTRA_ACCENTS` (array of `{char, letterId}`), `Layout.getAllLetterIds()` → array of all 38 ids in a fixed order, `Layout.CATEGORY_COUNTS` = `{ base: 26, 'azerty-accent': 5, 'extra-accent': 7 }`.

- [ ] **Step 1: Write the failing test**

Create `tests/layout.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const Layout = require('../js/layout.js');

test('digit row carries exactly the 4 accented digit-row letters', () => {
  const withLetter = Layout.DIGIT_ROW.filter((k) => k.letterId);
  assert.deepEqual(
    withLetter.map((k) => k.letterId).sort(),
    ['a-grave', 'c-cedilla', 'e-acute', 'e-grave'].sort()
  );
});

test('row 3 ends with ù (u-grave), not the digit row', () => {
  const last = Layout.ROW3[Layout.ROW3.length - 1];
  assert.equal(last.char, 'ù');
  assert.equal(last.letterId, 'u-grave');
});

test('extra accents list has exactly the 7 dead-key letters', () => {
  assert.deepEqual(
    Layout.EXTRA_ACCENTS.map((k) => k.letterId).sort(),
    ['a-circumflex', 'e-circumflex', 'e-diaeresis', 'i-circumflex', 'i-diaeresis', 'o-circumflex', 'u-circumflex'].sort()
  );
});

test('getAllLetterIds returns exactly 38 unique ids', () => {
  const ids = Layout.getAllLetterIds();
  assert.equal(ids.length, 38);
  assert.equal(new Set(ids).size, 38);
});

test('base rows contain exactly the 26 base letters', () => {
  const baseIds = [...Layout.ROW2, ...Layout.ROW3, ...Layout.ROW4]
    .map((k) => k.letterId)
    .filter((id) => !['u-grave'].includes(id));
  assert.equal(baseIds.length, 26);
  assert.equal(new Set(baseIds).size, 26);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/layout.test.js`
Expected: FAIL — `Cannot find module '../js/layout.js'`

- [ ] **Step 3: Write the implementation**

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

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/layout.test.js`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add js/layout.js tests/layout.test.js
git commit -m "Add AZERTY layout data"
```

---

### Task 3: Letter data validation helper

**Files:**
- Create: `js/validate.js`
- Test: `tests/validate.test.js`

**Interfaces:**
- Consumes: nothing (pure function, takes plain data as input).
- Produces: `Validate.validateLetters(letters)` → `{ valid: boolean, errors: string[] }`. Checks, per entry: `id` (non-empty string, unique across array), `grapheme` (non-empty string), `category` (one of `base`/`azerty-accent`/`extra-accent`), `ipa` (non-empty string), `soundLabel.en`/`soundLabel.zh` (non-empty strings), `articulation.tongue/lips/airflow` each with `.en`/`.zh`, `articulation.voicing` (`voiced`/`voiceless`), `articulation.nasal` (boolean), `zhuyin.hasEquivalent` (boolean); if `true`, `zhuyin.symbol` must be a non-empty string; `zhuyin.caveat.en`/`.zh` (non-empty strings) always required, `examples` (non-empty array of non-empty strings), `ttsText` (non-empty string), `sources` (non-empty array of `{title, url}` where `url` starts with `http`).

- [ ] **Step 1: Write the failing test**

Create `tests/validate.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { validateLetters } = require('../js/validate.js');

function validEntry(overrides) {
  return Object.assign(
    {
      id: 'a',
      grapheme: 'A',
      category: 'base',
      ipa: '/a/',
      soundLabel: { en: 'open a', zh: '開口a' },
      articulation: {
        tongue: { en: 'low, central', zh: '舌位低、居中' },
        lips: { en: 'neutral', zh: '自然' },
        airflow: { en: 'continuous, unobstructed', zh: '持續、無阻礙' },
        voicing: 'voiced',
        nasal: false,
      },
      zhuyin: {
        hasEquivalent: true,
        symbol: 'ㄚ',
        caveat: { en: 'Close match.', zh: '非常接近。' },
      },
      examples: ['papa'],
      ttsText: 'papa',
      sources: [{ title: 'Example Source', url: 'https://example.com/a' }],
    },
    overrides
  );
}

test('accepts a fully valid entry', () => {
  const result = validateLetters([validEntry()]);
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test('rejects a missing field', () => {
  const entry = validEntry();
  delete entry.ipa;
  const result = validateLetters([entry]);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.includes('ipa')));
});

test('rejects duplicate ids', () => {
  const result = validateLetters([validEntry(), validEntry()]);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.includes('Duplicate id')));
});

test('rejects an entry with no sources', () => {
  const entry = validEntry({ sources: [] });
  const result = validateLetters([entry]);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.includes('sources')));
});

test('rejects zhuyin.hasEquivalent true with no symbol', () => {
  const entry = validEntry({ zhuyin: { hasEquivalent: true, symbol: '', caveat: { en: 'x', zh: 'x' } } });
  const result = validateLetters([entry]);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((e) => e.includes('zhuyin.symbol')));
});

test('accepts zhuyin.hasEquivalent false with no symbol', () => {
  const entry = validEntry({ zhuyin: { hasEquivalent: false, symbol: null, caveat: { en: 'No close match.', zh: '沒有接近的音。' } } });
  const result = validateLetters([entry]);
  assert.equal(result.valid, true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/validate.test.js`
Expected: FAIL — `Cannot find module '../js/validate.js'`

- [ ] **Step 3: Write the implementation**

Create `js/validate.js`:

```js
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.Validate = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  const CATEGORIES = ['base', 'azerty-accent', 'extra-accent'];

  function isNonEmptyString(v) {
    return typeof v === 'string' && v.trim().length > 0;
  }

  function checkBilingual(obj, path, errors) {
    if (!obj || !isNonEmptyString(obj.en)) errors.push(`${path}.en missing or empty`);
    if (!obj || !isNonEmptyString(obj.zh)) errors.push(`${path}.zh missing or empty`);
  }

  function validateEntry(entry, index, errors, seenIds) {
    const label = `letters[${index}] (id=${entry && entry.id})`;

    if (!isNonEmptyString(entry.id)) {
      errors.push(`${label}: id missing or empty`);
    } else if (seenIds.has(entry.id)) {
      errors.push(`${label}: Duplicate id "${entry.id}"`);
    } else {
      seenIds.add(entry.id);
    }

    if (!isNonEmptyString(entry.grapheme)) errors.push(`${label}: grapheme missing or empty`);
    if (!CATEGORIES.includes(entry.category)) errors.push(`${label}: category must be one of ${CATEGORIES.join('/')}`);
    if (!isNonEmptyString(entry.ipa)) errors.push(`${label}: ipa missing or empty`);

    checkBilingual(entry.soundLabel, `${label}.soundLabel`, errors);

    const art = entry.articulation || {};
    checkBilingual(art.tongue, `${label}.articulation.tongue`, errors);
    checkBilingual(art.lips, `${label}.articulation.lips`, errors);
    checkBilingual(art.airflow, `${label}.articulation.airflow`, errors);
    if (!['voiced', 'voiceless'].includes(art.voicing)) {
      errors.push(`${label}: articulation.voicing must be "voiced" or "voiceless"`);
    }
    if (typeof art.nasal !== 'boolean') errors.push(`${label}: articulation.nasal must be a boolean`);

    const zh = entry.zhuyin || {};
    if (typeof zh.hasEquivalent !== 'boolean') {
      errors.push(`${label}: zhuyin.hasEquivalent must be a boolean`);
    } else if (zh.hasEquivalent && !isNonEmptyString(zh.symbol)) {
      errors.push(`${label}: zhuyin.symbol must be set when hasEquivalent is true`);
    }
    checkBilingual(zh.caveat, `${label}.zhuyin.caveat`, errors);

    if (!Array.isArray(entry.examples) || entry.examples.length === 0 || !entry.examples.every(isNonEmptyString)) {
      errors.push(`${label}: examples must be a non-empty array of non-empty strings`);
    }

    if (!isNonEmptyString(entry.ttsText)) errors.push(`${label}: ttsText missing or empty`);

    if (!Array.isArray(entry.sources) || entry.sources.length === 0) {
      errors.push(`${label}: sources must be a non-empty array`);
    } else {
      entry.sources.forEach((s, i) => {
        if (!s || !isNonEmptyString(s.title) || !isNonEmptyString(s.url) || !s.url.startsWith('http')) {
          errors.push(`${label}: sources[${i}] must have a title and an http(s) url`);
        }
      });
    }
  }

  function validateLetters(letters) {
    const errors = [];
    const seenIds = new Set();
    letters.forEach((entry, index) => validateEntry(entry, index, errors, seenIds));
    return { valid: errors.length === 0, errors };
  }

  return { validateLetters };
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/validate.test.js`
Expected: PASS (6 tests)

- [ ] **Step 5: Commit**

```bash
git add js/validate.js tests/validate.test.js
git commit -m "Add letter data validation helper"
```

---

### Task 4: Weighted flashcard game-state logic

**Files:**
- Create: `js/game.js`
- Test: `tests/game.test.js`

**Interfaces:**
- Consumes: nothing (pure, takes a plain array of ids).
- Produces:
  - `Game.createGameState(letterIds)` → `{ weights: { [id]: 1 }, history: [] }`
  - `Game.drawNext(state, rng)` → `{ id, state: newState }` (`rng` optional, defaults to `Math.random`; `newState.history` keeps at most the last 5 drawn ids)
  - `Game.rateCard(state, id, rating)` → `newState` (`rating` is `'easy' | 'hard' | 'missed'`; throws on unknown rating)

- [ ] **Step 1: Write the failing test**

Create `tests/game.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const Game = require('../js/game.js');

test('createGameState gives every id weight 1 and empty history', () => {
  const state = Game.createGameState(['a', 'b', 'c']);
  assert.deepEqual(state.weights, { a: 1, b: 1, c: 1 });
  assert.deepEqual(state.history, []);
});

test('drawNext picks according to cumulative weight and injected rng', () => {
  // weights a:1, b:1, c:1 -> cumulative [1,2,3], total 3.
  // rng() = 0.5 -> threshold 1.5 -> falls in b's bucket (1..2)
  let state = Game.createGameState(['a', 'b', 'c']);
  const result = Game.drawNext(state, () => 0.5);
  assert.equal(result.id, 'b');
  assert.deepEqual(result.state.history, ['b']);
});

test('drawNext excludes the most recently drawn id when possible', () => {
  let state = Game.createGameState(['a', 'b']);
  state = { ...state, history: ['a'] };
  // only 'b' should be a candidate regardless of rng value
  const result = Game.drawNext(state, () => 0.0);
  assert.equal(result.id, 'b');
});

test('drawNext does not exclude everything when the pool is too small', () => {
  let state = Game.createGameState(['a']);
  state = { ...state, history: ['a'] };
  const result = Game.drawNext(state, () => 0.0);
  assert.equal(result.id, 'a');
});

test('rateCard easy decreases weight with a floor of 0.5', () => {
  let state = Game.createGameState(['a']);
  state = Game.rateCard(state, 'a', 'easy');
  assert.equal(state.weights.a, 0.5);
  state = Game.rateCard(state, 'a', 'easy');
  assert.equal(state.weights.a, 0.5);
});

test('rateCard hard adds 1.5, missed adds 3', () => {
  let state = Game.createGameState(['a', 'b']);
  state = Game.rateCard(state, 'a', 'hard');
  assert.equal(state.weights.a, 2.5);
  state = Game.rateCard(state, 'b', 'missed');
  assert.equal(state.weights.b, 4);
});

test('rateCard throws on an unknown rating', () => {
  const state = Game.createGameState(['a']);
  assert.throws(() => Game.rateCard(state, 'a', 'bogus'));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/game.test.js`
Expected: FAIL — `Cannot find module '../js/game.js'`

- [ ] **Step 3: Write the implementation**

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

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/game.test.js`
Expected: PASS (7 tests)

- [ ] **Step 5: Commit**

```bash
git add js/game.js tests/game.test.js
git commit -m "Add weighted flashcard game-state logic"
```

---

### Task 5: TTS voice-selection logic

**Files:**
- Create: `js/tts.js`
- Test: `tests/tts.test.js`

**Interfaces:**
- Produces:
  - `Tts.pickVoice(voices)` → best `voice` object from a list of `{name, lang}`-shaped objects, or `null` if the list is empty. Preference order: (1) `lang` starts with `fr` (case-insensitive) AND `name` contains `google` (case-insensitive); (2) any `lang` starting with `fr`; (3) the first voice in the list; (4) `null` for an empty list.
  - `Tts.speak(letterUnit)` — browser-only wrapper (not unit tested; see manual test in Task 9), reads `window.speechSynthesis.getVoices()`, calls `pickVoice`, builds a `SpeechSynthesisUtterance` for `letterUnit.ttsText` with `lang = 'fr-FR'` and the picked voice, and calls `window.speechSynthesis.speak(utterance)`.

- [ ] **Step 1: Write the failing test**

Create `tests/tts.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert/strict');
const { pickVoice } = require('../js/tts.js');

test('prefers a Google French voice when present', () => {
  const voices = [
    { name: 'Microsoft Julie', lang: 'fr-FR' },
    { name: 'Google français', lang: 'fr-FR' },
    { name: 'Google US English', lang: 'en-US' },
  ];
  assert.equal(pickVoice(voices).name, 'Google français');
});

test('falls back to any french voice when no Google voice is present', () => {
  const voices = [
    { name: 'Amelie', lang: 'en-US' },
    { name: 'Thomas', lang: 'fr-CA' },
  ];
  assert.equal(pickVoice(voices).name, 'Thomas');
});

test('falls back to the first voice when no french voice is present', () => {
  const voices = [{ name: 'Amelie', lang: 'en-US' }, { name: 'Kenji', lang: 'ja-JP' }];
  assert.equal(pickVoice(voices).name, 'Amelie');
});

test('returns null for an empty voice list', () => {
  assert.equal(pickVoice([]), null);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/tts.test.js`
Expected: FAIL — `Cannot find module '../js/tts.js'`

- [ ] **Step 3: Write the implementation**

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

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/tts.test.js`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add js/tts.js tests/tts.test.js
git commit -m "Add TTS voice-selection logic"
```

---

### Task 6: Sourced pronunciation & zhuyin research

**Files:**
- Create: `docs/research/sources.md`

**Interfaces:**
- Produces: a Markdown reference file with one section per of the 38 letter ids from Task 2 (`Layout.getAllLetterIds()`), each carrying the facts Task 7 will transcribe into `data/letters.js`.

This task is content research, not code. Use web search.

- [ ] **Step 1: Research the base vowels**

For ids `a, e, i, o, u, y`: search for established French-phonetics descriptions of each vowel's articulation (tongue height/position, lip rounding, airflow — all French oral vowels are non-nasal, continuous, voiced). Good starting queries: `"French vowels" IPA articulation tongue position site:wikipedia.org`, `French phonology vowel chart articulation`. Record the IPA symbol used for the *letter name* pronunciation (e.g. "u" as a letter is said as /y/), one plain-English articulation description per vowel, and at least one source URL per vowel.

- [ ] **Step 2: Research the base consonants**

For ids `b, c, d, f, g, h, j, k, l, m, n, p, q, r, s, t, v, w, x, z`: search for how each letter *name* is pronounced in French (e.g. "h" is silent as a sound but named /aʃ/; "w" is named "double vé"), and the articulation of the consonant sound each letter most commonly represents (place/manner of articulation, voicing, airflow — e.g. "r" is a uvular fricative/approximant, voiced, airflow through a narrow gap at the back of the throat). Useful queries: `French consonant IPA place of articulation`, `how to pronounce the French R uvular`, `French alphabet letter names pronunciation`.

- [ ] **Step 3: Research the accented letters, prioritizing Taiwanese French-pedagogy sources for zhuyin**

For the 12 accented ids (`e-acute, e-grave, c-cedilla, a-grave, u-grave, a-circumflex, e-circumflex, i-circumflex, o-circumflex, u-circumflex, i-diaeresis, e-diaeresis`): first search specifically for Taiwanese French-teaching material that maps French sounds to zhuyin, e.g. `法文 發音 注音符號 對照`, `法語 母音 注音`, `台灣 法文系 發音教學`, `輔仁大學 法文系 發音`, `淡江大學 法文系 發音教學`, `教育部 法語 發音`. Record the closest zhuyin symbol and its source when you find genuine Taiwanese-pedagogy material.

If no such source can be found for a given sound (this is expected for e.g. `ê`/`e-circumflex` if it doesn't phonemically differ from `é`/`e-acute` in many descriptions, or for sounds with no zhuyin analogue at all), do not invent a mapping — you will mark `hasEquivalent: false` for it in Task 7 and cite a general French-phonetics source instead for the articulation facts.

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

### Task 7: Author the letter data file

**Files:**
- Create: `data/letters.js`
- Create: `scripts/check-data.js`

**Interfaces:**
- Consumes: `Validate.validateLetters` (Task 3), `Layout.getAllLetterIds`/`Layout.CATEGORY_COUNTS` (Task 2), `docs/research/sources.md` (Task 6).
- Produces: `data/letters.js` exporting (via the same Node/browser dual pattern as Task 1, but for a plain array) an array of 38 objects matching the shape validated in Task 3. Attaches to `module.exports` under Node and `window.LETTERS_DATA` in the browser.

- [ ] **Step 1: Write `data/letters.js`**

Using `docs/research/sources.md`, write all 38 entries matching the schema from Task 3's tests. Write concise, plain-language `en` text and a natural (not machine-translated-sounding) Traditional Chinese `zh` subtitle for every bilingual field. Example shape for one entry (repeat for all 38, each grounded in its own research section):

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
      { title: 'French phonology — Wikipedia', url: 'https://en.wikipedia.org/wiki/French_phonology' },
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

- [ ] **Step 2: Write the data-check script**

Create `scripts/check-data.js`:

```js
const { validateLetters } = require('../js/validate.js');
const { CATEGORY_COUNTS, getAllLetterIds } = require('../js/layout.js');
const letters = require('../data/letters.js');

function checkCounts(letters) {
  const errors = [];
  const expectedIds = new Set(getAllLetterIds());
  const actualIds = new Set(letters.map((l) => l.id));

  if (letters.length !== expectedIds.size) {
    errors.push(`Expected ${expectedIds.size} letters, found ${letters.length}`);
  }
  for (const id of expectedIds) {
    if (!actualIds.has(id)) errors.push(`Missing letter id from layout: ${id}`);
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
  return errors;
}

const { errors: fieldErrors } = validateLetters(letters);
const countErrors = checkCounts(letters);
const allErrors = [...fieldErrors, ...countErrors];

if (allErrors.length > 0) {
  console.error(`FAILED: ${allErrors.length} error(s)`);
  allErrors.forEach((e) => console.error(' -', e));
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
git commit -m "Author sourced letter data and add data integrity check"
```

---

### Task 8: Keyboard rendering

**Files:**
- Create: `js/keyboard.js`
- Modify: `index.html` (add script tags and container wiring)

**Interfaces:**
- Consumes: `Layout` (Task 2), `data/letters.js` → `window.LETTERS_DATA` (Task 7).
- Produces: `Keyboard.render(container, letters)` — sets `container.innerHTML` to the full keyboard markup (digit row, rows 2-4, extra-accents strip), each interactive key carrying `data-letter-id="<id>"`; inert digit-row keys (no `letterId`) get no `data-letter-id` and a `disabled`-looking class. `Keyboard.onKeyPress(container, callback)` — attaches one delegated `click` listener on `container` that calls `callback(letterId)` when a key with a `data-letter-id` is clicked.

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

Add before the closing `</body>` in `index.html` (after the existing `js/i18n.js` script tag), replacing the previous inline `<script>` block:

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

Add matching CSS to `style.css`:

```css
.kb-row {
  display: flex;
  gap: 4px;
  margin-bottom: 4px;
}

.key {
  min-width: 2.2rem;
  height: 2.2rem;
  border-radius: 4px;
  border: 1px solid var(--key-border);
  background: var(--key-bg);
  cursor: pointer;
  font-size: 1rem;
}

.key:hover {
  filter: brightness(0.95);
}

.key-inert {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.2rem;
  height: 2.2rem;
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
  font-size: 0.8rem;
  color: var(--text-sub);
  margin: 0.5rem 0 0.25rem;
}
```

- [ ] **Step 3: Manual check**

Open `index.html` in a browser. Confirm: the digit row shows `& é " ' ( - è _ ç à ) =` with `é è ç à` clickable and the rest visually inert; row 2/3/4 show the 26 letters in AZERTY order with `ù` at the end of row 3; the extra-accents strip shows `â ê î ô û ï ë` below a bilingual note. Open the browser console, click several keys (including `é`, `ù`, and an extra-accent key), and confirm each logs its correct id (e.g. `e-acute`, `u-grave`).

- [ ] **Step 4: Commit**

```bash
git add js/keyboard.js index.html style.css
git commit -m "Render the AZERTY keyboard"
```

---

### Task 9: Info panel + audio wiring

**Files:**
- Create: `js/panel.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: `Tts.speak` (Task 5), letter unit objects (Task 7 shape).
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

Add panel styling to `style.css`:

```css
.panel {
  max-width: 360px;
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
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--key-border);
  background: var(--accent-key-bg);
  cursor: pointer;
}

.panel .sources {
  font-size: 0.8rem;
  padding-left: 1.2rem;
}
```

- [ ] **Step 3: Manual check (use a Chromium-based browser for the "Google" voice)**

Open `index.html`. Click several keys across all three key categories (a base letter, `é`, and an extra accent like `ê`). Confirm the panel shows the grapheme, IPA, bilingual sound label, tongue/lips/airflow lines, the zhuyin line (including at least one letter that correctly shows "No close equivalent" if your research found one), example words, and clickable source links that open the right pages. Click "🔊 Play" and confirm you hear the example word spoken in French. Open the browser console and run `speechSynthesis.getVoices().map(v => v.name)` to confirm whether a "Google" voice was available and, if so, that it was the one used (no error either way if it falls back).

- [ ] **Step 4: Commit**

```bash
git add js/panel.js index.html style.css
git commit -m "Add info panel with sourced content and audio playback"
```

---

### Task 10: Game mode UI

**Files:**
- Create: `js/game-ui.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: `Game.createGameState`/`drawNext`/`rateCard` (Task 4), `Panel.render`/`onPlay` (Task 9), `Tts.speak` (Task 5).
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

Add game styling to `style.css`:

```css
.game-screen {
  max-width: 480px;
  margin: 0 auto;
  text-align: center;
}

.flashcard {
  font-size: 6rem;
  border: 2px solid var(--key-border);
  border-radius: 12px;
  padding: 2rem;
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
}

.rating-buttons button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--key-border);
  cursor: pointer;
}

.game-counter {
  color: var(--text-sub);
  font-size: 0.9rem;
}
```

- [ ] **Step 3: Manual check**

Open `index.html`, click the "Game" tab, and confirm a random letter card appears. Click "Reveal", confirm the full info panel (with working Play button) plus three rating buttons appear. Click through all three ratings across several draws and confirm: the counter increments, the easy streak resets on non-easy ratings, the same card never appears twice in a row, and clicking "Keyboard" then back to "Game" keeps the game running (state isn't reset by tab switching — only by a full page reload).

- [ ] **Step 4: Commit**

```bash
git add js/game-ui.js index.html style.css
git commit -m "Add weighted flashcard game mode UI"
```

---

### Task 11: Responsive pass and final verification

**Files:**
- Modify: `style.css`

**Interfaces:** none (styling + manual verification only).

- [ ] **Step 1: Add a narrow-viewport layout**

Extend the existing `@media (max-width: 720px)` block in `style.css` (created in Task 1) to also stack the panel below the keyboard and shrink the flashcard font size:

```css
@media (max-width: 720px) {
  .layout {
    flex-direction: column;
  }

  .panel {
    max-width: 100%;
  }

  .flashcard {
    font-size: 4rem;
    padding: 1.25rem;
  }

  .key,
  .key-inert {
    min-width: 1.8rem;
    height: 1.8rem;
    font-size: 0.85rem;
  }
}
```

- [ ] **Step 2: Full manual verification pass**

In a Chromium-based browser, resize the window to a typical desktop width (e.g. 1280px) and to a narrow/mobile width (e.g. 375px) and confirm the layout adapts per Step 1 at both sizes. Then run through the complete checklist from spec §10:

- [ ] Every key on the keyboard (26 base + 4 digit-row accents + `ù` + 7 extra accents = 38) opens a panel with correct content.
- [ ] Audio plays for at least 5 different letters across different categories.
- [ ] A full game session runs cleanly through at least 10 draws, exercising all three ratings.
- [ ] EN/ZH subtitles render everywhere text appears (titles, tabs, panel fields, game screen).
- [ ] `node --test tests/` passes with zero failures.
- [ ] `node scripts/check-data.js` prints `OK: 38 letters, 0 errors`.

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "Add responsive layout pass"
```
