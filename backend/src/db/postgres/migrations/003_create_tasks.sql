CREATE TABLE IF NOT EXISTS tasks (
  _id          BIGSERIAL PRIMARY KEY,
  notepad_id   BIGINT REFERENCES notepads(_id) ON DELETE CASCADE,
  user_id      BIGINT NOT NULL REFERENCES users(_id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  created_date TIMESTAMPTZ DEFAULT NOW(),
  is_completed BOOLEAN DEFAULT FALSE,
  description  TEXT,
  due_date     TIMESTAMPTZ
);
