export interface IProject {
  id: string;
  team_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  youtube_link: string | null;
  pdf: string | null;
  github_url: string | null;
  vote_count: number;
  created_at: string;
}

export interface IPublicProject extends IProject {
  team: {
    id: string;
    team_name: string;
    university?: {
      id: string;
      name: string;
    } | null;
    supervisor?: {
      supervisor_id: string;
      supervisor_name: string;
      supervisor_email: string;
      supervisor_contact_number: string;
      supervisor_university_id: string;
    } | null;
    coSupervisor?: {
      supervisor_id: string;
      supervisor_name: string;
      supervisor_email: string;
      supervisor_contact_number: string;
      supervisor_university_id: string;
    } | null;
    members?: Array<{
      id: string;
      role: 'LEADER' | 'MEMBER';
      user_id: string;
      user?: {
        id: string;
        full_name: string;
        email: string;
      };
    }>;
  };
}

export interface IProjectPayload {
  title: string;
  description?: string;
  image_url?: string;
  youtube_link?: string;
  pdf?: string;
  github_url?: string;
}
