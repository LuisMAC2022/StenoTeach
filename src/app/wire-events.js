import { parseOutline } from '../domain/parser.js';
import { pickRandomLesson } from '../domain/lesson-engine.js';
import { appReducer } from '../reducers/app-reducer.js';
import { selectStats } from '../selectors/stats-selectors.js';
import { selectView } from '../selectors/view-selectors.js';
import { drawBoard } from '../ui/canvas-renderer.js';
import { renderHistory } from '../ui/history-renderer.js';
import { renderStats } from '../ui/stats-renderer.js';
import { playTone, unlockAudio } from '../services/audio-service.js';
import { clearLevel3Timer, restartLevel3TimerIfNeeded } from '../services/timer-service.js';

export function wireEvents(refs, initialState) {
  let state = initialState;
  const dispatch = (action) => { state = appReducer(state, action); render(); };

  function render() {
    const stats = selectStats(state); const view = selectView(state);
    refs.outlineInput.value = state.outlineValue;
    refs.outlineInput.placeholder = view.placeholder;
    refs.canvas.classList.toggle('layout-hidden', !view.layoutVisible);
    refs.canvas.toggleAttribute('hidden', !view.layoutVisible);
    refs.body.classList.toggle('state-correct', state.backgroundState === 'correct');
    refs.body.classList.toggle('state-wrong', state.backgroundState === 'wrong');
    if (view.layoutVisible) drawBoard(refs.canvas, view.activeKeys);
    renderStats(refs, stats);
    renderHistory(refs.historyListEl, state.historyEntries);
  }

  const queueNext = () => { dispatch({ type: 'NEXT_LESSON_QUEUED' }); setTimeout(() => dispatch({ type: 'LESSON_SELECTED', payload: { lesson: pickRandomLesson() } }), 650); };

  function evaluate(force = false) { const parsed = parseOutline(state.outlineValue); if (!state.currentLesson || state.awaitingNext || !parsed.normalized) return; const guess = parsed.normalized.replace(/-/g, ''); const target = state.currentLesson.target.replace(/-/g, ''); if (!force && guess.length < target.length) return; if (state.difficultyLevel === 3) clearLevel3Timer(); const correct = guess === target; dispatch({ type: 'ATTEMPT_EVALUATED', payload: { correct } }); dispatch({ type: 'HISTORY_PUSHED', payload: { entry: { guess: parsed.normalized, target: state.currentLesson.target, correct } } }); playTone(correct ? 'correct' : 'wrong'); queueNext(); }

  refs.outlineInput.addEventListener('input', () => { unlockAudio(); dispatch({ type: 'OUTLINE_CHANGED', payload: { value: refs.outlineInput.value } }); evaluate(false); });
  refs.outlineInput.addEventListener('keydown', (e) => { unlockAudio(); if (e.key === 'Enter') { e.preventDefault(); evaluate(true); } });
  window.addEventListener('pointerdown', unlockAudio); window.addEventListener('keydown', unlockAudio); window.addEventListener('touchstart', unlockAudio, { passive: true });

  dispatch({ type: 'APP_INIT' });
  dispatch({ type: 'LESSON_SELECTED', payload: { lesson: pickRandomLesson() } });
  restartLevel3TimerIfNeeded(state.difficultyLevel === 3, (left) => dispatch({ type: 'TIMER_TICK', payload: { timeLeft: left } }), () => dispatch({ type: 'TIMEOUT_ELAPSED' }));
}
