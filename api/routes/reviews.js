import express from 'express';
import * as reviewController from '../controllers/review.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', reviewController.list);
router.post('/', authenticate, reviewController.create);

export default router;
