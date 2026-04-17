import express from 'express';
import * as reviewController from '../controllers/review.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', reviewController.list);
router.post('/', authenticate, reviewController.create);
router.delete('/:id', authenticate, adminOnly, reviewController.destroy);

export default router;
