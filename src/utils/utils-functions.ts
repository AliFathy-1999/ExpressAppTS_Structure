import * as crypto from 'crypto';
import { IUser } from '../interfaces/user';
import jwt from 'jsonwebtoken';
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

export {
    hashText,
    generateToken,
    generateOTP,
    trimText
}