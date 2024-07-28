import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { ErrorType } from "../interfaces/utils.interface";
import { ApiError } from "./apiError";


class BadRequestError extends ApiError {
    constructor(public message: string, status?: ErrorType) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
        this.status = status || getReasonPhrase(this.statusCode);
        this.isOperational = false;
    }
}


export default BadRequestError;