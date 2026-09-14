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
      return `<span class="key key-inert" aria-hidden="true">${k.char}</span>`;
    }
    const letter = findLetter(letters, k.letterId);
    const label = letter ? letter.grapheme : k.char;
    const accentClass = letter && letter.category !== 'base' ? ' key-accent' : '';
    return `<button type="button" class="key${accentClass}" data-letter-id="${k.letterId}" aria-pressed="false" lang="fr">${label}</button>`;
  }

  function renderRow(keys, letters, extraClass, prefixHtml) {
    const cls = extraClass ? ` ${extraClass}` : '';
    return `<div class="kb-row${cls}">${prefixHtml || ''}${keys.map((k) => renderKey(k, letters)).join('')}</div>`;
  }

  function render(container, letters) {
    const Layout = typeof window !== 'undefined' ? window.Layout : require('./layout.js');
    const extraNote =
      `<p class="kb-extra-note" title="還需要複合鍵才能在真實鍵盤上打出的重音字母 / Extra accents need a dead-key combo on a real keyboard">` +
      `<span class="lang-zh" lang="zh-Hant">需複合鍵輸入</span><span class="lang-en" lang="en">Dead-key accents</span></p>`;
    const html =
      `<div class="kb">` +
      renderRow(Layout.DIGIT_ROW, letters, 'kb-row-digits') +
      renderRow(Layout.ROW2, letters, 'kb-row-top') +
      renderRow(Layout.ROW3, letters, 'kb-row-home') +
      renderRow(Layout.ROW4, letters, 'kb-row-bottom') +
      renderRow(Layout.EXTRA_ACCENTS, letters, 'kb-row-extra', extraNote) +
      `</div>`;
    container.innerHTML = html;
  }

  function onKeyPress(container, callback) {
    container.addEventListener('click', (event) => {
      const key = event.target.closest('[data-letter-id]');
      if (key) callback(key.getAttribute('data-letter-id'));
    });
  }

  function setSelected(container, letterId) {
    container.querySelectorAll('[data-letter-id]').forEach((el) => {
      el.setAttribute('aria-pressed', String(el.getAttribute('data-letter-id') === letterId));
    });
  }

  return { render, onKeyPress, setSelected };
});
