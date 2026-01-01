import mongoose, { Schema, Document } from 'mongoose';
import { IProfile } from '../types';

export interface IProfileDocument extends IProfile, Document { }

const profileSchema = new Schema<IProfileDocument>(
    {
        name: { type: String, required: true },
        tagline: { type: String, required: true },
        bio: [{ type: String }],
        location: { type: String, default: '' },
        experience: { type: String, default: '' },
        email: { type: String, required: true, unique: true },
        availability: { type: String, default: '' },
        image: { type: String, default: '' },
        socialLinks: {
            linkedin: String,
            github: String,
            twitter: String,
            dribbble: String,
        },
        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

export const Profile = mongoose.model<IProfileDocument>('Profile', profileSchema);
