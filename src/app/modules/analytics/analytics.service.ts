import { prisma } from '../../lib/prisma';
import AppError from '../../helpers/AppError';
import status from 'http-status';

const getAllMyAnalytics = async (userId: string) => {
    return prisma.analytics.findMany({
        where: {
            url: { userId }
        },
        include: {
            url: {
                select: {
                    shortUrl:    true,
                    customUrl:   true,
                    originalUrl: true,
                    totalClicks: true,
                }
            }
        },
        orderBy: { clickedAt: 'desc' },
    })
}

const getUrlAnalytics = async (userId: string, urlsId: string) => {
    const url = await prisma.urls.findFirst({
        where: { id: urlsId, userId }
    })
    if (!url) throw new AppError(status.NOT_FOUND, 'URL not found')

    const analytics = await prisma.analytics.findMany({
        where:   { urlsId },
        orderBy: { clickedAt: 'desc' },
    })

    return {
        url: {
            id:          url.id,
            shortUrl:    url.shortUrl,
            customUrl:   url.customUrl,
            originalUrl: url.originalUrl,
            totalClicks: url.totalClicks,
            urlStatus:   url.urlStatus,
        },
        totalClicks: url.totalClicks,
        analytics,
    }
}

export const analyticsService = {
    getAllMyAnalytics,
    getUrlAnalytics,
}