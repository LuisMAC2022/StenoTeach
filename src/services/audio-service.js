let audioCtx = null;
let masterGain = null;

const NOTE_FREQUENCIES = {
  C: 261.63,
  D: 293.66,
  E: 329.63,
  F: 349.23,
  G: 392.00,
  A: 440.00,
  B: 493.88
};

export function ensureAudioContext() {
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) return null;

  if (!audioCtx) {
    audioCtx = new AudioContextConstructor();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.18;
    masterGain.connect(audioCtx.destination);
  }

  return audioCtx;
}

export async function unlockAudio() {
  const ctx = ensureAudioContext();
  if (!ctx) return false;

  if (ctx.state === 'suspended') {
    await ctx.resume();
  }

  return ctx.state === 'running';
}

export function playNote(noteName) {
  const ctx = ensureAudioContext();
  const frequency = NOTE_FREQUENCIES[noteName];

  if (!ctx || !masterGain || ctx.state !== 'running' || !frequency) return;

  const now = ctx.currentTime;
  const oscillator = ctx.createOscillator();
  const noteGain = ctx.createGain();

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(frequency, now);

  noteGain.gain.setValueAtTime(0.0001, now);
  noteGain.gain.exponentialRampToValueAtTime(0.8, now + 0.02);
  noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);

  oscillator.connect(noteGain);
  noteGain.connect(masterGain);
  oscillator.start(now);
  oscillator.stop(now + 0.38);
}
