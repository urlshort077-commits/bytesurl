import { prisma } from '../../lib/prisma';
import AppError from '../../helpers/AppError';
import { stripe } from '../../../config/stripe';
import { envVars } from '../../../config/envVars';
import status from 'http-status';
import { Plan } from '../../../../generated/prisma/enums';

const planLimits: Record<Plan, number> = {
    FREE:     10,
    PRO:      500,
    ULTIMATE: 999999,
}

const getPlanPrices = (): Partial<Record<Plan, string>> => ({
    PRO:      envVars.STRIPE_PRO_PRICE_ID,
    ULTIMATE: envVars.STRIPE_ULTIMATE_PRICE_ID,
})

const createCheckoutSession = async (userId: string, plan: 'PRO' | 'ULTIMATE') => {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    })
    if (!user) throw new AppError(status.NOT_FOUND, 'User not found')

    const planPrices = getPlanPrices()
    const priceId    = planPrices[plan]
    if (!priceId) throw new AppError(status.BAD_REQUEST, 'Invalid plan')

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode:                 'payment',
        line_items: [{
            price:    priceId,
            quantity: 1,
        }],
        metadata: {
            userId,
            plan,
        },
        success_url: `${envVars.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url:  `${envVars.FRONTEND_URL}/payment/cancel`,
    })

    return { checkoutUrl: session.url }
}

const handleWebhook = async (payload: Buffer, signature: string) => {
    let event

    try {
        event = stripe.webhooks.constructEvent(
            payload,
            signature,
            envVars.STRIPE_WEBHOOK_SECRET
        )
    } catch (err) {
        throw new AppError(status.BAD_REQUEST, 'Invalid webhook signature')
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object
        const userId  = session.metadata?.userId
        const plan    = session.metadata?.plan as Plan

        if (!userId || !plan) return

        const payment = await prisma.payments.create({
            data: {
                userId,
                stripeSessionId: session.id,
                stripePaymentId: session.payment_intent as string,
                amount:          (session.amount_total ?? 0) / 100,
                currency:        session.currency ?? 'bdt',
                plan,
            }
        })

        await prisma.subscriptions.update({
            where: { userId },
            data: {
                plan,
                urlLimit:    planLimits[plan],
                urlsCreated: 0,
                lastResetAt: new Date(),
                paymentId:   payment.id,
                purchasedAt: new Date(),
            }
        })
    }
}

const getMyPayments = async (userId: string) => {
    return prisma.payments.findMany({
        where:   { userId },
        orderBy: { createdAt: 'desc' }
    })
}

export const paymentService = {
    createCheckoutSession,
    handleWebhook,
    getMyPayments,
}