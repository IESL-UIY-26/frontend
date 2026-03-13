import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ApiError } from '@/utils/api-client';
import { useAuth } from '@/features/Auth/hooks/use-auth';
import { sessionsAPI } from '../api/sessions.api';
import type { IAvailableSession } from '../types/sessions.types';

export const useSessions = () => {
  const { user } = useAuth();

  const [sessions, setSessions] = useState<IAvailableSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const requests: [Promise<IAvailableSession[]>, Promise<string[]>] = [
          sessionsAPI.getAvailableSessions(),
          user
            ? sessionsAPI.getMyRegistrations().then((regs) => regs.map((r) => r.session_id))
            : Promise.resolve([]),
        ];
        const [data, regIds] = await Promise.all(requests);
        setSessions(data);
        setRegisteredIds(new Set(regIds));
      } catch (err) {
        if (err instanceof ApiError && err.status === 404 && err.path === '/api/sessions/available') {
          setError('Sessions service is not available right now (endpoint not found). Please contact admin or try again later.');
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load sessions');
        }
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, [user]);

  const toggleRegistration = useCallback(
    async (sessionId: string, currentlyRegistered: boolean) => {
      if (togglingIds.has(sessionId)) return;
      setTogglingIds((prev) => new Set(prev).add(sessionId));
      try {
        if (currentlyRegistered) {
          await sessionsAPI.unregister(sessionId);
          setRegisteredIds((prev) => {
            const next = new Set(prev);
            next.delete(sessionId);
            return next;
          });
          toast.success('Registration cancelled');
        } else {
          await sessionsAPI.register(sessionId);
          setRegisteredIds((prev) => new Set(prev).add(sessionId));
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
    [togglingIds]
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
