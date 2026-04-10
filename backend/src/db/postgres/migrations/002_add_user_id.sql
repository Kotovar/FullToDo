TRUNCATE TABLE notepads CASCADE;

-- Добавить user_id в notepads
ALTER TABLE notepads
ADD COLUMN IF NOT EXISTS user_id BIGINT NOT NULL
REFERENCES users(_id) ON DELETE CASCADE;

-- Добавить уникальное ограничение
ALTER TABLE notepads
ADD CONSTRAINT notepads_user_id_title_key
UNIQUE (user_id, title);
