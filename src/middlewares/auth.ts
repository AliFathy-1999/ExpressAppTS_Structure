
import { Request,Response,NextFunction } from 'express';
import  jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

import { ApiError } from '../lib';

import User from '../DB/models/users';
import { IUser, Role } from '../interfaces/user';

const verifyToken = async (bearerToken:string) => {
  bearerToken = bearerToken.split(' ')[1];
  if(!bearerToken) return new ApiError('Sign in again', StatusCodes.UNAUTHORIZED); 
  const decoded = jwt.verify(bearerToken, process.env.TOKEN_KEY);
  const user = await User.findById(decoded.userId);
  if(!user) return new ApiError('un-authenticated', StatusCodes.UNAUTHORIZED); 
  
  return user;
};

// const Auth = async (req:Request, res:Response, next:NextFunction) => {
//   const bearerToken = req.headers.authorization;
//   try {
//     if (!bearerToken) throw new ApiError('Un-Authenticated',StatusCodes.FORBIDDEN);
//     const result = await verifyToken(bearerToken);
//     req.user = result as IUser
//     return next();
//   } catch (err) {
//     next(err);
//   }
// };

const checkUserRole = (role: Role ) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const bearerToken = req.headers.authorization;
    try {
      if (!bearerToken) 
        throw new ApiError('Un-Authenticated', StatusCodes.UNAUTHORIZED);

      const result = await verifyToken(bearerToken) as IUser;
      const unAuthorizedAccess = result.role === Role.USER ?  "Unauthorized-User" : 'Unauthorized access' ;
    
      if (role === Role.BOTH) {        
        req.user = result;
        return next();
      }
      if(result.role !== role) throw new ApiError(unAuthorizedAccess, StatusCodes.UNAUTHORIZED);

      req.user = result as IUser;
      next();
    } catch (err) {
      next(err);
    }
  };
};
const Auth = checkUserRole(Role.BOTH)
const userAuth = checkUserRole(Role.USER);
const adminAuth = checkUserRole(Role.ADMIN);

export { userAuth, adminAuth, Auth,verifyToken };
