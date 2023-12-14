import * as yup from 'yup';
import Boom from '@hapi/boom';
import { NextFunction } from 'express';

type ValidationErrors = { [key: string]: string }

export const handleErrorValidation = (err: any, next: NextFunction) => {
  if (err instanceof yup.ValidationError) {
    const validationErrors: ValidationErrors = {};
    let additionalValidationErrors: string[] = []

    err.inner.forEach((error: yup.ValidationError) => {
      if (error.path) {
        validationErrors[error.path] = error.message;
      }
    });

    if (Object.keys(validationErrors).length === 0) {
      additionalValidationErrors = err.errors
    }

    const details = Object.keys(validationErrors).length === 0 ? additionalValidationErrors : validationErrors

    const boomError = Boom.badRequest('Validation failed', { details: details });
    return next(boomError);
  } else {
    const boomError = Boom.badImplementation('Internal Server Error', err);
    return next(boomError);
  }
}
