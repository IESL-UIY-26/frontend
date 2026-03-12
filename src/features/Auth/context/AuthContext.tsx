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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        setDbUser(null);
      }

      if (_event === 'SIGNED_IN' && session) {
        const pendingStr = localStorage.getItem('pending_profile');
        const pendingProfile: Partial<ProfileData> | undefined = pendingStr
          ? (JSON.parse(pendingStr) as Partial<ProfileData>)
          : undefined;
        const syncedUser = await authAPI.syncUser(session.access_token, pendingProfile);
        setDbUser(syncedUser ?? null);
        if (pendingStr) localStorage.removeItem('pending_profile');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

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
        setDbUser(syncedUser ?? null);
        if (pendingStr) localStorage.removeItem('pending_profile');
        return { error: null, dbUser: syncedUser ?? null };
      }

      return { error, dbUser: null };
    },
    []
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
