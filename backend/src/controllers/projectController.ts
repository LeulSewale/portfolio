import { Request, Response } from 'express';
import { Project } from '../models/Project';
import { successResponse, errorResponse } from '../utils/response';

// Public: Get active projects
export const getProjects = async (req: Request, res: Response) => {
    try {
        const projects = await Project.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
        res.json(successResponse(projects));
    } catch (error: any) {
        res.status(500).json(errorResponse(error.message));
    }
};

// Admin: Get all projects
export const getProjectsAdmin = async (req: Request, res: Response) => {
    try {
        const projects = await Project.find().sort({ order: 1, createdAt: -1 });
        res.json(successResponse(projects));
    } catch (error: any) {
        res.status(500).json(errorResponse(error.message));
    }
};

// Admin: Create project
export const createProject = async (req: Request, res: Response) => {
    try {
        const project = new Project(req.body);
        await project.save();
        res.status(201).json(successResponse(project, 'Project created successfully'));
    } catch (error: any) {
        res.status(500).json(errorResponse(error.message));
    }
};

// Admin: Update project
export const updateProject = async (req: Request, res: Response) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!project) {
            return res.status(404).json(errorResponse('Project not found'));
        }
        res.json(successResponse(project, 'Project updated successfully'));
    } catch (error: any) {
        res.status(500).json(errorResponse(error.message));
    }
};

// Admin: Delete project
export const deleteProject = async (req: Request, res: Response) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json(errorResponse('Project not found'));
        }
        res.json(successResponse(null, 'Project deleted successfully'));
    } catch (error: any) {
        res.status(500).json(errorResponse(error.message));
    }
};

// Admin: Toggle project visibility
export const toggleProject = async (req: Request, res: Response) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json(errorResponse('Project not found'));
        }
        project.isActive = !project.isActive;
        await project.save();
        res.json(successResponse(project, 'Project visibility toggled'));
    } catch (error: any) {
        res.status(500).json(errorResponse(error.message));
    }
};

// Admin: Reorder projects
export const reorderProjects = async (req: Request, res: Response) => {
    try {
        const { projects } = req.body; // Array of { id, order }

        const updatePromises = projects.map((item: { id: string; order: number }) =>
            Project.findByIdAndUpdate(item.id, { order: item.order })
        );

        await Promise.all(updatePromises);
        res.json(successResponse(null, 'Projects reordered successfully'));
    } catch (error: any) {
        res.status(500).json(errorResponse(error.message));
    }
};
