import { Router } from 'express';
import { login, logout, verifyToken } from '../controllers/authController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/verify', authMiddleware, verifyToken);

export default router;
