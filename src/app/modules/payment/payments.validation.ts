import z from 'zod';

const createCheckoutValidation = z.object({
    body: z.object({
        plan: z.enum(['PRO', 'ULTIMATE'], 'Invalid plan'),
    })
})

export const paymentValidation = {
    createCheckoutValidation,
}