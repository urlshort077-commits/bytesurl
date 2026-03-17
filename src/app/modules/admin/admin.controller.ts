import { Request, Response } from 'express';
import { adminService } from './admin.service';
import status from 'http-status';
import { sendResponse } from '../../shared/sendResponse';
import { catchAsync } from '../../shared/catchAsync';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.getAllUsers()
    sendResponse(res, {
        httpStatuscode: status.OK,
        success:        true,
        message:        'Users fetched successfully',
        data:           result,
    })
})

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.updateUserStatus(
        req.body.userId,
        req.body.status
    )
    sendResponse(res, {
        httpStatuscode: status.OK,
        success:        true,
        message:        'User status updated successfully',
        data:           result,
    })
})

const getAllUrls = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.getAllUrls()
    sendResponse(res, {
        httpStatuscode: status.OK,
        success:        true,
        message:        'URLs fetched successfully',
        data:           result,
    })
})

const updateUrlStatus = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.updateUrlStatus(
        req.body.urlId,
        req.body.urlStatus
    )
    sendResponse(res, {
        httpStatuscode: status.OK,
        success:        true,
        message:        'URL status updated successfully',
        data:           result,
    })
})

const getAllAnalytics = catchAsync(async (req: Request, res: Response) => {
    const result = await adminService.getAllAnalytics()
    sendResponse(res, {
        httpStatuscode: status.OK,
        success:        true,
        message:        'Analytics fetched successfully',
        data:           result,
    })
})

export const adminController = {
    getAllUsers,
    updateUserStatus,
    getAllUrls,
    updateUrlStatus,
    getAllAnalytics,
}