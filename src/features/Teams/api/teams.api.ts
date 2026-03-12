import api from '@/utils/api-client';
import type { TeamCreationFormValues } from '../dtos/teams.dto';

export const teamsAPI = {
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
