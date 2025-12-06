import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getUserById } from '../db/queries.js';
import { NotFoundError } from '../middleware/errorHandler.js';
const router = Router();
router.use(authMiddleware);
router.get('/profile', async (req, res, next) => {
    try {
        const userId = req.userId;
        const user = await getUserById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        // Don't send password hash to client
        const { passwordHash, ...safeUser } = user;
        res.json({
            user: safeUser,
        });
    }
    catch (error) {
        next(error);
    }
});
router.patch('/profile', async (req, res, next) => {
    try {
        // TODO: Implement profile update logic
        // For now, just return the current profile
        const userId = req.userId;
        const user = await getUserById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        const { passwordHash, ...safeUser } = user;
        res.json({
            message: 'Profile update endpoint stub',
            user: safeUser,
        });
    }
    catch (error) {
        next(error);
    }
});
export default router;
//# sourceMappingURL=user.js.map