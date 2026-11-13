const DAY = 86_400_000;

export function normalize(answer) {
  return answer.normalize("NFKC").toLowerCase()
    .replace(/[’‘]/g, "'").replace(/[–—]/g, "-")
    .replace(/[,.;:!?]+$/u, "").trim().replace(/\s+/g, " ");
}

export function checkAnswer(answer, accepted) {
  return accepted.some(option => normalize(option) === normalize(answer.trim()));
}

export function uniqueAttempts(attempts) {
  return [...new Map(attempts.map(event => [event.id, event])).values()]
    .sort((a, b) => a.at - b.at || a.id.localeCompare(b.id));
}

export function reviewStates(attempts) {
  const cards = new Map();
  for (const event of uniqueAttempts(attempts)) {
    if (event.kind !== "word") continue;
    const key = event.item + ":" + event.mode;
    const previous = cards.get(key) ?? { box: 0, errors: 0 };
    const box = event.rating === 0 ? 0 : event.rating === 1 ? Math.max(1, previous.box - 1)
      : Math.min(5, previous.box + (event.rating === 3 ? 2 : 1));
    const delay = [10 / 1440, 1, 3, 7, 14, 30][box];
    cards.set(key, {
      box, due: event.at + delay * DAY,
      errors: previous.errors + Number(event.rating === 0),
      lastRating: event.rating
    });
  }
  return cards;
}

export function queueFor(words, states, mode, now = Date.now()) {
  const scheduled = words.map(word => ({ word, state: states.get(word.id + ":" + mode) }));
  return [
    ...scheduled.filter(({ state }) => state && state.due <= now)
      .sort((a, b) => a.state.due - b.state.due).map(({ word }) => word),
    ...scheduled.filter(({ state }) => !state).map(({ word }) => word)
  ];
}

export function completedDocuments(documents, attempts) {
  const answered = new Set(attempts.filter(event => event.kind === "document").map(event => event.item));
  return documents.filter(doc => doc.questions.every(question => answered.has(doc.id + ":" + question.id)));
}

export function validAttempt(event, words, documents, now = Date.now()) {
  if (!event || typeof event !== "object" ||
    typeof event.id !== "string" || !/^[0-9a-f-]{36}$/i.test(event.id) ||
    !Number.isSafeInteger(event.at) || event.at <= 0 || event.at > now + DAY ||
    !Number.isInteger(event.rating)) return false;
  if (event.kind === "word") {
    return ["en-de", "de-en"].includes(event.mode) && event.rating >= 0 && event.rating <= 3 &&
      words.some(word => word.id === event.item);
  }
  return event.kind === "document" && [0, 2].includes(event.rating) &&
    documents.some(doc => doc.questions.some(q => doc.id + ":" + q.id === event.item));
}
