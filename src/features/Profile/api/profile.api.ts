import api from '@/utils/api-client';
import { sessionsAPI } from '@/features/Sessions/api/sessions.api';
import type { IAvailableSession } from '@/features/Sessions/types/sessions.types';
import type { IMyProfile, IMySessionRegistration, IUpdateMyProfilePayload } from '../types/profile.types';

export const profileAPI = {
  getMyProfile: async (): Promise<IMyProfile> => {
    const response = await api.get<IMyProfile>('/api/users/me');
    return response.data;
  },

  updateMyProfile: async (payload: IUpdateMyProfilePayload): Promise<IMyProfile> => {
    const response = await api.patch<IMyProfile>('/api/users/me', payload);
    return response.data;
  },

  getMyRegistrations: async (): Promise<IMySessionRegistration[]> => {
    const response = await api.get<IMySessionRegistration[]>('/api/sessions/my-registrations');
    return response.data;
  },

  getAvailableSessions: async (): Promise<IAvailableSession[]> => {
    return sessionsAPI.getAvailableSessions();
  },

  registerToSession: async (sessionId: string): Promise<void> => {
    await sessionsAPI.register(sessionId);
  },

  unregisterFromSession: async (sessionId: string): Promise<void> => {
    await sessionsAPI.unregister(sessionId);
  },
};
