(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.NumbersQuiz = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  const RANGES = [
    { id: '20', max: 20, label: '0–20' },
    { id: '100', max: 100, label: '0–100' },
    { id: '1000', max: 1000, label: '0–1000' },
    { id: '1M', max: 1000000, label: '0–1M' },
  ];
  const DEFAULT_RANGE = '100';

  // Digit-count buckets up to max; the top bucket absorbs max itself (0–9, 10–100 for max 100).
  function buckets(max) {
    const out = [];
    let lo = 0;
    let hi = 9;
    while (lo <= max) {
      out.push([lo, Math.min(hi, max)]);
      lo = hi + 1;
      hi = hi * 10 + 9;
    }
    const last = out[out.length - 1];
    if (out.length > 1 && last[0] === last[1]) {
      out.pop();
      out[out.length - 1][1] = max;
    }
    return out;
  }

  // Uniform bucket, then uniform number inside it; never repeats `previous`.
  function draw(max, previous, rng) {
    rng = rng || Math.random;
    const bs = buckets(max);
    for (let attempt = 0; attempt < 20; attempt++) {
      const [lo, hi] = bs[Math.floor(rng() * bs.length)];
      const n = lo + Math.floor(rng() * (hi - lo + 1));
      if (n !== previous) return n;
    }
    return previous === 0 ? 1 : 0;
  }

  function rangeById(id) {
    return RANGES.find((r) => r.id === id) || RANGES.find((r) => r.id === DEFAULT_RANGE);
  }

  return { RANGES, DEFAULT_RANGE, buckets, draw, rangeById };
});
