import { z } from 'zod';

export const supervisorSchema = z.object({
  supervisor_name: z.string().min(1, 'Name is required'),
  supervisor_email: z.string().email('Invalid email'),
  supervisor_contact_number: z.string().min(1, 'Contact number is required'),
  supervisor_university_id: z.string().min(1, 'Please select a university'),
});

export const memberSchema = z.object({
  user_id: z.string().uuid('Invalid user ID'),
  full_name: z.string(),
  email: z.string().email(),
  iesl_id: z.coerce.number().int().positive('IESL ID must be a positive integer'),
  department: z.string().min(1, 'Department is required'),
  university_id_image: z.string().min(1, 'University ID image URL is required'),
});

export const teamCreationSchema = z.object({
  team_name: z.string().min(1, 'Team name is required').max(150, 'Max 150 characters'),
  university_id: z.string().min(1, 'Please select a university'),
  supervisor: supervisorSchema,
  has_co_supervisor: z.boolean(),
  co_supervisor: supervisorSchema.optional(),
  // Leader details — user_id is injected by backend from the auth token
  leader_iesl_id: z.coerce.number().int().positive('IESL ID must be a positive integer'),
  leader_department: z.string().min(1, 'Department is required'),
  leader_university_id_image: z.string().min(1, 'University ID image URL is required'),
  members: z.array(memberSchema).min(1, 'You must add at least one other member. A team needs at least 2 members (including you as leader).'),
});

export type TeamCreationFormValues = z.infer<typeof teamCreationSchema>;
export type SupervisorFormValues = z.infer<typeof supervisorSchema>;
export type MemberFormValues = z.infer<typeof memberSchema>;
