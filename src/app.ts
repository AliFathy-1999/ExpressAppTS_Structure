import express,{ Express,Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import  morgan from 'morgan';
import helmet from 'helmet';
import sanitizer from 'express-sanitizer';
import cookieParser from 'cookie-parser';

import  limiter from './utils/rate-limiter'
import {ApiError, handleResponseError} from './lib/index'
import swaggerSpec from './utils/swagger'; // Import your swaggerSpec
const swaggerUi = require('swagger-ui-express');

import router from './routes/index'
import errorMsg from "./utils/messages/errorMsg";
import path from "path";
import { setSuccessFlag } from "./utils/utils-functions";
import { CustomResponse } from "./interfaces/utils.interface";
import { NotFoundError } from "./lib/apiError";

const app : Express = express();

const originalResJSON = app.response.json;

const jsonFuncOverride = function (this: CustomResponse, body: any) {
    this.responseBody = setSuccessFlag(this, body);
    return originalResJSON.call(this, this.responseBody);
};

app.response.json = jsonFuncOverride;

app.use((req, res, next) => {
    const requestDate = Date.now();
    console.log('requestDate:', new Date().getMilliseconds())
    req.requestDate = requestDate;
    next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(limiter);
app.use(sanitizer());
app.use(cookieParser());

//SSR 
app.set('view engine', 'ejs');
app.set('templates', path.join(__dirname, 'templates'));

// app.use('/', ( req:Request, res:Response, next:NextFunction ) => {
//     res.status(StatusCodes.OK).json({
//         "status": "up"
//     })
// })
app.use('/api/', router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.all('*',async (req:Request, res:Response,next:NextFunction) => {
    next(new NotFoundError(errorMsg.RouteNotFound(req.originalUrl)));
})

app.use(handleResponseError);




export default app;