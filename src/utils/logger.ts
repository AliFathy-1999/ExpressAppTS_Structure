import winston, { format, createLogger, transports, Logger } from 'winston';
const { combine, timestamp, label, prettyPrint, json } = format;

import config from "../config";
import { Request, Response } from 'express';
import { orderObject, removeFalsyValues, removeSensitiveData } from './utils-functions';
import IP from 'ip';
import moment from 'moment';
import { IinfoLogger, IloggerParams } from '../interfaces/utils.interface';
const { app: { environment } } = config;

let logsObjData: IinfoLogger = {
    Request: {
        source: process.env.SERVER_NAME,
        serviceName: "",
        elapsed: "0",
        endPoint: "",
        url: "",
        method: "",
        IPAddress: IP.address(),
        headers: {},
        params: {},
        query: {},
        body: {},
        userId: null,
    },
    Response: {
        body: {},
        statusCode : 0,
        statusMessage: ""
    }
}
const createLogData = (req: Request, res: Response, serviceName?: string, elapsed?: number): IinfoLogger => {
    delete req.headers.authorization;
    delete req.headers.cookie;
    return {
        Request: removeFalsyValues({
            source: process.env.SERVER_NAME,
            serviceName: `${serviceName}-service`,
            elapsed: `${elapsed}ms`,
            method: req.method,
            url: req.originalUrl,
            endPoint: req.url,
            headers: req.headers,
            query: req.query,
            params: req.params,
            body: req.body,
            IPAddress: IP.address(),
            userId: req.user?._id || null,
        }),
        Response: removeFalsyValues({
            statusCode: res.statusCode,
            body: res.responseBody,
            statusMessage: res.statusMessage
        })
    };
};

const logsFormat = (logsData: { [key:string]: any })=> {
    const blackList = JSON.parse(process.env.BLACKLIST_DATA)
    const sanitizedLogsData = removeSensitiveData(logsData, blackList);
    return sanitizedLogsData
}

const loggerLevel = (): string => {
    const env = process.env.NODE_ENV;
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'info'; 
}
const levels = {
    crit: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    verbose: 5,
    debug: 6,
    silly: 7
};
const customFormat = winston.format.combine(
    winston.format.printf(({ level, timestamp, ...rest}) => {
        return JSON.stringify({ level, timestamp , message: rest.message })
    }),
);

const logger: Logger = createLogger({
    level: loggerLevel(),
    levels,
    format: combine( 
        timestamp({
            format: () => moment().format('MMMM Do YYYY, h:mm:ss a'),
        }),
        customFormat,
    ),
    transports: [
        new winston.transports.Console(),
        new transports.File({
            filename: "./logs/combined.log",
        }),
        new transports.File({
            level: "error",
            filename: "./logs/error.log",
        }),
    ],
});

logger.exceptions.handle(
    new transports.File({ filename: './logs/exceptions.log' })
);
const errorLogger = (req:Request,res:Response) => {
    const logsObjData = createLogData(req, res);
    logger.error(logsFormat(logsObjData));
}
const warnLogger = (message: string, source: string = process.env.SERVER_NAME) => {
    logger.log("warn", { source, message  } );
}

const infoLogger = (arg: string | IloggerParams,source: string = process.env.SERVER_NAME) => {
    if (typeof arg === 'string') {
        logger.info({ message: arg, source });
    }else {
        const { req, res, serviceName, elapsed } = arg as any
        const logsObjData = createLogData(req, res, serviceName, elapsed);
        logger.info(logsFormat(logsObjData));
    }
}

const httpLogger = (req:Request,res:Response, serviceName:string, elapsed?: number) => {
    const logsObjData = createLogData(req, res, serviceName, elapsed);
    logger.http(logsFormat(logsObjData));
}

const criticalLogger = (message:string, source: string = process.env.SERVER_NAME) => {
    logger.crit({ source, message });
}

const debugLogger = (message:string) => {
    logger.debug(message );
}

if (environment !== 'production') {
    logger.add(new winston.transports.Console({
        format: format.simple(),
    }));
}


export { 
    httpLogger, 
    errorLogger, 
    criticalLogger, 
    infoLogger,
    warnLogger,
    debugLogger 
};