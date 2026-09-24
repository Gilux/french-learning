// App shell: one-row header (section switch + Learn/Quiz), section sheet, lazy views.
(function () {
  const bi = (zh, en) => I18n.renderBilingual({ zh, en });
  const letters = window.LETTERS_DATA;

  function initLettersLearn(view) {
    const keyboardContainer = view.querySelector('.keyboard-dock');
    const panelContainer = view.querySelector('.panel-area');
    Keyboard.render(keyboardContainer, letters);
    Keyboard.onKeyPress(keyboardContainer, (letterId) => {
      Keyboard.setSelected(keyboardContainer, letterId);
      Panel.render(panelContainer, letters.find((l) => l.id === letterId));
      if (panelContainer.getBoundingClientRect().top < 0) panelContainer.scrollIntoView({ block: 'start' });
    });
    Panel.onPlay(panelContainer, (text, opts) => Tts.speakText(text, opts));
  }

  // One entry per section; a new section is one more entry plus its two views in index.html.
  const SECTIONS = [
    {
      id: 'letters',
      glyph: 'é',
      label: { zh: '字母', en: 'Letters' },
      init: {
        learn: initLettersLearn,
        quiz: (view) => GameUI.init(view.querySelector('.game-root'), letters),
      },
    },
    {
      id: 'numbers',
      glyph: '97',
      label: { zh: '數字', en: 'Numbers' },
      init: {
        learn: (view) => NumbersUI.initLearn(view.querySelector('.num-root')),
        quiz: (view) => NumbersUI.initQuiz(view.querySelector('.num-root')),
      },
    },
  ];

  const switchBtn = document.getElementById('section-switch');
  const glyphEl = document.getElementById('section-glyph');
  const nameEl = document.getElementById('section-name');
  const modeBtns = document.querySelectorAll('#mode-switch [data-mode]');
  const sheet = document.getElementById('section-sheet');
  // While the sheet is open the page behind it is inert, so Tab stays inside the sheet.
  const behindSheet = [document.querySelector('.app-header'), document.querySelector('main')];
  const sheetList = sheet.querySelector('.sheet-list');
  const started = new Set();
  const state = { section: 'letters', mode: 'learn' };

  sheetList.innerHTML = SECTIONS.map(
    (s) =>
      `<li><button type="button" class="sheet-item" data-section="${s.id}">` +
      `<span class="glyph" lang="fr">${s.glyph}</span><span class="sheet-item-name">${bi(s.label.zh, s.label.en)}</span>` +
      `<svg class="check" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>` +
      `</button></li>`
  ).join('');

  function show(sectionId, mode) {
    const section = SECTIONS.find((s) => s.id === sectionId);
    state.section = sectionId;
    state.mode = mode;
    const key = `${sectionId}-${mode}`;
    document.querySelectorAll('[data-view]').forEach((v) => v.classList.toggle('active', v.getAttribute('data-view') === key));
    if (!started.has(key)) {
      started.add(key);
      section.init[mode](document.querySelector(`[data-view="${key}"]`));
    }
    glyphEl.textContent = section.glyph;
    nameEl.innerHTML = bi(section.label.zh, section.label.en);
    modeBtns.forEach((b) => {
      const on = b.getAttribute('data-mode') === mode;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    sheetList.querySelectorAll('[data-section]').forEach((b) => {
      const on = b.getAttribute('data-section') === sectionId;
      b.classList.toggle('active', on);
      if (on) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });
  }

  function openSheet() {
    behindSheet.forEach((el) => (el.inert = true));
    sheet.hidden = false;
    switchBtn.setAttribute('aria-expanded', 'true');
    sheetList.querySelector('.active').focus();
  }

  function closeSheet() {
    behindSheet.forEach((el) => (el.inert = false));
    sheet.hidden = true;
    switchBtn.setAttribute('aria-expanded', 'false');
    switchBtn.focus();
  }

  switchBtn.addEventListener('click', openSheet);
  sheet.addEventListener('click', (event) => {
    const item = event.target.closest('[data-section]');
    if (item) show(item.getAttribute('data-section'), state.mode);
    if (item || event.target.closest('[data-close]')) closeSheet();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !sheet.hidden) closeSheet();
  });
  modeBtns.forEach((b) => b.addEventListener('click', () => show(state.section, b.getAttribute('data-mode'))));

  show(state.section, state.mode);
})();
