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
