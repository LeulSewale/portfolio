import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AdminUser } from '../models/AdminUser';
import { config } from '../config/env';
import { successResponse, errorResponse } from '../utils/response';

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await AdminUser.findOne({ username, isActive: true });
        if (!user) {
            return res.status(401).json(errorResponse('Invalid credentials'));
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json(errorResponse('Invalid credentials'));
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, username: user.username, role: user.role },
            config.jwtSecret,
            { expiresIn: config.jwtExpiresIn }
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: config.env === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json(successResponse({ token, user: { username: user.username, role: user.role } }, 'Login successful'));
    } catch (error: any) {
        res.status(500).json(errorResponse(error.message));
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('token');
    res.json(successResponse(null, 'Logout successful'));
};

export const verifyToken = (req: Request, res: Response) => {
    res.json(successResponse({ isAuthenticated: true }));
};
