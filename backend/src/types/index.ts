export interface IProfile {
    name: string;
    tagline: string;
    bio: string[];
    location: string;
    experience: string;
    email: string;
    availability: string;
    image: string;
    socialLinks: {
        linkedin?: string;
        github?: string;
        twitter?: string;
        dribbble?: string;
    };
    isActive: boolean;
}

export interface IProject {
    title: string;
    description: string;
    tags: string[];
    imageUrl: string;
    liveUrl?: string;
    githubUrl?: string;
    featured: boolean;
    isActive: boolean;
    order: number;
}

export interface ISkill {
    name: string;
    level: number;
}

export interface ISkillCategory {
    categoryId: string;
    title: string;
    description: string;
    icon: string;
    skills: ISkill[];
    isActive: boolean;
    order: number;
}

export interface ITestimonial {
    name: string;
    role: string;
    company: string;
    content: string;
    avatar: string;
    isActive: boolean;
    order: number;
}

export interface IAdminUser {
    username: string;
    password: string;
    email: string;
    role: 'admin' | 'superadmin';
    isActive: boolean;
    lastLogin?: Date;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    errors?: any[];
}
