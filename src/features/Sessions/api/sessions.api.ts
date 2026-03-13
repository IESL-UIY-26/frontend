import api from '@/utils/api-client';
import type { IAvailableSession, IMyRegistration } from '../types/sessions.types';

export const sessionsAPI = {
  getAvailableSessions: async (): Promise<IAvailableSession[]> => {
    const response = await api.get<IAvailableSession[]>('/api/sessions/available');
    return response.data;
  },

  getMyRegistrations: async (): Promise<IMyRegistration[]> => {
    const response = await api.get<IMyRegistration[]>('/api/sessions/my-registrations');
    return response.data;
  },

  register: async (sessionId: string): Promise<void> => {
    await api.post<{ success: boolean }>(`/api/sessions/${sessionId}/register`);
  },

  unregister: async (sessionId: string): Promise<void> => {
    await api.delete<{ success: boolean }>(`/api/sessions/${sessionId}/register`);
  },
};
