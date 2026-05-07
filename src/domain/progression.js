export function evaluateProgression(state, correct) {
  const next = { ...state };
  if (correct) {
    next.currentStreak += 1;
    next.correctAttempts += 1;
    next.mistakeStreak = 0;
    next.bestStreak = Math.max(next.bestStreak, next.currentStreak);
    if (next.difficultyLevel === 1 && next.currentStreak >= 10) {
      next.layoutHidden = true;
      next.difficultyLevel = 2;
      next.level2CorrectStreak = 0;
    } else if (next.difficultyLevel === 2) {
      next.level2CorrectStreak += 1;
      if (next.level2CorrectStreak >= 10) { next.difficultyLevel = 3; next.level2CorrectStreak = 0; }
    }
  } else {
    if (next.currentStreak > 0) {
      next.completedStreaks += 1;
      next.sumCompletedStreaks += next.currentStreak;
    }
    next.currentStreak = 0;
    next.mistakeStreak += 1;
    next.level2CorrectStreak = 0;
    if (next.difficultyLevel === 2 && next.mistakeStreak >= 3) { next.layoutHidden = false; next.difficultyLevel = 1; }
    else if (next.difficultyLevel === 3 && next.mistakeStreak >= 3) { next.difficultyLevel = 2; }
  }
  return next;
}
