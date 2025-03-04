import  { IUser }  from '../interfaces/user';
import multer,{Field, Multer} from 'multer';

declare global{
    namespace Express {
        interface Request {
            user?: IUser | undefined,
            file?:Multer.File,
            files?: {[fieldname: string]: Multer.File[]} | Multer.File[],
            requestDate: number
        }
        interface Multer {
            File: Multer.File,
            files?: {[fieldname: string]: Multer.File[]} | Multer.File[],
        }
        interface Response {
            responseBody: any;
            success: boolean;
        }
    }
    
}