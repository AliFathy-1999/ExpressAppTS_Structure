import express,{ Application, Request, Response, NextFunction} from "express";
import cors from "cors";


const { handleResponseError,ApiError } = require('./lib/index');
const routes = require('./routes/index');
import connectToDB from "./DB/connects";
import router from './routes/index'

const app :Application = express();
//Run MongoDB server
connectToDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use(router)
app.use(handleResponseError);

module.exports = app;