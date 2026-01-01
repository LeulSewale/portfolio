import { Request, Response } from 'express';
import { SkillCategory } from '../models/SkillCategory';
import { successResponse, errorResponse } from '../utils/response';

// Public: Get active skill categories
export const getSkills = async (req: Request, res: Response) => {
    try {
        const skills = await SkillCategory.find({ isActive: true }).sort({ order: 1 });
        res.json(successResponse(skills));
    } catch (error: any) {
        res.status(500).json(errorResponse(error.message));
    }
};

// Admin: Get all skill categories
export const getSkillsAdmin = async (req: Request, res: Response) => {
    try {
        const skills = await SkillCategory.find().sort({ order: 1 });
        res.json(successResponse(skills));
    } catch (error: any) {
        res.status(500).json(errorResponse(error.message));
    }
};

// Admin: Create skill category
export const createSkill = async (req: Request, res: Response) => {
    try {
        const skill = new SkillCategory(req.body);
        await skill.save();
        res.status(201).json(successResponse(skill, 'Skill category created successfully'));
    } catch (error: any) {
        res.status(500).json(errorResponse(error.message));
    }
};

// Admin: Update skill category
export const updateSkill = async (req: Request, res: Response) => {
    try {
        const skill = await SkillCategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!skill) {
            return res.status(404).json(errorResponse('Skill category not found'));
        }
        res.json(successResponse(skill, 'Skill category updated successfully'));
    } catch (error: any) {
        res.status(500).json(errorResponse(error.message));
    }
};

// Admin: Delete skill category
export const deleteSkill = async (req: Request, res: Response) => {
    try {
        const skill = await SkillCategory.findByIdAndDelete(req.params.id);
        if (!skill) {
            return res.status(404).json(errorResponse('Skill category not found'));
        }
        res.json(successResponse(null, 'Skill category deleted successfully'));
    } catch (error: any) {
        res.status(500).json(errorResponse(error.message));
    }
};

// Admin: Toggle skill visibility
export const toggleSkill = async (req: Request, res: Response) => {
    try {
        const skill = await SkillCategory.findById(req.params.id);
        if (!skill) {
            return res.status(404).json(errorResponse('Skill category not found'));
        }
        skill.isActive = !skill.isActive;
        await skill.save();
        res.json(successResponse(skill, 'Skill visibility toggled'));
    } catch (error: any) {
        res.status(500).json(errorResponse(error.message));
    }
};

// Admin: Reorder skills
export const reorderSkills = async (req: Request, res: Response) => {
    try {
        const { skills } = req.body; // Array of { id, order }

        const updatePromises = skills.map((item: { id: string; order: number }) =>
            SkillCategory.findByIdAndUpdate(item.id, { order: item.order })
        );

        await Promise.all(updatePromises);
        res.json(successResponse(null, 'Skills reordered successfully'));
    } catch (error: any) {
        res.status(500).json(errorResponse(error.message));
    }
};
