import Boom from '@hapi/boom'
import { NextFunction, Request, Response } from 'express';

export const errorHandler = (err: Boom.Boom<any>, req: Request, res: Response, next: NextFunction  ) => {
  console.log('err', err);
  if (err.isBoom && err.data.details) {
    // Extract detailed validation errors from the Boom error payload
    const { details } = err.data;
    res.status(err.output.statusCode).json({ error: 'Bad Request', message: 'Validation failed', details });
  } else {
    // Handle other types of errors using default Boom error response
    res.status(err.output.statusCode).json(err.output.payload);
  }
};
