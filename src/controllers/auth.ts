import { Request, Response, NextFunction } from 'express';

import { ApiError } from '../lib';

import { infoLogger } from '../utils/logger';
import successMsg from '../utils/messages/successMsg';
import errorMsg from '../utils/messages/errorMsg';

import { generateToken } from '../utils/utils-functions';
import { userServices } from '../services';
import { StatusCodes } from 'http-status-codes';


const signIn = async (req:Request, res:Response, next:NextFunction) => {
        const { body : { email, password }} = req
        const user = await userServices.getUserService({email});
        if (!user) throw new ApiError(errorMsg.IncorrectField('Email'), StatusCodes.UNAUTHORIZED);
        
        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) throw new ApiError(errorMsg.IncorrectField('Password'), StatusCodes.UNAUTHORIZED);        

        infoLogger(`${req.method} | success | ${StatusCodes.OK} | ${req.protocol} | ${req.originalUrl} `)
        res.status(StatusCodes.OK).json({
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
            throw new ApiError(errorMsg.fileCount(1), StatusCodes.BAD_REQUEST);
        const pImage : Array<string> = images?.map((file)=> file.filename)

        // req.file? req['files'].filename : undefined    

        const { firstName, lastName, userName, email, password, role } = req.body;
        const user = await userServices.createUserService({ firstName, lastName, userName, email, password, pImage, role });
        if(!user) throw new ApiError(errorMsg.customMsg('Error in user registration'), StatusCodes.BAD_REQUEST);
        if(user) infoLogger(`${req.method} | success | ${StatusCodes.CREATED} | ${req.protocol} | ${req.originalUrl}`)
        res.status(StatusCodes.CREATED).json({
            status: 'success',
            message: successMsg.signUp(user.userName),
            data : user,
            token: generateToken(user),
})
}

const getProfile =async (req:Request, res:Response, next:NextFunction) => {
    const { _id } = req.user;
    const s = req.user._id
    console.log(s);
    
    const user = await userServices.getUserService({_id});
    if(user) infoLogger(`${req.method} | success | ${StatusCodes.OK} | ${req.protocol} | ${req.originalUrl}`)
    res.status(StatusCodes.OK).json({
        status: 'success',
        message : successMsg.get('User'),
        data: user
    })
}
export default {
    register,
    signIn,
    getProfile
}