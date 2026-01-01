import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errorResponse('Validation failed', errors.array()));
    }
    next();
};

// Validation rules for different entities
export const projectValidation = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
    body('imageUrl').optional().isString(),
    body('liveUrl').optional().isURL().withMessage('Live URL must be valid'),
    body('githubUrl').optional().isURL().withMessage('GitHub URL must be valid'),
];

export const skillValidation = [
    body('categoryId').trim().notEmpty().withMessage('Category ID is required'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().isString(),
    body('icon').optional().isString(),
    body('skills').optional().isArray().withMessage('Skills must be an array'),
];

export const testimonialValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('role').trim().notEmpty().withMessage('Role is required'),
    body('company').trim().notEmpty().withMessage('Company is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('avatar').optional().isString(),
];

export const profileValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('tagline').trim().notEmpty().withMessage('Tagline is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('bio').optional().isArray().withMessage('Bio must be an array'),
];
