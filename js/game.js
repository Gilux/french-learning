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
