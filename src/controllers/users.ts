import { Request, Response, NextFunction } from 'express';
import bcryptjs from 'bcryptjs'; 

import { IUser, ORDER } from '../interfaces/user';
import HttpStatusCode from '../types/http-status-code';

import { ApiError } from '../lib';
import { removeImage } from '../utils/upload-files-utils/oncloud';

import User from '../DB/models/users';
import { infoLogger } from '../utils/logger';
import successMsg from '../utils/successMsg';
import errorMsg from '../utils/errorMsg';

import fetchDataUtils from '../utils/fetch-data-utils';
import { generateToken } from '../utils/utils-functions';
import { commonService, userServices } from '../services';
import { Model } from 'mongoose';


const signIn = async (req:Request, res:Response, next:NextFunction) => {
        const { body : { email, password }} = req
        const user = await userServices.getUserService({email});
        if (!user) throw new ApiError(errorMsg.IncorrectField('Email'), HttpStatusCode.UNAUTHORIZED);
        
        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) throw new ApiError(errorMsg.IncorrectField('Password'), HttpStatusCode.UNAUTHORIZED);        

        infoLogger(`${req.method} | success | ${HttpStatusCode.OK} | ${req.protocol} | ${req.originalUrl} `)
        res.status(HttpStatusCode.OK).json({
            status:'success',
            message : successMsg.signIn(user.userName),
            token: generateToken(user),
            data : user,
        });        
}
const register = async (req: Request, res: Response, next: NextFunction) => {  
        
        // const images : IFiles = req.files as IFiles;

        const images = req.files as Express.Multer.File[];
        if (req.files?.length === 1) 
            throw new ApiError(errorMsg.fileCount(1), HttpStatusCode.BAD_REQUEST);
        const pImage : Array<string> = images.map((file)=> file.filename)

        // req.file? req['files'].filename : undefined    

        const { firstName, lastName, userName, email, password, role } = req.body;
        const user = await userServices.createUserService({ firstName, lastName, userName, email, password, pImage, role });
        
        if(user) infoLogger(`${req.method} | success | ${HttpStatusCode.CREATED} | ${req.protocol} | ${req.originalUrl}`)
        res.status(HttpStatusCode.CREATED).json({
            status: 'success',
            message: successMsg.signUp(user.userName),
            data : user,
            token: generateToken(user),
})
}

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
        if(updatedUser) infoLogger(`${req.method} | success | ${HttpStatusCode.OK} | ${req.protocol} | ${req.originalUrl}`)

    res.status(HttpStatusCode.OK).json({
        status: 'success',
        message: successMsg.updated('User', `${req.user._id}`),
        data : updatedUser
    })
}

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const { params : { id }} = req;  

    const user = await userServices.getUserService({_id:id});
    if(!user) throw new ApiError (errorMsg.NotFound('User', `${id}`), HttpStatusCode.BAD_REQUEST);

    const imageUrl = user.pImage;
    removeImage(imageUrl) 

    const deletedUser = await userServices.deleteUserService({_id:user._id});
    if(deletedUser) infoLogger(`${req.method} | success | ${HttpStatusCode.OK} | ${req.protocol} | ${req.originalUrl}`)
    
    res.status(HttpStatusCode.OK).json({
        status: 'success',
        message: successMsg.deleted('User', `${user._id}`),
    })
}

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    const { query : { page, limit, sort, select } } = req;
    const users = await commonService.getModelService(User, { page, limit, sort, select });
    if(users) infoLogger(`${req.method} | success | ${HttpStatusCode.OK} | ${req.protocol} | ${req.originalUrl}`)
    res.status(HttpStatusCode.OK).json({
        status: 'success',
        message : successMsg.get('Users'),
        data: users
    })
}
export default {
    register,
    signIn,
    updateUser,
    deleteUser,
    getUsers
}