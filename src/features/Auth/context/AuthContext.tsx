/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { authAPI } from '../api/auth.api';
import type { AuthContextValue, IUser, ProfileData } from '../types/auth.types';

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const DB_USER_CACHE_KEY = 'uiy_db_user';

const readCachedDbUser = (): IUser | null => {
  try {
    const raw = localStorage.getItem(DB_USER_CACHE_KEY);
    return raw ? (JSON.parse(raw) as IUser) : null;
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<IUser | null>(() => readCachedDbUser());
  const [loading, setLoading] = useState(true);

  const setDbUserWithCache = useCallback((next: IUser | null) => {
    setDbUser(next);
    try {
      if (next) {
        localStorage.setItem(DB_USER_CACHE_KEY, JSON.stringify(next));
      } else {
        localStorage.removeItem(DB_USER_CACHE_KEY);
      }
    } catch {
      // ignore localStorage failures
    }
  }, []);

  useEffect(() => {
    const bootstrapSession = async () => {
      setLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setSession(session);
        setUser(session?.user ?? null);

        if (session) {
          const pendingStr = localStorage.getItem('pending_profile');
          const pendingProfile: Partial<ProfileData> | undefined = pendingStr
            ? (JSON.parse(pendingStr) as Partial<ProfileData>)
            : undefined;

          try {
            const syncedUser = await authAPI.syncUser(session.access_token, pendingProfile);
            setDbUserWithCache(syncedUser ?? null);
            if (pendingStr) localStorage.removeItem('pending_profile');
          } catch {
            setDbUserWithCache(null);
          }
        } else {
          setDbUserWithCache(null);
        }
      } finally {
        setLoading(false);
      }
    };

    void bootstrapSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        setDbUserWithCache(null);
        setLoading(false);
        return;
      }

      if ((_event === 'SIGNED_IN' || _event === 'INITIAL_SESSION') && session) {
        setLoading(true);
        const pendingStr = localStorage.getItem('pending_profile');
        const pendingProfile: Partial<ProfileData> | undefined = pendingStr
          ? (JSON.parse(pendingStr) as Partial<ProfileData>)
          : undefined;
        try {
          const syncedUser = await authAPI.syncUser(session.access_token, pendingProfile);
          setDbUserWithCache(syncedUser ?? null);
          if (pendingStr) localStorage.removeItem('pending_profile');
        } catch {
          // Keep cached dbUser on transient sync errors to avoid UI role flicker.
        }
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [setDbUserWithCache]);

  const signUpWithEmail = useCallback(
    async (email: string, password: string, profile: ProfileData) => {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (!error && data.session) {
        await authAPI.syncUser(data.session.access_token, profile);
      } else if (!error && data.user && !data.session) {
        localStorage.setItem('pending_profile', JSON.stringify(profile));
      }

      return { error };
    },
    []
  );

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data.session) {
        const pendingStr = localStorage.getItem('pending_profile');
        const pendingProfile: Partial<ProfileData> | undefined = pendingStr
          ? (JSON.parse(pendingStr) as Partial<ProfileData>)
          : undefined;
        const syncedUser = await authAPI.syncUser(data.session.access_token, pendingProfile);
        setDbUserWithCache(syncedUser ?? null);
        if (pendingStr) localStorage.removeItem('pending_profile');
        return { error: null, dbUser: syncedUser ?? null };
      }

      return { error, dbUser: null };
    },
    [setDbUserWithCache]
  );

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, user, dbUser, loading, signUpWithEmail, signInWithEmail, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};
