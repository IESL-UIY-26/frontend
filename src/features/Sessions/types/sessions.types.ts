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
