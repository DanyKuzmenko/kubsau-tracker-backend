import { NextFunction, Request, Response } from 'express';
import { handleErrorValidation } from './utils/errorFunctions';
import { fetchGroupsFromUniversityAPI } from './utils/universityAPI';
import { sortByName } from './utils/additionalFunctions';

const Controller = {
  getGroups: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const groups = await fetchGroupsFromUniversityAPI();

      if (!groups || groups.length === 0) {
        throw new Error('Groups is empty');
      }

      res
        .status(200)
        .json(groups.groups.sort((a: any, b: any) => sortByName(a, b)));
    } catch (err: any) {
      handleErrorValidation(err, next);
    }
  },
};

export default Controller;
