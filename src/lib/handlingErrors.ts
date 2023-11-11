import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ApiError, DuplicateKeyError } from './apiError'
import { errorLogger } from '../utils/logger';
import errorMsg from '../utils/messages/errorMsg';
import { StatusCodes } from 'http-status-codes';


const handleMogooseValidationError = (err: mongoose.Error.ValidationError | DuplicateKeyError) => {
  if (err instanceof mongoose.Error.ValidationError)
    return new ApiError(errorMsg.mongooseInvalidInput(err), StatusCodes.UNPROCESSABLE_ENTITY);
  return new ApiError(errorMsg.DuplicatedKey(err), StatusCodes.UNPROCESSABLE_ENTITY);
};

export const handleResponseError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof mongoose.Error.ValidationError || err.code === 11000) {
    err = handleMogooseValidationError(err);
  }
  err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  
  err.status = err.status || 'failed';

  errorLogger(`${req.method} | ${err.status} | ${err.statusCode} | ${req.protocol} | ${req.originalUrl} | ${err.message}`)
  // errorLogger(`${req.method} request to ${req.originalUrl} failed. Response code : "${err.statusCode}", response message: "${err.message}"`)
  res.status(err.statusCode).json({ message: err.message, status: err.status });
};

