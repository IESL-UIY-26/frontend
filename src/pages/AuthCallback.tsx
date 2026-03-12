import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/features/Auth/hooks/use-auth';
import { UserRole } from '@/features/Auth/enums/auth.enums';

/**
 * Landing page after a Supabase OAuth redirect.
 * Waits for AuthContext to finish syncing the user (onAuthStateChange SIGNED_IN),
 * then redirects based on role and profile completeness.
 */
const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { loading, session, dbUser } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!session) {
      navigate('/login', { replace: true });
      return;
    }
    if (!dbUser) return; // still waiting for onAuthStateChange to finish syncing

    if (dbUser.role === UserRole.ADMIN) {
      navigate('/admin', { replace: true });
    } else {
      const isComplete = !!(dbUser.contact_number && dbUser.date_of_birth);
      navigate(isComplete ? '/' : '/complete-profile', { replace: true });
    }
  }, [loading, session, dbUser, navigate]);

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
