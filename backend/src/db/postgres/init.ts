import { query } from './db';

export async function initDb() {
  await query(`
     CREATE TABLE IF NOT EXISTS notepads (
       _id BIGSERIAL PRIMARY KEY,
       title TEXT NOT NULL UNIQUE
     )
     `);

  await query(`
   CREATE TABLE IF NOT EXISTS tasks (
     _id BIGSERIAL PRIMARY KEY,
     notepad_id BIGINT REFERENCES notepads(_id) ON DELETE CASCADE,
     title TEXT NOT NULL,
     created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     is_completed BOOLEAN DEFAULT false,
     description TEXT,
     due_date TIMESTAMP WITH TIME ZONE
   )
   `);

  await query(`
   CREATE TABLE IF NOT EXISTS subtasks (
   _id BIGSERIAL PRIMARY KEY,
   task_id BIGINT REFERENCES tasks(_id) ON DELETE CASCADE,
   title TEXT NOT NULL,
   is_completed BOOLEAN DEFAULT false
   )
   `);
}
