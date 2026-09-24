# Numbers Mode + Scalable Navigation — Design Spec

Date: 2026-09-24
Status: Approved by user (design grilled in session, mockups validated), ready for planning

Mockups (Design canvas, private): https://claude.ai/artifact/CZAFkiiSwSC2rx2nHEbKML
— the chosen navigation is **variant B** ("Nav-B" boards); the other numbers boards
still show the older two-tab header and are only a reference for their content area.

## 1. Purpose

Add a second learning section, **Numbers (數字)**, next to the existing **Letters (字母)**
section, with the same two modes:

1. **Learn (學習)** — type any integer 0–1 000 000 and see how it is written in words,
   how it is pronounced (IPA in context, silent letters, liaisons / non-liaisons), why
   (rules triggered by that number, with sources), and hear it.
2. **Quiz (測驗)** — listen to a random number, type it, check it, then see the same
   detail as Learn.

More sections will follow (dates, time, …), so the navigation is rebuilt to scale.

## 2. Navigation (whole app)

- One-row header (variant B): on the left a **section switch** — the section's mini
  plaque glyph (`é`, `97`), its name (zh + small en) and a ▾ chevron; on the right a
  compact **mode switch** `學習 | 測驗` (hanzi only, English as screen-reader text).
- Tapping the section switch opens a **bottom sheet** titled with the app name, listing
  every section (glyph + zh + en, check mark on the current one). Backdrop tap / Escape
  closes it. The app name only appears in the sheet and the document `<title>`.
- Sections are declared in one registry (id, glyph, label, learn/quiz initialisers) so a
  new section is one entry.
- Letters: Learn = the existing AZERTY keyboard + panel, Quiz = the existing weighted
  game, **without** the reviewed / easy-streak counters (removed, user decision).
- Each view is initialised lazily the first time it is shown and keeps its state when
  the user switches away and back (no persistence across reloads).
- Desktop keeps the same header row; the letters keyboard/panel two-column layout is
  unchanged; numbers screens are a centred column (max ≈ 680 px).

## 3. Language rules (the generator)

- **Spelling: 1990 rectified only.** Every numeral word of a compound number is joined
  by hyphens, including around `et` and above 100 (`vingt-et-un`, `deux-cent-trois`,
  `mille-deux-cents`). `un million` is a noun phrase (space, no hyphen). Agreement rules
  are kept: `quatre-vingts` / `deux-cents` take an s only when multiplied and final
  (`quatre-vingt-un`, `quatre-vingt-mille`, `deux-cent-mille`); `mille` is invariable.
- **Variety: France** (`soixante-dix`, `quatre-vingts`, `quatre-vingt-dix`), with a
  regional note for Belgium / Switzerland where relevant.
- **Pronunciation: one standard transcription**, no variants shown. Where sources
  disagree, `docs/research/numbers-sources.md` records the chosen standard.
- **Composition, not a lookup table.** Words are composed (0–16 irregular, tens,
  70–79 on 60, 80–99 on 4×20, hundreds, thousands, `un million`); pronunciation is a
  second pass over the word tokens using the next token as context (end / consonant /
  vowel, and the non-liaison words `un`, `huit`, `onze`).
- Every rule the UI can show carries at least one source from the research file.
- No zhuyin for numbers (whole-word zhuyin would be unsourced and misleading).

## 4. Learn screen

- The number input **is** an enamel plaque (white numerals on blue), `inputmode=numeric`,
  flanked by `−` / `+` keycaps (±1, clamped to 0–1 000 000), plus a `🎲 隨機` button and
  a "0 到 1 000 000" hint. Pasted `1 000`, `1.000`, `1'000` are normalised; anything else
  or out of range shows an inline bilingual message and no detail.
- Empty state: a prompt plus a row of **trap numbers** to tap
  (`17 71 80 81 91 99 200 201 1000 80 000`).
