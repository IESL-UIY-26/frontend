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
import type { AuthContextValue } from '../types/auth.types';

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
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

      if (_event === 'SIGNED_IN' && session) {
        await authAPI.syncUser(session.access_token);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUpWithEmail = useCallback(
    async (email: string, password: string, fullName: string) => {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (!error && data.session) {
        await authAPI.syncUser(data.session.access_token, fullName);
      } else if (!error && data.user && !data.session) {
        localStorage.setItem('pending_full_name', fullName);
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
        const pendingName = localStorage.getItem('pending_full_name') ?? undefined;
        await authAPI.syncUser(data.session.access_token, pendingName);
        if (pendingName) localStorage.removeItem('pending_full_name');
      }

      return { error };
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
      value={{ session, user, loading, signUpWithEmail, signInWithEmail, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};
