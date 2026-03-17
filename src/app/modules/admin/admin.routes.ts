import { Router } from 'express';
import { adminController } from './admin.controller';
import { adminValidation } from './admin.validation';
import validateRequest from '../../middlewares/validateRequest';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorizeAdmin } from '../../middlewares/admin.middleware';

const router = Router()

router.use(authenticate, authorizeAdmin)

router.get(
    '/users',
    adminController.getAllUsers
)

router.patch(
    '/users/:id',
    validateRequest(adminValidation.updateUserStatusValidation),
    adminController.updateUserStatus
)

router.get(
    '/urls',
    adminController.getAllUrls
)
router.patch(
    '/urls/:id',
    validateRequest(adminValidation.updateUrlStatusValidation),
    adminController.updateUrlStatus
)

router.get(
    '/analytics',
    adminController.getAllAnalytics
)

export const adminRoutes = router