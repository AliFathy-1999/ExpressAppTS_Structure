import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { ErrorType } from "../interfaces/utils.interface";
import { ApiError } from "./apiError";


class UnauthorizedError extends ApiError {
  constructor( public message:string) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN ;
    this.status = getReasonPhrase(this.statusCode);
    this.isOperational = false;
  }
}


export default UnauthorizedError;