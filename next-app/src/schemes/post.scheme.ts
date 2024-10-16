import { File } from 'buffer';
import { z } from 'zod';

// Zod schema to validate the incoming formData

export const createPostSchema = z.object({
    title: z.string().min(1, "Title is required").max(50),
    content: z.string().min(1, "Content is required").max(400),
    parentPostId: z.string().optional().nullable(),
    images: z.array(z.instanceof(File)).max(4, "You can upload up to 4 images"),
});

