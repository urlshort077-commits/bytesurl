import { Router } from 'express';
import { analyticsController } from './analytics.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router()

router.get(
    '/',
    authenticate,
    analyticsController.getAllMyAnalytics
)
router.get(
    '/:urlId',
    authenticate,
    analyticsController.getUrlAnalytics
)

export const analyticsRoutes = router