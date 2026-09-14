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

  function playBtn(text) {
    return `<button type="button" class="play-btn-sm" data-speak="${text}" title="Play">🔊</button>`;
  }

  function render(container, letterUnit) {
    if (!letterUnit) {
      container.innerHTML = '';
      return;
    }
    const zhuyinLine = letterUnit.zhuyin.hasEquivalent
      ? `<p><strong>Zhuyin / 注音:</strong> ${letterUnit.zhuyin.symbol}</p>`
      : `<p><strong>Zhuyin / 注音:</strong> <em>No close equivalent / 沒有接近的音</em></p>`;

    const examplesHtml = letterUnit.examples
      .map((word) => `<li>${word} ${playBtn(word)}</li>`)
      .join('');

    const sentenceHtml = letterUnit.exampleSentence
      ? `<p class="example-sentence">${letterUnit.exampleSentence} ${playBtn(letterUnit.exampleSentence)}</p>`
      : '';

    container.innerHTML = `
      <div class="panel">
        <h2>${letterUnit.grapheme} <span class="ipa">${letterUnit.ipa}</span></h2>
        <p class="letter-name">Letter name / 字母名稱: <strong>${letterUnit.letterName}</strong> ${playBtn(letterUnit.letterName)}</p>
        <p class="sound-label">${bilingual(letterUnit.soundLabel)}</p>
        <ul class="articulation">
          <li><strong>Tongue / 舌位:</strong> ${bilingual(letterUnit.articulation.tongue)}</li>
          <li><strong>Lips / 嘴唇:</strong> ${bilingual(letterUnit.articulation.lips)}</li>
          <li><strong>Airflow / 氣流:</strong> ${bilingual(letterUnit.articulation.airflow)}</li>
        </ul>
        ${zhuyinLine}
        <p class="zhuyin-caveat">${bilingual(letterUnit.zhuyin.caveat)}</p>
        <p><strong>Examples / 範例:</strong></p>
        <ul class="examples">${examplesHtml}</ul>
        ${sentenceHtml}
        <ul class="sources">
          ${letterUnit.sources.map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.title}</a></li>`).join('')}
        </ul>
      </div>
    `;
  }

  function onPlay(container, callback) {
    container.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-speak]');
      if (btn) callback(btn.getAttribute('data-speak'));
    });
  }

  return { render, onPlay };
});
