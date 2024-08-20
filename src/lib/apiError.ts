import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { ErrorType } from "../interfaces/utils.interface";
class ApiError extends Error {
  status: string;
  isOperational: boolean; 
  constructor( public message:string,public statusCode:number = StatusCodes.INTERNAL_SERVER_ERROR,status?:ErrorType) {
  console.log('status:', status)
    super(message);
    this.statusCode = statusCode ;
    this.status = status || getReasonPhrase(this.statusCode);
    this.isOperational = false;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends ApiError {
  constructor(public message:string) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND ;
    this.status = getReasonPhrase(this.statusCode);
    this.isOperational = false;
  }
}

class UnauthenticatedError extends ApiError {
  constructor( public message:string, status?:ErrorType) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
    this.status = status || getReasonPhrase(this.statusCode);
    this.isOperational = false;
  }
}

class ConflictError extends ApiError {
  constructor( public message:string) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT ;
    this.status = getReasonPhrase(this.statusCode);
    this.isOperational = false;
  }
}

class BadRequestError extends ApiError {
  constructor(public message: string, status?: ErrorType) {
      super(message);
      this.statusCode = StatusCodes.BAD_REQUEST;
      this.status = status || getReasonPhrase(this.statusCode);
      this.isOperational = false;
  }
}

class UnauthorizedError extends ApiError {
  constructor( public message:string) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN ;
    this.status = getReasonPhrase(this.statusCode);
    this.isOperational = false;
  }
}

export {  
  ApiError,
  NotFoundError,
  UnauthenticatedError,
  ConflictError,
  BadRequestError,
  UnauthorizedError
};