import { Request, Response, NextFunction } from 'express';
import bcryptjs from 'bcryptjs'; 

import { IUser, ORDER } from '../interfaces/user';

import { ApiError } from '../lib';
import { removeImage } from '../utils/upload-files-utils/oncloud';

import User from '../DB/models/users';
import { infoLogger } from '../utils/logger';
import successMsg from '../utils/messages/successMsg';
import errorMsg from '../utils/messages/errorMsg';
import { StatusCodes } from 'http-status-codes';

import fetchDataUtils from '../utils/fetch-data-utils';
import { commonService, userServices } from '../services';


const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const pImage = req.file ? req.file.path : undefined;

    if(req.file){
        const user = await userServices.getUserService({_id:req.user._id});
        const imageUrl = user.pImage;
        removeImage(imageUrl) 
    }
    const { firstName, lastName } = req.body;
    
    const updatedUser = await userServices.updateUserService(
        {_id:req.user._id},
        { firstName, lastName, pImage },
        );
        if(updatedUser) infoLogger(`${req.method} | success | ${StatusCodes.OK} | ${req.protocol} | ${req.originalUrl}`)

    res.status(StatusCodes.OK).json({
        status: 'success',
        message: successMsg.updated('User', `${req.user._id}`),
        data : updatedUser
    })
}

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const { params : { id }} = req;  

    const user = await userServices.getUserService({_id:id});
    if(!user) throw new ApiError (errorMsg.NotFound('User', `${id}`), StatusCodes.BAD_REQUEST);

    const imageUrl = user.pImage;
    removeImage(imageUrl) 

    const deletedUser = await userServices.deleteUserService({_id:user._id});
    if(deletedUser) infoLogger(`${req.method} | success | ${StatusCodes.OK} | ${req.protocol} | ${req.originalUrl}`)
    
    res.status(StatusCodes.OK).json({
        status: 'success',
        message: successMsg.deleted('User', `${user._id}`),
    })
}

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    const { query : { page, limit, sort, select } } = req;
    const users = await commonService.getModelService(User, { page, limit, sort, select });
    if(users) infoLogger(`${req.method} | success | ${StatusCodes.OK} | ${req.protocol} | ${req.originalUrl}`)
    res.status(StatusCodes.OK).json({
        status: 'success',
        message : successMsg.get('Users'),
        data: users
    })
}
const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    const { params : { id } } = req;
    const user = await userServices.getUserByIdService({ _id: id });
    if(!user) throw new ApiError (errorMsg.NotFound('User', `${id}`), StatusCodes.NOT_FOUND);
    if(user) infoLogger(`${req.method} | success | ${StatusCodes.OK} | ${req.protocol} | ${req.originalUrl}`)
    res.status(StatusCodes.OK).json({
        status: 'success',
        message : successMsg.get('User'),
        data: user
    })
}

const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
    const { 
        query : { 
            searchField,
            searchValue
        }
    } = req;
    const users = await commonService.searchModelService(User, req.query) 
    
    // .userSearchService(searchField as string,searchValue as string);
    const message = users?.length === 0 ? 
        errorMsg.searchNotFoundValue('User', searchField as string,searchValue as string) 
        : successMsg.get('Users');
    if(users) infoLogger(`${req.method} | success | ${StatusCodes.OK} | ${req.protocol} | ${req.originalUrl}`)
    res.status(StatusCodes.OK).json({
        status: 'success',
        message,
        data: users
    })
}

export default {
    updateUser,
    deleteUser,
    getUsers,
    getUserById,
    searchUsers
}