import { z } from 'zod';

export const projectPayloadSchema = z.object({
  title: z.string().min(1, 'Project title is required').max(200, 'Project title must be at most 200 characters'),
  description: z.string().max(5000, 'Description must be at most 5000 characters').optional(),
  image_url: z.string().url('Image URL must be a valid URL').optional(),
  youtube_link: z.string().url('YouTube link must be a valid URL').optional(),
  pdf: z.string().url('PDF link must be a valid URL').optional(),
  github_url: z.string().url('GitHub URL must be a valid URL').optional(),
});

export type ProjectPayloadFormValues = z.infer<typeof projectPayloadSchema>;
