import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectsAPI } from '../api/projects.api';
import { ApiError } from '@/utils/api-client';

export const useProjects = () => {
  const {
    data: projects = [],
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ['public-projects'],
    queryFn: () => projectsAPI.getPublicProjects(),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000,
  });

  const error = useMemo(() => {
    if (!queryError) return null;
    if (queryError instanceof ApiError && queryError.status === 404 && queryError.path === '/api/public/projects') {
      return 'Public projects service is not available right now (endpoint not found). Please contact admin or try again later.';
    }
    return queryError instanceof Error ? queryError.message : 'Failed to load projects';
  }, [queryError]);

  return {
    projects,
    loading,
    error,
  };
};
