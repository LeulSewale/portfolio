import mongoose, { Schema, Document } from 'mongoose';
import { ITestimonial } from '../types';

export interface ITestimonialDocument extends ITestimonial, Document { }

const testimonialSchema = new Schema<ITestimonialDocument>(
    {
        name: { type: String, required: true },
        role: { type: String, required: true },
        company: { type: String, required: true },
        content: { type: String, required: true },
        avatar: { type: String, default: '/placeholder.svg?height=100&width=100' },
        isActive: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

// Index for efficient querying
testimonialSchema.index({ isActive: 1, order: 1 });

export const Testimonial = mongoose.model<ITestimonialDocument>('Testimonial', testimonialSchema);
