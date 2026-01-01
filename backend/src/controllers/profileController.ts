import { Request, Response } from 'express';
import { Profile } from '../models/Profile';
import { successResponse, errorResponse } from '../utils/response';

export const getProfile = async (req: Request, res: Response) => {
    try {
        const profile = await Profile.findOne({ isActive: true });
        if (!profile) {
            return res.status(404).json(errorResponse('Profile not found'));
        }
        res.json(successResponse(profile));
    } catch (error: any) {
        res.status(500).json(errorResponse(error.message));
    }
};

export const getProfileAdmin = async (req: Request, res: Response) => {
    try {
        const profile = await Profile.findOne();
        if (!profile) {
            return res.status(404).json(errorResponse('Profile not found'));
        }
        res.json(successResponse(profile));
    } catch (error: any) {
        res.status(500).json(errorResponse(error.message));
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const profile = await Profile.findOneAndUpdate(
            {},
            req.body,
            { new: true, upsert: true, runValidators: true }
        );
        res.json(successResponse(profile, 'Profile updated successfully'));
    } catch (error: any) {
        res.status(500).json(errorResponse(error.message));
    }
};
