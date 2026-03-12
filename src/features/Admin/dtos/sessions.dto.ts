import { z } from 'zod';

export const sessionFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(500).optional(),
  zoom_link: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  session_date: z.string().min(1, 'Date is required'),
  session_time: z.string().min(1, 'Time is required'),
  duration_minutes: z.number().int().positive().default(60),
  host_name: z.string().max(100).optional(),
});

export type CreateSessionDto = z.infer<typeof sessionFormSchema>;
export type UpdateSessionDto = Partial<CreateSessionDto>;
