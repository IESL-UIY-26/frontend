import api from '@/utils/api-client';
import type { TeamCreationFormValues } from '../dtos/teams.dto';
import type { IMyTeam } from '../types/teams.types';

export interface UpdateTeamMemberPayload {
  user_id: string;
  role: 'LEADER' | 'MEMBER';
  iesl_id?: number;
  department?: string;
  university_id_image?: string;
}

export interface UpdateTeamSupervisorPayload {
  supervisor_name?: string;
  supervisor_email?: string;
  supervisor_contact_number?: string;
  supervisor_university_id?: string;
}

export interface UpdateMyTeamPayload {
  team_name?: string;
  university_id?: string;
  supervisor?: UpdateTeamSupervisorPayload;
  co_supervisor?: UpdateTeamSupervisorPayload | null;
  members?: UpdateTeamMemberPayload[];
}

export const teamsAPI = {
  getMyTeam: async (): Promise<IMyTeam | null> => {
    const response = await api.get<IMyTeam | null>('/api/teams/my-team');
    return response.data;
  },

  updateMyTeam: async (payload: UpdateMyTeamPayload): Promise<IMyTeam> => {
    const response = await api.patch<IMyTeam>('/api/teams/my-team', payload);
    return response.data;
  },

  createTeam: async (form: TeamCreationFormValues): Promise<unknown> => {
    // Build payload without a strict interface so TypeScript inference
    // matches Zod's inferred types exactly
    const payload = {
      team_name: form.team_name,
      university_id: form.university_id,
      supervisor: form.supervisor,
      co_supervisor: form.has_co_supervisor ? (form.co_supervisor ?? null) : null,
      members: [
        // LEADER — user_id injected by backend from auth token
        {
          role: 'LEADER' as const,
          iesl_id: form.leader_iesl_id as number,
          department: form.leader_department,
          university_id_image: form.leader_university_id_image,
        },
        ...form.members.map((m) => ({
          role: 'MEMBER' as const,
          user_id: m.user_id,
          iesl_id: m.iesl_id as number,
          department: m.department,
          university_id_image: m.university_id_image,
        })),
      ],
    };
    const response = await api.post<unknown>('/api/teams', payload);
    return response.data;
  },
};
