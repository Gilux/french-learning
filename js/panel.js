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

  const SPEAKER_ICON =
    '<svg class="say-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path d="M3.5 9.25v5.5h3.75L12 19V5L7.25 9.25z" fill="currentColor"/>' +
    '<path d="M15.5 8.75a4.6 4.6 0 0 1 0 6.5M18.25 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
    '</svg>';

  // Full sentences are spoken a bit slower than single words so learners can follow.
  const SENTENCE_RATE = 0.8;

  // A tappable French word/phrase: the whole pill speaks, not just an icon.
  function sayBtn(label, speakText, extraClass, rate) {
    const cls = extraClass ? ` ${extraClass}` : '';
    const rateAttr = rate ? ` data-speak-rate="${rate}"` : '';
    return (
      `<button type="button" class="say${cls}" data-speak="${speakText}"${rateAttr}>` +
      `<span class="sr-only">播放 </span><span class="say-text" lang="fr">${label}</span>${SPEAKER_ICON}` +
      `</button>`
    );
  }

  function render(container, letterUnit) {
    if (!letterUnit) {
      container.innerHTML = '';
      return;
    }
    const zhuyin = letterUnit.zhuyin;
    const zhuyinKey = zhuyin.hasEquivalent
      ? `<span class="zhuyin-key" lang="zh-Hant">${zhuyin.symbol}</span>`
      : `<span class="zhuyin-key is-none" aria-hidden="true"></span>`;
    const zhuyinNone = zhuyin.hasEquivalent
      ? ''
      : `<p class="zhuyin-none">${bilingual({ en: 'No close equivalent', zh: '沒有接近的音' })}</p>`;

    const articulationHtml = [
      [{ en: 'Tongue', zh: '舌位' }, letterUnit.articulation.tongue],
      [{ en: 'Lips', zh: '嘴唇' }, letterUnit.articulation.lips],
      [{ en: 'Airflow', zh: '氣流' }, letterUnit.articulation.airflow],
    ]
      .map(([label, text]) => `<div class="articulation-row"><dt>${bilingual(label)}</dt><dd>${bilingual(text)}</dd></div>`)
      .join('');

    const examplesHtml = letterUnit.examples.map((word) => sayBtn(word, word)).join('');

    const sentenceHtml = letterUnit.exampleSentence
      ? sayBtn(letterUnit.exampleSentence, letterUnit.exampleSentence, 'say-sentence', SENTENCE_RATE)
      : '';

    const ipaClass = letterUnit.ipa.length > 12 ? 'ipa ipa-long' : 'ipa';

    container.innerHTML = `
      <article class="panel">
        <header class="panel-head">
          <h2 class="plaque plaque-sm" lang="fr">${letterUnit.grapheme}</h2>
          <div class="panel-head-text">
            <p class="${ipaClass}">${letterUnit.ipa}</p>
            <p class="sound-label">${bilingual(letterUnit.soundLabel)}</p>
          </div>
        </header>
        <div class="letter-name">
          <p class="field-label">${bilingual({ en: 'Letter name', zh: '字母名稱' })}</p>
          ${sayBtn(letterUnit.letterName, letterUnit.letterNameTts, 'say-name')}
        </div>
        <dl class="articulation">${articulationHtml}</dl>
        <section class="zhuyin">
          ${zhuyinKey}
          <div class="zhuyin-text">
            <h3 class="field-label">${bilingual({ en: 'Zhuyin', zh: '注音' })}</h3>
            ${zhuyinNone}
            <p class="zhuyin-caveat">${bilingual(zhuyin.caveat)}</p>
          </div>
        </section>
        <section class="examples">
          <h3 class="field-label">${bilingual({ en: 'Examples', zh: '範例' })}</h3>
          <div class="say-list">${examplesHtml}</div>
          ${sentenceHtml}
        </section>
        <details class="sources">
          <summary>${bilingual({ en: 'Sources', zh: '資料來源' })}<span class="count">${letterUnit.sources.length}</span></summary>
          <ul>
            ${letterUnit.sources.map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.title}</a></li>`).join('')}
          </ul>
        </details>
      </article>
    `;
  }

  function onPlay(container, callback) {
    container.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-speak]');
      if (!btn) return;
      const rate = parseFloat(btn.getAttribute('data-speak-rate'));
      callback(btn.getAttribute('data-speak'), rate ? { rate } : undefined);
    });
  }

  return { render, onPlay };
});
