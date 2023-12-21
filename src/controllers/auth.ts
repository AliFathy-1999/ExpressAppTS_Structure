import { Request, Response, NextFunction } from 'express';

import { ApiError } from '../lib';

import { infoLogger } from '../utils/logger';
import successMsg from '../utils/messages/successMsg';
import errorMsg from '../utils/messages/errorMsg';

import { generateToken, hashText } from '../utils/utils-functions';
import { userServices } from '../services';
import { StatusCodes } from 'http-status-codes';
import renderTemplate from '../utils/renderTemplate';
import sendEmail from '../utils/sendEmail';


const signIn = async (req:Request, res:Response, next:NextFunction) => {
        const { body : { email, password }} = req
        const user = await userServices.getUserService({email});
        if (!user) throw new ApiError(errorMsg.IncorrectField('Email'), StatusCodes.UNAUTHORIZED);
        
        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) throw new ApiError(errorMsg.IncorrectField('Password'), StatusCodes.UNAUTHORIZED);        

        if(user.activated === false) throw new ApiError(errorMsg.unverifiedUser, StatusCodes.UNAUTHORIZED);
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
        const emailBody = {
            subject: 'Activate Your Email',
            text: 'Activate Your Email',
        }
        //Send Email
        const token = hashText(email);

        const user = await userServices.createUserService({ firstName, lastName, userName, email, password, pImage, role, activaredToken: token });
        
        if(!user) throw new ApiError(errorMsg.customMsg('Error in user registration'), StatusCodes.BAD_REQUEST);
        const emailTemplate = await renderTemplate({ firstName, token }, 'activateAccount') 
        await sendEmail( email, emailBody.subject, emailTemplate);

        if(user) infoLogger(`${req.method} | success | ${StatusCodes.CREATED} | ${req.protocol} | ${req.originalUrl}`)
        res.status(StatusCodes.CREATED).json({
            status: 'success',
            message: successMsg.signUp(user.userName),
            data : user,
})
}

const getProfile =async (req:Request, res:Response, next:NextFunction) => {
    const { _id } = req.user;
    const user = await userServices.getUserService({_id});
    if(user) infoLogger(`${req.method} | success | ${StatusCodes.OK} | ${req.protocol} | ${req.originalUrl}`)
    res.status(StatusCodes.OK).json({
        status: 'success',
        message : successMsg.get('User'),
        data: user
    })
}
const activateAccount = async (req:Request, res:Response, next:NextFunction) => {
    const { email } = req.query;
    const { token } = req.params;
    if(!token) throw new ApiError(errorMsg.IncorrectField('Token'), StatusCodes.BAD_REQUEST);
    if(!email) throw new ApiError(errorMsg.IncorrectField('Email'), StatusCodes.BAD_REQUEST);

    const updateUser = await userServices.updateUserService( { email, activaredToken: token }, { activated: true });
    if(!updateUser) throw new ApiError(errorMsg.NotFound('User',`${email}`,'Email'), StatusCodes.BAD_REQUEST);
    if(updateUser) infoLogger(`${req.method} | success | ${StatusCodes.OK} | ${req.protocol} | ${req.originalUrl}`)
    res.status(StatusCodes.OK).json({
        status: 'success',
        message: successMsg.activateAccount(email as string),
        data : updateUser
    })
}
const resendEmail = async (req:Request, res:Response, next:NextFunction) => {
    const { email } = req.body;
    if(!email) throw new ApiError(errorMsg.IncorrectField('Email'), StatusCodes.BAD_REQUEST);
    const user = await userServices.getUserService({email});
    if(!user) throw new ApiError(errorMsg.NotFound('User',`${email}`,'Email'), StatusCodes.BAD_REQUEST);
    if(user.activated === true) throw new ApiError(errorMsg.userAlreadyVerified, StatusCodes.OK);
    const emailBody = {
        subject: 'Activate Your Email',
        text: 'Activate Your Email',
    }
    const emailTemplate = await renderTemplate({ firstName: user.firstName, email }, 'activateAccount') 
    await sendEmail( email, emailBody.subject, emailTemplate);
    if(user) infoLogger(`${req.method} | success | ${StatusCodes.OK} | ${req.protocol} | ${req.originalUrl}`)
    res.status(StatusCodes.OK).json({
        status: 'success',
        message: successMsg.resendEmail(email),
    })
}
export default {
    register,
    signIn,
    getProfile,
    activateAccount,
    resendEmail
}