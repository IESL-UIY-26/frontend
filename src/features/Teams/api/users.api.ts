import api from '@/utils/api-client';
import type { IUserSearchResult } from '../types/teams.types';

export const usersAPI = {
  search: async (query: string): Promise<IUserSearchResult[]> => {
    const response = await api.get<IUserSearchResult[]>(
      `/api/users/search?q=${encodeURIComponent(query)}`
    );
    return response.data;
  },
};
