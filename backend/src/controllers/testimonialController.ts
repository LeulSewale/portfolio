import { Request, Response } from 'express';
import { Testimonial } from '../models/Testimonial';
import { successResponse, errorResponse } from '../utils/response';

// Public: Get active testimonials
export const getTestimonials = async (req: Request, res: Response) => {
    try {
        const testimonials = await Testimonial.find({ isActive: true }).sort({ order: 1 });
        res.json(successResponse(testimonials));
    } catch (error: any) {
        res.status(500).json(errorResponse(error.message));
    }
};

// Admin: Get all testimonials
export const getTestimonialsAdmin = async (req: Request, res: Response) => {
    try {
        const testimonials = await Testimonial.find().sort({ order: 1 });
        res.json(successResponse(testimonials));
    } catch (error: any) {
        res.status(500).json(errorResponse(error.message));
    }
};

// Admin: Create testimonial
export const createTestimonial = async (req: Request, res: Response) => {
    try {
        const testimonial = new Testimonial(req.body);
        await testimonial.save();
        res.status(201).json(successResponse(testimonial, 'Testimonial created successfully'));
    } catch (error: any) {
        res.status(500).json(errorResponse(error.message));
    }
};

// Admin: Update testimonial
export const updateTestimonial = async (req: Request, res: Response) => {
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!testimonial) {
            return res.status(404).json(errorResponse('Testimonial not found'));
        }
        res.json(successResponse(testimonial, 'Testimonial updated successfully'));
    } catch (error: any) {
        res.status(500).json(errorResponse(error.message));
    }
};

// Admin: Delete testimonial
export const deleteTestimonial = async (req: Request, res: Response) => {
    try {
        const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
        if (!testimonial) {
            return res.status(404).json(errorResponse('Testimonial not found'));
        }
        res.json(successResponse(null, 'Testimonial deleted successfully'));
    } catch (error: any) {
        res.status(500).json(errorResponse(error.message));
    }
};

// Admin: Toggle testimonial visibility
export const toggleTestimonial = async (req: Request, res: Response) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) {
            return res.status(404).json(errorResponse('Testimonial not found'));
        }
        testimonial.isActive = !testimonial.isActive;
        await testimonial.save();
        res.json(successResponse(testimonial, 'Testimonial visibility toggled'));
    } catch (error: any) {
        res.status(500).json(errorResponse(error.message));
    }
};
