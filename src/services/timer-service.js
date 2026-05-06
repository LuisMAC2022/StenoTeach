let timerId = null;

export function clearLevel3Timer() { if (timerId) { clearInterval(timerId); timerId = null; } }

export function restartLevel3TimerIfNeeded(enabled, onTick, onElapsed) {
  if (!enabled) return;
  clearLevel3Timer();
  let left = 5;
  onTick(left);
  timerId = setInterval(() => {
    left -= 1;
    onTick(left);
    if (left <= 0) { clearLevel3Timer(); onElapsed(); }
  }, 1000);
}
