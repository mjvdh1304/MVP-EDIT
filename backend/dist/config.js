import 'dotenv/config';
export const config = {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    isDev: (process.env.NODE_ENV || 'development') === 'development',
    isProd: process.env.NODE_ENV === 'production',
    // Database
    databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/transparent_treats',
    // JWT
    jwtSecret: process.env.JWT_SECRET || 'dev-secret',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
    jwtExpiresIn: '1h',
    jwtRefreshExpiresIn: '7d',
    // CORS
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    // Rate Limiting
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
};
// Validate required env vars in production
if (config.isProd) {
    const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
    const missing = requiredEnvVars.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
}
//# sourceMappingURL=config.js.map