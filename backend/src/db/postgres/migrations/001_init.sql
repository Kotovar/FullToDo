CREATE TABLE IF NOT EXISTS notepads (
  _id          BIGSERIAL PRIMARY KEY,
  title        TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
  _id          BIGSERIAL PRIMARY KEY,
  notepad_id   BIGINT REFERENCES notepads(_id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_completed BOOLEAN DEFAULT false,
  description  TEXT,
  due_date     TIMESTAMP WITH TIME ZONE
);
