import { ObjectId } from 'mongoose';
import { User, userType } from '../DB/models/users';
import { IUser } from '../interfaces/user';
import bcryptjs from 'bcryptjs';




const checkPassword  = async (password:string,newPassword:string) : Promise<Boolean> => await bcryptjs.compare(newPassword,password); 
export default{
    checkPassword
}
