/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
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
  const myTeamRef = useRef(myTeam);

  // Keep ref in sync with state
  useEffect(() => {
    myTeamRef.current = myTeam;
  }, [myTeam]);

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
    // Only clear team data if auth is done loading and we're certain there's no user
    // Don't clear during auth revalidation to prevent losing cached data
    if (!user) {
      if (!authLoading) {
        setMyTeam(null);
        setHasTeamCache(false);
        setTeamCookie(null);
        localStorage.removeItem(STORAGE_KEY);
      }
      return;
    }

    // Skip fetching if we already have cached team data and this isn't a manual refresh
    // This prevents unnecessary loading states when navigating between pages
    const hasCachedTeam = myTeamRef.current && (myTeamRef.current.id !== '');
    if (hasCachedTeam) {
      // Silently revalidate in background without setting loading state
      try {
        const team = await teamsAPI.getMyTeam();

        // Only update state if the team actually changed to prevent unnecessary rerenders
        const teamChanged = JSON.stringify(team) !== JSON.stringify(myTeamRef.current);
        if (teamChanged) {
          setMyTeam(team);
        }

        const hasTeam = !!team;
        setHasTeamCache(hasTeam);
        localStorage.setItem(STORAGE_KEY, hasTeam.toString());
        setTeamCookie(team);
      } catch {
        // Keep existing cached value on network error
      }
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
  }, [user, authLoading]);

  useEffect(() => {
    // Only fetch if auth is ready AND we don't already have valid cached team data
    // This prevents unnecessary fetches when navigating between pages
    const hasCachedTeam = myTeamRef.current && myTeamRef.current.id !== '';

    if (!authLoading && !hasCachedTeam) {
      void fetchMyTeam();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading]); // Only depend on authLoading, not fetchMyTeam or myTeam

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
