import { prisma } from '../../lib/prisma';
import AppError from '../../helpers/AppError';
import status from 'http-status';
import { nanoid } from 'nanoid';
import { envVars } from '../../../config/envVars';
import { Request } from 'express';
import { UAParser } from 'ua-parser-js';
import geoip from 'geoip-lite';

const recordAnalytics = async (req: Request, urlsId: string) => {
    const userAgent = Array.isArray(req.headers['user-agent'])
        ? req.headers['user-agent'][0]
        : req.headers['user-agent'] ?? ''

    const parser = new UAParser(userAgent)
    const result = parser.getResult()

    const forwarded = req.headers['x-forwarded-for']
    const ip = (
        Array.isArray(forwarded)
            ? forwarded[0]
            : forwarded || req.ip || ''
    ).split(',')[0].trim()

    const geo = geoip.lookup(ip)

    await prisma.analytics.create({
        data: {
            urlsId,
            ipAddress: ip          || null,
            userAgent: userAgent   || null,
            referer:   Array.isArray(req.headers['referer'])
                        ? req.headers['referer'][0]
                        : req.headers['referer']  || null,
            country:   geo?.country              || null,
            city:      geo?.city                 || null,
            device:    result.device.type        || null,
            browser:   result.browser.name       || null,
            os:        result.os.name            || null,
        }
    })
}

const createUrl = async (userId: string, data: {
    originalUrl: string
    customUrl?:  string
}) => {
    let subscription = await prisma.subscriptions.findUnique({
        where: { userId }
    })
    if (!subscription) throw new AppError(status.NOT_FOUND, 'Subscription not found')

    if (subscription.plan === 'PRO') {
        const now       = new Date()
        const lastReset = new Date(subscription.lastResetAt)

        const monthPassed =
            now.getMonth()    !== lastReset.getMonth() ||
            now.getFullYear() !== lastReset.getFullYear()

        if (monthPassed) {
            subscription = await prisma.subscriptions.update({
                where: { userId },
                data: {
                    urlsCreated: 0,
                    lastResetAt: now,
                }
            })
        }
    }

    if (subscription.urlsCreated >= subscription.urlLimit) {
        throw new AppError(
            status.FORBIDDEN,
            `URL limit reached (${subscription.urlLimit}). Upgrade your plan!`
        )
    }

    if (data.customUrl) {
        const existing = await prisma.urls.findUnique({
            where: { customUrl: data.customUrl }
        })
        if (existing) throw new AppError(status.CONFLICT, 'Custom URL already taken')
    }

    let shortUrl = nanoid(8)
    const existingShort = await prisma.urls.findUnique({ where: { shortUrl } })
    if (existingShort) shortUrl = nanoid(8)

    const url = await prisma.urls.create({
        data: {
            userId,
            originalUrl: data.originalUrl,
            shortUrl,
            customUrl:   data.customUrl ?? null,
        }
    })

    await prisma.subscriptions.update({
        where: { userId },
        data:  { urlsCreated: { increment: 1 } }
    })

    return {
        ...url,
        shortUrlFull: `${envVars.APP_URL}/${url.customUrl ?? url.shortUrl}`
    }
}

const getMyUrls = async (userId: string) => {
    const urls = await prisma.urls.findMany({
        where:   { userId },
        orderBy: { createdAt: 'desc' },
    })

    return urls.map(url => ({
        ...url,
        shortUrlFull: `${envVars.APP_URL}/${url.customUrl ?? url.shortUrl}`
    }))
}

const getUrlById = async (userId: string, urlId: string) => {
    const url = await prisma.urls.findFirst({
        where: { id: urlId, userId }
    })
    if (!url) throw new AppError(status.NOT_FOUND, 'URL not found')

    return {
        ...url,
        shortUrlFull: `${envVars.APP_URL}/${url.customUrl ?? url.shortUrl}`
    }
}

const updateUrl = async (userId: string, urlId: string, data: {
    customUrl?: string
}) => {
    const url = await prisma.urls.findFirst({
        where: { id: urlId, userId }
    })
    if (!url) throw new AppError(status.NOT_FOUND, 'URL not found')

    if (data.customUrl) {
        const existing = await prisma.urls.findFirst({
            where: {
                customUrl: data.customUrl,
                NOT: { id: urlId }
            }
        })
        if (existing) throw new AppError(status.CONFLICT, 'Custom URL already taken')
    }

    const updated = await prisma.urls.update({
        where: { id: urlId },
        data,
    })

    return {
        ...updated,
        shortUrlFull: `${envVars.APP_URL}/${updated.customUrl ?? updated.shortUrl}`
    }
}

const deleteUrl = async (userId: string, urlId: string) => {
    const url = await prisma.urls.findFirst({
        where: { id: urlId, userId }
    })
    if (!url) throw new AppError(status.NOT_FOUND, 'URL not found')

    await prisma.urls.delete({ where: { id: urlId } })

    await prisma.subscriptions.update({
        where: { userId },
        data:  { urlsCreated: { decrement: 1 } }
    })
}

const redirectUrl = async (req: Request, shortId: string) => {
    const url = await prisma.urls.findFirst({
        where: {
            OR: [
                { shortUrl:  shortId },
                { customUrl: shortId },
            ]
        }
    })
    if (!url) throw new AppError(status.NOT_FOUND, 'URL not found')
    if (url.urlStatus === 'RESTRICTED') {
        throw new AppError(status.FORBIDDEN, 'URL is restricted')
    }

    await recordAnalytics(req, url.id)

    await prisma.urls.update({
        where: { id: url.id },
        data:  { totalClicks: { increment: 1 } }
    })

    return url.originalUrl
}

export const urlService = {
    createUrl,
    getMyUrls,
    getUrlById,
    updateUrl,
    deleteUrl,
    redirectUrl,
}