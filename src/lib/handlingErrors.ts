import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ApiError, DuplicateKeyError } from './apiError'
import { errorLogger } from '../utils/logger';
import HttpStatusCode from '../types/http-status-code';
import errorMsg from '../utils/errorMsg';


const handleMogooseValidationError = (err: mongoose.Error.ValidationError | DuplicateKeyError) => {
  if (err instanceof mongoose.Error.ValidationError)
    return new ApiError(errorMsg.mongooseInvalidInput(err), HttpStatusCode.UNPROCESSABLE_ENTITY);
  return new ApiError(errorMsg.DuplicatedKey(err), HttpStatusCode.UNPROCESSABLE_ENTITY);
};

export const handleResponseError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof mongoose.Error.ValidationError || err.code === 11000) {
    err = handleMogooseValidationError(err);
  }
  err.status = err.status || 'failed';
  err.statusCode = err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
  errorLogger(`${req.method} | ${err.status} | ${err.statusCode} | ${req.protocol} | ${req.originalUrl} | ${err.message}`)
  // errorLogger(`${req.method} request to ${req.originalUrl} failed. Response code : "${err.statusCode}", response message: "${err.message}"`)
  res.status(err.statusCode).json({ message: err.message, status: err.status });
};

