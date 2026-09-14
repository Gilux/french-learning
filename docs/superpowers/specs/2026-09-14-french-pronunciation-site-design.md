# French Letter Pronunciation Trainer — Design Spec

Date: 2026-09-14
Status: Approved by user, ready for implementation planning

## 1. Purpose & audience

An interactive, static, single-page web app to help a Taiwanese beginner
learn how French letters are pronounced. Two features:

1. An AZERTY virtual keyboard: clicking a letter opens an info panel with
   sourced pronunciation details, a zhuyin (bopomofo) approximation, and a
   spoken audio demo.
2. A weighted flashcard game mode that drills random letters and drills
   harder on the ones the user marks as difficult/missed.

Primary UI language is **English**, with a **Traditional Chinese**
subtitle under every piece of interface text and every pedagogical
explanation. No backend, no build step, no accounts, no persistence
across page reloads.

## 2. Scope of letters

- The 26 base letters, laid out as a real AZERTY keyboard (3 rows:
  `azertyuiop`, `qsdfghjklm`, `wxcvbn`).
- The 5 accented letters that are genuine direct AZERTY keys on the
  digit row: **é è ç à ù** — rendered in their real position (digit row,
  unshifted character), to stay visually authentic.
- A separate, clearly labeled "extra accents" section for the other
  pedagogically important accented letters that require a dead-key
  combo on a real AZERTY keyboard: **â ê î ô û ï ë**.
- No digraphs/composed sounds (ch, ou, an, on, in, eu, gn) — explicitly
  out of scope per user decision, to keep this first version focused on
  single letters.

Total: 26 + 5 + 7 = 38 letter units.

## 3. Tech stack

Static site, no dependencies, no build step:

```
index.html
style.css
app.js
data/letters.js       — the content data (see §4), plain JS array
docs/research/sources.md — sourced research backing the data (see §7)
```

Opens directly via `file://` or any static file server. No framework,
no package.json.

## 4. Data model

One entry per letter unit in `data/letters.js`:

```js
{
  id: "e-acute",                 // stable slug
  grapheme: "É",                 // what's shown on the key/card
  category: "base" | "azerty-accent" | "extra-accent",
  ipa: "/e/",
  soundLabel: { en: "closed e", zh: "閉口e" },
  articulation: {
    tongue:  { en: "...", zh: "..." },
    lips:    { en: "...", zh: "..." },
    airflow: { en: "...", zh: "..." },
    voicing: "voiced" | "voiceless",
    nasal: false,
  },
  zhuyin: {
    symbol: "ㄟ",               // closest approximation, or null
    hasEquivalent: true,         // false => show "no close equivalent" warning
    caveat: { en: "...", zh: "..." },
  },
  examples: ["été", "café"],      // French example word(s)
  ttsText: "été",                 // text passed to speechSynthesis
  sources: [
    { title: "...", url: "..." }  // >= 1 required, see §7
  ],
}
```

A `category` field drives which section of the keyboard renders the
key (base row vs AZERTY-accent digit row vs extra-accents panel).

## 5. Keyboard UI

- CSS grid rendering of the 3 AZERTY letter rows, standard staggered
  key layout.
- Digit row rendered above it showing the 5 direct accented characters
  (é è ç à ù) as the primary glyph on their real keys, matching a real
  AZERTY keyboard.
- Below the keyboard, an "Extra accents" strip with the 7 dead-key
  letters (â ê î ô û ï ë), visually distinct (e.g. dashed border) with
  a one-line EN/ZH note explaining these need a dead-key combo on a
  real keyboard.
- Clicking any key opens an info panel (side panel on desktop, bottom
  sheet on narrow/mobile viewports) showing: grapheme, IPA, sound
  label, articulation (tongue/lips/airflow), zhuyin symbol + caveat,
  example word(s), a "🔊 Play" button, and the source links.
- "🔊 Play" uses the Web Speech API (`speechSynthesis`): pick a
  `fr-FR` voice, preferring one whose name contains "Google" if the
  browser exposes it (Chrome does), else any `fr-FR` voice, else the
  first available voice as a last resort; speak `ttsText` (an example
  word, not an isolated letter, since isolated-letter TTS is often
  mispronounced).

## 6. Game mode (weighted flashcards)

- Pool = all 38 letter units, each with an in-memory `weight` starting
  at `1`.
- Draw: weighted-random pick from the pool, excluding the most
  recently drawn 1–2 cards to avoid immediate repeats.
- Show only the big grapheme. User self-tests mentally, then clicks
  "Reveal" to show the same info-panel content as the keyboard mode
  (including the Play button).
- After reveal, user rates the card: **Easy / Hard / Missed**.
  - Easy → `weight = max(0.5, weight - 1)`
  - Hard → `weight += 1.5`
  - Missed → `weight += 3`
- A small session counter shows cards reviewed and current easy streak.
- **No persistence**: weights live only in a JS variable for the
  current page session and are discarded on reload/close — explicitly
  requested by the user, no `localStorage`/`sessionStorage` involved.

## 7. Sourced content research

Before writing `data/letters.js`, produce
`docs/research/sources.md` covering, per letter unit:

- The articulatory description (tongue position, lip position,
  airflow, voicing) backed by an established French-phonetics
  reference (e.g. academic phonology references, recognized FLE
  pronunciation resources).
- The zhuyin approximation, prioritizing sources that are actual
  Taiwanese French-pedagogy material (French-department course pages
  from Taiwanese universities, FLE-for-Mandarin-speakers guides,
  Taiwanese textbooks/blogs teaching French pronunciation via zhuyin).
  When no such source can be found for a given letter, `zhuyin.
  hasEquivalent` is set to `false` and the caveat explains there is no
  close zhuyin equivalent, rather than inventing one.

Every entry in `data/letters.js` must carry at least one source; the
UI displays these as clickable links in the info panel so claims are
traceable.

## 8. Bilingual UI

- All interface chrome (headings, buttons, instructions) is English
  first with a smaller Traditional Chinese subtitle underneath.
- Implemented via a plain JS convention: any UI string is an object
  `{ en, zh }`, rendered by a small helper that outputs both lines —
  no i18n library.
- Pedagogical content in the data model already carries this
  `{ en, zh }` shape (§4).

## 9. Responsive layout

Single page, responsive by default: keyboard + panel side-by-side on
desktop widths, panel becomes a bottom sheet / stacked section on
narrow (mobile/tablet) widths.

## 10. Verification plan

No backend, so verification is manual + one lightweight automated
data check:

- A small script/check (run in the browser console or a tiny Node
  script with no dependencies) asserts every letter unit has all
  required fields and at least one source, to catch unsourced or
  incomplete entries before shipping.
- Manual pass in a browser: click every key on the keyboard and
  confirm the panel renders correctly; confirm audio playback works;
  play a full game session including all three ratings; confirm
  EN/ZH subtitles render everywhere; check the responsive layout at
  desktop and mobile widths.

## 11. Out of scope (YAGNI)

- Digraphs / composed sounds (ch, ou, an, on, in, eu, gn, oi).
- Any persistence of game progress across sessions.
- Google Cloud TTS / any paid API or backend.
- Accounts, multi-user, or analytics.
- i18n library / framework (React, Vite, etc.).
