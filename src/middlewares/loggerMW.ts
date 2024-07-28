import { NextFunction, Request, Response } from "express";
import { infoLogger } from "../utils/logger";

const loggerMW = (serviceName: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const startTime = Date.now();
        await next();
        res.on("finish", ()=>{
            const elapsed = Date.now() - startTime;
            if(res.success){
                infoLogger({ req, res, serviceName, elapsed })
            }
        })
    };
};

export default loggerMW;