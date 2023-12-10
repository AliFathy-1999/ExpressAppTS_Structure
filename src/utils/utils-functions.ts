import * as crypto from 'crypto';
import { IUser } from '../interfaces/user';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ApiError } from '../lib';
import { StatusCodes } from 'http-status-codes';
import User from '../DB/models/users';
import errorMsg from './messages/errorMsg';
import * as QRCode from 'qrcode';
const hashText = (text:string) => {
    return crypto.createHash('sha256').update(text).digest('hex');
}
const generateToken = (user:IUser)=>{
    const { TOKEN_KEY, EXPIRES_IN } = process.env;
    const { _id , email, role } = user
    const token = jwt.sign(
        { 
            userId:_id,
            email,
            role
        },
        TOKEN_KEY,
        { expiresIn: EXPIRES_IN }
    )
    return token;
}
const verifyToken = async (bearerToken:string) : Promise<IUser | ApiError>=> {
    bearerToken = bearerToken.split(' ')[1];
    if(!bearerToken) return new ApiError(errorMsg.signInAgain, StatusCodes.UNAUTHORIZED); 
    const decoded = jwt.verify(bearerToken, process.env.TOKEN_KEY) as JwtPayload;
        
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

const trimText = (text:string) => {
    return text.replace(/\s+/g, ' ');
}

const generateQRCode = async (qrCodeContent:any) => {
    try {
        const qrCodeAsString = JSON.stringify(qrCodeContent)
        const generateUrl = await QRCode.toDataURL(qrCodeAsString);
        return generateUrl;
    } catch (err) {
        console.error(err)
    }
}

export {
    hashText,
    generateToken,
    generateOTP,
    trimText,
    verifyToken,
    generateQRCode
}