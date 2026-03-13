import api from '@/utils/api-client';
import type { IAvailableSession } from '../types/sessions.types';

export const sessionsAPI = {
  getAvailableSessions: async (): Promise<IAvailableSession[]> => {
    const response = await api.get<IAvailableSession[]>('/api/sessions/available');
    return response.data;
  },
};
