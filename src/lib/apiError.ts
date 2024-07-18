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

interface DuplicateKeyError extends Error {
  code: number;
  keyValue: string[];
}

export {  ApiError , DuplicateKeyError };