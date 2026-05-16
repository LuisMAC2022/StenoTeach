export function renderStats(refs, stats) {
  refs.streakOut.textContent = String(stats.streak);
  refs.bestStreakOut.textContent = String(stats.best);
  refs.attemptsOut.textContent = String(stats.attempts);
  refs.accuracyOut.textContent = `${stats.accuracyPct.toFixed(1)}%`;
  refs.avgStreakOut.textContent = stats.avgStreak.toFixed(2);
  refs.levelOut.textContent = String(stats.level);
  refs.timerOut.textContent = stats.timerText;
}
