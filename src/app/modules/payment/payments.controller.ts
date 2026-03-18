import { Request, Response } from 'express';
import { paymentService } from './payments.service';
import status from 'http-status';
import { sendResponse } from '../../shared/sendResponse';
import { catchAsync } from '../../shared/catchAsync';

const createCheckout = catchAsync(async (req: Request, res: Response) => {
    const result = await paymentService.createCheckoutSession(
        req.user.id,
        req.body.plan
    )
    sendResponse(res, {
        httpStatuscode: status.OK,
        success:        true,
        message:        'Checkout session created',
        data:           result,
    })
})

const webhook = async (req: Request, res: Response) => {
    try {
        const signature = req.headers['stripe-signature'] as string
        await paymentService.handleWebhook(req.body, signature)
        res.json({ received: true })
    } catch (err: any) {
        res.status(400).json({ error: err.message })
    }
}

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
    const result = await paymentService.getMyPayments(req.user.id)
    sendResponse(res, {
        httpStatuscode: status.OK,
        success:        true,
        message:        'Payments fetched successfully',
        data:           result,
    })
})

export const paymentController = {
    createCheckout,
    webhook,
    getMyPayments,
}