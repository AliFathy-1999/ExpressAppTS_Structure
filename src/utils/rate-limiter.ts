import { NextFunction, Request, Response } from 'express';
import { RateLimiterMemory } from "rate-limiter-flexible";
import { StatusCodes } from "http-status-codes";
import IP from 'ip'
import { ApiError } from '../lib';

const rateLimiter = new RateLimiterMemory({
  points: 10, 
  duration: 5, 
});

const rateLimiterMiddleware = (req:Request, res:Response, next:NextFunction) => {
  const ipAddress = IP.address();
   rateLimiter.consume(ipAddress)
      .then(() => {        
          next();
      })
      .catch(() => {
          next( new ApiError('Too Many Requests', StatusCodes.TOO_MANY_REQUESTS) );
      });
   };

   export default rateLimiterMiddleware