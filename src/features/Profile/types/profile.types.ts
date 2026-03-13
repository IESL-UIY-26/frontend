import type { AccountStatus, UserRole } from '@/features/Auth/enums/auth.enums';
import type { IAvailableSession } from '@/features/Sessions/types/sessions.types';

export interface IMyProfile {
  id: string;
  full_name: string;
  email: string;
  contact_number: string | null;
  role: UserRole;
  gender: string | null;
  address: string | null;
  date_of_birth: string | null;
  account_status: AccountStatus;
  created_at: string;
}

export interface IUpdateMyProfilePayload {
  full_name?: string;
  contact_number?: string | null;
  gender?: string | null;
  address?: string | null;
  date_of_birth?: string | null;
}

export interface IMyProfileForm {
  full_name: string;
  contact_number: string;
  gender: string;
  address: string;
  date_of_birth: string;
}

export interface IMySessionRegistration {
  id: string;
  session_id: string;
  user_id: string;
  created_at: string;
  session: IAvailableSession;
}
