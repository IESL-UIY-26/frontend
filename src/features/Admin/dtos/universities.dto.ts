import { z } from 'zod';

export const universityFormSchema = z.object({
  name: z.string().min(1, 'University name is required').max(200),
});

export type CreateUniversityDto = z.infer<typeof universityFormSchema>;
export type UpdateUniversityDto = Partial<CreateUniversityDto>;
