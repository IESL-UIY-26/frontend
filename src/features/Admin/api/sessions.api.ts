import api from '@/utils/api-client';
import type { CreateSessionDto, UpdateSessionDto } from '../dtos/sessions.dto';
import type { ISession } from '../types/sessions.types';

export const sessionsAPI = {
  getSessions: async (): Promise<ISession[]> => {
    const response = await api.get<ISession[]>('/api/sessions');
    return response.data;
  },

  createSession: async (data: CreateSessionDto): Promise<ISession> => {
    const response = await api.post<ISession>('/api/sessions', data);
    return response.data;
  },

  updateSession: async (id: string, data: UpdateSessionDto): Promise<ISession> => {
    const response = await api.patch<ISession>(`/api/sessions/${id}`, data);
    return response.data;
  },

  deleteSession: async (id: string): Promise<void> => {
    await api.delete(`/api/sessions/${id}`);
  },
};
