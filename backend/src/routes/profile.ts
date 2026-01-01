import { Router } from 'express';
import { getProfile, getProfileAdmin, updateProfile } from '../controllers/profileController';
import { authMiddleware } from '../middlewares/auth';
import { profileValidation, validate } from '../middlewares/validation';

const router = Router();

// Public routes
router.get('/', getProfile);

// Admin routes
router.get('/admin', authMiddleware, getProfileAdmin);
router.put('/admin', authMiddleware, profileValidation, validate, updateProfile);

export default router;
