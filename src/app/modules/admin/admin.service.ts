import { prisma } from '../../lib/prisma';
import AppError from '../../helpers/AppError';
import status from 'http-status';

const getAllUsers = async () => {
    return prisma.user.findMany({
        include: { subscription: true },
        orderBy: { createdAt: 'desc' },
    })
}

const updateUserStatus = async (userId: string, userStatus: 'ACTIVE' | 'SUSPENDED') => {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new AppError(status.NOT_FOUND, 'User not found')

    return prisma.user.update({
        where:   { id: userId },
        data:    { status: userStatus },
        include: { subscription: true }
    })
}

const getAllUrls = async () => {
    return prisma.urls.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' },
    })
}

const updateUrlStatus = async (urlId: string, urlStatus: 'AVAILABLE' | 'RESTRICTED') => {
    const url = await prisma.urls.findUnique({ where: { id: urlId } })
    if (!url) throw new AppError(status.NOT_FOUND, 'URL not found')

    return prisma.urls.update({
        where: { id: urlId },
        data:  { urlStatus },
    })
}

const getAllAnalytics = async () => {
    return prisma.analytics.findMany({
        include: { url: true },
        orderBy: { clickedAt: 'desc' },
    })
}

export const adminService = {
    getAllUsers,
    updateUserStatus,
    getAllUrls,
    updateUrlStatus,
    getAllAnalytics,
}