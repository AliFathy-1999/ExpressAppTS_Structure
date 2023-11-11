import { Router } from 'express';
    
import validate from '../middlewares/validation'
import { usersValidator } from '../Validation/index'

import { Auth, adminAuth, userAuth } from '../middlewares/auth';
import { asyncWrapper } from '../lib';

import { userController } from '../controllers';

import { upload } from '../utils/upload-files-utils';

const router = Router();

router.delete('/:id', adminAuth, asyncWrapper(userController.deleteUser))
router.patch('/', Auth, upload, validate(usersValidator.signUp), asyncWrapper(userController.updateUser))
router.get('/', asyncWrapper(userController.getUsers))
router.get('/:id', Auth, asyncWrapper(userController.getUserById))


export default router;