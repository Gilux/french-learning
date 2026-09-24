# Numbers Research (0–1 000 000)

Sourced facts behind the **numbers mode**: a composition-based (no lookup table) generator that turns
any integer 0–1 000 000 into French words in **1990 rectified spelling** (hyphens between all numeral
words), plus **one standard France-French IPA transcription in context**, silent letters, liaisons /
non-liaisons, and short rule notes. Each section below keeps the claim id from the brief.

Conventions:
- IPA follows Wiktionnaire: syllable dots, `‿` for a consonant linked onto the next vowel (liaison or
  enchaînement). Wiktionnaire IPA was read from each page's wikitext (`?action=raw`) on 2026-09-24;
  the canonical page URLs are cited. TLFi (cnrtl.fr) pages were read in a browser because the site is
  now a JavaScript app.
- "Numeral word" = un…seize, vingt…soixante, cent(s), mille, et. The only **vowel-initial** numeral
  words are **un, huit, onze, et**. This drives every liaison rule below.
- In 0–1 000 000 the generator only ever outputs bare numbers (no following noun), so "final" = end of
  the whole number.

---

## S1 — Hyphens everywhere (1990); million is a noun

**Verdict:** confirmed for numeral adjectives; **contested** for *million*.

**Rule:** Join **every** numeral word of the number with a hyphen, including around *et* and above
100: `vingt-et-un`, `cent-deux`, `deux-cent-soixante-et-onze`, `mille-deux-cents`,
`trois-cent-mille`, `sept-cent-mille-trois-cent-vingt-et-un`. The official 1990 text says only: « on
lie par des traits d'union les numéraux formant un nombre complexe, inférieur ou supérieur à cent »
and does **not** mention *million* / *milliard* at all. The Académie adds, on its own pages:
« Milliard, million et millier, étant des noms, ne sont pas concernés par cette rectification. »
→ For France French, write **`un million`** (space, no hyphen). In 0–1 000 000 this only affects the
number 1 000 000.

**Examples:** 21 `vingt-et-un` [vɛ̃.t‿e.œ̃] · 102 `cent-deux` [sɑ̃.dø] · 1 200 `mille-deux-cents`
[mil.dø.sɑ̃] · 300 000 `trois-cent-mille` [tʁwa.sɑ̃.mil] · 1 000 000 `un million` [œ̃.mi.ljɔ̃]

