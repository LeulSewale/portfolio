import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

router.get('/', getSettings);
router.put('/admin', authMiddleware, updateSettings);

export default router;
