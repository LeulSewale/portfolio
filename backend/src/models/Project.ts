import mongoose, { Schema, Document } from 'mongoose';
import { IProject } from '../types';

export interface IProjectDocument extends IProject, Document { }

const projectSchema = new Schema<IProjectDocument>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        tags: [{ type: String }],
        imageUrl: { type: String, default: '' },
        liveUrl: { type: String },
        githubUrl: { type: String },
        featured: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

// Index for efficient querying
projectSchema.index({ isActive: 1, order: 1 });

export const Project = mongoose.model<IProjectDocument>('Project', projectSchema);
