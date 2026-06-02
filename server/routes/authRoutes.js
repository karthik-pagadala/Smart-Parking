import express from 'express';
import { 
  registerUser, 
  registerAdmin, 
  verifyEmail, 
  login, 
  logout, 
  getMe 
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { body } from 'express-validator';

const router = express.Router();

// Validation Middleware Array
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

router.post('/register/user', registerValidation, registerUser);
router.post('/register/admin', registerValidation, registerAdmin);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);

export default router;
