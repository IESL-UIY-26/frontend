import api from '@/utils/api-client';
import type {
  IGetPublicProjectsResult,
  IProject,
  IProjectPayload,
  IPublicProjectsResponse,
} from '../types/projects.types';

export const projectsAPI = {
  getPublicProjects: async (page = 1): Promise<IGetPublicProjectsResult> => {
    const response = await api.getRaw<IPublicProjectsResponse>(`/api/public/projects?page=${page}`);
    return {
      projects: response.data,
      pagination: response.pagination,
    };
  },

  searchProjectsByName: async (q: string, page = 1): Promise<IGetPublicProjectsResult> => {
    const response = await api.getRaw<IPublicProjectsResponse>(
      `/api/public/projects/search?q=${encodeURIComponent(q)}&page=${page}`
    );
    return {
      projects: response.data,
      pagination: response.pagination,
    };
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

  uploadProjectImage: async (teamId: string, file: File): Promise<{ url: string; fileId: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('teamId', teamId);
    const response = await api.postForm<{ url: string; fileId: string }>('/api/uploads/project-image', formData);
    return response.data;
  },

  deleteUploadedFile: async (fileId: string): Promise<void> => {
    await api.delete(`/api/uploads/temp/${encodeURIComponent(fileId)}`);
  },

  createVote: async (projectId: string): Promise<void> => {
    await api.post(`/api/projects/${projectId}/vote`);
  },

  removeVote: async (projectId: string): Promise<void> => {
    await api.delete(`/api/projects/${projectId}/vote`);
  },
};
