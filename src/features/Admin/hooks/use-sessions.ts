import { useState, useCallback, useEffect } from 'react';
import { sessionsAPI } from '../api/sessions.api';
import type { ISession } from '../types/sessions.types';
import type { CreateSessionDto, UpdateSessionDto } from '../dtos/sessions.dto';
import { AppToast } from '@/utils/toast-utils';

export function useSessions() {
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      setSessions(await sessionsAPI.getSessions());
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch sessions';
      AppToast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void fetchSessions(); }, [fetchSessions]);

  const createSession = useCallback(async (data: CreateSessionDto) => {
    try {
      await sessionsAPI.createSession(data);
      AppToast.success('Session created');
      void fetchSessions();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create session';
      AppToast.error(msg);
      throw err;
    }
  }, [fetchSessions]);

  const updateSession = useCallback(async (id: string, data: UpdateSessionDto) => {
    try {
      await sessionsAPI.updateSession(id, data);
      AppToast.success('Session updated');
      void fetchSessions();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update session';
      AppToast.error(msg);
      throw err;
    }
  }, [fetchSessions]);

  const deleteSession = useCallback(async (id: string) => {
    try {
      await sessionsAPI.deleteSession(id);
      AppToast.success('Session deleted');
      void fetchSessions();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete session';
      AppToast.error(msg);
      throw err;
    }
  }, [fetchSessions]);

  return { sessions, loading, refetch: fetchSessions, createSession, updateSession, deleteSession };
}
