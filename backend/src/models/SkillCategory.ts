import mongoose, { Schema, Document } from 'mongoose';
import { ISkillCategory, ISkill } from '../types';

export interface ISkillCategoryDocument extends ISkillCategory, Document { }

const skillSchema = new Schema<ISkill>({
    name: { type: String, required: true },
    level: { type: Number, default: 80, min: 0, max: 100 },
}, { _id: false });

const skillCategorySchema = new Schema<ISkillCategoryDocument>(
    {
        categoryId: { type: String, required: true, unique: true },
        title: { type: String, required: true },
        description: { type: String, default: '' },
        icon: { type: String, default: 'Code' },
        skills: [skillSchema],
        isActive: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

// Index for efficient querying
skillCategorySchema.index({ isActive: 1, order: 1 });

export const SkillCategory = mongoose.model<ISkillCategoryDocument>('SkillCategory', skillCategorySchema);
