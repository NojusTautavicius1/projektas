import express from 'express';
import rateLimit from 'express-rate-limit';
import { 
  createContactMessage, 
  getAllContactMessages, 
  getContactMessageById,
  deleteContactMessage,
  markMessageAsRead
} from '../controllers/contact.js';

const router = express.Router();

// Rate limiter: max 3 messages per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs
  message: { message: 'Too many contact submissions. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/contact - Create new contact message (with rate limiting)
router.post('/', contactLimiter, createContactMessage);

// GET /api/contact - Get all contact messages (admin)
router.get('/', getAllContactMessages);

// GET /api/contact/:id - Get specific contact message
router.get('/:id', getContactMessageById);

// PATCH /api/contact/:id/read - Mark message as read
router.patch('/:id/read', markMessageAsRead);

// DELETE /api/contact/:id - Delete contact message
router.delete('/:id', deleteContactMessage);

export default router;
