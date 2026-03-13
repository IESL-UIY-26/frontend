import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@/utils/api-client';
import { useAuth } from '@/features/Auth/hooks/use-auth';
import { sessionsAPI } from '../api/sessions.api';
import type { IMyRegistration } from '../types/sessions.types';

export const useSessions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  const {
    data: sessions = [],
    isLoading: sessionsLoading,
    error: sessionsError,
  } = useQuery({
    queryKey: ['available-sessions'],
    queryFn: () => sessionsAPI.getAvailableSessions(),
    staleTime: 5 * 60 * 1000,
  });

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
    if (sessionsError instanceof ApiError && sessionsError.status === 404 && sessionsError.path === '/api/sessions/available') {
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
    loading,
    error,
    registeredIds,
    togglingIds,
    toggleRegistration,
  };
};
