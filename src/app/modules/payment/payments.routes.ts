import { Router } from 'express';
import express from 'express';
import { paymentController } from './payments.controller';
import { paymentValidation } from './payments.validation';
import validateRequest from '../../middlewares/validateRequest';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router()

router.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    paymentController.webhook
)

router.post(
    '/create-checkout',
    authenticate,
    validateRequest(paymentValidation.createCheckoutValidation),
    paymentController.createCheckout
)

router.get(
    '/',
    authenticate,
    paymentController.getMyPayments
)

export const paymentRoutes = router