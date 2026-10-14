import api from './client';
import { AuthResponse, ApiResponse } from '../types';

export const authApi = {
  register: async (data: { name: string; email: string; password: string }) => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return res.data.data!;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return res.data.data!;
  },

  me: async () => {
    const res = await api.get<ApiResponse<{ user: AuthResponse['user'] }>>('/auth/me');
    return res.data.data!.user;
  },
};
