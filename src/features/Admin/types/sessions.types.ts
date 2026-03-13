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

export interface ISessionFeedbackAdminView {
  id: string;
  session_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user: {
    id: string;
    full_name: string;
    email: string;
  };
}
