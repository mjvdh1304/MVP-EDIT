import pkg from 'pg';
export declare const pool: pkg.Pool;
export declare function query<T>(text: string, params?: (string | number | boolean | null)[]): Promise<T[]>;
export declare function queryOne<T>(text: string, params?: (string | number | boolean | null)[]): Promise<T | null>;
export declare function execute(text: string, params?: (string | number | boolean | null)[]): Promise<number>;
export declare function closePool(): Promise<void>;
//# sourceMappingURL=pool.d.ts.map