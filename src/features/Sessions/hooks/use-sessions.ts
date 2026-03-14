import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@/utils/api-client';
import { useAuth } from '@/features/Auth/hooks/use-auth';
import { sessionsAPI } from '../api/sessions.api';
import type { IGetAvailableSessionsResult, IMyRegistration } from '../types/sessions.types';

export const useSessions = (page: number, date = '') => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  const {
    data: sessionsData,
    isLoading: sessionsLoading,
    error: sessionsError,
  } = useQuery({
    queryKey: ['available-sessions', page, date],
    queryFn: () =>
      date ? sessionsAPI.searchSessionsByDate(date, page) : sessionsAPI.getAvailableSessions(page),
    staleTime: 5 * 60 * 1000,
  });

  const sessions = sessionsData?.sessions ?? [];
  const pagination = sessionsData?.pagination;
  const totalPages = pagination?.totalPages ?? 0;
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  const {
    data: myRegistrations = [],
    isLoading: registrationsLoading,
  } = useQuery({
    queryKey: ['my-session-registrations', user?.id],
    queryFn: () => sessionsAPI.getMyRegistrations(),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  const registeredIds = useMemo(
    () => new Set(myRegistrations.map((reg: IMyRegistration) => reg.session_id)),
    [myRegistrations]
  );

  const registerMutation = useMutation({
    mutationFn: (sessionId: string) => sessionsAPI.register(sessionId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['my-session-registrations', user?.id] });
    },
  });

  const unregisterMutation = useMutation({
    mutationFn: (sessionId: string) => sessionsAPI.unregister(sessionId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['my-session-registrations', user?.id] });
    },
  });

  const error = useMemo(() => {
    if (!sessionsError) return null;
    if (
      sessionsError instanceof ApiError &&
      sessionsError.status === 404 &&
      sessionsError.path.startsWith('/api/sessions/available')
    ) {
      return 'Sessions service is not available right now (endpoint not found). Please contact admin or try again later.';
    }
    return sessionsError instanceof Error ? sessionsError.message : 'Failed to load sessions';
  }, [sessionsError]);

  const loading = sessionsLoading || (!!user && registrationsLoading);

  const toggleRegistration = useCallback(
    async (sessionId: string, currentlyRegistered: boolean) => {
      if (togglingIds.has(sessionId)) return;
      setTogglingIds((prev) => new Set(prev).add(sessionId));
      try {
        if (currentlyRegistered) {
          await unregisterMutation.mutateAsync(sessionId);
          toast.success('Registration cancelled');
        } else {
          await registerMutation.mutateAsync(sessionId);
          toast.success('Successfully registered!');
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Action failed');
      } finally {
        setTogglingIds((prev) => {
          const next = new Set(prev);
          next.delete(sessionId);
          return next;
        });
      }
    },
    [togglingIds, registerMutation, unregisterMutation]
  );

  return {
    sessions,
    totalPages,
    hasPreviousPage,
    hasNextPage,
    loading,
    error,
    registeredIds,
    togglingIds,
    toggleRegistration,
  };
};
