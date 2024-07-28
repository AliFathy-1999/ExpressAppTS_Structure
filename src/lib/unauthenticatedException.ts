import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { ErrorType } from "../interfaces/utils.interface";
import { ApiError } from "./apiError";


class UnauthenticatedError extends ApiError {
  constructor( public message:string, status?:ErrorType) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
    this.status = status || getReasonPhrase(this.statusCode);
    this.isOperational = false;
  }
}


export default UnauthenticatedError;