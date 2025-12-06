import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimitMiddleware } from './middleware/rateLimit.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/user.js';
import { migrate } from './db/schema.js';
const app = express();
// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors({
    origin: config.frontendUrl,
    credentials: true,
}));
// Rate limiting
app.use(rateLimitMiddleware(config.rateLimitWindowMs, config.rateLimitMaxRequests));
// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});
// Error handler (must be last)
app.use(errorHandler);
async function main() {
    try {
        console.log('Running migrations...');
        await migrate();
        console.log('✓ Database ready');
        app.listen(config.port, () => {
            console.log(`✓ Server running on http://localhost:${config.port}`);
            console.log(`  Environment: ${config.nodeEnv}`);
            console.log(`  Frontend: ${config.frontendUrl}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=index.js.map