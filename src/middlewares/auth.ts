
const { AppError } = require('../lib/index');
import { Request,Response,NextFunction } from 'express';
import  jwt from 'jsonwebtoken';
const User = require('../DB/models/users');


const verifyToken = async (bearerToken:string) => {
  bearerToken = bearerToken.split(' ')[1];
  if(!bearerToken) return new AppError('Sign in again', 401); 
  const decoded = jwt.verify(bearerToken, process.env.TOKEN_KEY);
  const user = await User.findById(decoded.userId);
  if(!user) return new AppError('un-authenticated', 401); 
  return user;
};

const Auth = async (req:Request, res:Response, next:NextFunction) => {
  let bearerToken = req.headers.authorization;
  try {
    if (!bearerToken) throw new Error('Un-Authenticated');
    const result = await verifyToken(bearerToken);
    req.user = result
    return next();
  } catch (err) {
    next(err);
  }
};

const userAuth = async (req:Request, res:Response, next:NextFunction) => {
  let bearerToken = req.headers.authorization; 
  try {
    if (!bearerToken) throw new Error('Un-Authenticated');
    const result = await verifyToken(bearerToken);
    if (result.role !== 'USER') throw new AppError('Unauthorized-User', 403);
    req.user = result
    return next();
  } catch (err) {
    next(err);
  }
};

const adminAuth = async (req:Request, res:Response, next:NextFunction) => {
  let bearerToken = req.headers.authorization;  
  try {
    if (!bearerToken) throw new Error('Unauthenticated-User');
    const result = await verifyToken(bearerToken);
    if (result.role !== 'ADMIN') throw new AppError('Unauthorized-User', 403);
    req.user = result;
    return next();
  } catch (err) {
    next(err);
  }
};

module.exports = { userAuth, adminAuth, Auth };
