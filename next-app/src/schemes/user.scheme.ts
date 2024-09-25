import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/constant/constants'
import { ESex } from '@/types/ISex'
import { z } from 'zod'
import { zfd } from "zod-form-data"

// export const postUserScheme = zfd.formData({
export const postUserScheme = z.object({
    username: z.string().min(4),
    password: z.string().min(8),
    displayName: z.string().min(4),
    sex: z.nativeEnum(ESex),
    // email: z.string().email({ message: "please enter email for account creation." }),
    email: z.string().email(),
    age: z.number().positive().min(5, {message: "age below 5 is not allow in fortoon :D"})

    // image: z
    //     .instanceof(File)
    //     .refine(
    //         (file) => file.size <= MAX_FILE_SIZE,
    //         `Image size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`
    //     )
    //     .refine(
    //         (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    //         `Only the following image types are allowed: ${ACCEPTED_IMAGE_TYPES.join(
    //             ", "
    //         )}.`
    //     )
    //     .optional()
    //     .nullable(),
})

export type TPostUserScheme = z.infer<typeof postUserScheme>;