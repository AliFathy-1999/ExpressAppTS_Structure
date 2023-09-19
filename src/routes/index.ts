import { Request, Response, NextFunction,Router } from 'express';

import userRoutes from './users';

const router = Router()

router.use("/api/v1/users", userRoutes)


export default router;
