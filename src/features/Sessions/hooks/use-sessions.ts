import { useEffect, useState } from 'react';
import { ApiError } from '@/utils/api-client';
import { sessionsAPI } from '../api/sessions.api';
import type { IAvailableSession } from '../types/sessions.types';

export const useSessions = () => {
  const [sessions, setSessions] = useState<IAvailableSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await sessionsAPI.getAvailableSessions();
        setSessions(data);
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
  }, []);

  return {
    sessions,
    loading,
    error,
  };
};
