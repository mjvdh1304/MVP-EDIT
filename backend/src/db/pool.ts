import pkg from 'pg';
import { config } from '../config.js';

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: config.databaseUrl,
});

pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client', err);
});

export async function query<T>(text: string, params?: (string | number | boolean | null)[]): Promise<T[]> {
  const result = await pool.query(text, params);
  return result.rows as T[];
}

export async function queryOne<T>(text: string, params?: (string | number | boolean | null)[]): Promise<T | null> {
  const result = await pool.query(text, params);
  return (result.rows[0] as T) || null;
}

export async function execute(text: string, params?: (string | number | boolean | null)[]): Promise<number> {
  const result = await pool.query(text, params);
  return result.rowCount || 0;
}

export async function closePool(): Promise<void> {
  await pool.end();
}