- The detail updates live while typing. **Nothing plays automatically.**
- **Detail panel** (shared with the quiz):
  1. `唸法 Say it` label + **speed** control `0.5× 0.75× 1×` (shared session state for the
     whole numbers section, default 1×).
  2. A say pill with the full number in words; tapping speaks it.
  3. For numbers ≥ 1000 with a non-zero remainder: `分段聽 Listen in parts`, two pills
     (thousands part, remainder), each speaking its own part.
  4. The full IPA in context (e.g. `/ka.tʁə.vɛ̃.di.sɛt/`).
  5. `結構 Structure` when meaningful: `17 = 10 + 7`, `97 = 4 × 20 + 17`,
     `201 = 2 × 100 + 1`, `21 080 = 21 × 1000 + 80` (one level, each part with its words).
  6. `逐字拆解 Word by word`: one static tile per word (not clickable — isolated-word audio
     would teach the wrong in-context sound) with its in-context IPA; silent letters
     greyed; letters with a noteworthy sound (e.g. `x` = [z] in dix-neuf, the sounded `t`
     of vingt in 21–29) underlined in green; joints are hyphens, with a green arc for a
     liaison / enchaînement and a red ⊘ for a trap non-liaison. A legend lists only the
     marks present.
  7. `這個數字的規則 Rules for this number`: only the rules this number triggers, each
     tagged 拼寫 Spelling / 發音 Sound / 用法 Usage / 地區 Region, zh first then en.
  8. `資料來源 Sources` (collapsed), the union of the triggered rules' sources.
- Audio: the Web Speech API is given the **digits** (`97`, parts as `21000` / `80`), which
  fr-FR voices normalise reliably; the words stay the displayed reference. A short list
  of trap numbers is handed to the user to check by ear after implementation.

## 5. Quiz screen (listen & type only)

- Prompt `聽一聽，寫下你聽到的數字`, a big play plaque (speaker icon) — **never
  auto-plays**, replayable at will.
- One settings row: the speed control and a compact **range** select
  `範圍 0–20 / 0–100 (default) / 0–1000 / 0–1M`.
- Draw: pick a digit-count bucket uniformly (`0–9`, `10–99`, `100–999`, … capped at the
  range max, the top bucket including the max), then a number uniformly inside it;
  never the same number twice in a row. Changing the range draws a new number.
- Numeric answer field (Enter = check), buttons `不知道 Show answer` and `檢查 Check`.
- After checking: the number on a smaller plaque, a verdict banner — green `答對了！`, or
  red `差一點！你寫的是 79` with a comparison of the typed number and the answer (words +
  structure) when the typed value is a valid number — then the full detail panel and a
  `下一個 Next` button. "Show answer" reveals without a verdict.
- No counters, no weighting, no persistence.

## 6. Out of scope

Ordinals, decimals, negatives, feminine agreement (except a usage note `un → une` when
the number ends in *un*), liaison with a following noun, years / phone numbers, other
regional forms as primary spelling, variant pronunciations, zhuyin, any persistence.

## 7. Tech constraints (unchanged from the letters spec)

Static site, no build step, no dependencies, classic scripts with the UMD-style dual
export so pure logic can be `require()`d from Node. No test framework: pure logic is
verified by a dependency-free Node script (`scripts/check-numbers.js`, same spirit as
`scripts/check-data.js`) holding a table of trap numbers with expected words / IPA and an
exhaustive 0–1 000 000 invariant sweep; DOM behaviour is verified in a real browser at
phone and desktop widths. Mobile first; no stacked rows of control groups.

## 8. Verification

- `node scripts/check-numbers.js` and `node scripts/check-data.js` pass.
- Browser, 390 px and desktop: section sheet opens/closes and switches sections; mode
  switch works in both sections; letters keyboard, panel and game still work (game has
  no counters); learn: typing, paste normalisation, invalid input, −/+, dice, trap chips,
  every detail block, halves for ≥ 1000, speed applied to every playback; quiz: play,
  range change, correct / wrong / show-answer paths, Enter to check, next.
- No console errors. User ear-checks the trap-number audio list.
