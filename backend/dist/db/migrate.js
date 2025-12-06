import { migrate } from './schema.js';
import { pool } from './pool.js';
async function main() {
    try {
        await migrate();
        console.log('Database ready!');
    }
    catch (error) {
        console.error('Failed to run migrations:', error);
        process.exit(1);
    }
    finally {
        await pool.end();
    }
}
main();
//# sourceMappingURL=migrate.js.map