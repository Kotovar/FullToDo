import fs from 'fs';
import path from 'path';
import { pool } from './db';
import { repositoryLogger } from '@logger/index';

const migrateLogger = repositoryLogger.child({ layer: 'migrations' });

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

export async function runMigrations() {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename TEXT PRIMARY KEY,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    const { rows } = await client.query<{ filename: string }>(
      'SELECT filename FROM schema_migrations ORDER BY filename',
    );
    const applied = new Set(rows.map(row => row.filename));

    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of files) {
      if (applied.has(file)) {
        migrateLogger.info({ file }, 'migration skipped (already applied)');
        continue;
      }

      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf-8');

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO schema_migrations (filename) VALUES ($1)',
          [file],
        );
        await client.query('COMMIT');
        migrateLogger.info({ file }, 'migration applied');
      } catch (err) {
        await client.query('ROLLBACK');
        migrateLogger.error({ file, err }, 'migration failed');
        throw err;
      }
    }

    migrateLogger.info('migrations complete');
  } finally {
    client.release();
  }
}

if (require.main === module) {
  runMigrations()
    .catch(err => {
      migrateLogger.error({ err }, 'Migration failed');
      process.exit(1);
    })
    .finally(() => pool.end());
}
