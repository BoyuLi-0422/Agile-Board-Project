import axiosClient from '../api/axiosClient';
import type { AuthRequest, AuthResponse } from '../types/auth';

export const authService = {
  /**
   * 用户登录
   */
  login: (payload: AuthRequest): Promise<AuthResponse> => {
    return axiosClient.post<AuthResponse>('/auth/login', payload);
  },

  /**
   * 用户注册
   */
  register: (payload: AuthRequest): Promise<AuthResponse> => {
    return axiosClient.post<AuthResponse>('/auth/register', payload);
  },
};