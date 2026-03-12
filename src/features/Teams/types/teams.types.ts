export interface IUserSearchResult {
  id: string;
  full_name: string;
  email: string;
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
