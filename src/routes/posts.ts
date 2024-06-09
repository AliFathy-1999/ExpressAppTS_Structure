import { Router } from 'express';
import { userAuth } from '../middlewares/auth';
import { asyncWrapper } from '../lib';
import { postController } from '../controllers';

const router = Router();

router.get('/',userAuth, asyncWrapper(postController.getPosts))

export default router;