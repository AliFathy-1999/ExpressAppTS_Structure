import { Request, Response , NextFunction } from "express";
import jwt from 'jsonwebtoken'
import bcryptjs from "bcryptjs"; 

import { IUser } from "../interfaces/user";
import HttpStatusCode from "../types/http-status-code";

import { ApiError } from "../lib";
import { removeImage } from "../middlewares/upload-image";

import User from "../DB/models/users";
import { infoLog } from "../utils/logger";
const generateToken = (user:IUser)=>{
    const TOKEN_KEY = process.env.TOKEN_KEY as string
    const token = jwt.sign(
        { 
            userId:user._id,
            email:user.email,
            role : user.role
        },
        TOKEN_KEY,
        { expiresIn: process.env.EXPIRES_IN }
    )
    return token;
}

const signIn = async (req:Request,res:Response,next:NextFunction) => {

        const { body : { email , password }} = req
        const user = await User.findOne({email});
        if (!user) 
            throw new ApiError('Invalid Email', HttpStatusCode.UNAUTHORIZED);

        const valid = bcryptjs.compareSync(password, user.password);
        if (!valid)
            throw new ApiError('Invalid Password', HttpStatusCode.UNAUTHORIZED);
        infoLog(`${req.method} | success | ${HttpStatusCode.OK} | ${req.protocol} | ${req.originalUrl} `)
        res.status(HttpStatusCode.OK).json({status:'success', token: generateToken(user), data : user});        
}
const register = async (req: Request, res: Response, next: NextFunction) => {
        const pImage = req.file? req.file.path : undefined    
        const { firstName , lastName, userName , email, password, role  } = req.body;
        
        const user = await User.create({ firstName , lastName, userName , email, password , pImage, role })
        if(user) infoLog(`${req.method} | success | ${HttpStatusCode.CREATED} | ${req.protocol} | ${req.originalUrl}`)

        res.status(HttpStatusCode.CREATED).json({
            status: 'success',
            data : user
})
}

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const pImage = req.file? req.file.path : undefined;

    if(req.file){
        const user = await User.findOne({_id:req.user._id});
        const imageUrl = user.pImage;
        removeImage(imageUrl) 
    }
    const { firstName , lastName } = req.body;
    
    const updatedUser = await User.findOneAndUpdate(
        {_id:req.user._id},
        { firstName , lastName , pImage },
        {runValidation: true, new : true},
        );
        if(updatedUser) infoLog(`${req.method} | success | ${HttpStatusCode.OK} | ${req.protocol} | ${req.originalUrl}`)

    res.status(HttpStatusCode.OK).json({
        status: 'success',
        data : updatedUser
    })
}

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const { params : { id }} = req;  

    const user = await User.findOne({_id:id});
    if(!user) throw new ApiError (`No User with ID ${id}`, HttpStatusCode.BAD_REQUEST);

    const imageUrl = user.pImage;
    removeImage(imageUrl) 

    const deletedUser = await User.findOneAndDelete({_id:id});
    if(deletedUser) infoLog(`${req.method} | success | ${HttpStatusCode.OK} | ${req.protocol} | ${req.originalUrl}`)
    
    res.status(HttpStatusCode.OK).json({
        status: 'success',
    })
}

export default {
    register,
    signIn,
    updateUser,
    deleteUser
}