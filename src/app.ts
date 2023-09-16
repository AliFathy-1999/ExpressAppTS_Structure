import express,{ Application } from "express";
import cors from "cors";
import  morgan from 'morgan';
import helmet from 'helmet';
import sanitizer from 'express-sanitizer';
import  limiter from './utils/rate-limiter'
import {handleResponseError} from './lib/index'

import connectToDB from "./DB/connects";
import router from './routes/index'

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

app.use(router)
app.use(handleResponseError);

export default app;