import { Request, Response, NextFunction } from 'express';
import admin from '../../config/firebase';
import AppError from '../helpers/AppError';
import status from 'http-status';
import { prisma } from '../lib/prisma';

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1]
        if (!token) throw new AppError(status.UNAUTHORIZED, 'No token provided')

        const decoded = await admin.auth().verifyIdToken(token)

        const user = await prisma.user.findUnique({
            where:   { firebaseUid: decoded.uid },
            include: { subscription: true }
        })
        if (!user) throw new AppError(status.NOT_FOUND, 'User not found')

        if (user.status === 'SUSPENDED') {
            throw new AppError(status.FORBIDDEN, 'Account suspended')
        }

        req.user = user
        next()
    } catch (err) {
        next(err)
    }
}

export const verifyFirebaseToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1]
        if (!token) throw new AppError(status.UNAUTHORIZED, 'No token provided')

        const decoded = await admin.auth().verifyIdToken(token)
        req.firebaseUid = decoded.uid

        next()
    } catch (err) {
        next(err)
    }
}