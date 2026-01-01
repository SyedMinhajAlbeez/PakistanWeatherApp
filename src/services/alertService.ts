import apiClient, { handleApiError } from './api';
import { Alert, CreateAlertRequest, CurrentWeather, ForecastPrediction } from '../types';

export const alertService = {
  // Get all alerts
  getAlerts: async (): Promise<Alert[]> => {
    try {
      const response = await apiClient.get<Alert[]>('/alerts');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get alert by ID
  getAlertById: async (id: string): Promise<Alert> => {
    try {
      const response = await apiClient.get<Alert>(`/alerts/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Create new alert (Admin only)
  createAlert: async (data: CreateAlertRequest): Promise<Alert> => {
    try {
      const response = await apiClient.post<Alert>('/alerts', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Update alert (Admin only)
  updateAlert: async (id: string, data: Partial<CreateAlertRequest>): Promise<Alert> => {
    try {
      const response = await apiClient.put<Alert>(`/alerts/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Delete alert (Admin only)
  deleteAlert: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/alerts/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get current weather
  getCurrentWeather: async (): Promise<CurrentWeather> => {
    try {
      const response = await apiClient.get<CurrentWeather>('/weather/current');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Get forecast predictions
  getForecastPredictions: async (): Promise<ForecastPrediction[]> => {
    try {
      const response = await apiClient.get<ForecastPrediction[]>('/ml/predict');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },
};