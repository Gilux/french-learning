(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.Keyboard = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  function findLetter(letters, id) {
    return letters.find((l) => l.id === id);
  }

  function renderKey(k, letters) {
    if (!k.letterId) {
      return `<span class="key key-inert">${k.char}</span>`;
    }
    const letter = findLetter(letters, k.letterId);
    const label = letter ? letter.grapheme : k.char;
    return `<button type="button" class="key" data-letter-id="${k.letterId}">${label}</button>`;
  }

  function renderRow(keys, letters, extraClass) {
    const cls = extraClass ? ` ${extraClass}` : '';
    return `<div class="kb-row${cls}">${keys.map((k) => renderKey(k, letters)).join('')}</div>`;
  }

  function render(container, letters) {
    const Layout = typeof window !== 'undefined' ? window.Layout : require('./layout.js');
    const html =
      renderRow(Layout.DIGIT_ROW, letters, 'kb-row-digits') +
      renderRow(Layout.ROW2, letters) +
      renderRow(Layout.ROW3, letters) +
      renderRow(Layout.ROW4, letters) +
      `<div class="kb-extra-note">Extra accents (need a dead-key combo on a real keyboard)<br>還需要複合鍵才能在真實鍵盤上打出的重音字母</div>` +
      renderRow(Layout.EXTRA_ACCENTS, letters, 'kb-row-extra');
    container.innerHTML = html;
  }

  function onKeyPress(container, callback) {
    container.addEventListener('click', (event) => {
      const key = event.target.closest('[data-letter-id]');
      if (key) callback(key.getAttribute('data-letter-id'));
    });
  }

  return { render, onKeyPress };
});
