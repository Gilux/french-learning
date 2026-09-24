# Numbers Mode + Scalable Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Numbers section (learn: type 0–1 000 000 and see words / IPA / silent letters / liaisons / sourced rules; quiz: listen & type) and replace the two-tab header with a one-row section switch + bottom sheet that scales to more sections.

**Architecture:** Pure, Node-requireable modules (UMD dual export like the existing `js/*.js`): `js/numbers.js` composes words from rules and resolves in-context pronunciation token by token; `data/number-rules.js` holds the bilingual rule notes and their sources; `js/numbers-quiz.js` draws balanced random numbers. Thin DOM glue: `js/numbers-ui.js` (learn + quiz screens, shared detail panel) and `js/app.js` (header, section sheet, lazy views, replaces the inline script of `index.html`). The pure logic was prototyped and validated (trap table + exhaustive 0–1 000 000 sweep) before this plan was written; each task below ships that code with its check.

**Tech Stack:** Vanilla JS classic scripts, vanilla CSS, Web Speech API. No dependencies, no build, no test framework.

**Spec:** [docs/superpowers/specs/2026-09-24-numbers-mode-design.md](../specs/2026-09-24-numbers-mode-design.md) · **Research:** [docs/research/numbers-sources.md](../../research/numbers-sources.md)

## Global Constraints

- No build step, no npm dependencies, no framework, no test runner (repo convention; `scripts/check-*.js` sanity scripts only).
- 1990 rectified spelling only; France French; one standard IPA transcription (Wiktionnaire notation: syllable dots, `‿` for a linked consonant).
- Pronunciation choices where sources disagree are the research file's recommendations: `cinq` = [sɛ̃] before cent/mille, `quatre` = [ka.tʁə] before vingt/cent/mille, `trois` = [tʁwa], `mille` + un/huit/onze enchaîné ([mi.l‿œ̃]), `un million` with a space.
- Every rule note cites at least one source from `docs/research/numbers-sources.md`; the panel also links each word's Wiktionnaire page.
- UI text: Traditional Chinese first, English second (`I18n.renderBilingual`); hanzi-only allowed in the compact header controls with English as screen-reader text.
- Mobile first; never stack several rows of control groups. Nothing auto-plays. No persistence (no localStorage/sessionStorage).
- Audio: the TTS receives digits (`String(n)`), never the hyphenated words.

---

### Task 1: Number generator, rules, quiz draw + sanity script

**Files:**
- Create: `scripts/check-numbers.js` (first — it must fail before the modules exist)
- Create: `js/numbers.js`, `data/number-rules.js`, `js/numbers-quiz.js`
- Add: `docs/research/numbers-sources.md` (already written by the research pass)

**Interfaces (produced):**
- `Numbers.MAX = 1000000`, `Numbers.NNBSP`
- `Numbers.parse(string) → { status: 'empty' | 'invalid' | 'ok', value: number | null }` (strips spaces, NBSP, NNBSP, `.`, `'`, `’`, `_`; > MAX is invalid)
- `Numbers.formatDigits(n) → string` (groups of 3 with NNBSP from 10 000 up)
- `Numbers.toWords(n)`, `Numbers.toIpa(n)` (IPA wrapped in slashes)
- `Numbers.analyze(n) → { n, digits, speak, words, ipa, tiles: [{ text, headword, segments: [{ text, mark: null|'mute'|'sound' }], ipa }], joints: ('hyphen'|'link'|'nolink'|'space')[], legend: ('mute'|'sound'|'link'|'nolink')[], structure: null | [ {n, words}, '+', {n, words} ], halves: null | [{ words, speak }, { words, speak }], rules: [{ id, ctx }] }`
- `NumberRules.RULES[id] = { tag: 'spell'|'sound'|'usage'|'region', sources: string[], text(ctx) → { zh, en } }` (HTML with `.fr` / `.ipa-inline` spans); `NumberRules.SOURCES[key] = { title, url }`; `NumberRules.sourcesFor(ruleIds, headwords) → [{ title, url }]`
- `NumbersQuiz.RANGES` (`20`, `100`, `1000`, `1M`), `NumbersQuiz.DEFAULT_RANGE = '100'`, `NumbersQuiz.buckets(max)`, `NumbersQuiz.draw(max, previous, rng?)`, `NumbersQuiz.rangeById(id)`

