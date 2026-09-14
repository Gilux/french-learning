const { CATEGORY_COUNTS, getAllLetterIds } = require('../js/layout.js');
const letters = require('../data/letters.js');

const REQUIRED_FIELDS = ['id', 'grapheme', 'category', 'letterName', 'ipa', 'soundLabel', 'articulation', 'zhuyin', 'examples', 'ttsText', 'sources'];

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
