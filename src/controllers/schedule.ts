import { NextFunction, Request, Response } from 'express';
import { handleErrorValidation } from './utils/errorFunctions';
import { fetchAndSaveNewSchedule } from './utils/savingSchedule';
import { ScheduleModel } from '../models/schedule';
import moment from 'moment';

const Controller = {
  getSchedule: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const groupID = req.params.groupID;

      const existingSchedule = await ScheduleModel.findOne({ id: groupID })
        .populate({
          path: 'weeks',
          populate: {
            path: 'days',
            populate: {
              path: 'classes',
              populate: {
                path: 'lessons',
                model: 'Lesson',
              },
            },
          },
        })
        .exec();

      if (!existingSchedule) {
        // Если расписание не найдено, просто получаем новое и отдаем его
        const freshSchedule = await fetchAndSaveNewSchedule(groupID);
        res.status(200).json(freshSchedule);
        return;
      }

      const lastRefresh = moment(existingSchedule.lastRefresh);
      const currentTime = moment();
      const daysDiff = currentTime.diff(lastRefresh, 'days');

      if (daysDiff >= 1) {
        // Если прошло более 1 дня с последнего обновления, получаем новое и отдаем его
        await existingSchedule.deleteOne(); // удаляем старое расписание
        const freshSchedule = await fetchAndSaveNewSchedule(groupID);
        res.status(200).json(freshSchedule);
      } else {
        res.status(200).json(existingSchedule);
      }
    } catch (err: any) {
      handleErrorValidation(err, next);
    }
  },
};

export default Controller;
