import api from '@/utils/api-client';
import type { IProject, IProjectPayload, IPublicProject } from '../types/projects.types';

export const projectsAPI = {
  getPublicProjects: async (): Promise<IPublicProject[]> => {
    const response = await api.get<IPublicProject[]>('/api/public/projects');
    return response.data;
  },

  getTeamProjects: async (teamId: string): Promise<IProject[]> => {
    const response = await api.get<IProject[]>(`/api/teams/${teamId}/projects`);
    return response.data;
  },

  createProject: async (teamId: string, payload: IProjectPayload): Promise<IProject> => {
    const response = await api.post<IProject>(`/api/teams/${teamId}/projects`, payload);
    return response.data;
  },

  updateProject: async (projectId: string, payload: Partial<IProjectPayload>): Promise<IProject> => {
    const response = await api.patch<IProject>(`/api/projects/${projectId}`, payload);
    return response.data;
  },
};
