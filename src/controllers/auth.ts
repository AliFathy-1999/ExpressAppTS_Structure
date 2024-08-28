import { Request, Response, NextFunction } from 'express';

import successMsg from '../utils/messages/successMsg';
import errorMsg from '../utils/messages/errorMsg';

import { generateToken, hashText } from '../utils';
import { userServices } from '../services';
import { StatusCodes } from 'http-status-codes';
import renderTemplate from '../utils/renderTemplate';
import sendEmail from '../utils/sendEmail';
import { IUserPayload, TOKEN_TYPE } from '../interfaces/user';
import jwt from 'jsonwebtoken';
import { cacheOption } from '../interfaces/utils.interface';
import { BadRequestError, ConflictError, UnauthenticatedError, UnauthorizedError } from '../lib/apiError';


const signIn = async (req:Request, res:Response, next:NextFunction) => {
        const { body : { email, password }} = req
        const user = await userServices.getUserService({email});
        
        if (!user) throw new UnauthenticatedError(errorMsg.IncorrectField('Email'));
    
        
        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) throw new UnauthenticatedError(errorMsg.IncorrectField('Password'));        
        
        const userPayload: IUserPayload = {
            userId: String(user._id),
            email: user.email,
            role: user.role,
            verified: user.verified
        }
        if(user.verified === false) throw new UnauthenticatedError(errorMsg.unverifiedUser);
        res
        .status(StatusCodes.OK)
        .cookie('refreshToken', generateToken(userPayload,TOKEN_TYPE.REFRESH_TOKEN), { httpOnly: true, sameSite: 'strict' })
        .json({
            message : successMsg.signIn(user.userName),
            accessToken: generateToken(userPayload),
            data : user,
        })
        
}
const refreshAccessToken = async (req:Request, res:Response, next:NextFunction) => {
    const refreshToken = req.cookies['refreshToken'];    
    if(!refreshToken) throw new UnauthorizedError('Access Denied. No refresh token provided.')
    const decodedRefreshToken = jwt.verify(refreshToken, process.env.AUTH_REFRESH_TOKEN_SECRET) as IUserPayload;
    const accessToken = generateToken(decodedRefreshToken) 
    res.status(StatusCodes.OK).header('Authorization',`Brearer ${accessToken}`).json({
        accessToken
    })
}
const logout = async (req:Request, res:Response, next:NextFunction) => {
    const refreshToken = req.cookies['refreshToken'];    
    if(!refreshToken) throw new UnauthorizedError('Access Denied. No refresh token provided.')
    res.status(StatusCodes.OK)
    .clearCookie('refreshToken').json({
        message: "logout successfully"
    })
}

const register = async (req: Request, res: Response, next: NextFunction) => {  
        
        // const images : IFiles = req.files as IFiles;

        const images = req.files as Express.Multer.File[];
        // if (req.files?.length === 1) 
        //     throw new BadRequestError(errorMsg.fileCount(1));
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
        
        const emailTemplate = await renderTemplate({ firstName, token }, 'activateAccount') 
        if(process.env.MOCK_MODE == "1"){
            const x = await sendEmail( email, emailBody.subject, emailTemplate);
            console.log('x:', x)
        }
        if(!user) throw new BadRequestError(errorMsg.customMsg('Error in user registration'));

        res.status(StatusCodes.CREATED).json({
            message: successMsg.signUp(user.userName),
            data : user,
})
}

const getProfile =async (req:Request, res:Response, next:NextFunction) => {
    const { _id } = req.user;
    const user = await userServices.getUserService({_id},cacheOption.USE_CACHE);
    res.status(StatusCodes.OK).json({
        message : successMsg.get('User'),
        data: user
    })
}
const activateAccount = async (req:Request, res:Response, next:NextFunction) => {
    const { email } = req.query;
    const { token } = req.params;
    if(!token) throw new BadRequestError(errorMsg.IncorrectField('Token'));
    if(!email) throw new BadRequestError(errorMsg.IncorrectField('Email'));

    const updateUser = await userServices.updateUserService( { email, activaredToken: token }, { verified: true });
    if(!updateUser) throw new BadRequestError(errorMsg.NotFound('User',`${email}`,'Email'));
    res.status(StatusCodes.ACCEPTED).json({
        message: successMsg.activateAccount(email as string),
        data : updateUser
    })
}
const resendEmail = async (req:Request, res:Response, next:NextFunction) => {
    const { email } = req.body;
    if(!email) throw new BadRequestError(errorMsg.IncorrectField('Email'));
    const user = await userServices.getUserService({email});
    if(!user) throw new BadRequestError(errorMsg.NotFound('User',`${email}`,'Email'));
    if(user.verified === true) throw new ConflictError(errorMsg.userAlreadyVerified);
    const emailBody = {
        subject: 'Activate Your Email',
        text: 'Activate Your Email',
    }
    const emailTemplate = await renderTemplate({ firstName: user.firstName, email }, 'activateAccount') 
    await sendEmail( email, emailBody.subject, emailTemplate);
    res.status(StatusCodes.OK).json({
        message: successMsg.resendEmail(email),
    })
}

export default {
    register,
    signIn,
    getProfile,
    activateAccount,
    resendEmail,
    refreshAccessToken,
    logout
}