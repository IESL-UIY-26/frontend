import api from '@/utils/api-client';
import type { IUserSearchResult } from '../types/teams.types';

export const usersAPI = {
  searchByEmail: async (email: string): Promise<IUserSearchResult[]> => {
    const response = await api.get<IUserSearchResult[]>(
      `/api/users/search?email=${encodeURIComponent(email)}`
    );
    return response.data;
  },
};
