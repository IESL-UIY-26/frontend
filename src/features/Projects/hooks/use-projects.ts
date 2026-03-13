import { useEffect, useState } from 'react';
import { projectsAPI } from '../api/projects.api';
import type { IPublicProject } from '../types/projects.types';
import { ApiError } from '@/utils/api-client';

export const useProjects = () => {
  const [projects, setProjects] = useState<IPublicProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await projectsAPI.getPublicProjects();
        setProjects(data);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404 && err.path === '/api/public/projects') {
          setError('Public projects service is not available right now (endpoint not found). Please contact admin or try again later.');
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load projects');
        }
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, []);

  return {
    projects,
    loading,
    error,
  };
};
