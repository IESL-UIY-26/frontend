import React from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/use-auth';
import { UserRole } from '../enums/auth.enums';

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loading, dbUser } = useAuth();

  if (loading && !dbUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-uiy-darkblue via-uiy-blue to-uiy-accent">
        <Loader2 className="h-10 w-10 animate-spin text-white" />
      </div>
    );
  }

  if (!dbUser || dbUser.role !== UserRole.ADMIN) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
