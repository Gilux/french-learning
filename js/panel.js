(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.Panel = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  function bilingual(text) {
    const I18n = typeof window !== 'undefined' ? window.I18n : require('./i18n.js');
    return I18n.renderBilingual(text);
  }

  function render(container, letterUnit) {
    if (!letterUnit) {
      container.innerHTML = '';
      return;
    }
    const zhuyinLine = letterUnit.zhuyin.hasEquivalent
      ? `<p><strong>Zhuyin / 注音:</strong> ${letterUnit.zhuyin.symbol}</p>`
      : `<p><strong>Zhuyin / 注音:</strong> <em>No close equivalent / 沒有接近的音</em></p>`;

    container.innerHTML = `
      <div class="panel">
        <h2>${letterUnit.grapheme} <span class="ipa">${letterUnit.ipa}</span></h2>
        <p class="sound-label">${bilingual(letterUnit.soundLabel)}</p>
        <ul class="articulation">
          <li><strong>Tongue / 舌位:</strong> ${bilingual(letterUnit.articulation.tongue)}</li>
          <li><strong>Lips / 嘴唇:</strong> ${bilingual(letterUnit.articulation.lips)}</li>
          <li><strong>Airflow / 氣流:</strong> ${bilingual(letterUnit.articulation.airflow)}</li>
        </ul>
        ${zhuyinLine}
        <p class="zhuyin-caveat">${bilingual(letterUnit.zhuyin.caveat)}</p>
        <p><strong>Examples / 範例:</strong> ${letterUnit.examples.join(', ')}</p>
        <button type="button" class="play-btn" data-action="play">🔊 Play / 播放</button>
        <ul class="sources">
          ${letterUnit.sources.map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.title}</a></li>`).join('')}
        </ul>
      </div>
    `;
  }

  function onPlay(container, callback) {
    container.addEventListener('click', (event) => {
      if (event.target.closest('[data-action="play"]')) callback();
    });
  }

  return { render, onPlay };
});