**Sources:**
- Les rectifications de l'orthographe — Rapport du CSLF, JO du 6 décembre 1990 (academie-francaise.fr, PDF) — https://www.academie-francaise.fr/sites/academie-francaise.fr/files/rectifications_1990.pdf
- Les rectifications de l'orthographe, annexe (dictionnaire-academie.fr) — https://www.dictionnaire-academie.fr/annexes/rectifications-orthographe.html
- Questions de langue : Rectifications de l'orthographe (dictionnaire-academie.fr) — https://www.dictionnaire-academie.fr/article/QDL073
- Questions de langue : Nombres (écriture, lecture, accord) (dictionnaire-academie.fr) — https://www.dictionnaire-academie.fr/article/QDL057
- cent, Dictionnaire 9e éd. (« Peut s'écrire cent-deux, deux-cents, deux-cent-trente-et-un ») (dictionnaire-academie.fr) — https://www.dictionnaire-academie.fr/article/A9C1297
- mille, Dictionnaire 9e éd. (« deux-mille, mille-deux-cent-trente-et-un, cinq-cent-mille ») (dictionnaire-academie.fr) — https://www.dictionnaire-academie.fr/article/A9M2155
- Nombres et trait d'union (dictionnaire.lerobert.com) — https://dictionnaire.lerobert.com/guide/nombres-et-trait-d-union
- Rectifications liées aux numéraux composés (OQLF, Vitrine linguistique) — https://vitrinelinguistique.oqlf.gouv.qc.ca/23163/lorthographe/rectifications-de-lorthographe/rectifications-liees-au-trait-dunion-et-soudure/rectifications-liees-aux-numeraux-composes
- Règles de la nouvelle orthographe (RENOUVO) — https://www.renouvo.org/regles.php
- Règle 1, numéraux composés (orthographe-recommandee.info) — https://www.orthographe-recommandee.info/regles1.htm
- Numéraux, liste (CCDMD, Rectifications orthographiques) — https://ro.ccdmd.qc.ca/regles/soudure-traitdunion/numeraux/liste
- Annexe : Rectifications orthographiques du français en 1990 (fr.wiktionary.org) — https://fr.wiktionary.org/wiki/Annexe:Rectifications_orthographiques_du_fran%C3%A7ais_en_1990
- Nombres en français (fr.wikipedia.org) — https://fr.wikipedia.org/wiki/Nombres_en_fran%C3%A7ais

**Notes:** Because the 1990 text is silent on nouns, two readings coexist. Académie + Le Robert +
Wikipedia: `un million`, `deux millions` (no hyphen). OQLF (« y compris ceux formés avec les noms
million, milliard… » : `deux-millions-sept-cent-mille`), RENOUVO / orthographe-recommandee.info
(`un-million-cent`) and CCDMD (`un-million`) hyphenate it; so does the Taiwanese site French Nautilus
(`deux-millions`). Recommended standard for this France-targeted app: **Académie → `un million`**
(matches the design spec). The OQLF accepts both traditional and rectified spellings in general.

## S2 — Where *et* appears

**Verdict:** confirmed.

**Rule:** Insert *et* only between vingt / trente / quarante / cinquante / soixante and **un** (21,
31, 41, 51, 61) or **onze** (71 `soixante-et-onze`). Never in 81 `quatre-vingt-un`, 91
`quatre-vingt-onze`, never after cent or mille (`cent-un`, `mille-un`), never with other units
(`soixante-huit`, `soixante-quinze`). The rule applies inside bigger numbers (`cent-vingt-et-un`,
`vingt-et-un-mille`). *Mille et un* / *cent et un* exist only as idioms for "a great many" — not for
1001 / 101.

**Examples:** 61 `soixante-et-un` [swa.sɑ̃.t‿e.œ̃] · 71 `soixante-et-onze` [swa.sɑ̃.t‿e.ɔ̃z] · 81
`quatre-vingt-un` [ka.tʁə.vɛ̃.œ̃] · 101 `cent-un` [sɑ̃.œ̃] · 1001 `mille-un` [mi.l‿œ̃]

**Sources:**
- Prononciation de *et* dans les nombres composés (OQLF) — https://vitrinelinguistique.oqlf.gouv.qc.ca/24631/la-prononciation/prononciation-des-nombres/prononciation-de-et-dans-les-nombres-composes
- vingt, TLFi (cnrtl.fr) — https://www.cnrtl.fr/definition/vingt
- un, une, Dictionnaire 9e éd. (« L'article cent un du Code civil ») (dictionnaire-academie.fr) — https://www.dictionnaire-academie.fr/article/A9U0056
- Mille-et-une questions sur « mille » (Antidote blog) — https://www.antidote.info/fr/blogue/enquetes/milleetune-questions-sur-mille
- Nombres en français (fr.wikipedia.org) — https://fr.wikipedia.org/wiki/Nombres_en_fran%C3%A7ais
- 【法文數字 1-100】邏輯解釋 (法語鸚鵡螺 French Nautilus, Taiwan; « 301 trois-cent-un（不用et）») — https://french-nautilus.com/blog/vocabulaire/chiffre-2/

**Notes:** —

## S3 — Plural *s* of vingt (quatre-vingts)

**Verdict:** confirmed.

**Rule:** Write `vingts` only if vingt is **multiplied** (`quatre-vingt…`) **and** no other numeral
word follows it. *Mille* is a numeral adjective, so it blocks the *s* (`quatre-vingt-mille`).
*Million* is a noun, so it doesn't block it (`quatre-vingts millions`, which is above the range). In
0–1 000 000 this means: `quatre-vingts` if and only if it is the last word of the whole number.
Ordinal use (`page quatre-vingt`) stays invariable (not generated).

**Examples:** 80 `quatre-vingts` [ka.tʁə.vɛ̃] · 81 `quatre-vingt-un` · 180 `cent-quatre-vingts`
[sɑ̃.ka.tʁə.vɛ̃] · 80 000 `quatre-vingt-mille` [ka.tʁə.vɛ̃.mil] · 80 080
`quatre-vingt-mille-quatre-vingts`

**Sources:**
- Questions de langue : Nombres (« ils restent invariables s'ils sont suivis d'un autre nombre ou de mille ») (dictionnaire-academie.fr) — https://www.dictionnaire-academie.fr/article/QDL057
- Pluriel de vingt, de cent et de mille (OQLF) — https://vitrinelinguistique.oqlf.gouv.qc.ca/21532/la-grammaire/les-determinants/determinants-numeraux/pluriel-de-vingt-de-cent-et-de-mille
- vingt, TLFi (cnrtl.fr) — https://www.cnrtl.fr/definition/vingt
- Nombres en français (80 000 = quatre-vingt-mille; 80 000 000 = quatre-vingts millions) (fr.wikipedia.org) — https://fr.wikipedia.org/wiki/Nombres_en_fran%C3%A7ais

**Notes:** —

## S4 — Plural *s* of cent

**Verdict:** confirmed.

**Rule:** Same rule as vingt. `cents` only if multiplied (deux…neuf before it) **and** no numeral
word follows. So `deux-cents`, `deux-cent-un`, `deux-cent-mille`, `mille-deux-cents`, and (out of
range) `deux-cents millions`. 100 = `cent` (never *un cent*). The *s* is silent.

**Examples:** 200 `deux-cents` [dø.sɑ̃] · 201 `deux-cent-un` [dø.sɑ̃.œ̃] · 200 000 `deux-cent-mille`
[dø.sɑ̃.mil] · 200 200 `deux-cent-mille-deux-cents` · 100 `cent` [sɑ̃] · 100 000 `cent-mille` [sɑ̃.mil]

**Sources:**
- Questions de langue : Nombres (dictionnaire-academie.fr) — https://www.dictionnaire-academie.fr/article/QDL057
- cent, Dictionnaire 9e éd. (« Trois cent mille francs ») (dictionnaire-academie.fr) — https://www.dictionnaire-academie.fr/article/A9C1297
- Pluriel de vingt, de cent et de mille (« trois cent mille dollars », « Cinq cents millions ») (OQLF) — https://vitrinelinguistique.oqlf.gouv.qc.ca/21532/la-grammaire/les-determinants/determinants-numeraux/pluriel-de-vingt-de-cent-et-de-mille
- cent, Dictionnaire de français (larousse.fr) — https://www.larousse.fr/dictionnaires/francais/cent/14089
- Counting in French (Frenchplanations, FLE; no *un* before cent / mille) — https://frenchplanations.com/counting-numbers-in-french/

**Notes:** I found no dictionary sentence that literally says "not *un cent*". The rule rests on
every dictionary example using bare `cent` and on FLE teaching (Frenchplanations).

## S5 — mille

**Verdict:** confirmed.

**Rule:** *Mille* never takes an *s* (`deux-mille`, `cent-mille`, `trois-cent-mille`). 1000 is
`mille`, never *un mille* (unlike `un million`, because *mille* is an adjective and *million* is a
noun). 1001 = `mille-un`. Use `mille`, not `mil` (*mil* is only an optional date spelling).

**Examples:** 1000 `mille` [mil] · 2000 `deux-mille` [dø.mil] · 1001 `mille-un` [mi.l‿œ̃]

**Sources:**
- Questions de langue : Nombres (« Mille (ou mil) est toujours invariable ») (dictionnaire-academie.fr) — https://www.dictionnaire-academie.fr/article/QDL057
- mille, Dictionnaire 9e éd. (dictionnaire-academie.fr) — https://www.dictionnaire-academie.fr/article/A9M2155
- Pluriel de vingt, de cent et de mille (« Le déterminant numéral mille ne varie pas ») (OQLF) — https://vitrinelinguistique.oqlf.gouv.qc.ca/21532/la-grammaire/les-determinants/determinants-numeraux/pluriel-de-vingt-de-cent-et-de-mille
- mille, Dictionnaire de français (« Mille n'est pas un nom (contrairement à million) ») (larousse.fr) — https://www.larousse.fr/dictionnaires/francais/mille/51453
- Mille-et-une questions sur « mille » (« Le nombre 1 001 s'écrit et se prononce mille-un ») (Antidote) — https://www.antidote.info/fr/blogue/enquetes/milleetune-questions-sur-mille
- Counting in French (Frenchplanations) — https://frenchplanations.com/counting-numbers-in-french/

**Notes:** —

## S6 — un / une

**Verdict:** confirmed, with one clarification.

**Rule:** A number ending in *un* uses *une* when it directly determines a feminine noun
(`vingt-et-une pages`, `deux-cent-cinquante-et-une invitations`, « Trente et une tonnes »). Before
*mille*, the *un* determines *mille*, which is masculine, so it stays **un whatever noun follows**:
`vingt-et-un-mille personnes`, not *vingt-et-une-mille*. Bare numbers (what the app shows) always
use masculine `un`.

**Examples:** `vingt-et-une` [vɛ̃.t‿e.yn] · `trente-et-une` [tʁɑ̃.t‿e.yn] · 21 000 `vingt-et-un-mille`
[vɛ̃.t‿e.œ̃.mil]

**Sources:**
- Déterminant numéral se terminant par *un* (« Vingt et un mille personnes… (et non : Vingt et une mille personnes) ») (OQLF) — https://vitrinelinguistique.oqlf.gouv.qc.ca/25228/la-grammaire/les-determinants/determinants-numeraux/determinant-numeral-se-terminant-par-un
- un, une, Dictionnaire 9e éd. (dictionnaire-academie.fr) — https://www.dictionnaire-academie.fr/article/A9U0056
- « mille » ou « milles » ? (Projet Voltaire) — https://www.projet-voltaire.fr/regles-orthographe/mille-ou-milles/
- Mille-et-une questions sur « mille » (« mille-une devant un nom féminin ») (Antidote) — https://www.antidote.info/fr/blogue/enquetes/milleetune-questions-sur-mille
- vingt-et-une (fr.wiktionary.org) — https://fr.wiktionary.org/wiki/vingt-et-une

**Notes:** —

## S7 — Belgium / Switzerland

**Verdict:** confirmed, with details added (cantons; Belgium says *quatre-vingts*).

**Rule:** France uses `soixante-dix`, `quatre-vingts`, `quatre-vingt-dix`. Belgium and French-speaking
Switzerland use **septante** (70) and **nonante** (90). **Huitante** (80) is Swiss only, mainly in the
cantons of **Vaud, Valais and Fribourg**. Geneva and the Jura arc mostly say *quatre-vingts*.
**Belgium says *quatre-vingts***. **Octante** is not in living use: the Académie labels it "regional
or dated", and a survey found almost no one uses it. Show these as a region note only; never generate
them.

**Examples:** `septante` [sɛp.tɑ̃t] · `huitante` [ɥi.tɑ̃t] · `nonante` [nɔ.nɑ̃t] · `octante` [ɔk.tɑ̃t] ·
Belgian *huit* [wit]

**Sources:**
- huitante, Dictionnaire 9e éd. (« En Suisse romande. Quatre-vingts ») (dictionnaire-academie.fr) — https://www.dictionnaire-academie.fr/article/A9H1077
- octante, Dictionnaire 9e éd. (« Régional (Belgique, Suisse, Canada) ou vieilli… en Suisse romande, on dit plutôt aujourd'hui huitante ») (dictionnaire-academie.fr) — https://www.dictionnaire-academie.fr/article/A9O0163
- septante, Dictionnaire 9e éd. (« En Belgique et en Suisse romande ») (dictionnaire-academie.fr) — https://www.dictionnaire-academie.fr/article/A9S1279
- Comment dit-on 80 en Belgique et en Suisse ? (M. Avanzi, Français de nos régions) — https://francaisdenosregions.com/2017/03/26/comment-dit-on-80-en-belgique-et-en-suisse/
- huitante / octante / septante / nonante / huit (fr.wiktionary.org) — https://fr.wiktionary.org/wiki/huitante · https://fr.wiktionary.org/wiki/octante · https://fr.wiktionary.org/wiki/septante · https://fr.wiktionary.org/wiki/nonante · https://fr.wiktionary.org/wiki/huit
- Nombres en français (fr.wikipedia.org) — https://fr.wikipedia.org/wiki/Nombres_en_fran%C3%A7ais

**Notes:** In the Avanzi survey, *huitante* use was 77–82 % in Vaud, Fribourg and Valais, 13 % in
Geneva and 7 % in the Jura arc. Only 57 of about 15 000 respondents chose *octante*. Wiktionnaire
records *octante* only for an Acadian community in south-west Nova Scotia.

---

## P1 — six and dix

**Verdict:** confirmed; notation corrected (`dix-huit` is [di.z‿ɥit]); standard for *dix-sept* =
[di.sɛt].

**Rule:**
- Final or alone: [sis], [dis].
- Before a consonant-initial numeral word (*cents*, *cent*, *mille*, *sept*): x is silent → [si],
  [di].
- Before a vowel: [z]. Inside numbers this only happens in *dix-huit* [di.z‿ɥit].
- *dix-neuf*: x = [z] → [diz.nœf].
- *dix-sept*: show **[di.sɛt]**. The Académie writes « x se prononce s »; that [s] merges with the
  s of *sept*.

*Six* never comes before a vowel-initial numeral word in 0–1 000 000. The same forms carry into
77–79 and 97–99.

**Examples:** 6 `six` [sis] · 600 `six-cents` [si.sɑ̃] · 6000 `six-mille` [si.mil] · 66 `soixante-six`
[swa.sɑ̃t.sis] · 10 000 `dix-mille` [di.mil] · 17 `dix-sept` [di.sɛt] · 18 `dix-huit` [di.z‿ɥit] ·
19 `dix-neuf` [diz.nœf] · 77 `soixante-dix-sept` [swa.sɑ̃t.di.sɛt] · 99 `quatre-vingt-dix-neuf`
[ka.tʁə.vɛ̃.diz.nœf] · 70 000 `soixante-dix-mille` [swa.sɑ̃t.di.mil]

**Sources:**
- six, Dictionnaire 9e éd. (« x ne se prononce pas devant une consonne ou un h aspiré ; il se prononce z devant … une voyelle … ; il se prononce ss quand six est seul ou quand il est final ») (dictionnaire-academie.fr) — https://www.dictionnaire-academie.fr/article/A9S1804
- dix, Dictionnaire 9e éd. (same wording) (dictionnaire-academie.fr) — https://www.dictionnaire-academie.fr/article/A9D2877
- dix-sept (« x se prononce s ») / dix-huit (« x se prononce z ») / dix-neuf (« x se prononce z »), Dictionnaire 9e éd. (dictionnaire-academie.fr) — https://www.dictionnaire-academie.fr/article/A9D2887 · https://www.dictionnaire-academie.fr/article/A9D2879 · https://www.dictionnaire-academie.fr/article/A9D2884
- dix, TLFi (dix-sept « [dissɛt]… se réduit le plus souvent à [disɛt] »; [diz] in dix-huit, dix-neuf) (cnrtl.fr) — https://www.cnrtl.fr/definition/dix
- six, TLFi (cnrtl.fr) — https://www.cnrtl.fr/definition/six
- Prononciation de *six* et *dix* (OQLF) — https://vitrinelinguistique.oqlf.gouv.qc.ca/23137/la-prononciation/prononciation-des-nombres/prononciation-de-six-et-dix
- six / dix / dix-sept / dix-huit / dix-neuf / six-cents / six-mille / dix-mille / soixante-dix-sept (fr.wiktionary.org) — https://fr.wiktionary.org/wiki/six · https://fr.wiktionary.org/wiki/dix · https://fr.wiktionary.org/wiki/dix-sept · https://fr.wiktionary.org/wiki/dix-huit · https://fr.wiktionary.org/wiki/dix-neuf · https://fr.wiktionary.org/wiki/six-cents · https://fr.wiktionary.org/wiki/six-mille · https://fr.wiktionary.org/wiki/dix-mille · https://fr.wiktionary.org/wiki/soixante-dix-sept

**Notes:** For *dix-sept*, Wiktionnaire lists [di.sɛt] and [dis.sɛt]; TLFi says the geminate is
usually reduced. Standard: [di.sɛt]. For the silent-letter view, the x in *dix-sept* is not truly
silent: it is merged with the s of *sept*. Label it as merged rather than greying it out. For
*dix-neuf*, Wiktionnaire also lists [dis.nœf], but the Académie and TLFi give [z] → [diz.nœf].

## P2 — huit

**Verdict:** confirmed; notation corrected (`vingt-huit` is [vɛ̃.t‿ɥit], not [vɛ̃t.ɥit]).

**Rule:**
- [ɥit] when final. [ɥi] before a consonant-initial word (*cents*, *mille*).
- *Huit* behaves like an aspirated h, which blocks liaison and elision. The exceptions are
  *dix-huit* [di.z‿ɥit] and *vingt-huit* [vɛ̃.t‿ɥit] (Académie: « h n'est pas aspiré dans dix-huit,
  vingt-huit »).
- So no liaison in `cent-huit` [sɑ̃.ɥit] or `quatre-vingt-huit` [ka.tʁə.vɛ̃.ɥit].
- A consonant that is always pronounced still links on (enchaînement, not liaison):
  `trente-huit` [tʁɑ̃.t‿ɥit], `soixante-huit` [swa.sɑ̃.t‿ɥit].

**Examples:** 8 [ɥit] · 800 `huit-cents` [ɥi.sɑ̃] · 8000 `huit-mille` [ɥi.mil] · 108 `cent-huit`
[sɑ̃.ɥit] · 88 `quatre-vingt-huit` [ka.tʁə.vɛ̃.ɥit] · 28 `vingt-huit` [vɛ̃.t‿ɥit] · 18 000
`dix-huit-mille` [di.z‿ɥi.mil] · 98 `quatre-vingt-dix-huit` [ka.tʁə.vɛ̃.di.z‿ɥit]

**Sources:**
- huit, Dictionnaire 9e éd. (« t ne se prononce pas devant une consonne … ; h n'est pas aspiré dans dix-huit, vingt-huit ») (dictionnaire-academie.fr) — https://www.dictionnaire-academie.fr/article/A9H1074
- huit, TLFi (« dix-huit [dizɥit], vingt-huit [vɛ̃tɥit]; cent huit [sɑ̃ɥit], quatre-vingt-huit [katʀəvɛ̃ɥit] en revanche sans liaison ») (cnrtl.fr) — https://www.cnrtl.fr/definition/huit
- Prononciation de *huit* (« exception faite de quatre-vingt-huit et cent huit ») (OQLF) — https://vitrinelinguistique.oqlf.gouv.qc.ca/23149/la-prononciation/prononciation-des-nombres/prononciation-de-huit
- huit / huit-cents / huit-mille / vingt-huit / quatre-vingt-huit / trente-huit / soixante-huit (fr.wiktionary.org) — https://fr.wiktionary.org/wiki/huit · https://fr.wiktionary.org/wiki/huit-cents · https://fr.wiktionary.org/wiki/huit-mille · https://fr.wiktionary.org/wiki/vingt-huit · https://fr.wiktionary.org/wiki/quatre-vingt-huit · https://fr.wiktionary.org/wiki/trente-huit · https://fr.wiktionary.org/wiki/soixante-huit

**Notes:** —

## P3 — cinq before cent(s) / mille

**Verdict:** **contested**. Recommended standard: **[sɛ̃] before *cent(s)* / *mille* inside a
number; [sɛ̃k] everywhere else in a bare number** (i.e. when final).

**Rule:** *cinq* is followed by a consonant-initial numeral word only before *cent(s)* and *mille*:
`cinq-cents` [sɛ̃.sɑ̃], `cinq-mille` [sɛ̃.mil], `vingt-cinq-mille` [vɛ̃t.sɛ̃.mil]. When final, it is
[sɛ̃k]: `vingt-cinq` [vɛ̃t.sɛ̃k], `cent-cinq` [sɑ̃.sɛ̃k].

**Examples:** 5 [sɛ̃k] · 500 `cinq-cents` [sɛ̃.sɑ̃] · 5000 `cinq-mille` [sɛ̃.mil] · 1 500
`mille-cinq-cents` [mil.sɛ̃.sɑ̃] · 25 [vɛ̃t.sɛ̃k]

**Sources:**
- cinq, Dictionnaire 9e éd. (« q se prononce surtout en liaison ou en fin de groupe ») (dictionnaire-academie.fr) — https://www.dictionnaire-academie.fr/article/A9C2335
- cinq, TLFi (elision [sɛ̃] before a consonant-initial plural noun; the [k] « généralement tenue pour populaire, s'introduit de plus en plus largement », citing Grevisse 1964) (cnrtl.fr) — https://www.cnrtl.fr/definition/cinq
- cinq (note: « cinq cents [sɛ̃.sɑ̃] et ses composés », « cinq mille [sɛ̃.mil] … sauf lorsque l'on veut appuyer sur le cinq ») (fr.wiktionary.org) — https://fr.wiktionary.org/wiki/cinq
- Annexe : Prononciation du Q en français (« à l'intérieur d'un nombre, suivi de cent, mille… : le Q est muet ») (fr.wiktionary.org) — https://fr.wiktionary.org/wiki/Annexe:Prononciation_du_Q_en_fran%C3%A7ais
- cinq-cents ([sɛ̃(k).sɑ̃]) / cinq-mille ([sɛ̃k.mil]) (fr.wiktionary.org) — https://fr.wiktionary.org/wiki/cinq-cents · https://fr.wiktionary.org/wiki/cinq-mille
- Prononciation de *cinq* (before a consonant « les deux prononciations, [sẽk] et [sẽ], sont possibles ») (OQLF) — https://vitrinelinguistique.oqlf.gouv.qc.ca/23135/la-prononciation/prononciation-des-nombres/prononciation-de-cinq
- Prononciation des nombres compris entre 1100 et 1999 (1500 = [milsẽsã]) (OQLF) — https://vitrinelinguistique.oqlf.gouv.qc.ca/23142/la-prononciation/prononciation-des-nombres/prononciation-des-nombres-compris-entre-1100-et-1999
- 法文數字好複雜！(尚進 scedu.com.tw, Taiwan; « cinq 放在子音前時，字尾 /k/ 音…可能發音，也可能弱化或省略 ») — https://scedu.com.tw/blog-detail.php?id=307

**Notes:** Why [sɛ̃]:
- The Académie 9e, the TLFi rule, the Wiktionnaire France note, the Wiktionnaire Q annex and OQLF's
  own 1500 transcription all drop the [k] before *cent* / *mille*.
- [sɛ̃k] is a documented, spreading variant (TLFi, OQLF "both possible", Wiktionnaire's cinq-mille
  page), used "to stress the figure".

Show [sɛ̃] in the IPA and add a rule note along the lines of "[sɛ̃k.sɑ̃] is also heard". The app feeds
digits to TTS, and the fr-FR voice may say [sɛ̃k]. Put 500 and 5000 on the by-ear check list.

## P4 — sept and neuf

**Verdict:** confirmed.

**Rule:**
- *sept* is always [sɛt] in numbers; the p is never pronounced. Its t is always pronounced, even
  before a consonant: `sept-cents` [sɛt.sɑ̃], `sept-mille` [sɛt.mil].
- *neuf* is [nœf] in every number context: `neuf-cents` [nœf.sɑ̃], `dix-neuf` [diz.nœf].
- [nœv] only occurs before *ans* and *heures* (the OQLF also lists *autres*, *hommes*). That is out
  of scope.

**Examples:** 7 [sɛt] · 700 [sɛt.sɑ̃] · 9 [nœf] · 9000 `neuf-mille` [nœf.mil]

**Sources:**
- sept, Dictionnaire 9e éd. (« se prononce sète ») (dictionnaire-academie.fr) — https://www.dictionnaire-academie.fr/article/A9S1277
- Prononciation de *sept* et *neuf* (OQLF) — https://vitrinelinguistique.oqlf.gouv.qc.ca/23136/la-prononciation/prononciation-des-nombres/prononciation-de-sept-et-neuf
- sept / neuf / sept-cents / neuf-cents (fr.wiktionary.org) — https://fr.wiktionary.org/wiki/sept · https://fr.wiktionary.org/wiki/neuf · https://fr.wiktionary.org/wiki/sept-cents · https://fr.wiktionary.org/wiki/neuf-cents

**Notes:** —

## P5 — vingt

**Verdict:** confirmed; notation corrected (`vingt-et-un` is [vɛ̃.t‿e.œ̃]).

**Rule:**
- The g is always silent.
- The t is pronounced **only when vingt is not multiplied and a unit word follows it (21–29)**:
  before et/huit as a liaison [vɛ̃.t‿…], before a consonant as [vɛ̃t.…].
- When multiplied (*quatre-vingt…*, 80–99), the t is **never** pronounced, even before *un*, *huit*
  or *onze*.
- Final or before *mille*: [vɛ̃].

**Examples:** 20 [vɛ̃] · 21 [vɛ̃.t‿e.œ̃] · 22 `vingt-deux` [vɛ̃t.dø] · 24 [vɛ̃t.katʁ] · 29
[vɛ̃t.nœf] · 81 [ka.tʁə.vɛ̃.œ̃] · 91 [ka.tʁə.vɛ̃.ɔ̃z] · 92 `quatre-vingt-douze` [ka.tʁə.vɛ̃.duz] ·
120 `cent-vingt` [sɑ̃.vɛ̃] · 20 000 `vingt-mille` [vɛ̃.mil] · 22 000 [vɛ̃t.dø.mil]

**Sources:**
- vingt, Dictionnaire 9e éd. (« g ne se prononce pas, t se fait entendre en liaison devant une voyelle … et, devant une consonne, dans les nombres de vingt-deux à vingt-neuf »; « Vingt mille euros ») (dictionnaire-academie.fr) — https://www.dictionnaire-academie.fr/article/A9V0851
- Prononciation de *vingt* (« Lorsque vingt est multiplié dans un nombre composé, comme dans 81 ou 92, on ne prononce pas le -t final ») (OQLF) — https://vitrinelinguistique.oqlf.gouv.qc.ca/23141/la-prononciation/prononciation-des-nombres/prononciation-de-vingt
- vingt, TLFi (« [vɛ̃] à la pause ou devant cons. sauf dans les nombres de 22 à 29 ») (cnrtl.fr) — https://www.cnrtl.fr/definition/vingt
- vingt / vingt-deux / vingt-et-un / quatre-vingt-un / quatre-vingt-onze (fr.wiktionary.org) — https://fr.wiktionary.org/wiki/vingt · https://fr.wiktionary.org/wiki/vingt-deux · https://fr.wiktionary.org/wiki/vingt-et-un · https://fr.wiktionary.org/wiki/quatre-vingt-un · https://fr.wiktionary.org/wiki/quatre-vingt-onze
- 法文數字好複雜！(尚進, Taiwan; vingt 的 t 在 21～29 會唸出來) — https://scedu.com.tw/blog-detail.php?id=307

**Notes:** —

## P6 — No liaison before un / huit / onze

**Verdict:** confirmed. No fetched source treats liaison in *cent-un* ([sɑ̃.tœ̃]) as acceptable.

**Rule:** The t of *cent* and of a multiplied *vingt* stays silent before *un*, *huit* and *onze*.
The only numeral liaisons are *dix-huit* [z], *vingt-huit* [t] and *vingt-et-* [t] (P1, P2, P5).
*Onze* also blocks elision and liaison in general.

**Examples:** 101 `cent-un` [sɑ̃.œ̃] · 108 [sɑ̃.ɥit] · 111 `cent-onze` [sɑ̃.ɔ̃z] · 201 [dø.sɑ̃.œ̃] ·
81 [ka.tʁə.vɛ̃.œ̃] · 88 [ka.tʁə.vɛ̃.ɥit] · 91 [ka.tʁə.vɛ̃.ɔ̃z]

**Sources:**
- cent, TLFi (« Liaison devant voyelle, excepté les cas de un, unième, huit, huitième, onze, onzième et les mots commençant par h aspiré (Littré, Barbeau-Rodhe 1930) ») (cnrtl.fr) — https://www.cnrtl.fr/definition/cent
- Prononciation de *et* dans les nombres composés (101 pages [sãyn]) (OQLF) — https://vitrinelinguistique.oqlf.gouv.qc.ca/24631/la-prononciation/prononciation-des-nombres/prononciation-de-et-dans-les-nombres-composes
- Prononciation de *onze* et de *onzième* (« On ne fait généralement pas la liaison ni l'élision devant … onze ») (OQLF) — https://vitrinelinguistique.oqlf.gouv.qc.ca/23140/la-prononciation/prononciation-des-nombres/prononciation-de-onze-et-de-onzieme
- Contextes de liaisons interdites (« En principe, on ne fait pas la liaison devant les numéraux ») (OQLF) — https://vitrinelinguistique.oqlf.gouv.qc.ca/index.php?id=23552
- Prononciation de *huit* (OQLF) — https://vitrinelinguistique.oqlf.gouv.qc.ca/23149/la-prononciation/prononciation-des-nombres/prononciation-de-huit
- onze (note on disjunction) / quatre-vingt-un (fr.wiktionary.org) — https://fr.wiktionary.org/wiki/onze · https://fr.wiktionary.org/wiki/quatre-vingt-un
- Numbers with *cent* (« never pronounce the "t" in the word "cent" when it is inside a number ») (Master Your French, FLE) — https://www.masteryourfrench.com/how-to-pronounce/numbers-with-cent/

**Notes:** —

## P7 — et

**Verdict:** confirmed; notation corrected to Wiktionnaire's form.

**Rule:**
- *et* = [e]. Its t is never pronounced and never makes a liaison: `et un` is [e.œ̃], `et onze` is
  [e.ɔ̃z].
- The consonant before *et* links onto it:
  - *vingt*: a liaison t, pronounced only here and in 22–29.
  - *trente…soixante*: the t is always pronounced, so this is enchaînement.

**Examples:** 21 [vɛ̃.t‿e.œ̃] · 31 [tʁɑ̃.t‿e.œ̃] · 41 [ka.ʁɑ̃.t‿e.œ̃] · 51 [sɛ̃.kɑ̃.t‿e.œ̃] · 61
[swa.sɑ̃.t‿e.œ̃] · 71 [swa.sɑ̃.t‿e.ɔ̃z]

**Sources:**
- et (« Le t est toujours muet, on ne fait jamais la liaison ») / vingt-et-un / trente-et-un / quarante-et-un / cinquante-et-un / soixante-et-un / soixante-et-onze (fr.wiktionary.org) — https://fr.wiktionary.org/wiki/et · https://fr.wiktionary.org/wiki/vingt-et-un · https://fr.wiktionary.org/wiki/trente-et-un · https://fr.wiktionary.org/wiki/quarante-et-un · https://fr.wiktionary.org/wiki/cinquante-et-un · https://fr.wiktionary.org/wiki/soixante-et-un · https://fr.wiktionary.org/wiki/soixante-et-onze
- Prononciation de *et* dans les nombres composés (21 [vẽteœ̃]; *[katʁəvẽeyn] marked incorrect) (OQLF) — https://vitrinelinguistique.oqlf.gouv.qc.ca/24631/la-prononciation/prononciation-des-nombres/prononciation-de-et-dans-les-nombres-composes
- 法文數字好複雜！(尚進, Taiwan; « et 本身的字尾 t 不發音，即使後方接母音，也不能自行產生連音 ») — https://scedu.com.tw/blog-detail.php?id=307

**Notes:** Wiktionnaire writes the 1990 forms with dots ([vɛ̃.t‿e.œ̃]) and the traditional spaced
forms with a space ([vɛ̃.t‿e œ̃]). Use the dotted form.

## P8 — quatre

**Verdict:** **contested**. Recommended convention: **[ka.tʁə] before any consonant-initial numeral
word (*vingt(s)*, *cent(s)*, *mille*); [katʁ] only when final.** Never show [kat].

**Rule:** In 0–1 000 000, *quatre* is either final (`vingt-quatre` [vɛ̃t.katʁ]) or followed by
*vingt(s)*, *cent(s)* or *mille*. It is never followed by a vowel.

**Examples:** 4 [katʁ] · 80 [ka.tʁə.vɛ̃] · 400 `quatre-cents` [ka.tʁə.sɑ̃] · 4000 `quatre-mille`
[ka.tʁə.mil] · 1 427 `mille-quatre-cent-vingt-sept` [mil.ka.tʁə.sɑ̃.vɛ̃t.sɛt] · 34 [tʁɑ̃t.katʁ]

**Sources:**
- quatre (« [kat] familier, généralement devant une consonne, et à l'exception notable de quatre-vingts ») / quatre-vingts (« se prononce toujours [ka.tʁə.vɛ̃] ») / quatre-cents ([ka.tʁə.sɑ̃], [kat.sɑ̃]) / quatre-mille ([katʁ.mil]) (fr.wiktionary.org) — https://fr.wiktionary.org/wiki/quatre · https://fr.wiktionary.org/wiki/quatre-vingts · https://fr.wiktionary.org/wiki/quatre-cents · https://fr.wiktionary.org/wiki/quatre-mille
- quatre, TLFi ([katʀ]; *quat'* is « pop. et fam. ») (cnrtl.fr) — https://www.cnrtl.fr/definition/quatre
- Prononciation des nombres compris entre 1100 et 1999 (1427 = [milkatʁəsãvẽtsɛt]) (OQLF) — https://vitrinelinguistique.oqlf.gouv.qc.ca/23142/la-prononciation/prononciation-des-nombres/prononciation-des-nombres-compris-entre-1100-et-1999
- E caduc (schwa inserted as « voyelle d'appui » to avoid three-consonant clusters) (fr.wikipedia.org) — https://fr.wikipedia.org/wiki/E_caduc

**Notes:** The sources disagree:
- Wiktionnaire's *quatre-mille* page gives [katʁ.mil].
- Its *quatre-cents* page gives [ka.tʁə.sɑ̃] first.
- *quatre-vingts* is always [ka.tʁə.vɛ̃].
- The OQLF writes [katʁəsã].

A single rule, "[ə] before a consonant-initial numeral word", covers all three and matches the
schwa-insertion tendency. [katʁ.mil] and [ka.tʁə.mil] are near-equivalent in speech, so this choice
costs no accuracy.

## P9 — mille, million

**Verdict:** confirmed.

**Rule:**
- *mille* is [mil]; the ll is a plain [l] (Académie: « les deux l se prononcent sans mouillure »),
  unlike *fille* [fij].
- *million* is [mi.ljɔ̃].
- *un million* is [œ̃.mi.ljɔ̃]: no liaison, because million starts with a consonant.
- Wiktionnaire's familiar [mi.jɔ̃] is not used.

**Examples:** 1000 [mil] · 1 000 000 [œ̃.mi.ljɔ̃]

**Sources:**
- mille, Dictionnaire 9e éd. (dictionnaire-academie.fr) — https://www.dictionnaire-academie.fr/article/A9M2155
- mille / million (fr.wiktionary.org) — https://fr.wiktionary.org/wiki/mille · https://fr.wiktionary.org/wiki/million

**Notes:** —

## P10 — soixante

**Verdict:** confirmed.

**Rule:** In *soixante*, x = [s] → [swa.sɑ̃t]. Its final t is always pronounced. *soixante-dix*
is [swa.sɑ̃t.dis]. Wiktionnaire also records a « parfois » [swa.sɑ̃.tə.dis], which is not used.

**Examples:** 60 [swa.sɑ̃t] · 70 [swa.sɑ̃t.dis] · 76 `soixante-seize` [swa.sɑ̃t.sɛz] · 79
[swa.sɑ̃t.diz.nœf]

**Sources:**
- soixante, Dictionnaire 9e éd. (« x se prononce ss ») (dictionnaire-academie.fr) — https://www.dictionnaire-academie.fr/article/A9S1954
- soixante-dix, Dictionnaire 9e éd. (« le premier x se prononce ss ; le second x ne se fait pas entendre devant une consonne … il se prononce ss quand soixante-dix est seul ou final ») (dictionnaire-academie.fr) — https://www.dictionnaire-academie.fr/article/A9S1955
- soixante / soixante-dix / soixante-seize / soixante-dix-neuf (fr.wiktionary.org) — https://fr.wiktionary.org/wiki/soixante · https://fr.wiktionary.org/wiki/soixante-dix · https://fr.wiktionary.org/wiki/soixante-seize · https://fr.wiktionary.org/wiki/soixante-dix-neuf

**Notes:** —

## P11 — deux / trois before a vowel inside a number

**Verdict:** confirmed: this **never happens** in 0–1 000 000.

**Rule:** Inside a number, *deux* and *trois* are only ever followed by *cent(s)* or *mille*, both
consonant-initial, or they end the number. The vowel-initial numeral words (*un, huit, onze, et*)
follow only these words:
- *dix*: only *huit*.
- *vingt* (unmultiplied): *et*, *huit*.
- *trente…soixante*: *et*, *huit*.
- *quatre-vingt*: *un*, *huit*, *onze*.
- *cent*: *un*, *huit*, *onze*.
- *mille*: *un*, *huit*, *onze*.
- *et*: *un*, *onze*.

So *deux* [dø] and *trois* [tʁwa] never make a liaison in this mode. Their [z] liaison exists only
before a vowel-initial noun (`deux avions` [døzavjɔ̃]), which is out of scope.

**Examples:** 2 000 [dø.mil] · 300 [tʁwa.sɑ̃] · 32 [tʁɑ̃t.dø]

**Sources:**
- Prononciation de *deux* et *trois* (OQLF) — https://vitrinelinguistique.oqlf.gouv.qc.ca/23134/la-prononciation/prononciation-des-nombres/prononciation-de-deux-et-trois
- trois, TLFi ([tʀwɑ], [tʀwa]) (cnrtl.fr) — https://www.cnrtl.fr/definition/trois
- deux / trois / trois-cents / deux-mille (fr.wiktionary.org) — https://fr.wiktionary.org/wiki/deux · https://fr.wiktionary.org/wiki/trois · https://fr.wiktionary.org/wiki/trois-cents · https://fr.wiktionary.org/wiki/deux-mille

**Notes:** For *trois*, both TLFi and Wiktionnaire list [tʁwɑ] and [tʁwa]. Wiktionnaire's compound
pages use [tʁwɑ]. Recommend **[tʁwa]** everywhere (editorial choice, so the app does not teach an
[ɑ]/[a] contrast it uses nowhere else). If strict Wiktionnaire-compound matching is preferred, use
[tʁwɑ] consistently instead.

## P12 — un

**Verdict:** confirmed.

**Rule:** Show *un* as [œ̃]. The feminine *une* [yn] is not generated for bare numbers. One-line note:
in Paris and most of northern France [œ̃] has merged with [ɛ̃], so many speakers say [ɛ̃]. The
distinction survives mainly in the south.

**Examples:** 1 [œ̃] · 41 [ka.ʁɑ̃.t‿e.œ̃] · 1 000 000 [œ̃.mi.ljɔ̃]

**Sources:**
- un (IPA [œ̃]; « Accents avec fusion /œ̃/-/ɛ̃/ : [ɛ̃] ») (fr.wiktionary.org) — https://fr.wiktionary.org/wiki/un
- Ces mots qui ne se prononcent pas de la même façon d'un bout à l'autre de la France (M. Avanzi, Français de nos régions) — https://francaisdenosregions.com/2017/07/06/ces-mots-qui-ne-se-prononcent-pas-de-la-meme-facon-dun-bout-a-lautre-de-la-france/
- Prononciation de *un* (OQLF) — https://vitrinelinguistique.oqlf.gouv.qc.ca/23131/la-prononciation/prononciation-des-nombres/prononciation-de-un

**Notes:** An FLE source (Master Your French) already writes *cent-un* as /sɑ̃.ɛ̃/, so learners will
meet both forms.

## P13 — Base-word IPA table

**Verdict:** confirmed. All IPA is from Wiktionnaire except where a recommendation above overrides a
variant.

In-number forms follow P1–P12. "Silent" letters are derived from the IPA and apply when the word
stands alone.

| Word | Alone / final | Other forms inside a number | Silent letters (alone) | Wiktionnaire |
|---|---|---|---|---|
| zéro | [ze.ʁo] | only ever alone | — | https://fr.wiktionary.org/wiki/z%C3%A9ro |
| un | [œ̃] | always [œ̃] | (n = nasal) | https://fr.wiktionary.org/wiki/un |
| deux | [dø] | always [dø] | x | https://fr.wiktionary.org/wiki/deux |
| trois | [tʁwa] (Wikt. [tʁwɑ]~[tʁwa]) | always | s | https://fr.wiktionary.org/wiki/trois |
| quatre | [katʁ] | [ka.tʁə] before vingt(s)/cent(s)/mille | final e | https://fr.wiktionary.org/wiki/quatre |
| cinq | [sɛ̃k] | [sɛ̃] before cent(s)/mille | — | https://fr.wiktionary.org/wiki/cinq |
| six | [sis] | [si] before cent(s)/mille | — (x=[s]) | https://fr.wiktionary.org/wiki/six |
| sept | [sɛt] | always [sɛt] | p | https://fr.wiktionary.org/wiki/sept |
| huit | [ɥit] | [ɥi] before cent(s)/mille | h | https://fr.wiktionary.org/wiki/huit |
| neuf | [nœf] | always [nœf] | — | https://fr.wiktionary.org/wiki/neuf |
| dix | [dis] | [di] before sept/cent(s)/mille; [diz] before neuf; [di.z‿] before huit | — (x=[s]) | https://fr.wiktionary.org/wiki/dix |
| onze | [ɔ̃z] | always | final e | https://fr.wiktionary.org/wiki/onze |
| douze | [duz] | always | final e | https://fr.wiktionary.org/wiki/douze |
| treize | [tʁɛz] | always | final e | https://fr.wiktionary.org/wiki/treize |
| quatorze | [ka.tɔʁz] | always | final e | https://fr.wiktionary.org/wiki/quatorze |
| quinze | [kɛ̃z] | always | final e | https://fr.wiktionary.org/wiki/quinze |
| seize | [sɛz] | always | final e | https://fr.wiktionary.org/wiki/seize |
| vingt | [vɛ̃] | unmultiplied + unit: [vɛ̃t] / [vɛ̃.t‿] before et, huit; multiplied: always [vɛ̃] | g, t (and s of vingts) | https://fr.wiktionary.org/wiki/vingt |
| trente | [tʁɑ̃t] | [tʁɑ̃.t‿] before et/huit | final e | https://fr.wiktionary.org/wiki/trente |
| quarante | [ka.ʁɑ̃t] | [ka.ʁɑ̃.t‿] before et/huit | final e | https://fr.wiktionary.org/wiki/quarante |
| cinquante | [sɛ̃.kɑ̃t] | [sɛ̃.kɑ̃.t‿] before et/huit | final e | https://fr.wiktionary.org/wiki/cinquante |
| soixante | [swa.sɑ̃t] | [swa.sɑ̃.t‿] before et/huit | final e (x=[s]) | https://fr.wiktionary.org/wiki/soixante |
| cent(s) | [sɑ̃] | always [sɑ̃], no liaison | t (and s of cents) | https://fr.wiktionary.org/wiki/cent |
| mille | [mil] | [mi.l‿] before un/huit/onze (see P14) | final e | https://fr.wiktionary.org/wiki/mille |
| million | [mi.ljɔ̃] | — | — | https://fr.wiktionary.org/wiki/million |
| et | [e] | always [e], no liaison | t | https://fr.wiktionary.org/wiki/et |

**Sources:** the Wiktionnaire pages in the table, plus the Académie / TLFi / OQLF pages cited in
P1–P12.

**Notes:**
- Syllabification: join word IPAs with dots.
- A pronounced final consonant before a vowel-initial word moves to the next syllable with `‿`
  ([tʁɑ̃.t‿e.œ̃], [di.z‿ɥit]).
- A word that ends in a pronounced consonant keeps it in its own syllable before a consonant
  ([vɛ̃t.dø], [swa.sɑ̃t.dis]).

## P14 — Other traps for 0–1 000 000

**Verdict:** additions (not in the brief).

**Rules:**
1. **mille + un / huit / onze.** Spelling: `mille-un` (no et), `mille-huit`, `mille-onze`. Nothing
   is silent, because mille's [l] is always pronounced. For syllabification, recommend enchaînement
   [mi.l‿œ̃], [mi.l‿ɥit], [mi.l‿ɔ̃z]. That follows Wiktionnaire's *mille et un* [mi.l‿e œ̃] and its
   *trente-huit* [tʁɑ̃.t‿ɥit] (enchaînement shown even before disjunctive *huit*). This is
   **editorial**: no source transcribes *mille-huit* / *mille-onze* with syllable marks (the OQLF
   writes [milœ̃], [milɥisã] without them). Do not flag it as a liaison.
2. **Number part before *mille* keeps its "before-consonant" form:**
   - `dix-huit-mille` [di.z‿ɥi.mil]
   - `vingt-cinq-mille` [vɛ̃t.sɛ̃.mil]
   - `soixante-six-mille` [swa.sɑ̃t.si.mil]
   - `quatre-vingt-dix-mille` [ka.tʁə.vɛ̃.di.mil]
3. **70–79 and 90–99 reuse the 10–19 forms**, including *et* only in 71: `soixante-et-onze` but
   `soixante-douze`, `quatre-vingt-onze` (no et).
4. **1100–1999:** the generator writes `mille-cent`, `mille-deux-cents`, …. Speakers often say
   *onze-cents* [ɔ̃z.sɑ̃], *douze-cents*, …. The OQLF says the hundreds forms are clearly more common
   orally for 1100–1699. Worth a usage note only; TTS may read 1500 either way.
5. **cent in *cent-mille*:** not multiplied, so no *s* and no *un*: `cent-mille` [sɑ̃.mil] (100 000).
   `cent-un-mille` is 101 000.
6. **Ordinal / page use** (`page quatre-vingt`, `page deux-cent`) keeps vingt and cent invariable.
   The generator only outputs cardinals, so no change is needed, but a note can prevent confusion.
7. **zéro** is only ever the number 0 alone; it never appears inside a compound.
8. **un million:** the only noun in range. It needs *un* (unlike *cent* / *mille*) and has no hyphen
   (S1).
9. **TTS mismatch risks for the by-ear check:**
   - 500 / 5000 (cinq [sɛ̃] vs [sɛ̃k])
   - 400 / 4000 (quatre)
   - 17 (dix-sept)
   - 1100–1699 (the voice may say *onze-cents*)
   - 101 (the voice must not say [sɑ̃.tœ̃])

**Examples:** 1001 [mi.l‿œ̃] · 1008 [mi.l‿ɥit] · 1011 [mi.l‿ɔ̃z] · 18 000 [di.z‿ɥi.mil] · 90 000
[ka.tʁə.vɛ̃.di.mil] · 72 [swa.sɑ̃t.duz]

**Sources:**
- mille et un (fr.wiktionary.org) — https://fr.wiktionary.org/wiki/mille_et_un
- trente-huit (fr.wiktionary.org) — https://fr.wiktionary.org/wiki/trente-huit
- onze-cents (fr.wiktionary.org) — https://fr.wiktionary.org/wiki/onze-cents
- Prononciation des nombres compris entre 1100 et 1999 (OQLF) — https://vitrinelinguistique.oqlf.gouv.qc.ca/23142/la-prononciation/prononciation-des-nombres/prononciation-des-nombres-compris-entre-1100-et-1999
- Prononciation de *et* dans les nombres composés (1001 [milœ̃]) (OQLF) — https://vitrinelinguistique.oqlf.gouv.qc.ca/24631/la-prononciation/prononciation-des-nombres/prononciation-de-et-dans-les-nombres-composes
- Pluriel de vingt, de cent et de mille (ordinal « la page deux cent ») (OQLF) — https://vitrinelinguistique.oqlf.gouv.qc.ca/21532/la-grammaire/les-determinants/determinants-numeraux/pluriel-de-vingt-de-cent-et-de-mille
- Nombres en français (fr.wikipedia.org) — https://fr.wikipedia.org/wiki/Nombres_en_fran%C3%A7ais

**Notes:** Two Taiwanese sources were found and used:
- **法語鸚鵡螺 French Nautilus** (Taiwan-based, prices in NT$) uses 1990 hyphens throughout
  (`deux-cents`, `trois-cent-un（不用et）`, `mille-neuf-cent-quatre-vingt-sept`). It also hyphenates
  `deux-millions`, against the Académie. Its pronunciation audio is members-only, and it gives no
  written pronunciation rules.
- **尚進 scedu.com.tw** gives written pronunciation rules (cinq, six/dix, vingt in 21–29, silent t
  of et). It mixes traditional and rectified spellings. Its sentence on *et* lists only 21–61, though
  its table shows `soixante-et-onze`.

abconline.com.tw's numbers page was checked but has no pronunciation content.

---

## Source index

| Key | Source | URL |
|---|---|---|
| AF_RAPPORT_1990 | Les rectifications de l'orthographe, Rapport CSLF, JO 6 déc. 1990 (Académie PDF) | https://www.academie-francaise.fr/sites/academie-francaise.fr/files/rectifications_1990.pdf |
| AF_ANNEXE_RECTIF | Les rectifications de l'orthographe, annexe (Dictionnaire de l'Académie) | https://www.dictionnaire-academie.fr/annexes/rectifications-orthographe.html |
| AF_QDL_RECTIF | Questions de langue : Rectifications de l'orthographe | https://www.dictionnaire-academie.fr/article/QDL073 |
| AF_QDL_NOMBRES | Questions de langue : Nombres (écriture, lecture, accord) | https://www.dictionnaire-academie.fr/article/QDL057 |
| AF_DICT_UN | un, une (Dict. Académie 9e) | https://www.dictionnaire-academie.fr/article/A9U0056 |
| AF_DICT_CINQ | cinq (Dict. Académie 9e) | https://www.dictionnaire-academie.fr/article/A9C2335 |
| AF_DICT_SIX | six (Dict. Académie 9e) | https://www.dictionnaire-academie.fr/article/A9S1804 |
| AF_DICT_SEPT | sept (Dict. Académie 9e) | https://www.dictionnaire-academie.fr/article/A9S1277 |
| AF_DICT_HUIT | huit (Dict. Académie 9e) | https://www.dictionnaire-academie.fr/article/A9H1074 |
| AF_DICT_DIX | dix (Dict. Académie 9e) | https://www.dictionnaire-academie.fr/article/A9D2877 |
| AF_DICT_DIX_SEPT | dix-sept (Dict. Académie 9e) | https://www.dictionnaire-academie.fr/article/A9D2887 |
| AF_DICT_DIX_HUIT | dix-huit (Dict. Académie 9e) | https://www.dictionnaire-academie.fr/article/A9D2879 |
| AF_DICT_DIX_NEUF | dix-neuf (Dict. Académie 9e) | https://www.dictionnaire-academie.fr/article/A9D2884 |
| AF_DICT_VINGT | vingt (Dict. Académie 9e) | https://www.dictionnaire-academie.fr/article/A9V0851 |
| AF_DICT_SOIXANTE | soixante (Dict. Académie 9e) | https://www.dictionnaire-academie.fr/article/A9S1954 |
| AF_DICT_SOIXANTE_DIX | soixante-dix (Dict. Académie 9e) | https://www.dictionnaire-academie.fr/article/A9S1955 |
| AF_DICT_CENT | cent (Dict. Académie 9e) | https://www.dictionnaire-academie.fr/article/A9C1297 |
| AF_DICT_MILLE | mille (Dict. Académie 9e) | https://www.dictionnaire-academie.fr/article/A9M2155 |
| AF_DICT_SEPTANTE | septante (Dict. Académie 9e) | https://www.dictionnaire-academie.fr/article/A9S1279 |
| AF_DICT_HUITANTE | huitante (Dict. Académie 9e) | https://www.dictionnaire-academie.fr/article/A9H1077 |
| AF_DICT_OCTANTE | octante (Dict. Académie 9e) | https://www.dictionnaire-academie.fr/article/A9O0163 |
| RENOUVO_REGLES | Règles de la nouvelle orthographe (RENOUVO) | https://www.renouvo.org/regles.php |
| ORTHOREC_REGLE1 | Règle 1, numéraux composés (orthographe-recommandee.info) | https://www.orthographe-recommandee.info/regles1.htm |
| CCDMD_NUMERAUX | Numéraux, liste (CCDMD) | https://ro.ccdmd.qc.ca/regles/soudure-traitdunion/numeraux/liste |
| ROBERT_NOMBRES_TU | Nombres et trait d'union (Le Robert) | https://dictionnaire.lerobert.com/guide/nombres-et-trait-d-union |
| LAROUSSE_CENT | cent (Larousse) | https://www.larousse.fr/dictionnaires/francais/cent/14089 |
| LAROUSSE_MILLE | mille (Larousse) | https://www.larousse.fr/dictionnaires/francais/mille/51453 |
| TLFI_TROIS | trois (TLFi) | https://www.cnrtl.fr/definition/trois |
| TLFI_QUATRE | quatre (TLFi) | https://www.cnrtl.fr/definition/quatre |
| TLFI_CINQ | cinq (TLFi) | https://www.cnrtl.fr/definition/cinq |
| TLFI_SIX | six (TLFi) | https://www.cnrtl.fr/definition/six |
| TLFI_HUIT | huit (TLFi) | https://www.cnrtl.fr/definition/huit |
| TLFI_DIX | dix (TLFi) | https://www.cnrtl.fr/definition/dix |
| TLFI_VINGT | vingt (TLFi) | https://www.cnrtl.fr/definition/vingt |
| TLFI_CENT | cent (TLFi) | https://www.cnrtl.fr/definition/cent |
| OQLF_RECTIF_NUMERAUX | Rectifications liées aux numéraux composés | https://vitrinelinguistique.oqlf.gouv.qc.ca/23163/lorthographe/rectifications-de-lorthographe/rectifications-liees-au-trait-dunion-et-soudure/rectifications-liees-aux-numeraux-composes |
| OQLF_DET_NUM_TU | Déterminants numéraux : trait d'union et pluriel | https://vitrinelinguistique.oqlf.gouv.qc.ca/index.php?id=23494 |
| OQLF_PLURIEL_VCM | Pluriel de vingt, de cent et de mille | https://vitrinelinguistique.oqlf.gouv.qc.ca/21532/la-grammaire/les-determinants/determinants-numeraux/pluriel-de-vingt-de-cent-et-de-mille |
| OQLF_DET_NUM_UN | Déterminant numéral se terminant par un | https://vitrinelinguistique.oqlf.gouv.qc.ca/25228/la-grammaire/les-determinants/determinants-numeraux/determinant-numeral-se-terminant-par-un |
| OQLF_PRON_ET | Prononciation de et dans les nombres composés | https://vitrinelinguistique.oqlf.gouv.qc.ca/24631/la-prononciation/prononciation-des-nombres/prononciation-de-et-dans-les-nombres-composes |
| OQLF_PRON_UN | Prononciation de un | https://vitrinelinguistique.oqlf.gouv.qc.ca/23131/la-prononciation/prononciation-des-nombres/prononciation-de-un |
| OQLF_PRON_DEUX_TROIS | Prononciation de deux et trois | https://vitrinelinguistique.oqlf.gouv.qc.ca/23134/la-prononciation/prononciation-des-nombres/prononciation-de-deux-et-trois |
| OQLF_PRON_CINQ | Prononciation de cinq | https://vitrinelinguistique.oqlf.gouv.qc.ca/23135/la-prononciation/prononciation-des-nombres/prononciation-de-cinq |
| OQLF_PRON_SIX_DIX | Prononciation de six et dix | https://vitrinelinguistique.oqlf.gouv.qc.ca/23137/la-prononciation/prononciation-des-nombres/prononciation-de-six-et-dix |
| OQLF_PRON_SEPT_NEUF | Prononciation de sept et neuf | https://vitrinelinguistique.oqlf.gouv.qc.ca/23136/la-prononciation/prononciation-des-nombres/prononciation-de-sept-et-neuf |
| OQLF_PRON_HUIT | Prononciation de huit | https://vitrinelinguistique.oqlf.gouv.qc.ca/23149/la-prononciation/prononciation-des-nombres/prononciation-de-huit |
| OQLF_PRON_ONZE | Prononciation de onze et de onzième | https://vitrinelinguistique.oqlf.gouv.qc.ca/23140/la-prononciation/prononciation-des-nombres/prononciation-de-onze-et-de-onzieme |
| OQLF_PRON_VINGT | Prononciation de vingt | https://vitrinelinguistique.oqlf.gouv.qc.ca/23141/la-prononciation/prononciation-des-nombres/prononciation-de-vingt |
| OQLF_PRON_1100_1999 | Prononciation des nombres compris entre 1100 et 1999 | https://vitrinelinguistique.oqlf.gouv.qc.ca/23142/la-prononciation/prononciation-des-nombres/prononciation-des-nombres-compris-entre-1100-et-1999 |
| OQLF_LIAISONS_INTERDITES | Contextes de liaisons interdites | https://vitrinelinguistique.oqlf.gouv.qc.ca/index.php?id=23552 |
| WIKT_BASE | Wiktionnaire base-word pages (see P13 table) | https://fr.wiktionary.org/wiki/ |
| WIKT_ANNEXE_Q | Annexe : Prononciation du Q en français | https://fr.wiktionary.org/wiki/Annexe:Prononciation_du_Q_en_fran%C3%A7ais |
| WIKT_ANNEXE_1990 | Annexe : Rectifications orthographiques du français en 1990 | https://fr.wiktionary.org/wiki/Annexe:Rectifications_orthographiques_du_fran%C3%A7ais_en_1990 |
| WP_NOMBRES_FR | Nombres en français (Wikipédia) | https://fr.wikipedia.org/wiki/Nombres_en_fran%C3%A7ais |
| WP_E_CADUC | E caduc (Wikipédia) | https://fr.wikipedia.org/wiki/E_caduc |
| AVANZI_80 | Comment dit-on 80 en Belgique et en Suisse ? (Français de nos régions) | https://francaisdenosregions.com/2017/03/26/comment-dit-on-80-en-belgique-et-en-suisse/ |
| AVANZI_UN_BRUN | Ces mots qui ne se prononcent pas de la même façon… (Français de nos régions) | https://francaisdenosregions.com/2017/07/06/ces-mots-qui-ne-se-prononcent-pas-de-la-meme-facon-dun-bout-a-lautre-de-la-france/ |
| ANTIDOTE_MILLE | Mille-et-une questions sur « mille » (Antidote) | https://www.antidote.info/fr/blogue/enquetes/milleetune-questions-sur-mille |
| VOLTAIRE_MILLE | « mille » ou « milles » ? (Projet Voltaire) | https://www.projet-voltaire.fr/regles-orthographe/mille-ou-milles/ |
| MYF_CENT | Numbers with cent (Master Your French, FLE) | https://www.masteryourfrench.com/how-to-pronounce/numbers-with-cent/ |
| FRENCHPLANATIONS_NUM | Counting in French (Frenchplanations, FLE) | https://frenchplanations.com/counting-numbers-in-french/ |
| TW_NAUTILUS_NOMBRES | 【法文數字 1-100】邏輯解釋 (法語鸚鵡螺 French Nautilus, Taiwan) | https://french-nautilus.com/blog/vocabulaire/chiffre-2/ |
| TW_SCEDU_NOMBRES | 法文數字好複雜！(尚進, Taiwan) | https://scedu.com.tw/blog-detail.php?id=307 |
| TW_ABC_NOMBRES | 法文數字表 1-100 (abconline.com.tw, Taiwan; checked, no pronunciation rules) | https://www.abconline.com.tw/blog/french/numbers |

Individual Wiktionnaire compound pages are cited inline in the sections above (URL pattern
`https://fr.wiktionary.org/wiki/<entry>`).
