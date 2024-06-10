import { Router } from 'express';
import { userAuth } from '../middlewares/auth';
import { asyncWrapper } from '../lib';
import { postController } from '../controllers';
import validate from '../middlewares/validation';
import { postsValidator } from '../Validation';

const router = Router();

router.post('/',userAuth,  validate(postsValidator.createPost),asyncWrapper(postController.createPost))
router.get('/',userAuth, asyncWrapper(postController.getPosts))

export default router;