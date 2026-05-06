let audioCtx = null;
let audioUnlocked = false;

export function ensureAudioContext() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) audioCtx = new Ctx();
  return audioCtx;
}

export function unlockAudio() {
  const ctx = ensureAudioContext();
  if (!ctx || audioUnlocked) return;
  ctx.resume();
  audioUnlocked = true;
}

export function playTone(kind) {
  const ctx = ensureAudioContext();
  if (!ctx || ctx.state !== 'running') return;
  const now = ctx.currentTime; const osc = ctx.createOscillator(); const gain = ctx.createGain();
  osc.type = 'sine'; osc.frequency.setValueAtTime(kind === 'correct' ? 880 : 180, now);
  gain.gain.setValueAtTime(0.0001, now); gain.gain.exponentialRampToValueAtTime(0.18, now + 0.03); gain.gain.exponentialRampToValueAtTime(0.0001, now + 1);
  osc.connect(gain); gain.connect(ctx.destination); osc.start(now); osc.stop(now + 1);
}
