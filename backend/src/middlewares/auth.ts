import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { errorResponse } from '../utils/response';

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        username: string;
        role: string;
    };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Get token from cookie or Authorization header
        const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json(errorResponse('No authentication token provided'));
        }

        // Verify token
        const decoded = jwt.verify(token, config.jwtSecret) as {
            userId: string;
            username: string;
            role: string;
        };

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json(errorResponse('Invalid or expired token'));
    }
};
