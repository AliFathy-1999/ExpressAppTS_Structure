import { Request, Response, NextFunction,Router } from 'express';

import userRoutes from './users';
import authRoutes from './auth';


const router = Router()

router.use("/api/v1/auth", authRoutes)
router.use("/api/v1/users", userRoutes)


export default router;