- [ ] **Step 1: Write the sanity script** with the trap table (words + IPA for 0, 1, 4, 5, 6, 8, 10, 16–22, 24, 28, 31, 38, 41, 56, 61, 68, 70–72, 77–81, 88, 90, 91, 97, 99, 100, 101, 108, 111, 180, 200, 201, 400, 500, 600, 800, 1000, 1001, 1008, 1080, 1427, 1500, 2000, 4000, 5000, 6000, 10 000, 18 000, 20 000, 21 000, 21 080, 26 000, 80 000, 90 000, 100 000, 200 000, 999 999, 1 000 000 — values from the research file), expected rule ids for the classic traps, parse cases, source integrity (every rule has ≥1 source, every key exists), the exhaustive 0–1 000 000 invariants (well-formed words, no plural before another numeral, no `milles`, tiles spell the words, no rule text renders `undefined`, every rule id is reachable) and quiz draw range / no-repeat checks.
- [ ] **Step 2: Run it — expect failure** — `node scripts/check-numbers.js` → `Cannot find module '../js/numbers.js'`.
- [ ] **Step 3: Add the three modules** (validated prototype).
- [ ] **Step 4: Run the checks** — `node scripts/check-numbers.js` → `OK: … 0 errors`; `node scripts/check-data.js` → `OK: 38 letters, 0 errors`.
- [ ] **Step 5: Commit** — `git add scripts/check-numbers.js js/numbers.js data/number-rules.js js/numbers-quiz.js docs/research/numbers-sources.md docs/superpowers && git commit -m "Add sourced French number generator, rules and quiz draw"`

### Task 2: One-row navigation (variant B) + letters game without counters

**Files:**
- Modify: `index.html` (header = section switch + `學習/測驗`; four `[data-view]` sections; section sheet; scripts incl. `js/app.js`; generic `<title>`)
- Create: `js/app.js` (SECTIONS registry, `show(section, mode)`, lazy init per view, sheet open/close with Escape / backdrop / item, focus return)
- Modify: `js/game-ui.js` (remove the reviewed / easy-streak stats markup and counters)
- Modify: `style.css` (new header, `.glyph`, `.section-switch`, `.seg-mini`, sheet; remove `.brand`, `#app-title`, `.tabs`, `.plaque-mark`, `.game-stats`/`.stat`)

**Interfaces:** consumes `Keyboard`, `Panel`, `Tts`, `GameUI.init(root, letters)`, and (Task 3) `NumbersUI.initLearn(root)`, `NumbersUI.initQuiz(root)`.

- [ ] **Step 1:** Rewrite `index.html` and add `js/app.js` with a temporary `NumbersUI` guard-free call (Task 3 lands in the same branch before any push).
- [ ] **Step 2:** Update `style.css` and `js/game-ui.js`.
- [ ] **Step 3: Verify in the browser** (390 px and desktop): sheet opens from the header, lists 字母 / 數字 with a check on the current one, closes on backdrop / Escape / selection; 學習 / 測驗 switch works; letters keyboard + panel + audio unchanged; letters game works without counters; no console errors.
- [ ] **Step 4: Commit** — `git commit -m "Replace header tabs with a section switch and sheet; drop game counters"`

### Task 3: Numbers learn + quiz screens

**Files:**
- Create: `js/numbers-ui.js` (`initLearn(root)`, `initQuiz(root)`, `renderDetail(analysis)`; shared session speed; say pills speak digits)
- Modify: `style.css` (learn plaque input, detail panel, tiles/joints/legend, rules, speed, quiz settings row, answer field, verdicts, compare rows)

- [ ] **Step 1:** Add `js/numbers-ui.js` and the CSS.
- [ ] **Step 2: Verify in the browser** (390 px and desktop): empty state + trap chips; typing, paste of `21 080` / `21.080`, invalid input message; −/+ (clamped), 🎲; every detail block for 97, 21 080, 201, 1 000 000; halves only for ≥ 1000 with a remainder; speed control applies to every playback and stays in sync; quiz: no auto-play, play, range change draws a new number, Enter checks, right / wrong (with compare) / show-answer paths, next; long numbers fit the plaques; no console errors.
- [ ] **Step 3: Commit** — `git commit -m "Add numbers learn and listen-and-type quiz screens"`

### Task 4: Final pass

- [ ] Run `node scripts/check-numbers.js` and `node scripts/check-data.js`.
- [ ] Hand the user the by-ear list (17, 18, 19, 21, 71, 80, 81, 88, 91, 101, 108, 111, 201, 400, 500, 600, 800, 1001, 1500, 4000, 5000, 18 000, 80 000, 1 000 000).
- [ ] Ask before pushing `main` (pushing redeploys the public site).
