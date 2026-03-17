import { Request, Response } from 'express';
import { analyticsService } from './analytics.service';
import status from 'http-status';
import { sendResponse } from '../../shared/sendResponse';
import { catchAsync } from '../../shared/catchAsync';

const getAllMyAnalytics = catchAsync(async (req: Request, res: Response) => {
    const result = await analyticsService.getAllMyAnalytics(req.user.id)
    sendResponse(res, {
        httpStatuscode: status.OK,
        success:        true,
        message:        'Analytics fetched successfully',
        data:           result,
    })
})

const getUrlAnalytics = catchAsync(async (req: Request, res: Response) => {
    const urlsId = Array.isArray(req.params.urlId)
        ? req.params.urlId[0]
        : req.params.urlId

    const result = await analyticsService.getUrlAnalytics(req.user.id, urlsId)
    sendResponse(res, {
        httpStatuscode: status.OK,
        success:        true,
        message:        'URL analytics fetched successfully',
        data:           result,
    })
})

export const analyticsController = {
    getAllMyAnalytics,
    getUrlAnalytics,
}