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

    let gameState = Game.createGameState(letters.map((l) => l.id));
    let reviewed = 0;
    let easyStreak = 0;
    let currentId = null;
    let currentLetter = null;

    rootEl.innerHTML = `
      <div class="game-screen">
        <p class="game-counter"></p>
        <div class="game-card"></div>
        <div class="game-reveal-area"></div>
      </div>
    `;

    const counterEl = rootEl.querySelector('.game-counter');
    const cardEl = rootEl.querySelector('.game-card');
    const revealAreaEl = rootEl.querySelector('.game-reveal-area');

    function findLetter(id) {
      return letters.find((l) => l.id === id);
    }

    function updateCounter() {
      counterEl.textContent = `Reviewed / 已複習: ${reviewed} — Easy streak / 連續簡單: ${easyStreak}`;
    }

    function drawCard() {
      const result = Game.drawNext(gameState);
      gameState = result.state;
      currentId = result.id;
      currentLetter = findLetter(currentId);
      cardEl.innerHTML = `<div class="flashcard">${currentLetter.grapheme}</div>`;
      revealAreaEl.innerHTML = `<button type="button" class="reveal-btn">Reveal / 顯示答案</button>`;
      revealAreaEl.querySelector('.reveal-btn').addEventListener('click', showAnswer);
    }

    function showAnswer() {
      revealAreaEl.innerHTML = `
        <div class="panel-container"></div>
        <div class="rating-buttons">
          <button type="button" data-rating="easy">Easy / 簡單</button>
          <button type="button" data-rating="hard">Hard / 困難</button>
          <button type="button" data-rating="missed">Missed / 沒答對</button>
        </div>
      `;
      const panelContainer = revealAreaEl.querySelector('.panel-container');
      Panel.render(panelContainer, currentLetter);
      Panel.onPlay(panelContainer, () => Tts.speak(currentLetter));

      revealAreaEl.querySelector('.rating-buttons').addEventListener('click', (event) => {
        const btn = event.target.closest('[data-rating]');
        if (!btn) return;
        const rating = btn.getAttribute('data-rating');
        gameState = Game.rateCard(gameState, currentId, rating);
        reviewed += 1;
        easyStreak = rating === 'easy' ? easyStreak + 1 : 0;
        updateCounter();
        drawCard();
      });
    }

    updateCounter();
    drawCard();
  }

  return { init };
});
