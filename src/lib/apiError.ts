import { StatusCodes, getReasonPhrase } from "http-status-codes";
class ApiError extends Error {
  status: string;
  isOperational: boolean; 
  constructor( public message:string, public statusCode:number = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode ;
    this.status = getReasonPhrase(this.statusCode);
    this.isOperational = false;
    Error.captureStackTrace(this, this.constructor);
  }
}

interface DuplicateKeyError extends Error {
  code: number;
  keyValue: string[];
}

export {  ApiError , DuplicateKeyError };