import { Router } from 'express';
import {
    getSkills,
    getSkillsAdmin,
    createSkill,
    updateSkill,
    deleteSkill,
    toggleSkill,
    reorderSkills,
} from '../controllers/skillController';
import { authMiddleware } from '../middlewares/auth';
import { skillValidation, validate } from '../middlewares/validation';

const router = Router();

// Public routes
router.get('/', getSkills);

// Admin routes
router.get('/admin', authMiddleware, getSkillsAdmin);
router.post('/admin', authMiddleware, skillValidation, validate, createSkill);
router.put('/admin/:id', authMiddleware, skillValidation, validate, updateSkill);
router.delete('/admin/:id', authMiddleware, deleteSkill);
router.patch('/admin/:id/toggle', authMiddleware, toggleSkill);
router.patch('/admin/reorder', authMiddleware, reorderSkills);

export default router;
