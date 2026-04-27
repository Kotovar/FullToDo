CREATE TABLE IF NOT EXISTS notepads (
  _id      BIGSERIAL PRIMARY KEY,
  title    TEXT NOT NULL,
  user_id  BIGINT NOT NULL REFERENCES users(_id) ON DELETE CASCADE,
  CONSTRAINT notepads_user_id_title_key UNIQUE (user_id, title)
);
