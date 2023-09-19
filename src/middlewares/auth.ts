
import { Request,Response,NextFunction } from 'express';
import  jwt from 'jsonwebtoken';

import { ApiError } from '../lib';

import User from '../DB/models/users';
import HttpStatusCode from '../types/http-status-code';
import { IUser, Role } from '../interfaces/user';

const verifyToken = async (bearerToken:string) => {
  bearerToken = bearerToken.split(' ')[1];
  if(!bearerToken) return new ApiError('Sign in again', HttpStatusCode.UNAUTHORIZED); 
  const decoded = jwt.verify(bearerToken, process.env.TOKEN_KEY);
  const user = await User.findById(decoded.userId);
  if(!user) return new ApiError('un-authenticated', HttpStatusCode.UNAUTHORIZED); 
  
  return user;
};

const Auth = async (req:Request, res:Response, next:NextFunction) => {
  let bearerToken = req.headers.authorization;
  try {
    if (!bearerToken) throw new ApiError('Un-Authenticated',HttpStatusCode.FORBIDDEN);
    const result = await verifyToken(bearerToken);
    req.user = result as IUser
    return next();
  } catch (err) {
    next(err);
  }
};

const userAuth = async (req:Request, res:Response, next:NextFunction) => {
  let bearerToken = req.headers.authorization; 
  try {
    if (!bearerToken) throw new ApiError('Un-Authenticated',HttpStatusCode.UNAUTHORIZED);
    const result = await verifyToken(bearerToken);
    if ( result['role'] !== 'user') throw new ApiError('Unauthorized-User',HttpStatusCode.FORBIDDEN);
    req.user = result as IUser
    return next();
  } catch (err) {
    next(err);
  }
};

const adminAuth = async (req:Request, res:Response, next:NextFunction) => {
  let bearerToken = req.headers.authorization;  
  try {
    if (!bearerToken) throw new ApiError('Unauthenticated-User', HttpStatusCode.UNAUTHORIZED);
    const result = await verifyToken(bearerToken);
    if ( result['role'] !== "admin") return res.status(HttpStatusCode.FORBIDDEN).json({ error: 'Unauthorized access' });
    req.user = result as IUser;
    return next();
  } catch (err) {
    next(err);
  }
};

export { userAuth, adminAuth, Auth };
