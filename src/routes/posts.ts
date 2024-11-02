import { Router } from 'express';
import { checkUserAuthenticated, userAuth } from '../middlewares/auth';
import { asyncWrapper } from '../lib';
import { postController } from '../controllers';
import validate from '../middlewares/validation';
import { postsValidator } from '../Validation';
import clearCacheMW from '../middlewares/clearCache';

const router = Router();
//clearCacheMW
router.post('/',checkUserAuthenticated,userAuth,  validate(postsValidator.createPost), asyncWrapper(postController.createPost))
//clearCacheMW
router.patch('/:id', checkUserAuthenticated,validate(postsValidator.updatePost), asyncWrapper(postController.updatePost))
router.get('/', checkUserAuthenticated, userAuth, asyncWrapper(postController.getPosts))

export default router;