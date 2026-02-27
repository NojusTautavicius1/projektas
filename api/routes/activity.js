import express from 'express';
import { 
  getAllActivities, 
  getActivityStats,
  deleteActivity
} from '../controllers/activity.js';

const router = express.Router();

// GET /api/activity - Get all activity logs
router.get('/', getAllActivities);

// GET /api/activity/stats - Get activity statistics
router.get('/stats', getActivityStats);

// DELETE /api/activity/:id - Delete activity log
router.delete('/:id', deleteActivity);

export default router;
