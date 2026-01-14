import axiosInstance from './axiosInstance';

export interface LoginResponse {
    accessToken: string;
    user: {
        username: string;
        role: 'admin' | 'user';
    };
}

export interface User {
    username: string;
    role: 'admin' | 'user';
}

export const authApi = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await axiosInstance.post<LoginResponse>('/api/login', { email, password });
        return response.data;
    },

    getMe: async (): Promise<User> => {
        const response = await axiosInstance.get<User>('/api/me');
        return response.data;
    },
};
