// Rule notes shown under a number, keyed by the ids Numbers.analyze() emits.
// Every rule cites keys from SOURCES (backed by docs/research/numbers-sources.md).
(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.NumberRules = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  const fr = (t) => `<span class="fr" lang="fr">${t}</span>`;
  const ipa = (t) => `<span class="ipa-inline">[${t}]</span>`;

  const SOURCES = {
    AF_QDL_NOMBRES: { title: 'Questions de langue : Nombres (Dictionnaire de l’Académie française)', url: 'https://www.dictionnaire-academie.fr/article/QDL057' },
    AF_QDL_RECTIF: { title: 'Questions de langue : Rectifications de l’orthographe (Académie française)', url: 'https://www.dictionnaire-academie.fr/article/QDL073' },
    AF_DICT_UN: { title: 'un, une (Dictionnaire de l’Académie française, 9e éd.)', url: 'https://www.dictionnaire-academie.fr/article/A9U0056' },
    AF_DICT_CINQ: { title: 'cinq (Dictionnaire de l’Académie française, 9e éd.)', url: 'https://www.dictionnaire-academie.fr/article/A9C2335' },
    AF_DICT_SIX: { title: 'six (Dictionnaire de l’Académie française, 9e éd.)', url: 'https://www.dictionnaire-academie.fr/article/A9S1804' },
    AF_DICT_SEPT: { title: 'sept (Dictionnaire de l’Académie française, 9e éd.)', url: 'https://www.dictionnaire-academie.fr/article/A9S1277' },
    AF_DICT_HUIT: { title: 'huit (Dictionnaire de l’Académie française, 9e éd.)', url: 'https://www.dictionnaire-academie.fr/article/A9H1074' },
    AF_DICT_DIX: { title: 'dix (Dictionnaire de l’Académie française, 9e éd.)', url: 'https://www.dictionnaire-academie.fr/article/A9D2877' },
    AF_DICT_DIX_SEPT: { title: 'dix-sept (Dictionnaire de l’Académie française, 9e éd.)', url: 'https://www.dictionnaire-academie.fr/article/A9D2887' },
    AF_DICT_DIX_HUIT: { title: 'dix-huit (Dictionnaire de l’Académie française, 9e éd.)', url: 'https://www.dictionnaire-academie.fr/article/A9D2879' },
    AF_DICT_DIX_NEUF: { title: 'dix-neuf (Dictionnaire de l’Académie française, 9e éd.)', url: 'https://www.dictionnaire-academie.fr/article/A9D2884' },
    AF_DICT_VINGT: { title: 'vingt (Dictionnaire de l’Académie française, 9e éd.)', url: 'https://www.dictionnaire-academie.fr/article/A9V0851' },
    AF_DICT_SOIXANTE: { title: 'soixante (Dictionnaire de l’Académie française, 9e éd.)', url: 'https://www.dictionnaire-academie.fr/article/A9S1954' },
    AF_DICT_SOIXANTE_DIX: { title: 'soixante-dix (Dictionnaire de l’Académie française, 9e éd.)', url: 'https://www.dictionnaire-academie.fr/article/A9S1955' },
    AF_DICT_CENT: { title: 'cent (Dictionnaire de l’Académie française, 9e éd.)', url: 'https://www.dictionnaire-academie.fr/article/A9C1297' },
    AF_DICT_MILLE: { title: 'mille (Dictionnaire de l’Académie française, 9e éd.)', url: 'https://www.dictionnaire-academie.fr/article/A9M2155' },
    AF_DICT_SEPTANTE: { title: 'septante (Dictionnaire de l’Académie française, 9e éd.)', url: 'https://www.dictionnaire-academie.fr/article/A9S1279' },
    AF_DICT_HUITANTE: { title: 'huitante (Dictionnaire de l’Académie française, 9e éd.)', url: 'https://www.dictionnaire-academie.fr/article/A9H1077' },
    ROBERT_NOMBRES_TU: { title: 'Nombres et trait d’union (Le Robert)', url: 'https://dictionnaire.lerobert.com/guide/nombres-et-trait-d-union' },
    LAROUSSE_MILLE: { title: 'mille (Larousse)', url: 'https://www.larousse.fr/dictionnaires/francais/mille/51453' },
    TLFI_QUATRE: { title: 'quatre (TLFi, CNRTL)', url: 'https://www.cnrtl.fr/definition/quatre' },
    TLFI_CINQ: { title: 'cinq (TLFi, CNRTL)', url: 'https://www.cnrtl.fr/definition/cinq' },
    TLFI_HUIT: { title: 'huit (TLFi, CNRTL)', url: 'https://www.cnrtl.fr/definition/huit' },
    TLFI_DIX: { title: 'dix (TLFi, CNRTL)', url: 'https://www.cnrtl.fr/definition/dix' },
    TLFI_VINGT: { title: 'vingt (TLFi, CNRTL)', url: 'https://www.cnrtl.fr/definition/vingt' },
    TLFI_CENT: { title: 'cent (TLFi, CNRTL)', url: 'https://www.cnrtl.fr/definition/cent' },
    OQLF_PLURIEL_VCM: { title: 'Pluriel de vingt, de cent et de mille (OQLF)', url: 'https://vitrinelinguistique.oqlf.gouv.qc.ca/21532/la-grammaire/les-determinants/determinants-numeraux/pluriel-de-vingt-de-cent-et-de-mille' },
    OQLF_DET_NUM_UN: { title: 'Déterminant numéral se terminant par un (OQLF)', url: 'https://vitrinelinguistique.oqlf.gouv.qc.ca/25228/la-grammaire/les-determinants/determinants-numeraux/determinant-numeral-se-terminant-par-un' },
    OQLF_PRON_ET: { title: 'Prononciation de et dans les nombres composés (OQLF)', url: 'https://vitrinelinguistique.oqlf.gouv.qc.ca/24631/la-prononciation/prononciation-des-nombres/prononciation-de-et-dans-les-nombres-composes' },
    OQLF_PRON_SIX_DIX: { title: 'Prononciation de six et dix (OQLF)', url: 'https://vitrinelinguistique.oqlf.gouv.qc.ca/23137/la-prononciation/prononciation-des-nombres/prononciation-de-six-et-dix' },
    OQLF_PRON_SEPT_NEUF: { title: 'Prononciation de sept et neuf (OQLF)', url: 'https://vitrinelinguistique.oqlf.gouv.qc.ca/23136/la-prononciation/prononciation-des-nombres/prononciation-de-sept-et-neuf' },
    OQLF_PRON_HUIT: { title: 'Prononciation de huit (OQLF)', url: 'https://vitrinelinguistique.oqlf.gouv.qc.ca/23149/la-prononciation/prononciation-des-nombres/prononciation-de-huit' },
    OQLF_PRON_ONZE: { title: 'Prononciation de onze et de onzième (OQLF)', url: 'https://vitrinelinguistique.oqlf.gouv.qc.ca/23140/la-prononciation/prononciation-des-nombres/prononciation-de-onze-et-de-onzieme' },
    OQLF_PRON_VINGT: { title: 'Prononciation de vingt (OQLF)', url: 'https://vitrinelinguistique.oqlf.gouv.qc.ca/23141/la-prononciation/prononciation-des-nombres/prononciation-de-vingt' },
    OQLF_PRON_1100_1999: { title: 'Prononciation des nombres compris entre 1100 et 1999 (OQLF)', url: 'https://vitrinelinguistique.oqlf.gouv.qc.ca/23142/la-prononciation/prononciation-des-nombres/prononciation-des-nombres-compris-entre-1100-et-1999' },
    OQLF_LIAISONS_INTERDITES: { title: 'Contextes de liaisons interdites (OQLF)', url: 'https://vitrinelinguistique.oqlf.gouv.qc.ca/index.php?id=23552' },
    WIKT_ANNEXE_Q: { title: 'Annexe : Prononciation du Q en français (Wiktionnaire)', url: 'https://fr.wiktionary.org/wiki/Annexe:Prononciation_du_Q_en_fran%C3%A7ais' },
    WIKT_MILLION: { title: 'million (Wiktionnaire)', url: 'https://fr.wiktionary.org/wiki/million' },
    WP_NOMBRES_FR: { title: 'Nombres en français (Wikipédia)', url: 'https://fr.wikipedia.org/wiki/Nombres_en_fran%C3%A7ais' },
    WP_E_CADUC: { title: 'E caduc (Wikipédia)', url: 'https://fr.wikipedia.org/wiki/E_caduc' },
    AVANZI_80: { title: 'Comment dit-on 80 en Belgique et en Suisse ? (Français de nos régions)', url: 'https://francaisdenosregions.com/2017/03/26/comment-dit-on-80-en-belgique-et-en-suisse/' },
    ANTIDOTE_MILLE: { title: 'Mille-et-une questions sur « mille » (Antidote)', url: 'https://www.antidote.info/fr/blogue/enquetes/milleetune-questions-sur-mille' },
    VOLTAIRE_MILLE: { title: '« mille » ou « milles » ? (Projet Voltaire)', url: 'https://www.projet-voltaire.fr/regles-orthographe/mille-ou-milles/' },
    FRENCHPLANATIONS_NUM: { title: 'Counting in French (Frenchplanations)', url: 'https://frenchplanations.com/counting-numbers-in-french/' },
    TW_NAUTILUS_NOMBRES: { title: '【法文數字 1-100】邏輯解釋（法語鸚鵡螺 French Nautilus）', url: 'https://french-nautilus.com/blog/vocabulaire/chiffre-2/' },
    TW_SCEDU_NOMBRES: { title: '法文數字好複雜！（尚進）', url: 'https://scedu.com.tw/blog-detail.php?id=307' },
  };

  const RULES = {
    et: {
      tag: 'spell',
      sources: ['OQLF_PRON_ET', 'WP_NOMBRES_FR', 'TW_NAUTILUS_NOMBRES'],
      text: (c) => ({
        zh: `21、31、41、51、61、71 要加 ${fr('et')}：${fr(c.words)}（81、91 不加）。`,
        en: `21, 31, 41, 51, 61 and 71 take ${fr('et')}: ${fr(c.words)} (81 and 91 don’t).`,
      }),
    },
    'no-et': {
      tag: 'spell',
      sources: ['OQLF_PRON_ET', 'ANTIDOTE_MILLE', 'TW_NAUTILUS_NOMBRES'],
      text: (c) => ({
        zh: `這裡不加 ${fr('et')}：${fr(c.words)}。只有 21、31 … 71 才加。`,
        en: `No ${fr('et')} here: ${fr(c.words)}. Only 21, 31 … 71 take it.`,
      }),
    },
    'vingts-plural': {
      tag: 'spell',
      sources: ['AF_QDL_NOMBRES', 'OQLF_PLURIEL_VCM', 'TLFI_VINGT'],
      text: () => ({
        zh: `80 寫成 ${fr('quatre-vingts')}：後面沒有別的數字時，vingt 要加 s。`,
        en: `80 is ${fr('quatre-vingts')}: vingt takes an s when nothing follows it.`,
      }),
    },
    'vingt-no-s': {
      tag: 'spell',
      sources: ['AF_QDL_NOMBRES', 'OQLF_PLURIEL_VCM', 'TLFI_VINGT'],
      text: (c) => ({
        zh: `後面還有數字時，${fr('quatre-vingt')} 不加 s：${fr(c.words)}。`,
        en: `With a number after it, ${fr('quatre-vingt')} drops the s: ${fr(c.words)}.`,
      }),
    },
    'cents-plural': {
      tag: 'spell',
      sources: ['AF_QDL_NOMBRES', 'OQLF_PLURIEL_VCM', 'AF_DICT_CENT'],
      text: (c) => ({
        zh: `${fr('cent')} 前面有倍數、後面沒有別的數字時要加 s：${fr(c.words)}。`,
        en: `${fr('cent')} takes an s when multiplied and nothing follows: ${fr(c.words)}.`,
      }),
    },
    'cent-no-s': {
      tag: 'spell',
      sources: ['AF_QDL_NOMBRES', 'OQLF_PLURIEL_VCM', 'AF_DICT_CENT'],
      text: (c) => ({
        zh: `後面還有數字時，${fr('cent')} 不加 s：${fr(c.words)}。`,
        en: `With a number after it, ${fr('cent')} has no s: ${fr(c.words)}.`,
      }),
    },
    'mille-invariable': {
      tag: 'spell',
      sources: ['AF_QDL_NOMBRES', 'AF_DICT_MILLE', 'VOLTAIRE_MILLE'],
      text: (c) => ({
        zh: `${fr('mille')} 永遠不加 s：${fr(c.words)}。`,
        en: `${fr('mille')} never takes an s: ${fr(c.words)}.`,
      }),
    },
    'mille-alone': {
      tag: 'spell',
      sources: ['LAROUSSE_MILLE', 'ANTIDOTE_MILLE', 'FRENCHPLANATIONS_NUM'],
      text: () => ({
        zh: `1000 就是 ${fr('mille')}，前面不加 ${fr('un')}。`,
        en: `1000 is just ${fr('mille')}, with no ${fr('un')} in front.`,
      }),
    },
    'million-noun': {
      tag: 'spell',
      sources: ['AF_QDL_RECTIF', 'ROBERT_NOMBRES_TU'],
      text: () => ({
        zh: `${fr('million')} 是名詞：寫成 ${fr('un million')}，中間用空格，不用連字號。`,
        en: `${fr('million')} is a noun: ${fr('un million')}, with a space, no hyphen.`,
      }),
    },
    'vingt-t': {
      tag: 'sound',
      sources: ['AF_DICT_VINGT', 'OQLF_PRON_VINGT', 'TW_SCEDU_NOMBRES'],
      text: (c) => ({
        zh: `21 到 29 裡，${fr('vingt')} 的 ${fr('t')} 要唸出來：${fr(c.words)} ${ipa(c.ipa)}。`,
        en: `In 21–29 the ${fr('t')} of ${fr('vingt')} is sounded: ${fr(c.words)} ${ipa(c.ipa)}.`,
      }),
    },
    'vingt-80s': {
      tag: 'sound',
      sources: ['OQLF_PRON_VINGT', 'TLFI_VINGT'],
      text: () => ({
        zh: `${fr('quatre-vingt')} 裡的 ${fr('vingt')} 一律唸 ${ipa('vɛ̃')}，${fr('gt')} 不發音。`,
        en: `Inside ${fr('quatre-vingt')}, ${fr('vingt')} is always ${ipa('vɛ̃')}: the ${fr('gt')} is silent.`,
      }),
    },
    'et-sound': {
      tag: 'sound',
      sources: ['OQLF_PRON_ET', 'TW_SCEDU_NOMBRES'],
      text: (c) => ({
        zh: `${fr('et')} 唸 ${ipa('e')}，它的 ${fr('t')} 永遠不發音；前一個字結尾的 ${fr('t')} 會連到 ${fr('et')} 上：${fr(c.words)} ${ipa(c.ipa)}。`,
        en: `${fr('et')} is ${ipa('e')} and its ${fr('t')} is never sounded; the ${fr('t')} before it runs into it: ${fr(c.words)} ${ipa(c.ipa)}.`,
      }),
    },
    'no-liaison': {
      tag: 'sound',
      sources: ['TLFI_CENT', 'OQLF_LIAISONS_INTERDITES', 'OQLF_PRON_HUIT', 'OQLF_PRON_ONZE'],
      text: (c) => ({
        zh: `${fr(c.words)} 不連音：${ipa(c.ipa)}，不是 ${ipa(c.wrong)}。${fr('cent')} 和 ${fr('quatre-vingt')} 的 ${fr('t')} 在 ${fr('un')}、${fr('huit')}、${fr('onze')} 前面都不發音。`,
        en: `No liaison in ${fr(c.words)}: ${ipa(c.ipa)}, not ${ipa(c.wrong)}. The ${fr('t')} of ${fr('cent')} and of ${fr('quatre-vingt')} stays silent before ${fr('un')}, ${fr('huit')} and ${fr('onze')}.`,
      }),
    },
    'x-end': {
      tag: 'sound',
      sources: ['AF_DICT_SIX', 'AF_DICT_DIX', 'OQLF_PRON_SIX_DIX'],
      text: (c) => ({
        zh: `${fr(c.words)} 在最後時，${fr('x')} 唸 ${ipa('s')}：${ipa(c.ipa)}。`,
        en: `At the end, the ${fr('x')} of ${fr(c.words)} sounds ${ipa('s')}: ${ipa(c.ipa)}.`,
      }),
    },
    'x-silent': {
      tag: 'sound',
      sources: ['AF_DICT_SIX', 'AF_DICT_DIX', 'OQLF_PRON_SIX_DIX', 'TW_SCEDU_NOMBRES'],
      text: (c) => ({
        zh: `後面接子音時 ${fr('x')} 不發音：${fr(c.words)} ${ipa(c.ipa)}。`,
        en: `Before a consonant the ${fr('x')} is silent: ${fr(c.words)} ${ipa(c.ipa)}.`,
      }),
    },
    'dix-huit': {
      tag: 'sound',
      sources: ['AF_DICT_DIX_HUIT', 'TLFI_HUIT'],
      text: () => ({
        zh: `${fr('dix-huit')} 的 ${fr('x')} 唸成 ${ipa('z')}，並和 ${fr('huit')} 連起來：${ipa('di.z‿ɥit')}。`,
        en: `In ${fr('dix-huit')} the ${fr('x')} becomes ${ipa('z')} and links: ${ipa('di.z‿ɥit')}.`,
      }),
    },
    'dix-neuf': {
      tag: 'sound',
      sources: ['AF_DICT_DIX_NEUF', 'TLFI_DIX'],
      text: () => ({
        zh: `${fr('dix-neuf')} 的 ${fr('x')} 唸成 ${ipa('z')}：${ipa('diz.nœf')}。`,
        en: `In ${fr('dix-neuf')} the ${fr('x')} sounds like ${ipa('z')}: ${ipa('diz.nœf')}.`,
      }),
    },
    'dix-sept': {
      tag: 'sound',
      sources: ['AF_DICT_DIX_SEPT', 'TLFI_DIX'],
      text: () => ({
        zh: `${fr('dix-sept')} 的 ${fr('x')} 和 ${fr('sept')} 的 ${fr('s')} 合成一個 ${ipa('s')}：${ipa('di.sɛt')}。`,
        en: `In ${fr('dix-sept')} the ${fr('x')} and the ${fr('s')} of ${fr('sept')} merge into one ${ipa('s')}: ${ipa('di.sɛt')}.`,
      }),
    },
    'cinq-q': {
      tag: 'sound',
      sources: ['AF_DICT_CINQ', 'TLFI_CINQ', 'WIKT_ANNEXE_Q', 'TW_SCEDU_NOMBRES'],
      text: (c) => ({
        zh: `${fr('cinq')} 後面接 ${fr('cent')}、${fr('mille')} 時，${fr('q')} 不發音：${fr(c.words)} ${ipa(c.ipa)}；單獨時唸 ${ipa('sɛ̃k')}。`,
        en: `Before ${fr('cent')} or ${fr('mille')} the ${fr('q')} of ${fr('cinq')} is silent: ${fr(c.words)} ${ipa(c.ipa)}; on its own it is ${ipa('sɛ̃k')}.`,
      }),
    },
    'quatre-e': {
      tag: 'sound',
      sources: ['TLFI_QUATRE', 'OQLF_PRON_1100_1999', 'WP_E_CADUC'],
      text: (c) => ({
        zh: `${fr('quatre')} 後面接 ${fr('vingt')}、${fr('cent')}、${fr('mille')} 時，結尾的 ${fr('e')} 要輕輕唸出來：${fr(c.words)} ${ipa(c.ipa)}；單獨時唸 ${ipa('katʁ')}。`,
        en: `Before ${fr('vingt')}, ${fr('cent')} or ${fr('mille')} the final ${fr('e')} of ${fr('quatre')} is heard: ${fr(c.words)} ${ipa(c.ipa)}; on its own it is ${ipa('katʁ')}.`,
      }),
    },
    'huit-silent': {
      tag: 'sound',
      sources: ['AF_DICT_HUIT', 'OQLF_PRON_HUIT'],
      text: (c) => ({
        zh: `${fr('huit')} 後面接子音時，${fr('t')} 不發音：${fr(c.words)} ${ipa(c.ipa)}。`,
        en: `Before a consonant the ${fr('t')} of ${fr('huit')} is silent: ${fr(c.words)} ${ipa(c.ipa)}.`,
      }),
    },
    'sept-p': {
      tag: 'sound',
      sources: ['AF_DICT_SEPT', 'OQLF_PRON_SEPT_NEUF'],
      text: () => ({
        zh: `${fr('sept')} 的 ${fr('p')} 永遠不發音：${ipa('sɛt')}。`,
        en: `The ${fr('p')} in ${fr('sept')} is never sounded: ${ipa('sɛt')}.`,
      }),
    },
    'soixante-x': {
      tag: 'sound',
      sources: ['AF_DICT_SOIXANTE', 'AF_DICT_SOIXANTE_DIX'],
      text: () => ({
        zh: `${fr('soixante')} 的 ${fr('x')} 唸 ${ipa('s')}：${ipa('swa.sɑ̃t')}。`,
        en: `The ${fr('x')} in ${fr('soixante')} sounds ${ipa('s')}: ${ipa('swa.sɑ̃t')}.`,
      }),
    },
    'mille-ll': {
      tag: 'sound',
      sources: ['AF_DICT_MILLE'],
      text: () => ({
        zh: `${fr('mille')} 的 ${fr('ll')} 唸 ${ipa('l')}，不像 ${fr('fille')} 唸 ${ipa('j')}。`,
        en: `The ${fr('ll')} in ${fr('mille')} is ${ipa('l')}, not ${ipa('j')} as in ${fr('fille')}.`,
      }),
    },
    'million-ll': {
      tag: 'sound',
      sources: ['WIKT_MILLION'],
      text: () => ({
        zh: `${fr('million')} 的 ${fr('ll')} 唸 ${ipa('lj')}：${ipa('mi.ljɔ̃')}。`,
        en: `The ${fr('ll')} in ${fr('million')} is ${ipa('lj')}: ${ipa('mi.ljɔ̃')}.`,
      }),
    },
    une: {
      tag: 'usage',
      sources: ['OQLF_DET_NUM_UN', 'AF_DICT_UN'],
      text: (c) => ({
        zh: `接陰性名詞時 ${fr('un')} 要變成 ${fr('une')}：${fr(c.example)}。`,
        en: `Before a feminine noun, ${fr('un')} becomes ${fr('une')}: ${fr(c.example)}.`,
      }),
    },
    'hundreds-oral': {
      tag: 'usage',
      sources: ['OQLF_PRON_1100_1999'],
      text: (c) => ({
        zh: `1100 到 1699 口語也常說成幾個「百」：${fr(c.oral)}。`,
        en: `From 1100 to 1699 you will also hear it said in hundreds: ${fr(c.oral)}.`,
      }),
    },
    'region-70': {
      tag: 'region',
      sources: ['AF_DICT_SEPTANTE', 'WP_NOMBRES_FR'],
      text: (c) => ({
        zh: `比利時、瑞士說 ${fr(c.local)}（法國說 ${fr(c.france)}）。`,
        en: `In Belgium and Switzerland: ${fr(c.local)} (France: ${fr(c.france)}).`,
      }),
    },
    'region-80': {
      tag: 'region',
      sources: ['AF_DICT_HUITANTE', 'AVANZI_80'],
      text: (c) => ({
        zh: `瑞士沃州、瓦萊州、弗里堡州說 ${fr(c.local)}；比利時和法國一樣說 ${fr(c.france)}。`,
        en: `The Swiss cantons of Vaud, Valais and Fribourg say ${fr(c.local)}; Belgium says ${fr(c.france)} like France.`,
      }),
    },
    'region-90': {
      tag: 'region',
      sources: ['AF_DICT_SEPTANTE', 'WP_NOMBRES_FR'],
      text: (c) => ({
        zh: `比利時、瑞士說 ${fr(c.local)}（法國說 ${fr(c.france)}）。`,
        en: `In Belgium and Switzerland: ${fr(c.local)} (France: ${fr(c.france)}).`,
      }),
    },
  };

  // Sources for a number: its rules' sources in order, then the Wiktionnaire page of each word.
  function sourcesFor(ruleIds, headwords) {
    const keys = [];
    ruleIds.forEach((id) => RULES[id].sources.forEach((k) => keys.includes(k) || keys.push(k)));
    const words = [];
    (headwords || []).forEach((w) => words.includes(w) || words.push(w));
    return keys
      .map((k) => SOURCES[k])
      .concat(words.map((w) => ({ title: `${w} (Wiktionnaire)`, url: `https://fr.wiktionary.org/wiki/${encodeURIComponent(w)}` })));
  }

  return { SOURCES, RULES, sourcesFor };
});
