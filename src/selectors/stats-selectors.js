export function selectStats(state) {
  const accuracyPct = state.attempts > 0 ? (state.correctAttempts / state.attempts) * 100 : 0;
  const avgStreak = state.completedStreaks > 0
    ? (state.sumCompletedStreaks / state.completedStreaks)
    : state.currentStreak;

  return {
    streak: state.currentStreak,
    best: state.bestStreak,
    attempts: state.attempts,
    accuracyPct,
    avgStreak,
    level: state.difficultyLevel,
    timerText: state.difficultyLevel === 3 ? `${state.level3TimeLeft}s` : '—'
  };
}
