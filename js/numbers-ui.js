(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.NumbersUI = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  const g = typeof window !== 'undefined' ? window : globalThis;
  const bi = (zh, en) => g.I18n.renderBilingual({ zh, en });

  const SPEAKER =
    '<svg class="say-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path d="M3.5 9.25v5.5h3.75L12 19V5L7.25 9.25z" fill="currentColor"/>' +
    '<path d="M15.5 8.75a4.6 4.6 0 0 1 0 6.5M18.25 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
    '</svg>';
  const DICE =
    '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<rect x="3.5" y="3.5" width="17" height="17" rx="4" fill="none" stroke="currentColor" stroke-width="2"/>' +
    '<circle cx="8.6" cy="8.6" r="1.5" fill="currentColor"/><circle cx="15.4" cy="8.6" r="1.5" fill="currentColor"/>' +
    '<circle cx="12" cy="12" r="1.5" fill="currentColor"/>' +
    '<circle cx="8.6" cy="15.4" r="1.5" fill="currentColor"/><circle cx="15.4" cy="15.4" r="1.5" fill="currentColor"/>' +
    '</svg>';
  const CHECK =
    '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const CROSS =
    '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>';
  const ARROW =
    '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const CHEV_DOWN =
    '<svg class="chev" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path d="M6 9.5l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const LINK_ARC =
    '<svg viewBox="0 0 24 12" aria-hidden="true" focusable="false">' +
    '<path d="M3 3c3.5 7.5 14.5 7.5 18 0" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
  const NO_LINK =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2.2"/>' +
    '<path d="M6.6 17.4L17.4 6.6" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>';

  const TRAPS = [17, 71, 80, 81, 91, 99, 200, 201, 1000, 80000];
  const TAGS = {
    spell: ['tag-spell', '拼寫', 'Spelling'],
    sound: ['tag-sound', '發音', 'Sound'],
    usage: ['tag-usage', '用法', 'Usage'],
    region: ['tag-region', '地區', 'Region'],
  };

  // Playback speed is shared by every numbers screen for the session.
  let speed = 1;

  function say(text) {
    g.Tts.speakText(text, { rate: speed });
  }

  function speedControl() {
    const btn = (v) => `<button type="button" data-speed="${v}" aria-pressed="false">${v}×</button>`;
    return (
      `<div class="speed" role="group" aria-label="播放速度 Playback speed">` +
      `<span class="ctl-label">${bi('速度', 'Speed')}</span>` +
      `<div class="speed-seg">${[0.5, 0.75, 1].map(btn).join('')}</div></div>`
    );
  }

  function syncSpeed() {
    document.querySelectorAll('[data-speed]').forEach((b) => {
      const on = Number(b.getAttribute('data-speed')) === speed;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
  }

  function sayPill(words, speak, extraClass) {
    const cls = extraClass ? ` ${extraClass}` : '';
    return (
      `<button type="button" class="say${cls}" data-say="${speak}">` +
      `<span class="sr-only">播放 </span><span class="say-text" lang="fr">${words}</span>${SPEAKER}</button>`
    );
  }

  // ---------- detail panel ----------
  function tileHtml(tile) {
    const letters = tile.segments
      .map((s) => (s.mark ? `<span class="${s.mark}">${s.text}</span>` : s.text))
      .join('');
    return `<span class="word"><span class="word-fr" lang="fr">${letters}</span><span class="word-ipa">${tile.ipa}</span></span>`;
  }

  function jointHtml(kind) {
    if (kind === 'link') return `<span class="joint joint-link" title="連音 linked">-${LINK_ARC}</span>`;
    if (kind === 'nolink') return `<span class="joint joint-nolink" title="不連音 no liaison">-${NO_LINK}</span>`;
    if (kind === 'space') return `<span class="joint joint-space" aria-hidden="true"></span>`;
    return `<span class="joint" aria-hidden="true">-</span>`;
  }

  function legendHtml(kinds) {
    const items = {
      mute: `<span class="legend-item"><span class="legend-swatch mute" lang="fr">gt</span>${bi('不發音', 'silent')}</span>`,
      sound: `<span class="legend-item"><span class="legend-swatch sound" lang="fr">x</span>${bi('注意這個音', 'watch this sound')}</span>`,
      link: `<span class="legend-item joint-link">${LINK_ARC}<span class="legend-label">${bi('連音', 'linked')}</span></span>`,
      nolink: `<span class="legend-item joint-nolink">${NO_LINK}<span class="legend-label">${bi('不連音', 'no liaison')}</span></span>`,
    };
    return kinds.length ? `<p class="legend">${kinds.map((k) => items[k]).join('')}</p>` : '';
  }

  function structureHtml(a) {
    if (!a.structure) return '';
    const part = (p) => `<span class="eq-part"><b>${p.n}</b><small lang="fr">${p.words}</small></span>`;
    let html = `<span class="eq-group"><span class="eq-total">${a.digits}</span><span class="eq-op">=</span>${part(a.structure[0])}</span>`;
    for (let i = 1; i < a.structure.length; i += 2) {
      html += `<span class="eq-group"><span class="eq-op">${a.structure[i]}</span>${part(a.structure[i + 1])}</span>`;
    }
    return `<section class="num-section"><h3 class="field-label">${bi('結構', 'Structure')}</h3><div class="structure">${html}</div></section>`;
  }

  function rulesHtml(a) {
    if (!a.rules.length) return '';
    const items = a.rules
      .map(({ id, ctx }) => {
        const rule = g.NumberRules.RULES[id];
        const [cls, zh, en] = TAGS[rule.tag];
        const text = rule.text(ctx);
        return `<li class="rule"><span class="rule-tag ${cls}">${bi(zh, en)}</span><div class="rule-text">${bi(text.zh, text.en)}</div></li>`;
      })
      .join('');
    return `<section class="num-section"><h3 class="field-label">${bi('這個數字的規則', 'Rules for this number')}</h3><ul class="rules">${items}</ul></section>`;
  }

  function sourcesHtml(a) {
    const sources = g.NumberRules.sourcesFor(
      a.rules.map((r) => r.id),
      a.tiles.map((t) => t.headword)
    );
    const links = sources
      .map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.title}</a></li>`)
      .join('');
    return (
      `<details class="sources"><summary>${bi('資料來源', 'Sources')}<span class="count">${sources.length}</span></summary>` +
      `<ul>${links}</ul></details>`
    );
  }

  function renderDetail(a) {
    const halves = a.halves
      ? `<div class="halves"><p class="halves-label">${bi('分段聽', 'Listen in parts')}</p>` +
        `<div class="say-list">${a.halves.map((h) => sayPill(h.words, h.speak)).join('')}</div></div>`
      : '';
    const tiles = a.tiles.map((t, i) => (i === 0 ? '' : jointHtml(a.joints[i - 1])) + tileHtml(t)).join('');
    return `<article class="panel num-panel">
      <div class="say-head"><h3 class="field-label">${bi('唸法', 'Say it')}</h3>${speedControl()}</div>
      ${sayPill(a.words, a.speak, 'say-number')}
      ${halves}
      <p class="ipa ipa-num">${a.ipa}</p>
      ${structureHtml(a)}
      <section class="num-section"><h3 class="field-label">${bi('逐字拆解', 'Word by word')}</h3><div class="words">${tiles}</div>${legendHtml(a.legend)}</section>
      ${rulesHtml(a)}
      ${sourcesHtml(a)}
    </article>`;
  }

  // Delegated handlers shared by both screens: say pills and speed buttons.
  function bindCommon(root) {
    root.addEventListener('click', (event) => {
      const sayBtn = event.target.closest('[data-say]');
      if (sayBtn) say(sayBtn.getAttribute('data-say'));
      const speedBtn = event.target.closest('[data-speed]');
      if (speedBtn) {
        speed = Number(speedBtn.getAttribute('data-speed'));
        syncSpeed();
      }
    });
  }

  // Long numbers shrink so "1 000 000" still fits the plaque.
  function plaqueFit(el, text) {
    el.classList.toggle('is-long', text.length >= 7);
    el.classList.toggle('is-longer', text.length >= 9);
  }

  // ---------- learn ----------
  function emptyHtml() {
    const chips = TRAPS.map(
      (n) => `<button type="button" class="key tricky-key" data-value="${n}">${g.Numbers.formatDigits(n)}</button>`
    ).join('');
    return `<div class="panel panel-empty">
      <p class="empty-title">${bi('輸入一個數字，看看、聽聽它怎麼唸', 'Type a number to see and hear how it’s said')}</p>
      <div class="tricky">
        <h3 class="field-label">${bi('試試這些陷阱', 'Try the tricky ones')}</h3>
        <div class="tricky-list">${chips}</div>
      </div>
    </div>`;
  }

  function invalidHtml() {
    return `<div class="panel panel-empty"><p class="empty-title">${bi(
      '請輸入 0 到 1 000 000 之間的整數',
      'Enter a whole number from 0 to 1,000,000'
    )}</p></div>`;
  }

  function initLearn(root) {
    const MAX = g.Numbers.MAX;
    root.innerHTML = `<div class="num-screen">
      <div class="num-entry">
        <button type="button" class="key step-key" data-step="-1" aria-label="減一 Minus one">−</button>
        <label class="plaque plaque-input"><span class="sr-only">輸入數字 Type a number</span><input type="text" inputmode="numeric" autocomplete="off" enterkeyhint="done" placeholder="0 – 1${g.Numbers.NNBSP}000${g.Numbers.NNBSP}000"></label>
        <button type="button" class="key step-key" data-step="1" aria-label="加一 Plus one">+</button>
      </div>
      <div class="entry-tools">
        <button type="button" class="tool-btn" data-random>${DICE}${bi('隨機', 'Random')}</button>
        <p class="entry-hint">${bi(`0 到 1${g.Numbers.NNBSP}000${g.Numbers.NNBSP}000`, 'from 0 to 1,000,000')}</p>
      </div>
      <div class="num-output"></div>
    </div>`;
    const input = root.querySelector('.plaque-input input');
    const plaque = root.querySelector('.plaque-input');
    const output = root.querySelector('.num-output');

    function current() {
      return g.Numbers.parse(input.value);
    }

    function update() {
      const parsed = current();
      plaqueFit(plaque, input.value);
      if (parsed.status === 'empty') output.innerHTML = emptyHtml();
      else if (parsed.status === 'invalid') output.innerHTML = invalidHtml();
      else output.innerHTML = renderDetail(g.Numbers.analyze(parsed.value));
      syncSpeed();
    }

    function setValue(n) {
      input.value = g.Numbers.formatDigits(Math.min(MAX, Math.max(0, n)));
      update();
    }

    input.addEventListener('input', update);
    input.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;
      const parsed = current();
      if (parsed.status === 'ok') say(String(parsed.value));
    });
    root.addEventListener('click', (event) => {
      const step = event.target.closest('[data-step]');
      if (step) {
        const parsed = current();
        setValue(parsed.status === 'ok' ? parsed.value + Number(step.getAttribute('data-step')) : 0);
      }
      if (event.target.closest('[data-random]')) {
        const parsed = current();
        setValue(g.NumbersQuiz.draw(MAX, parsed.status === 'ok' ? parsed.value : null));
      }
      const chip = event.target.closest('[data-value]');
      if (chip) {
        setValue(Number(chip.getAttribute('data-value')));
        // The chip itself is re-rendered away; keep keyboard users on the input.
        if (event.detail === 0) input.focus();
      }
    });
    bindCommon(root);
    update();
  }

  // ---------- quiz ----------
  function rangeSelect(rangeId) {
    const options = g.NumbersQuiz.RANGES.map(
      (r) => `<option value="${r.id}"${r.id === rangeId ? ' selected' : ''}>${r.label}</option>`
    ).join('');
    return (
      `<label class="range-select"><span class="range-tag" lang="zh-Hant">範圍<span class="sr-only" lang="en"> Range</span></span>` +
      `<select data-range>${options}</select>${CHEV_DOWN}</label>`
    );
  }

  function structureLine(a) {
    return a.structure ? a.structure.map((p) => (typeof p === 'string' ? p : p.n)).join(' ') : '';
  }

  function verdictHtml(answer, typed) {
    if (typed === null) return '';
    if (typed === answer.n) {
      return `<div class="verdict verdict-right"><div class="verdict-head"><span class="verdict-badge">${CHECK}</span>` +
        `<p class="verdict-title" tabindex="-1">${bi('答對了！', 'Correct!')}</p></div></div>`;
    }
    const mine = g.Numbers.analyze(typed);
    const row = (a, cls, zh, en) =>
      `<div class="compare-row ${cls}"><span class="compare-n">${a.digits}</span>` +
      `<span><span class="compare-w" lang="fr">${a.words}</span><span class="compare-eq">${structureLine(a)}</span></span>` +
      `<span class="compare-tag">${bi(zh, en)}</span></div>`;
    return `<div class="verdict verdict-wrong">
      <div class="verdict-head"><span class="verdict-badge">${CROSS}</span><p class="verdict-title" tabindex="-1">${bi(
        `差一點！你寫的是 ${mine.digits}`,
        `Not quite — you typed ${mine.digits}`
      )}</p></div>
      <div class="compare">${row(mine, 'is-yours', '你寫的', 'yours')}${row(answer, 'is-answer', '答案', 'answer')}</div>
    </div>`;
  }

  function initQuiz(root) {
    let rangeId = g.NumbersQuiz.DEFAULT_RANGE;
    let current = null;

    function scrollTop() {
      if (root.getBoundingClientRect().top < 0) root.scrollIntoView({ block: 'start' });
    }

    // Every screen is rebuilt, so keyboard / screen-reader focus is put back explicitly.
    function ask(focusSelector) {
      current = g.NumbersQuiz.draw(g.NumbersQuiz.rangeById(rangeId).max, current);
      root.innerHTML = `<div class="game-screen num-quiz">
        <p class="game-prompt">${bi('聽一聽，寫下你聽到的數字。', 'Listen, then type the number you hear.')}</p>
        <div class="game-card"><button type="button" class="plaque plaque-lg plaque-num plaque-play" data-play aria-label="播放 Play">${SPEAKER.replace('say-icon', 'play-icon')}</button></div>
        <div class="game-reveal-area">
          <div class="quiz-settings">${speedControl()}${rangeSelect(rangeId)}</div>
          <label class="answer-field"><span class="sr-only">你聽到的數字 The number you heard</span><input type="text" inputmode="numeric" autocomplete="off" enterkeyhint="done" placeholder="你聽到的數字 · Number you heard"></label>
          <p class="answer-msg" role="status"></p>
          <div class="action-bar"><div class="listen-actions">
            <button type="button" class="btn btn-ghost" data-reveal>${bi('不知道', 'Show answer')}</button>
            <button type="button" class="btn btn-primary" data-check>${bi('檢查', 'Check')}</button>
          </div></div>
        </div>
      </div>`;
      syncSpeed();
      scrollTop();
      if (focusSelector) root.querySelector(focusSelector).focus();
    }

    function reveal(typed) {
      const answer = g.Numbers.analyze(current);
      root.innerHTML = `<div class="game-screen num-quiz is-revealed">
        <div class="game-card"><div class="plaque plaque-lg plaque-num" lang="fr" data-len="${answer.digits.length}">${answer.digits}</div></div>
        <div class="game-reveal-area">
          ${verdictHtml(answer, typed)}
          <div class="panel-container">${renderDetail(answer)}</div>
          <div class="action-bar">
            <button type="button" class="btn btn-primary" data-next><span class="btn-row"><span>${bi('下一個', 'Next')}</span>${ARROW}</span></button>
          </div>
        </div>
      </div>`;
      syncSpeed();
      scrollTop();
      root.querySelector('.verdict-title, .say-number').focus();
    }

    function check() {
      const input = root.querySelector('.answer-field input');
      const msg = root.querySelector('.answer-msg');
      const parsed = g.Numbers.parse(input.value);
      if (parsed.status === 'ok') {
        reveal(parsed.value);
        return;
      }
      msg.innerHTML =
        parsed.status === 'empty'
          ? bi('先輸入你聽到的數字', 'Type the number you heard first')
          : bi('請輸入 0 到 1 000 000 之間的整數', 'Enter a whole number from 0 to 1,000,000');
      input.focus();
    }

    root.addEventListener('click', (event) => {
      if (event.target.closest('[data-play]')) say(String(current));
      if (event.target.closest('[data-check]')) check();
      if (event.target.closest('[data-reveal]')) reveal(null);
      if (event.target.closest('[data-next]')) ask('[data-play]');
    });
    root.addEventListener('change', (event) => {
      if (!event.target.matches('[data-range]')) return;
      rangeId = event.target.value;
      ask('[data-range]');
    });
    root.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && event.target.matches('.answer-field input')) {
        event.preventDefault();
        check();
      }
    });
    bindCommon(root);
    ask();
  }

  return { initLearn, initQuiz, renderDetail };
});
