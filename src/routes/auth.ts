import { Router } from 'express'; 
import validate from '../middlewares/validation'
import { usersValidator } from '../Validation/index'

import { asyncWrapper } from '../lib';

import { authController } from '../controllers';

import { upload } from '../utils/upload-files-utils';
import { adminAuth, checkUserAuthenticated } from '../middlewares/auth';

const router = Router()
router.post('/register', upload, validate(usersValidator.signUp), asyncWrapper(authController.register))
router.post('/login', validate(usersValidator.signIn),asyncWrapper(authController.signIn))
router.get('/profile', checkUserAuthenticated, asyncWrapper(authController.getProfile))
router.patch('/activate/:token', asyncWrapper(authController.activateAccount))
router.post('/resendEmail', asyncWrapper(authController.resendEmail))
router.get('/refresh-token', asyncWrapper(authController.refreshAccessToken))
router.patch('/logout', checkUserAuthenticated, asyncWrapper(authController.logout))


export default router;