import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

/**
 * Landing page after a Supabase OAuth redirect.
 * Supabase appends the tokens as a URL fragment; the JS client picks them up
 * automatically on load so we just wait for the session, then redirect home.
 */
const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Whether session exists or not, send user away from this intermediate page
      navigate(session ? '/' : '/login', { replace: true });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-uiy-darkblue via-uiy-blue to-uiy-accent">
      <div className="flex flex-col items-center gap-4 text-white">
        <Loader2 className="h-10 w-10 animate-spin" />
        <p className="text-lg font-medium">Finishing sign-in…</p>
      </div>
    </div>
  );
};

export default AuthCallback;
