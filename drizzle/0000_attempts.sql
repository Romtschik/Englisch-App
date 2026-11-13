CREATE TABLE learning_attempts (
  user_id TEXT NOT NULL,
  event_id TEXT NOT NULL,
  occurred_at INTEGER NOT NULL,
  payload TEXT NOT NULL,
  PRIMARY KEY (user_id, event_id)
);
CREATE INDEX learning_attempts_by_user ON learning_attempts (user_id, occurred_at, event_id);
