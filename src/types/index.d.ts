import  { IUser }  from '../types/schemasType';
import multer from 'multer';

declare global{
    namespace Express {
        interface Request {
            user?: IUser | undefined,
            file?:multer.File
        }
        interface ProcessEnv {
            PORT?: number;
            TOKEN_KEY?: string;
            DB?: string;
            BEARER_SECRET? : string;
            SALT_ROUND? : number
            SENDER_EMAIL?: string;
            SENDER_PASSWORD?: string;
            EXPIRES_IN?: string;        
        }
    }
    
}