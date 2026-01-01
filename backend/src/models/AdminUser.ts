import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IAdminUser } from '../types';

export interface IAdminUserDocument extends IAdminUser, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const adminUserSchema = new Schema<IAdminUserDocument>(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
        isActive: { type: Boolean, default: true },
        lastLogin: { type: Date },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
adminUserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Method to compare passwords
adminUserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export const AdminUser = mongoose.model<IAdminUserDocument>('AdminUser', adminUserSchema);
