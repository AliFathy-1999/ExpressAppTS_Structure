import { Router } from "express";



import express, { Request, Response, NextFunction } from 'express';

import userRoutes from './users';
const { ApiError } =require("../lib/index");


const router = Router()

router.use("/api/v1/users", userRoutes)


router.all('*',async (req:Request, res:Response,next:NextFunction) => {
    next(new ApiError(`Can't find ${req.originalUrl} on this server`, 404));
})





export default router;
