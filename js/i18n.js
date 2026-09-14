(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.I18n = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  function renderBilingual(text, opts) {
    const tag = (opts && opts.tag) || 'span';
    const enClass = (opts && opts.enClass) || 'lang-en';
    const zhClass = (opts && opts.zhClass) || 'lang-zh';
    // Traditional Chinese is the primary line; English is the subtitle.
    return (
      `<${tag} class="${zhClass}" lang="zh-Hant">${text.zh}</${tag}>` +
      `<${tag} class="${enClass}" lang="en">${text.en}</${tag}>`
    );
  }

  return { renderBilingual };
});
