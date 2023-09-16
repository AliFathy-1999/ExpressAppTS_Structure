
import { handleResponseError } from "./handlingErrors";
import { ApiError } from "./apiError";
import asyncWrapper from "./asyncWrapper";

const trimText = (text:string) => {
    return text.replace(/\s+/g, ' ');
}

export { ApiError, asyncWrapper, handleResponseError, trimText };
