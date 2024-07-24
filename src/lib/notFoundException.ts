import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { ErrorType } from "../interfaces/utils.interface";
import { ApiError } from "./apiError";


class NotFoundError extends ApiError {
  constructor(public message:string) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND ;
    this.status = getReasonPhrase(this.statusCode);
    this.isOperational = false;
  }
}


export default NotFoundError;