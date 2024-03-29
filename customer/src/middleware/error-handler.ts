import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

  if (err instanceof CustomError) {
    console.log( err.serializeErrors())
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  res.status(400).send({
    errors: [{ message: 'Something went wrong' }]
  });
}

