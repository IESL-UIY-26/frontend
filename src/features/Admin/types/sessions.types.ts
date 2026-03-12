export interface ISession {
  id: string;
  title: string;
  description: string | null;
  zoom_link: string | null;
  session_date: string;
  session_time: string;
  duration_minutes: number;
  host_name: string | null;
  created_by: string;
  created_at: string;
}
