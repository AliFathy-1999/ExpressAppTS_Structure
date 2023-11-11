import { NextFunction, Request, Response } from "express";
import { Schema, ValidationError } from "joi";

import { ApiError } from "../lib";

const validate = (schema: { [key: string]: Schema }) => async (req:Request, res:Response, next:NextFunction) => {
  const validationErr = [];
  ['body', 'params', 'query'].forEach((key) => {
    if (schema[key]) {
      const validation = schema[key].validate(req[key]);
      if (validation.error) {
        validationErr.push(validation.error);
      }
    }
  });
  if (validationErr.length) {
    next(new ApiError(validationErr[0].details[0].message, 400));
  } else {
    next();
  }
};
export default validate ;
