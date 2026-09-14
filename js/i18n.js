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
    return (
      `<${tag} class="${enClass}">${text.en}</${tag}>` +
      `<${tag} class="${zhClass}">${text.zh}</${tag}>`
    );
  }

  return { renderBilingual };
});
