import z from 'zod';

const checkEmailValidation = z.object({
    body: z.object({
        email: z.email('Invalid email'),
    })
})

const registerValidation = z.object({
    body: z.object({
        email:     z.email('Invalid email'),
        password:  z.string().min(6, 'Min 6 characters'),
        name:      z.string().min(1, 'Name is required').max(30, 'Name too long'),
        avatarUrl: z.url().optional(),
    })
})

const loginValidation = z.object({
    body: z.object({
        email:    z.email('Invalid email'),
        password: z.string().min(1, 'Password is required'),
    })
})

const googleAuthValidation = z.object({
    body: z.object({
        email:     z.email('Invalid email'),
        name:      z.string().min(1, 'Name is required'),
        avatarUrl: z.url().optional(),
    })
})

export const authValidation = {
    checkEmailValidation,
    registerValidation,
    loginValidation,
    googleAuthValidation,
}