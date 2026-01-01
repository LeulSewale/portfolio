import { Router } from 'express';
import {
    getTestimonials,
    getTestimonialsAdmin,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    toggleTestimonial,
} from '../controllers/testimonialController';
import { authMiddleware } from '../middlewares/auth';
import { testimonialValidation, validate } from '../middlewares/validation';

const router = Router();

// Public routes
router.get('/', getTestimonials);

// Admin routes
router.get('/admin', authMiddleware, getTestimonialsAdmin);
router.post('/admin', authMiddleware, testimonialValidation, validate, createTestimonial);
router.put('/admin/:id', authMiddleware, testimonialValidation, validate, updateTestimonial);
router.delete('/admin/:id', authMiddleware, deleteTestimonial);
router.patch('/admin/:id/toggle', authMiddleware, toggleTestimonial);

export default router;
