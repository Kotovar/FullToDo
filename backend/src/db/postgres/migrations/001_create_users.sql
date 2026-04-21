CREATE TABLE IF NOT EXISTS users (
  _id           BIGSERIAL PRIMARY KEY,
  email         TEXT UNIQUE,
  password_hash TEXT,
  google_id     TEXT UNIQUE,
  is_verified   BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
