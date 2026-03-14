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

export interface ISessionFeedback {
  id: string;
  session_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface IFeedbackPayload {
  rating: number;
  comment?: string;
}

export interface ISessionsPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IAvailableSessionsResponse {
  success: boolean;
  data: IAvailableSession[];
  pagination: ISessionsPaginationMeta;
}

export interface IGetAvailableSessionsResult {
  sessions: IAvailableSession[];
  pagination: ISessionsPaginationMeta;
}
