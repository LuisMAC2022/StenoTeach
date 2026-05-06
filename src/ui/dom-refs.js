export function getDomRefs() {
  return {
    body: document.body,
    outlineInput: document.getElementById('outline'),
    canvas: document.getElementById('board'),
    streakOut: document.getElementById('streakOut'),
    bestStreakOut: document.getElementById('bestStreakOut'),
    attemptsOut: document.getElementById('attemptsOut'),
    accuracyOut: document.getElementById('accuracyOut'),
    avgStreakOut: document.getElementById('avgStreakOut'),
    levelOut: document.getElementById('levelOut'),
    timerOut: document.getElementById('timerOut'),
    historyListEl: document.getElementById('historyList')
  };
}
