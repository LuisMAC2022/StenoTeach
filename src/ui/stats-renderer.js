export function renderStats(refs, stats) {
  refs.streakOut.textContent = String(stats.streak);
  refs.bestStreakOut.textContent = String(stats.best);
  refs.attemptsOut.textContent = String(stats.attempts);
  refs.levelOut.textContent = String(stats.level);
  refs.timerOut.textContent = stats.timerText;
}
