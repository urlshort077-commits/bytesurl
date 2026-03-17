import { Request, Response, NextFunction } from 'express';
import AppError from '../helpers/AppError';
import status from 'http-status';

export const authorizeAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.user.role !== 'ADMIN') {
        throw new AppError(status.FORBIDDEN, 'Access denied')
    }
    next()
}