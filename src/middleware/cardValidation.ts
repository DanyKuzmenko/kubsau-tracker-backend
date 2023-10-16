import { Request, Response, NextFunction } from 'express';
import cardSchema from '../schemas/card';

export const validateCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await cardSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (err: any) {
    res.status(400).json({ err: err.inner });
  }
};
