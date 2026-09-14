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
    const I18n = typeof window !== 'undefined' ? window.I18n : require('./i18n.js');

    // The game drills the 26 base letters only; accented letters stay in keyboard mode.
    const gameIds = letters.filter((l) => l.category === 'base').map((l) => l.id);
    let gameState = Game.createGameState(gameIds);
    let reviewed = 0;
    let easyStreak = 0;
    let currentId = null;
    let currentLetter = null;

    rootEl.innerHTML = `
      <div class="game-screen">
        <div class="game-stats">
          <p class="stat"><span class="stat-num" data-stat="reviewed">0</span><span>${I18n.renderBilingual({ en: 'Reviewed', zh: '已複習' })}</span></p>
          <p class="stat"><span class="stat-num" data-stat="streak">0</span><span>${I18n.renderBilingual({ en: 'Easy streak', zh: '連續簡單' })}</span></p>
        </div>
        <div class="game-card"></div>
        <div class="game-reveal-area"></div>
      </div>
    `;

    const screenEl = rootEl.querySelector('.game-screen');
    const reviewedEl = rootEl.querySelector('[data-stat="reviewed"]');
    const streakEl = rootEl.querySelector('[data-stat="streak"]');
    const cardEl = rootEl.querySelector('.game-card');
    const revealAreaEl = rootEl.querySelector('.game-reveal-area');

    function findLetter(id) {
      return letters.find((l) => l.id === id);
    }

    function updateCounter() {
      reviewedEl.textContent = reviewed;
      streakEl.textContent = easyStreak;
    }

    function drawCard() {
      const result = Game.drawNext(gameState);
      gameState = result.state;
      currentId = result.id;
      currentLetter = findLetter(currentId);
      screenEl.classList.remove('is-revealed');
      cardEl.innerHTML = `<div class="plaque plaque-lg" lang="fr">${currentLetter.grapheme}</div>`;
      revealAreaEl.innerHTML = `
        <p class="game-prompt">${I18n.renderBilingual({ en: 'Say it out loud, then check the answer.', zh: '先大聲唸出來，再看答案。' })}</p>
        <div class="action-bar">
          <button type="button" class="btn btn-primary reveal-btn">${I18n.renderBilingual({ en: 'Reveal answer', zh: '顯示答案' })}</button>
        </div>
      `;
      revealAreaEl.querySelector('.reveal-btn').addEventListener('click', showAnswer);
    }

    function showAnswer() {
      screenEl.classList.add('is-revealed');
      revealAreaEl.innerHTML = `
        <div class="panel-container"></div>
        <div class="action-bar">
          <div class="rating-buttons">
            <button type="button" class="btn" data-rating="easy">${I18n.renderBilingual({ en: 'Easy', zh: '簡單' })}</button>
            <button type="button" class="btn" data-rating="hard">${I18n.renderBilingual({ en: 'Hard', zh: '困難' })}</button>
            <button type="button" class="btn" data-rating="missed">${I18n.renderBilingual({ en: 'Missed', zh: '沒答對' })}</button>
          </div>
        </div>
      `;
      const panelContainer = revealAreaEl.querySelector('.panel-container');
      Panel.render(panelContainer, currentLetter);
      Panel.onPlay(panelContainer, (text, opts) => Tts.speakText(text, opts));

      revealAreaEl.querySelector('.rating-buttons').addEventListener('click', (event) => {
        const btn = event.target.closest('[data-rating]');
        if (!btn) return;
        const rating = btn.getAttribute('data-rating');
        gameState = Game.rateCard(gameState, currentId, rating);
        reviewed += 1;
        easyStreak = rating === 'easy' ? easyStreak + 1 : 0;
        updateCounter();
        drawCard();
        if (rootEl.getBoundingClientRect().top < 0) rootEl.scrollIntoView({ block: 'start' });
      });
    }

    updateCounter();
    drawCard();
  }

  return { init };
});
