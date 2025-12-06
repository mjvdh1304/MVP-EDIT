import { Router } from 'express';
import { submitProductSchema } from '../schemas/products.js';
import { createSubmission, getUserSubmissions, getProductById, getProductByBarcode, getAllProducts } from '../db/queries.js';
import { authMiddleware } from '../middleware/auth.js';
import { createRateLimiter } from '../middleware/rateLimit.js';
import { ValidationError, NotFoundError } from '../middleware/errorHandler.js';
const router = Router();
const submitRateLimiter = createRateLimiter(5); // 5 submissions per day
// Public endpoints
router.get('/', async (req, res, next) => {
    try {
        const products = await getAllProducts();
        res.json(products);
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        const product = await getProductById(req.params.id);
        if (!product) {
            throw new NotFoundError('Product not found');
        }
        res.json(product);
    }
    catch (error) {
        next(error);
    }
});
// Protected endpoints
router.post('/submit', authMiddleware, submitRateLimiter, async (req, res, next) => {
    try {
        const validated = submitProductSchema.parse(req.body);
        // Check if product with same barcode already exists
        const existing = await getProductByBarcode(validated.barcode);
        if (existing) {
            throw new ValidationError('A product with this barcode already exists');
        }
        // Get user's trust score to determine if auto-publish
        const userId = req.userId;
        // TODO: Fetch user trust score from database
        // For now, assume new users go to pending review
        const status = 'pending_review';
        const submission = await createSubmission(userId, validated.barcode, validated.name, validated.brand, validated.category, validated.ingredients, validated.certifications || [], validated.nutritionFacts, validated.sourceUrl, validated.notes, status);
        res.status(201).json({
            submissionId: submission.id,
            status: submission.status,
            message: status === 'pending_review'
                ? 'Thank you! Your submission is under review.'
                : 'Product published successfully!',
        });
    }
    catch (error) {
        next(error);
    }
});
router.get('/my-submissions', authMiddleware, async (req, res, next) => {
    try {
        const userId = req.userId;
        const submissions = await getUserSubmissions(userId);
        res.json(submissions);
    }
    catch (error) {
        next(error);
    }
});
export default router;
//# sourceMappingURL=products.js.map