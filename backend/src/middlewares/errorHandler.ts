import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((e: any) => e.message);
        return res.status(400).json(errorResponse('Validation failed', errors));
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json(errorResponse(`${field} already exists`));
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json(errorResponse('Invalid token'));
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json(errorResponse('Token expired'));
    }

    // Default error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    res.status(statusCode).json(errorResponse(message));
};
