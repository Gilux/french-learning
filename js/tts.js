(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.Tts = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  function pickVoice(voices) {
    if (!voices || voices.length === 0) return null;
    const isFrench = (v) => v.lang && v.lang.toLowerCase().startsWith('fr');
    const isGoogle = (v) => v.name && v.name.toLowerCase().includes('google');

    const googleFrench = voices.find((v) => isFrench(v) && isGoogle(v));
    if (googleFrench) return googleFrench;

    const anyFrench = voices.find(isFrench);
    if (anyFrench) return anyFrench;

    return voices[0];
  }

  function speakText(text) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices();
    const voice = pickVoice(voices);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    if (voice) utterance.voice = voice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  return { pickVoice, speakText };
});
