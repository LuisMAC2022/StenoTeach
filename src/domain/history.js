export function pushHistory(entries, item) {
  return [item, ...entries].slice(0, 10);
}
