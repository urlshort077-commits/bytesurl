import z from 'zod';

const updateUserStatusValidation = z.object({
    body: z.object({
        userId:    z.string().min(1, 'User ID is required'),
        status:    z.enum(['ACTIVE', 'SUSPENDED'], 'Invalid status'),
    })
})

const updateUrlStatusValidation = z.object({
    body: z.object({
        urlId:     z.string().min(1, 'URL ID is required'),
        urlStatus: z.enum(['AVAILABLE', 'RESTRICTED'], 'Invalid status'),
    })
})

export const adminValidation = {
    updateUserStatusValidation,
    updateUrlStatusValidation,
}