(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.Tts = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  // Known good standard voices (Apple's Thomas/Audrey/Aurélie, Microsoft "Natural" voices).
  const PREFERRED_NAMES = ['thomas', 'audrey', 'aurélie', 'natural'];
  // Apple's Eloquence voices sound robotic; only use them as a last resort.
  const LOW_QUALITY_NAMES = ['eddy', 'flo', 'grandma', 'grandpa', 'reed', 'rocko', 'sandy', 'shelley'];

  function pickVoice(voices) {
    if (!voices || voices.length === 0) return null;
    const lang = (v) => (v.lang || '').toLowerCase().replace('_', '-');
    const name = (v) => (v.name || '').toLowerCase();
    // Prefer France French: the first "fr*" voice is often Canadian (e.g. Amélie fr-CA on Apple).
    const isFrance = (v) => lang(v) === 'fr-fr';
    const isFrench = (v) => lang(v).startsWith('fr');
    const isGoogle = (v) => name(v).includes('google');
    const isPreferred = (v) => PREFERRED_NAMES.some((n) => name(v).includes(n));
    const isLowQuality = (v) => LOW_QUALITY_NAMES.some((n) => name(v).startsWith(n));

    return (
      voices.find((v) => isFrance(v) && isGoogle(v)) ||
      voices.find((v) => isFrance(v) && isPreferred(v)) ||
      voices.find((v) => isFrance(v) && !isLowQuality(v)) ||
      voices.find(isFrance) ||
      voices.find((v) => isFrench(v) && isGoogle(v)) ||
      voices.find(isFrench) ||
      voices[0]
    );
  }

  function speakText(text, opts) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices();
    const voice = pickVoice(voices);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    if (voice) utterance.voice = voice;
    if (opts && opts.rate) utterance.rate = opts.rate;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  return { pickVoice, speakText };
});
