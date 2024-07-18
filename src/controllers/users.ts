import { Request, Response, NextFunction } from 'express';


import { ApiError } from '../lib';
import { removeImage } from '../utils/upload-files-utils/oncloud';

import { User } from '../DB/models/users';
import successMsg from '../utils/messages/successMsg';
import errorMsg from '../utils/messages/errorMsg';
import { StatusCodes } from 'http-status-codes';

import { commonService, userServices } from '../services';
import {generateQRCode  } from '../utils/utils-functions';
import sendEmail from '../utils/sendEmail';
import renderTemplate from '../utils/renderTemplate';


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

    res.status(StatusCodes.OK).json({
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
    
    res.status(StatusCodes.OK).json({
        message: successMsg.deleted('User', `${user._id}`),
    })
}

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    const { query : { page, limit, sort, select } } = req;
    const users = await commonService.getModelService(User, { page, limit, sort, select });
    res.status(StatusCodes.OK).json({
        message : successMsg.get('Users'),
        data: users
    })
}
const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    const { params : { id } } = req;
    const user = await userServices.getUserByIdService({ _id: id });
    if(!user) throw new ApiError (errorMsg.NotFound('User', `${id}`), StatusCodes.NOT_FOUND);
    res.status(StatusCodes.OK).json({
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
    res.status(StatusCodes.OK).json({
        message,
        data: users
    })
}

const getQrCode = async (req: Request, res: Response, next: NextFunction) => {
    const qrCodeBody = {
        name: 'Ali Ahmed',
        email: 'a@a.com',
        phone: '1234567890',
        address: '123 Main St',
        city: 'New York',

    }
    const url = await generateQRCode(qrCodeBody);
    res.status(StatusCodes.OK).json({
        message : successMsg.get('QrCode'),
        data: url
    })
}
const testSendEmail = async (req: Request, res: Response, next: NextFunction) => {
    const emailBody = {
        subject: 'Test Email Subject',
        text: 'This is a test email',
    }
    const emailTemplate = await renderTemplate({ firstName: "Ali Fathi", email: "aliahmedfathi37@gmail.com" }, 'activateAccount') 
    const email = await sendEmail( "aliahmedfathi37@gmail.com", emailBody.subject, emailTemplate);
    res.status(StatusCodes.OK).json({
        message : successMsg.get('Email'),
        data: email
    })
}
export default {
    updateUser,
    deleteUser,
    getUsers,
    getUserById,
    searchUsers,
    getQrCode,
    testSendEmail
}