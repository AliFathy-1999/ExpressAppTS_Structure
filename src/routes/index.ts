import { Router } from 'express';

import userRoutes from './users';
import postRoutes from './posts';

import authRoutes from './auth';
import loggerMW from '../middlewares/loggerMW';


const router = Router()

router.use("/v1/auth", loggerMW("auth"), authRoutes)
router.use("/v1/users", loggerMW("user"), userRoutes)
router.use("/v1/posts", loggerMW("posts"),postRoutes)


export default router;
