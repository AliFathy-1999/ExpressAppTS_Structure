import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ApiError, UnauthenticatedError } from './apiError'
import { errorLogger } from '../utils/logger';
import errorMsg from '../utils/messages/errorMsg';
import { StatusCodes } from 'http-status-codes';
import { DuplicateKeyError, ErrorType } from '../interfaces/utils.interface';
import { JsonWebTokenError, VerifyCallback, TokenExpiredError } from 'jsonwebtoken';


const handleMogooseValidationError = (err: mongoose.Error.ValidationError | DuplicateKeyError) => {
  if (err instanceof mongoose.Error.ValidationError)
    return new ApiError(errorMsg.mongooseInvalidInput(err), StatusCodes.UNPROCESSABLE_ENTITY);
  return new ApiError(errorMsg.DuplicatedKey(err), StatusCodes.UNPROCESSABLE_ENTITY);
};

const handleJwtError = (err: JsonWebTokenError) => {
  if(err instanceof TokenExpiredError){
    return new UnauthenticatedError("Token has been expired, please login again", ErrorType.JWT);
  } else if(err.message == "invalid signature"){
    return new UnauthenticatedError("Invalid token, provide valid signature", ErrorType.JWT);
  }
    return new UnauthenticatedError("Invalid token", ErrorType.JWT);
};

export const handleResponseError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof mongoose.Error.ValidationError || err.code === 11000) {
    err = handleMogooseValidationError(err);
  } else if ( err instanceof JsonWebTokenError) {
    err = handleJwtError(err)
  }
  err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  err.status = err.status || 'failed';
  
  res.status(err.statusCode).json({ message: err.message, status: err.status });
  
  //Don't log any error in case of validation error or token error
  if(err.status !== ErrorType.VALIDATION && err.status !== ErrorType.JWT){
    const currentTime = Date.now();
    const elapsed = currentTime - req.requestDate
    errorLogger({ req,res,elapsed })
  }
};

