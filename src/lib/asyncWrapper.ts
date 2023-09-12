import { NextFunction, Request, Response } from "express";


function asyncWrapper(fn: (req: Request, res: Response) => Promise<void>) {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res).catch(next);
    };
}

module.exports = asyncWrapper;
