CREATE TABLE IF NOT EXISTS subtasks (
  _id          BIGSERIAL PRIMARY KEY,
  task_id      BIGINT NOT NULL REFERENCES tasks(_id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE
);
