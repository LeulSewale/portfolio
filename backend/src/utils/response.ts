import { ApiResponse } from '../types';

export const successResponse = <T>(data: T, message?: string): ApiResponse<T> => {
    return {
        success: true,
        data,
        message,
    };
};

export const errorResponse = (error: string, errors?: any[]): ApiResponse => {
    return {
        success: false,
        error,
        errors,
    };
};
