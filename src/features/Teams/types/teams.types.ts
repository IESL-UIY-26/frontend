export interface IUserSearchResult {
  id: string;
  full_name: string;
  email: string;
  in_team: boolean;
}

export interface ITeamMemberForm {
  user_id: string;
  full_name: string;
  email: string;
  iesl_id: number | '';
  department: string;
  university_id_image: string;
}

export interface ISupervisorForm {
  supervisor_name: string;
  supervisor_email: string;
  supervisor_contact_number: string;
  supervisor_university_id: string;
}

export interface ISupervisorResult {
  supervisor_id: string;
  supervisor_name: string;
  supervisor_email: string;
  supervisor_contact_number: string;
  supervisor_university_id: string;
}

export interface ITeamMemberResult {
  id: string;
  user_id: string;
  role: 'LEADER' | 'MEMBER';
  iesl_id: number | null;
  department: string | null;
  university_id_image: string | null;
  created_at: string;
  user: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface IMyTeam {
  id: string;
  team_name: string;
  university_id: string;
  created_at: string;
  university: { id: string; name: string };
  supervisor: ISupervisorResult | null;
  coSupervisor: ISupervisorResult | null;
  members: ITeamMemberResult[];
}
