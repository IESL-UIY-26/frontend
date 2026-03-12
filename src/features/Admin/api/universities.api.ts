import api from '@/utils/api-client';
import type { CreateUniversityDto, UpdateUniversityDto } from '../dtos/universities.dto';
import type { IUniversity } from '../types/universities.types';

export const universitiesAPI = {
  getUniversities: async (): Promise<IUniversity[]> => {
    const response = await api.get<IUniversity[]>('/api/universities');
    return response.data;
  },

  createUniversity: async (data: CreateUniversityDto): Promise<IUniversity> => {
    const response = await api.post<IUniversity>('/api/universities', data);
    return response.data;
  },

  updateUniversity: async (id: string, data: UpdateUniversityDto): Promise<IUniversity> => {
    const response = await api.patch<IUniversity>(`/api/universities/${id}`, data);
    return response.data;
  },

  deleteUniversity: async (id: string): Promise<void> => {
    await api.delete(`/api/universities/${id}`);
  },
};
