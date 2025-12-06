import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { getPendingSubmissions, approveSubmission, rejectSubmission } from '../db/queries.js';
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js';

const router = Router();

// Admin middleware check (must be authenticated first)
router.use(authMiddleware, adminMiddleware);

router.get('/submissions', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 0;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = page * limit;

    const submissions = await getPendingSubmissions(limit, offset);
    res.json({
      submissions,
      page,
      limit,
      count: submissions.length,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/submissions/:id/approve', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const submissionId = req.params.id;
    const adminId = req.userId!;

    await approveSubmission(submissionId, adminId);

    res.json({
      message: 'Submission approved and product published',
      submissionId,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/submissions/:id/reject', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { reason } = req.body;
    if (!reason || typeof reason !== 'string') {
      throw new ValidationError('Rejection reason is required');
    }

    const submissionId = req.params.id;
    await rejectSubmission(submissionId, reason);

    res.json({
      message: 'Submission rejected',
      submissionId,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
