import * as yup from 'yup';
import Boom from '@hapi/boom';
import { NextFunction } from 'express';

export const handleErrorValidation = (err: any, next: NextFunction) => {
  if (err instanceof yup.ValidationError) {
    const validationErrors: { [key: string]: string } = {};

    err.inner.forEach((error: yup.ValidationError) => {
      if (error.path) {
        validationErrors[error.path] = error.message;
      }
    });

    const boomError = Boom.badRequest('Validation failed', { details: validationErrors });
    return next(boomError);
  } else {
    const boomError = Boom.badImplementation('Internal Server Error', err);
    return next(boomError);
  }
}
