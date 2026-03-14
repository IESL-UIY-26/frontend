import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { projectsAPI } from '../api/projects.api';
import { ApiError } from '@/utils/api-client';
import { useAuth } from '@/features/Auth/hooks/use-auth';
import type { IGetPublicProjectsResult } from '../types/projects.types';

export const useProjects = (page: number, query = '') => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  const {
    data: publicProjectsData,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ['public-projects', page, query],
    queryFn: () =>
      query ? projectsAPI.searchProjectsByName(query, page) : projectsAPI.getPublicProjects(page),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000,
  });

  const projects = publicProjectsData?.projects ?? [];
  const pagination = publicProjectsData?.pagination;
  const totalPages = pagination?.totalPages ?? 0;
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  const error = useMemo(() => {
    if (!queryError) return null;
    if (
      queryError instanceof ApiError &&
      queryError.status === 404 &&
      queryError.path.startsWith('/api/public/projects')
    ) {
      return 'Public projects service is not available right now (endpoint not found). Please contact admin or try again later.';
    }
    return queryError instanceof Error ? queryError.message : 'Failed to load projects';
  }, [queryError]);

  const voteMutation = useMutation({
    mutationFn: (projectId: string) => projectsAPI.createVote(projectId),
  });

  const unvoteMutation = useMutation({
    mutationFn: (projectId: string) => projectsAPI.removeVote(projectId),
  });

  const updateVoteCount = useCallback(
    (projectId: string, delta: 1 | -1) => {
      queryClient.setQueryData<IGetPublicProjectsResult>(['public-projects', page, query], (prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          projects: prev.projects.map((project) =>
            project.id === projectId
              ? {
                  ...project,
                  vote_count: Math.max(0, project.vote_count + delta),
                }
              : project
          ),
        };
      });
    },
    [page, query, queryClient]
  );

  const toggleVote = useCallback(
    async (projectId: string) => {
      if (!user) return;
      if (togglingIds.has(projectId)) return;

      setTogglingIds((prev) => new Set(prev).add(projectId));
      const currentlyVoted = votedIds.has(projectId);

      try {
        if (currentlyVoted) {
          await unvoteMutation.mutateAsync(projectId);
          setVotedIds((prev) => {
            const next = new Set(prev);
            next.delete(projectId);
            return next;
          });
          updateVoteCount(projectId, -1);
          toast.success('Vote removed');
        } else {
          await voteMutation.mutateAsync(projectId);
          setVotedIds((prev) => new Set(prev).add(projectId));
          updateVoteCount(projectId, 1);
          toast.success('Vote added');
        }
      } catch (err) {
        if (err instanceof ApiError && err.status === 409) {
          setVotedIds((prev) => new Set(prev).add(projectId));
          toast.info('You have already voted for this project. Click again to remove vote.');
        } else if (err instanceof ApiError && err.status === 404 && err.message.includes('Vote not found')) {
          setVotedIds((prev) => {
            const next = new Set(prev);
            next.delete(projectId);
            return next;
          });
          toast.info('No existing vote found for this project.');
        } else {
          toast.error(err instanceof Error ? err.message : 'Vote action failed');
        }
      } finally {
        setTogglingIds((prev) => {
          const next = new Set(prev);
          next.delete(projectId);
          return next;
        });
      }
    },
    [user, togglingIds, votedIds, unvoteMutation, updateVoteCount, voteMutation]
  );

  return {
    projects,
    totalPages,
    hasPreviousPage,
    hasNextPage,
    loading,
    error,
    votedIds,
    togglingIds,
    toggleVote,
  };
};
