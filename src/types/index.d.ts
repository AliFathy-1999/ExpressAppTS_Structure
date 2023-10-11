import  { IUser }  from '../interfaces/user';
import multer from 'multer';

declare global{
    namespace Express {
        interface Request {
            user?: IUser | undefined,
            file?:multer.File
        }
        interface Multer {
            File: multer.File
        }
    }
    
}