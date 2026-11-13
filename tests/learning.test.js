import { test } from "node:test";
import assert from "node:assert/strict";
import { words, documents } from "../web/content.js";
import { checkAnswer, queueFor, reviewStates, completedDocuments, validAttempt } from "../web/learning.js";

const at = 1_790_000_000_000;
const word = (rating, time, sequence) => ({
  id: "00000000-0000-4000-8000-" + String(sequence).padStart(12, "0"),
  at: time, kind: "word", item: "test-report", mode: "de-en", rating
});

test("Antwortvarianten und Satzzeichen", () => {
  assert.equal(checkAnswer(" Testbericht. ", ["Prüfbericht", "Testbericht"]), true);
  assert.equal(checkAnswer("Prüfberichte", ["Prüfbericht"]), false);
});
test("Karten fallen nach einem Fehler zurück; Wiederholungen zählen einmal", () => {
  const secure = word(3, at, 1);
  const mistake = word(0, at + 1000, 2);
  const states = reviewStates([mistake, secure, mistake]);
  assert.equal(states.get("test-report:de-en").errors, 1);
  assert.equal(states.get("test-report:de-en").box, 0);
  assert.equal(queueFor(words, states, "de-en", at + 601_001)[0].id, "test-report");
  assert.equal(queueFor(words, states, "de-en", at + 1001).some(card => card.id === "test-report"), false);
  assert.equal(queueFor(words, states, "en-de", at + 1001).some(card => card.id === "test-report"), true);
});
test("Übungsinhalte haben gültige Verweise und IDs", () => {
  assert.equal(new Set(words.map(card => card.id)).size, words.length);
  for (const document of documents) {
    assert.ok(document.terms.every(id => words.some(card => card.id === id)));
    for (const question of document.questions) {
      assert.ok(document.paragraphs[question.ref]);
      assert.ok(question.options[question.answer]);
    }
  }
});
test("Dokumentfortschritt braucht jede Frage und Events sind validierbar", () => {
  const doc = documents[0];
  const events = doc.questions.map((q, i) => ({ ...word(2, at + i, i), kind:"document", item:doc.id + ":" + q.id }));
  assert.ok(events.every(event => validAttempt(event, words, documents)));
  assert.equal(completedDocuments(documents, events.slice(1)).length, 0);
  assert.deepEqual(completedDocuments(documents, events), [doc]);
  assert.equal(validAttempt({ ...events[0], rating: 5 }, words, documents), false);
});
