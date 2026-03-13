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

const STORAGE_KEY = 'uiy_has_team';
const COOKIE_KEY = 'uiy_team_data';

const readCacheBoolean = (): boolean => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === 'true';
  } catch {
    return false;
  }
};

const readTeamFromCookie = (): IMyTeam | null => {
  try {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, val] = cookie.trim().split('=');
      acc[key] = decodeURIComponent(val);
      return acc;
    }, {} as Record<string, string>);
    const raw = cookies[COOKIE_KEY];
    return raw ? (JSON.parse(raw) as IMyTeam) : null;
  } catch {
    return null;
  }
};

const setTeamCookie = (team: IMyTeam | null) => {
  if (team) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7); // 7 day expiry
    document.cookie = `${COOKIE_KEY}=${encodeURIComponent(JSON.stringify(team))}; path=/; expires=${expires.toUTCString()}`;
  } else {
    document.cookie = `${COOKIE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
  }
};

const TeamStatusContext = createContext<TeamStatusContextValue | undefined>(undefined);

export const TeamStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [myTeam, setMyTeam] = useState<IMyTeam | null>(() => readTeamFromCookie());
  const [hasTeamCache, setHasTeamCache] = useState(readCacheBoolean);
  const [teamLoading, setTeamLoading] = useState(false);

  // Initialize myTeam as a sentinel if cache says we have a team (so button shows before API returns)
  useEffect(() => {
    if (hasTeamCache && !myTeam) {
      const sentinel: IMyTeam = {
        id: '',
        team_name: '',
        university_id: '',
        created_at: new Date().toISOString(),
        university: { id: '', name: '' },
        supervisor: null,
        coSupervisor: null,
        members: [],
      };
      setMyTeam(sentinel);
    }
  }, [hasTeamCache, myTeam]);

  const fetchMyTeam = useCallback(async () => {
    if (!user) {
      setMyTeam(null);
      setHasTeamCache(false);
      setTeamCookie(null);
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    setTeamLoading(true);
    try {
      const team = await teamsAPI.getMyTeam();
      setMyTeam(team);
      const hasTeam = !!team;
      setHasTeamCache(hasTeam);
      localStorage.setItem(STORAGE_KEY, hasTeam.toString());
      setTeamCookie(team);
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
