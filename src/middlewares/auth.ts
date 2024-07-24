
import { Request,Response,NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ApiError } from '../lib';

import { IUser, Role } from '../interfaces/user';
import { verifyToken } from '../utils/utils-functions';
import errorMsg from '../utils/messages/errorMsg';
import UnauthenticatedError from '../lib/unauthenticatedException';
import UnauthorizedError from '../lib/unAuthorizedException';

const checkUserAuthenticated = async (req:Request, res:Response, next:NextFunction) => {
  try {
    let token: string;
    if( req.headers.authorization && req.headers.authorization.startsWith("Bearer") ) {
      token = req.headers.authorization?.split(" ")[1]
    }
    if(!token) throw new UnauthenticatedError(errorMsg.unAuthenticated);

    const decoded = await verifyToken(token) as IUser;
    if(!decoded.verified) throw new UnauthenticatedError(errorMsg.unverifiedUser);

    req.user = decoded;
    next();
    
  } catch (error) {
      next(error);
  }
}

const checkUserRole = (role: Role[] ) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userPayload = req.user;
      if(!role?.includes(userPayload?.role)) {
        throw new UnauthorizedError(errorMsg.unAuthorized)
      };
      next();
    } catch (err) {
      next(err);
    }
  };
};
const userAuth = checkUserRole([Role.USER]);
const adminAuth = checkUserRole([Role.ADMIN]);

export { userAuth, adminAuth,verifyToken, checkUserAuthenticated };


