import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup'

export const validateCard = (cardSchema:  yup.ObjectSchema<any>) => async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await cardSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (err: any) {
    res.status(400).json({ err: err.inner });
  }
};
