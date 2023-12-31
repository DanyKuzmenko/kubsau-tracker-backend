import {
  ISchedule,
  LessonModel,
  ClassModel,
  DayModel,
  WeekModel,
  ScheduleModel,
} from '../../models/schedule';
import mongoose from 'mongoose';
import { fetchScheduleFromUniversityAPI } from './universityAPI';

export const saveScheduleToDB = async (scheduleData: ISchedule) => {
  try {
    // Создание и сохранение всех Class, Day и Week
    const weeksPromises = scheduleData.weeks.map(async (week) => {
      const daysPromises = await Promise.all(
        week.days.map(async (day) => {
          const classPromises = await Promise.all(
            day.classes.map(async (classInfo) => {
              const uniqueLessons = classInfo.lessons.map((lesson) => ({
                _id: new mongoose.Types.ObjectId(),
                ...lesson,
              }));

              const createdLessons = await LessonModel.create(uniqueLessons);

              const lessonRefs = createdLessons.map((lesson) => ({
                _id: lesson._id,
                name: lesson.name,
                type: lesson.type,
                teachers: lesson.teachers,
              }));

              return await ClassModel.create({
                _id: new mongoose.Types.ObjectId(),
                ...classInfo,
                lessons: lessonRefs,
              });
            }),
          );

          return await DayModel.create({
            _id: new mongoose.Types.ObjectId(),
            ...day,
            classes: classPromises,
          });
        }),
      );

      return await WeekModel.create({
        _id: new mongoose.Types.ObjectId(),
        ...week,
        days: daysPromises,
      });
    });

    // Создание и сохранение расписания
    const createdWeeks = await Promise.all(weeksPromises);

    const scheduleToSave = {
      ...scheduleData,
      weeks: createdWeeks,
    };

    return await ScheduleModel.create(scheduleToSave);
  } catch (error) {
    console.error('Error saving schedule to MongoDB:', error);
    return null;
  }
};

export const fetchAndSaveNewSchedule = async (
  groupID: string,
): Promise<ISchedule | null> => {
  try {
    const schedule = await fetchScheduleFromUniversityAPI({ groupID });
    await saveScheduleToDB(schedule);
    return await ScheduleModel.findOne({ id: groupID })
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
  } catch (error) {
    console.error('Error fetching and saving schedule:', error);
    return null;
  }
};
