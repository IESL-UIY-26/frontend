export interface IAvailableSession {
  id: string;
  title: string;
  description: string | null;
  zoom_link: string | null;
  session_date: string;
  session_time: string;
  duration_minutes: number;
  host_name: string | null;
}

export interface IMyRegistration {
  id: string;
  session_id: string;
  user_id: string;
  created_at: string;
  session: IAvailableSession;
}
