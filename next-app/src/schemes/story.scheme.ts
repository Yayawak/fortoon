import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/constant/constants'
import { File } from 'buffer';
import { z } from 'zod'
import { zfd } from "zod-form-data"

// export const postUserScheme = zfd.formData({
export const postStoryScheme = z.object({
    authorId: z.number(),
    title: z.string(),
    introduction: z.string(),
    price: z.number(),


    coverImage: z
        .instanceof(File)
        .refine(
            (file) => file.size <= MAX_FILE_SIZE,
            `Image size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`
        )
        .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
            `Only the following image types are allowed: ${ACCEPTED_IMAGE_TYPES.join(
                ", "
            )}.`
        )
        // .optional()
        // .nullable(),
})

export type TPostStoryScheme = z.infer<typeof postStoryScheme>;