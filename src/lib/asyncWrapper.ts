import { NextFunction, Request, Response } from "express";


function asyncWrapper(fn: (req: Request, res: Response,next:NextFunction) => Promise<void>) {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res,next ).catch(next);
    };
}

export default asyncWrapper;
