import pkg from 'pg';
import { config } from '../config.js';
const { Pool } = pkg;
export const pool = new Pool({
    connectionString: config.databaseUrl,
});
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});
export async function query(text, params) {
    const result = await pool.query(text, params);
    return result.rows;
}
export async function queryOne(text, params) {
    const result = await pool.query(text, params);
    return result.rows[0] || null;
}
export async function execute(text, params) {
    const result = await pool.query(text, params);
    return result.rowCount || 0;
}
export async function closePool() {
    await pool.end();
}
//# sourceMappingURL=pool.js.map