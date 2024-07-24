import { Request, Response, NextFunction } from 'express';
import successMsg from '../utils/messages/successMsg';
import { StatusCodes } from 'http-status-codes';

import { postServices } from '../services';
import errorMsg from '../utils/messages/errorMsg';
import { cacheOption } from '../interfaces/utils.interface';
import UnauthorizedError from '../lib/unAuthorizedException';

const createPost = async (req: Request, res: Response, next: NextFunction) => {
    const {
        user: { _id },
        body: {
            title,
            content
        }
    } = req;

    const post = await postServices.createPostService({ author: _id, title, content });
    
    res.status(StatusCodes.CREATED).json({
        message: successMsg.created('Posts'),
        data: post
    })
}

const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    const { user : { _id } } = req;
    const posts = await postServices.getPostService({author: _id },_id,cacheOption.USE_CACHE)
    let message = successMsg.get('Posts')
    if(posts?.length === 0) message = "You don't any posts"
    res.status(StatusCodes.OK).json({
        message,
        data: posts
    })
}
const updatePost = async (req: Request, res: Response, next: NextFunction) => {

    const {
        user: { _id },
        body: {
            title,
            content
        },
        params: { id }
    } = req;    
    const userPost = await postServices.getPostByIdService({_id: id})
    const isAuthorized = userPost.author == req.user._id
    if(!isAuthorized) throw new UnauthorizedError(errorMsg.unAuthorized);
    const updatedPost = await postServices.updatePostService(
        { author: _id, _id: id },
        {  title, content },
    ) ;

    res.status(StatusCodes.OK).json({
        message: successMsg.updated('Post', `${id}`),
        data : updatedPost
    })
}
export default {
    getPosts,
    createPost,
    updatePost
}