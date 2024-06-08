
import { Request,Response,NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ApiError } from '../lib';

import { IUser, Role } from '../interfaces/user';
import { verifyToken } from '../utils/utils-functions';
import errorMsg from '../utils/messages/errorMsg';



const checkUserRole = (role: Role[] ) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const bearerToken = req.headers.authorization;
    try {
      if (!bearerToken) 
        throw new ApiError(errorMsg.unAuthenticated, StatusCodes.UNAUTHORIZED);
      const result = await verifyToken(bearerToken) as IUser;
      if(result.verified === false) throw new ApiError(errorMsg.unverifiedUser, StatusCodes.UNAUTHORIZED);
      // if (role === Role.BOTH) {        
      //   req.user = result;
      //   return next();
      // }
      if(role.includes(result.role)) {
        req.user = result as IUser;
        return next()
      };
      if(!role.includes(result.role)) throw new ApiError(errorMsg.unAuthorized, StatusCodes.UNAUTHORIZED);
      // if(result.role !== role) throw new ApiError(errorMsg.unAuthorized, StatusCodes.UNAUTHORIZED);

      req.user = result as IUser;
      next();
    } catch (err) {
      next(err);
    }
  };
};
const Auth = checkUserRole(Object.values(Role))
const userAuth = checkUserRole([Role.USER]);
const adminAuth = checkUserRole([Role.ADMIN]);

export { userAuth, adminAuth, Auth,verifyToken };


