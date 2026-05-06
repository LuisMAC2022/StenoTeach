import { parseOutline, formatOutlineForDisplay } from '../domain/parser.js';

export function selectView(state) {
  const parsed = parseOutline(state.outlineValue);
  return {
    activeKeys: parsed.active,
    placeholder: state.currentLesson ? formatOutlineForDisplay(state.currentLesson.target) : 'Loading…',
    layoutVisible: !state.layoutHidden
  };
}
