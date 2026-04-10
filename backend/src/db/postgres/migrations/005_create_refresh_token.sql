CREATE TABLE refresh_tokens (
  _id        BIGSERIAL PRIMARY KEY,
  user_id    BIGINT NOT NULL REFERENCES users(_id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
