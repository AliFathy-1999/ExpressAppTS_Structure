import * as crypto from 'crypto';
import { IUser, IUserPayload, TOKEN_TYPE } from '../interfaces/user';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ApiError } from '../lib';
import { StatusCodes } from 'http-status-codes';
import { User } from '../DB/models/users';
import errorMsg from './messages/errorMsg';

const hashText = (text:string) => {
    return crypto.createHash('sha256').update(text).digest('hex').substring(0,20);
}
const generateActivationToken = (email: string): string => {
    return jwt.sign({ email }, process.env.EMAIL_SECRET_KEY, { expiresIn: '1h' }); // Token expires in 1 hour
};
const generateToken = (user: IUserPayload, tokenType = TOKEN_TYPE.ACCESS_TOKEN)=>{
    const { 
        AUTH_ACCESS_TOKEN_SECRET, AUTH_ACCESS_TOKEN_EXPIRY,
        AUTH_REFRESH_TOKEN_SECRET, AUTH_REFRESH_TOKEN_EXPIRY
    } = process.env;

    let secretOrPrivateKey = AUTH_ACCESS_TOKEN_SECRET;
    let options = { expiresIn: AUTH_ACCESS_TOKEN_EXPIRY }

    if(tokenType === 'REFRESH_TOKEN') {
        secretOrPrivateKey = AUTH_REFRESH_TOKEN_SECRET;
        options.expiresIn = AUTH_REFRESH_TOKEN_EXPIRY
    }
    const { userId, email, role, verified } = user
    const token = jwt.sign(
        {
            userId,
            email,
            role,
            verified
        },
        secretOrPrivateKey,
        options
    )
    return token;
}
const verifyToken = async (token:string) : Promise<IUser | ApiError> => {
    if(!token) return new ApiError(errorMsg.signInAgain, StatusCodes.UNAUTHORIZED); 
    const decoded = jwt.verify(token, process.env.AUTH_ACCESS_TOKEN_SECRET) as JwtPayload;
        
    const user = await User.findById(decoded.userId);
    if(!user) return new ApiError(errorMsg.unAuthenticated, StatusCodes.UNAUTHORIZED); 
    
    return user;
};
const generateOTP = (noOfDigits: number) => {
    noOfDigits = noOfDigits || 6
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < noOfDigits; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

export {
    hashText,
    generateToken,
    verifyToken,
    generateOTP,
    generateActivationToken
}