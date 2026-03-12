import type { Session, User, AuthError } from '@supabase/supabase-js';
import type { UserRole, AccountStatus } from '../enums/auth.enums';

export interface ProfileData {
  full_name: string;
  contact_number?: string;
  date_of_birth?: string;
  address?: string;
  gender?: string;
}

export interface IUser {
  id: string;
  full_name: string;
  email: string;
  contact_number?: string | null;
  role: UserRole;
  gender?: string | null;
  address?: string | null;
  date_of_birth?: string | null;
  account_status: AccountStatus;
  created_at: string;
}

export interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUpWithEmail: (
    email: string,
    password: string,
    profile: ProfileData
  ) => Promise<{ error: AuthError | null }>;
  signInWithEmail: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}
