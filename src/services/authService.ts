import apiClient, { handleApiError } from './api';
import * as SecureStore from 'expo-secure-store';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';
import { STORAGE_KEYS } from '../utils/constants';

export const authService = {
  // Register new user
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
      await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Login user
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', data);
      await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
      await SecureStore.setItemAsync(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Get stored user data
  getStoredUser: async (): Promise<User | null> => {
    try {
      const userData = await SecureStore.getItemAsync(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting stored user:', error);
      return null;
    }
  },

  // Get stored token
  getStoredToken: async (): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting stored token:', error);
      return null;
    }
  },
};