import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.routes';
import { userRoutes } from '../modules/user/user.routes';
import { urlRoutes } from '../modules/urls/urls.routes';
import { adminRoutes } from '../modules/admin/admin.routes';
import { analyticsRoutes } from '../modules/analytics/analytics.routes';

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/urls', urlRoutes)
router.use('/admin', adminRoutes)
router.use('/analytics', analyticsRoutes)

export const IndexRoutes = router