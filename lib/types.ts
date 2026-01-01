// Portfolio Content Type Definitions

export interface Profile {
    _id?: string;
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
    isActive?: boolean;
}

export interface Skill {
    name: string;
    level?: number; // 0-100
}

export interface SkillCategory {
    _id: string;
    categoryId: string;
    title: string;
    description: string;
    icon: string;
    skills: Skill[];
    isActive: boolean;
    order: number;
}

export interface Project {
    _id: string;
    title: string;
    description: string;
    tags: string[];
    imageUrl: string;
    liveUrl?: string;
    githubUrl?: string;
    isActive: boolean;
    order: number;
    featured?: boolean;
}

export interface Testimonial {
    _id: string;
    name: string;
    role: string;
    company: string;
    content: string;
    avatar: string;
    isActive: boolean;
    order: number;
}

export interface NavigationItem {
    label: string;
    href: string;
    visible: boolean;
}

export interface SectionConfig {
    id: string;
    title: string;
    visible: boolean;
    order: number;
}

// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    errors?: any[];
}

// Auth Types
export interface LoginCredentials {
    username: string;
    password: string;
}

export interface SessionData {
    isAuthenticated: boolean;
    username?: string;
    role?: string;
}
