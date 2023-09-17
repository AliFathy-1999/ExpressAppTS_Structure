import winston, { format, createLogger,transports } from 'winston';
const { printf } = format;

import config from "../config";
const { app: { environment } } = config;

const logger = createLogger({
    level: "info",
    format: printf((info) => {
        let message = `${new Date().toLocaleString()} |  ${info.level.toUpperCase()} | ${environment} | ${ info.message }  `;
            return message;
        }),
        transports: [
            new transports.File({
                filename: "./logs/combined.log",
            }),
            new transports.File({
                level: "error",
                filename: "./logs/error.log",
            }),
        ],
})

const infoLog = async (message: string) => {
    logger.log("info", message);
}
const errorLog = async (message: string) => {
        logger.log("error", message);
}
if (environment !== 'production') {

    logger.add(new winston.transports.Console({
            format: format.simple(),
    }));
}


export { infoLog , errorLog };