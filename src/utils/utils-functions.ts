import * as crypto from 'crypto';
import { IUser, IUserPayload, TOKEN_TYPE } from '../interfaces/user';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ApiError } from '../lib';
import { StatusCodes } from 'http-status-codes';
import { User } from '../DB/models/users';
import errorMsg from './messages/errorMsg';
import * as QRCode from 'qrcode';
import moment from 'moment';
import { CustomResponse, splitCharacterType } from '../interfaces/utils.interface';
import { parse, stringify } from 'circular-json';
import { Response } from 'express';
import fs from 'fs';
import { infoLogger } from './logger';

const hashText = (text:string) => {
    return crypto.createHash('sha256').update(text).digest('hex').substring(0,20);
}
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
const handleStringifyValueResponse = (stringValue:string) => {
    //Example
    // stringValue = "{\people\:{\persons\:[{\id\\:\"123\",\name\:\"علي احمد \",\age\:\"22\",\salary\:\"500\"},{\id\:\"456\",\name\:\"حسام\",\age\:\"30\",\salary\:\"1000\"}]}}"
    const parseString = JSON.parse(stringValue)
    return parseString;
}
const formatDate = (unFormateDate:string,splitCharacter: splitCharacterType = "/") => {
    //formatDate("20220202")
    //splitCharacter =>  / or - or . or space
    const date = unFormateDate ? moment(unFormateDate, 'YYYYMMDD').format(`YYYY${splitCharacter}MM${splitCharacter}DD`) : "-";
    return date
};
const  InsertSplitCharInMiddle = (str:string, splitCharacter:splitCharacterType = "-") => {
    if(str.includes(splitCharacter)) return str;
    const length = str.length;
    const middleIndex = Math.floor(length / 2);
    // Insert special character in the middle
    const firstHalf = str.substring(0, middleIndex);
    const secondHalf = str.substring(middleIndex);
    
    return `${firstHalf}${splitCharacter}${secondHalf}`;
}

const replaceEngDigitsToArDigits = (str:string | number) => str.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);

const concatenateText = (groupOfText:Array<string>,splitedCharacter:splitCharacterType = " "): string => groupOfText.map(text => text.trim()).join(splitedCharacter);

const formatDateLocale = (date:Date, locale:string= 'en-US') => new Intl.DateTimeFormat(locale).format(date);

const orderObject = <T>(unOrderedObject: { [key:string]: any }, keyOrder: Array<string>): T => {
    const orderedObj: { [key: string]: any } = {};
    keyOrder.forEach(key => {
    if (unOrderedObject.hasOwnProperty(key)) {
        orderedObj[key] = unOrderedObject[key];
    }
    });
    return orderedObj as T;
}

const removeFalsyValues = <T>(obj: { [key:string] : any }) => {
    const result = {};
    for (const key in obj) {
            if ( obj[key] && !(typeof obj[key] == "object" && Object.keys(obj[key]).length == 0)) {
                result[key] = obj[key];
        }
    }
        
    return result as T;
}

const removeSensitiveData = (data: any, sensitiveKeys: string[]): any => {
    if (typeof data !== 'object' || data === null) {
        return data;
    }
    const flatData = parse(stringify(data));


    if (Array.isArray(data)) {
        return data.map(item => removeSensitiveData(item, sensitiveKeys));
    }

    const sanitizedData: any = {};
    for (const key in flatData) {
        if (typeof key == "string" && sensitiveKeys.includes(key)  ) {
            sanitizedData[key] = '[REDACTED]';
        } 
        else {
            sanitizedData[key] = removeSensitiveData(flatData[key], sensitiveKeys);
        }
    }

    return sanitizedData;
};

const setSuccessFlag = (res: CustomResponse, body: any) => {
    res.success = res.statusCode >= 200 && res.statusCode < 300;
    body.success = res.success;
    return body;
};

const createFolderIfNotExists = (foldersPath: Array<string>) => {
    if(foldersPath.length !=0 ){    
        foldersPath?.forEach((folderPath) => {
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
                infoLogger(`Folder created: ${folderPath}`)
            } else {
                infoLogger(`Folder already exists: ${folderPath}`);
            }
    });
    }
};

export {
    hashText,
    generateToken,
    generateOTP,
    trimText,
    verifyToken,
    generateQRCode,
    handleStringifyValueResponse,
    formatDate,
    InsertSplitCharInMiddle,
    replaceEngDigitsToArDigits,
    concatenateText,
    formatDateLocale,
    removeFalsyValues,
    orderObject,
    removeSensitiveData,
    setSuccessFlag,
    createFolderIfNotExists
}