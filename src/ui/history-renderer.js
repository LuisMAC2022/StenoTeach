import { formatOutlineForDisplay } from '../domain/parser.js';

export function renderHistory(historyListEl, entries) {
  if (!entries.length) { historyListEl.innerHTML = '<li>No attempts yet.</li>'; return; }
  historyListEl.innerHTML = entries.map((entry) => `<li class="history-item"><span class="history-badge ${entry.correct ? 'ok' : 'bad'}">${entry.correct ? 'OK' : 'X'}</span><span class="history-main"><span><strong><code>${formatOutlineForDisplay(entry.target)}</code></strong></span><span class="muted">You: <code>${formatOutlineForDisplay(entry.guess)}</code></span></span></li>`).join('');
}
