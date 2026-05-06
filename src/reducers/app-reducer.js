import { initialState } from '../domain/model.js';
import { evaluateProgression } from '../domain/progression.js';
import { pushHistory } from '../domain/history.js';

export function appReducer(state = initialState, action) {
  switch (action.type) {
    case 'APP_INIT': return { ...state };
    case 'OUTLINE_CHANGED': return { ...state, outlineValue: action.payload.value };
    case 'LESSON_SELECTED': return { ...state, currentLesson: action.payload.lesson, awaitingNext: false, outlineValue: '' };
    case 'ATTEMPT_EVALUATED': {
      const base = { ...state, attempts: state.attempts + 1 };
      const progressed = evaluateProgression(base, action.payload.correct);
      return { ...progressed, backgroundState: action.payload.correct ? 'correct' : 'wrong' };
    }
    case 'TIMEOUT_ELAPSED': return appReducer(state, { type: 'ATTEMPT_EVALUATED', payload: { correct: false } });
    case 'LEVEL_SET': return { ...state, difficultyLevel: action.payload.level };
    case 'LAYOUT_VISIBILITY_SET': return { ...state, layoutHidden: !action.payload.visible };
    case 'HISTORY_PUSHED': return { ...state, historyEntries: pushHistory(state.historyEntries, action.payload.entry) };
    case 'NEXT_LESSON_QUEUED': return { ...state, awaitingNext: true };
    case 'TIMER_TICK': return { ...state, level3TimeLeft: action.payload.timeLeft };
    case 'BACKGROUND_STATE_SET': return { ...state, backgroundState: action.payload.kind };
    default: return state;
  }
}
