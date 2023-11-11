import { StatusCodes } from 'http-status-codes';
import User from '../DB/models/users';
import { IUser } from '../interfaces/user';
import { ApiError } from '../lib';
import errorMsg from '../utils/messages/errorMsg';


const getUserService = async (filterBy: { [key:string] : any}) : Promise<IUser> => await User.findOne(filterBy); 

const createUserService = async (userData: { [key:string] : any}) : Promise<IUser>=> await User.create(userData);

const updateUserService = async (filterBy: { [key:string] : any}, updateData: { [key:string] : any}) : Promise<IUser> => await User.findOneAndUpdate(filterBy, updateData, {runValidation: true, new : true});

const deleteUserService = async (filterBy: { [key:string] : any}) : Promise<IUser> => await User.findOneAndDelete(filterBy);

const getUserByIdService = async (filterBy: { [key:string] : any}) : Promise<IUser> => await User.findOne(filterBy);

const userSearchService = async (searchField:string, searchValue:string)  => {
    // const regex = new RegExp(searchValue, 'i');
    // const schemaPaths = User.schema.paths;
    // const userSchemaFields = Object.keys(schemaPaths);
    // let filterBy = {}
    // userSchemaFields.forEach((field:string) => {
        
    //     if (field === searchField) {
    //         filterBy[field] = regex
    //     }
    // })
    // if (!userSchemaFields.includes(searchField)) {
    //     throw new ApiError(
    //         errorMsg.searchByInvalidField('User', searchField),
    //         StatusCodes.UNPROCESSABLE_ENTITY
    //     );
    // }
    // const user = await User.find(filterBy)
    
    // return user
};
export default{
    getUserService,
    createUserService,
    updateUserService,
    deleteUserService,
    getUserByIdService,
    userSearchService
}
