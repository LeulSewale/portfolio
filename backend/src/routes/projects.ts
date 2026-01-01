import { Router } from 'express';
import {
    getProjects,
    getProjectsAdmin,
    createProject,
    updateProject,
    deleteProject,
    toggleProject,
    reorderProjects,
} from '../controllers/projectController';
import { authMiddleware } from '../middlewares/auth';
import { projectValidation, validate } from '../middlewares/validation';

const router = Router();

// Public routes
router.get('/', getProjects);

// Admin routes
router.get('/admin', authMiddleware, getProjectsAdmin);
router.post('/admin', authMiddleware, projectValidation, validate, createProject);
router.put('/admin/:id', authMiddleware, projectValidation, validate, updateProject);
router.delete('/admin/:id', authMiddleware, deleteProject);
router.patch('/admin/:id/toggle', authMiddleware, toggleProject);
router.patch('/admin/reorder', authMiddleware, reorderProjects);

export default router;
