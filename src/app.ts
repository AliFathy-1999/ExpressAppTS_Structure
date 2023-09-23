import express,{ Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import  morgan from 'morgan';
import helmet from 'helmet';
import sanitizer from 'express-sanitizer';

import  limiter from './utils/rate-limiter'
import {ApiError, handleResponseError} from './lib/index'
import swaggerSpec from './utils/swagger'; // Import your swaggerSpec
const swaggerUi = require('swagger-ui-express');

import connectToDB from "./DB/connects";
import router from './routes/index'
import HttpStatusCode from "./types/http-status-code";
import errorMsg from "./utils/errorMsg";

const app :Application = express();
//Run MongoDB server
connectToDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(limiter);
app.use(sanitizer());

app.use(router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.all('*',async (req:Request, res:Response,next:NextFunction) => {
    next(new ApiError(errorMsg.RouteNotFound(req.originalUrl), HttpStatusCode.NOT_FOUND));
})

app.use(handleResponseError);




export default app;