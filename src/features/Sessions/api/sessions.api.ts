import api from '@/utils/api-client';
import type {
  IAvailableSessionsResponse,
  IAvailableSession,
  IFeedbackPayload,
  IGetAvailableSessionsResult,
  IMyRegistration,
  ISessionFeedback,
} from '../types/sessions.types';

export const sessionsAPI = {
  getAvailableSessions: async (page = 1): Promise<IGetAvailableSessionsResult> => {
    const response = await api.getRaw<IAvailableSessionsResponse>(`/api/sessions/available?page=${page}`);
    return {
      sessions: response.data,
      pagination: response.pagination,
    };
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

  getMyFeedback: async (sessionId: string): Promise<ISessionFeedback | null> => {
    const response = await api.get<ISessionFeedback | null>(`/api/sessions/${sessionId}/feedback/me`);
    return response.data;
  },

  createFeedback: async (sessionId: string, payload: IFeedbackPayload): Promise<ISessionFeedback> => {
    const response = await api.post<ISessionFeedback>(`/api/sessions/${sessionId}/feedback`, payload);
    return response.data;
  },

  updateFeedback: async (sessionId: string, payload: Partial<IFeedbackPayload>): Promise<ISessionFeedback> => {
    const response = await api.patch<ISessionFeedback>(`/api/sessions/${sessionId}/feedback`, payload);
    return response.data;
  },

  deleteFeedback: async (sessionId: string): Promise<void> => {
    await api.delete(`/api/sessions/${sessionId}/feedback`);
  },

  getSessionFeedbacksForAdmin: async (sessionId: string): Promise<Array<ISessionFeedback & { user: { id: string; full_name: string; email: string } }>> => {
    const response = await api.get<Array<ISessionFeedback & { user: { id: string; full_name: string; email: string } }>>(
      `/api/sessions/${sessionId}/feedback`
    );
    return response.data;
  },
};
