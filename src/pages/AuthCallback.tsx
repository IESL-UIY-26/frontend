import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { authAPI } from '@/features/Auth/api/auth.api';
import { Loader2 } from 'lucide-react';

/**
 * Landing page after a Supabase OAuth redirect.
 * Syncs the user to the backend, then redirects to profile completion if
 * optional fields (phone, DOB, etc.) are missing, otherwise goes home.
 */
const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        navigate('/login', { replace: true });
        return;
      }
      const user = await authAPI.syncUser(session.access_token);
      const isComplete = !!(user?.contact_number && user?.date_of_birth);
      navigate(isComplete ? '/' : '/complete-profile', { replace: true });
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
