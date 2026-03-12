/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { IMyTeam } from '../types/teams.types';
import { teamsAPI } from '../api/teams.api';
import { useAuth } from '@/features/Auth/hooks/use-auth';

interface TeamStatusContextValue {
  myTeam: IMyTeam | null;
  teamLoading: boolean;
  refreshMyTeam: () => Promise<void>;
}

const STORAGE_KEY = 'uiy_my_team';

const readCache = (): IMyTeam | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as IMyTeam) : null;
  } catch {
    return null;
  }
};

const TeamStatusContext = createContext<TeamStatusContextValue | undefined>(undefined);

export const TeamStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [myTeam, setMyTeam] = useState<IMyTeam | null>(readCache);
  const [teamLoading, setTeamLoading] = useState(false);

  const fetchMyTeam = useCallback(async () => {
    if (!user) {
      setMyTeam(null);
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    setTeamLoading(true);
    try {
      const team = await teamsAPI.getMyTeam();
      setMyTeam(team);
      if (team) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(team));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Keep existing cached value on network error so the button stays visible
    } finally {
      setTeamLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) fetchMyTeam();
  }, [authLoading, fetchMyTeam]);

  return (
    <TeamStatusContext.Provider value={{ myTeam, teamLoading, refreshMyTeam: fetchMyTeam }}>
      {children}
    </TeamStatusContext.Provider>
  );
};

export const useTeamStatus = (): TeamStatusContextValue => {
  const ctx = useContext(TeamStatusContext);
  if (!ctx) throw new Error('useTeamStatus must be used within TeamStatusProvider');
  return ctx;
};
