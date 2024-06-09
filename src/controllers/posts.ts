import { Request, Response, NextFunction } from 'express';
import { infoLogger } from '../utils/logger';
import successMsg from '../utils/messages/successMsg';
import { StatusCodes } from 'http-status-codes';

import { postServices } from '../services';


const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    const { user : { _id } } = req;
    const posts = await postServices.getPostService({ author:_id });
    if(posts) infoLogger(`${req.method} | success | ${StatusCodes.OK} | ${req.protocol} | ${req.originalUrl}`)
    res.status(StatusCodes.OK).json({
        status: 'success',
        message : successMsg.get('Posts'),
        data: posts
    })
}

export default {
    getPosts,
}