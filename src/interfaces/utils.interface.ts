import { Request, Response } from "express";

type splitCharacterType = "/" | ":" | "-" | "." | " ";

enum cacheOption {
    USE_CACHE,
    NO_CACHE
}
enum ErrorType {
    VALIDATION = "VALIDATION",
    JWT = "JWT_ERROR"
} 
interface CustomResponse extends Response {
    success: boolean;
    responseBody: any;
}
interface IinfoLogger {
    Request: {
        source: string | undefined;
        serviceName?: string;
        elapsed?: string;
        endPoint: string;
        url: string;
        method: string;
        headers: any;
        cookies?: any;
        query: any;
        params: any;
        body: any;
        IPAddress: string;
        userId: string | null;
    },
    Response: {
        body: Object,
        statusCode : number,
        statusMessage: string
    };
}

interface IloggerParams {
    req?:Request;
    res?:Response;
    serviceName?:string;
    elapsed?: number;
}

export { 
    splitCharacterType,
    cacheOption,
    IinfoLogger,
    IloggerParams,
    ErrorType,
    CustomResponse
}