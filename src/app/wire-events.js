import { playNote, unlockAudio } from '../services/audio-service.js';

const PLAYABLE_SYMBOLS = new Set(['C', 'D', 'E', 'F', 'G', 'A', 'B', 'R']);

export function wireEvents(refs) {
  let previousValue = '';

  function setStatus(message) {
    refs.status.textContent = message;
  }

  async function startAudio() {
    const started = await unlockAudio();
    setStatus(started
      ? 'Audio is ready. Focus the input and write note letters with Plover.'
      : 'This browser does not support the Web Audio API.');
    refs.ploverInput.focus();
  }

  function playNewPloverOutput() {
    const currentValue = refs.ploverInput.value.toUpperCase();
    const newText = currentValue.slice(previousValue.length);
    previousValue = currentValue;

    for (const symbol of newText) {
      if (!PLAYABLE_SYMBOLS.has(symbol)) continue;

      if (symbol === 'R') {
        setStatus('Rest.');
        continue;
      }

      playNote(symbol);
      setStatus(`Played ${symbol}.`);
    }
  }

  refs.startAudioButton.addEventListener('click', startAudio);
  refs.ploverInput.addEventListener('input', playNewPloverOutput);
}
