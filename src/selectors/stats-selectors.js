export function selectStats(state) {
  return {
    streak: state.currentStreak,
    best: state.bestStreak,
    attempts: state.attempts,
    level: state.difficultyLevel,
    timerText: state.difficultyLevel === 3 ? `${state.level3TimeLeft}s` : '—'
  };
}
