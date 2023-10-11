import { Request, Response , NextFunction } from "express";
import jwt from 'jsonwebtoken'
import bcryptjs from "bcryptjs"; 

import { IUser, ORDER } from "../interfaces/user";
import HttpStatusCode from "../types/http-status-code";

import { ApiError } from "../lib";
import { removeImage } from "../utils/upload-files-utils/oncloud";

import User from "../DB/models/users";
import { infoLogger } from "../utils/logger";
import successMsg from "../utils/successMsg";
import errorMsg from "../utils/errorMsg";

import fetchDataUtils from "../utils/fetch-data-utils";

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
            throw new ApiError(errorMsg.IncorrectField('Email'), HttpStatusCode.UNAUTHORIZED);

        const valid = bcryptjs.compareSync(password, user.password);
        if (!valid)
            throw new ApiError(errorMsg.IncorrectField('Password'), HttpStatusCode.UNAUTHORIZED);
        infoLogger(`${req.method} | success | ${HttpStatusCode.OK} | ${req.protocol} | ${req.originalUrl} `)
        res.status(HttpStatusCode.OK).json({
            status:'success',
            message : successMsg.signIn(user.userName),
            token: generateToken(user),
            data : user,
        });        
}
const register = async (req: Request, res: Response, next: NextFunction) => {
        const pImage = req.file? req.file.path : undefined    
        const { firstName , lastName, userName , email, password, role  } = req.body;
        
        const user = await User.create({ firstName , lastName, userName , email, password , pImage, role })
        if(user) infoLogger(`${req.method} | success | ${HttpStatusCode.CREATED} | ${req.protocol} | ${req.originalUrl}`)

        res.status(HttpStatusCode.CREATED).json({
            status: 'success',
            message: successMsg.signUp(user.userName),
            data : user,
            token: generateToken(user),
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
        if(updatedUser) infoLogger(`${req.method} | success | ${HttpStatusCode.OK} | ${req.protocol} | ${req.originalUrl}`)

    res.status(HttpStatusCode.OK).json({
        status: 'success',
        message: successMsg.updated('User',`${req.user._id}`),
        data : updatedUser
    })
}

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const { params : { id }} = req;  

    const user = await User.findOne({_id:id});
    if(!user) throw new ApiError (errorMsg.NotFound('User',`${id}`), HttpStatusCode.BAD_REQUEST);

    const imageUrl = user.pImage;
    removeImage(imageUrl) 

    const deletedUser = await User.findOneAndDelete({_id:id});
    if(deletedUser) infoLogger(`${req.method} | success | ${HttpStatusCode.OK} | ${req.protocol} | ${req.originalUrl}`)
    
    res.status(HttpStatusCode.OK).json({
        status: 'success',
        message: successMsg.deleted('User',`${user._id}`),
    })
}

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    const { query : { page , limit, sort } } = req;
    const users =  User.find({})
    
    const fetchData = new fetchDataUtils(users, req.query);
    fetchData.sort().paginate();
    const results = await fetchData.query;
    
    res.status(HttpStatusCode.OK).json({
        status: 'success',
        message : successMsg.get('Users'),
        data:{
            page : +fetchData.page,
            limit : +fetchData.limit,
            totalDocs : fetchData.totalDocs,
            totalPages:fetchData.totalPages,            
            users : results
        },

    })
}
export default {
    register,
    signIn,
    updateUser,
    deleteUser,
    getUsers
}