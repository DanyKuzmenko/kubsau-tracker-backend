import { NextFunction, Request, Response } from 'express';
import { createTaskSchema, updateTaskSchema } from '../schemas/task';
import { handleErrorValidation } from './utils/errorFunctions';
import TaskCardModel from '../models/taskCard';
import { createTaskCardSchema, deleteTaskCardByDateSchema } from '../schemas/taskCard';
import { createTask } from './utils/savingTasks';
import TaskModel, { ITask } from '../models/tasks';
import mongoose, { Types } from 'mongoose';
import { createCheckboxSchema, id, updateCheckboxSchema } from '../schemas/common';
import CheckboxModel from '../models/common';

const Controller = {
  getTaskCards: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tasks = await TaskCardModel.find().populate({
        path: 'tasks',
        populate: {
          path: 'checkboxes',
          model: 'Checkbox'
        }
      });
      res.status(200).json(tasks);
    } catch (err: any) {
      handleErrorValidation(err, next);
    }
  },

  getTaskByLessonId: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const lessonId = req.params.lessonId;

      await id.validate(lessonId, { abortEarly: false });

      const lessonObjectId = mongoose.Types.ObjectId.createFromHexString(lessonId);

      const task = await TaskModel.findOne({ lessonId: lessonObjectId }).populate('checkboxes');
      res.status(200).json(task);
    } catch (err: any) {
      handleErrorValidation(err, next);
    }
  },

  createTaskCard: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { date, task } = req.body;

      await createTaskCardSchema.validate(req.body, { abortEarly: false });
      await createTaskSchema.validate(task, { abortEarly: false });

      const localeDate = new Date(date).toLocaleDateString('en')

      let taskCard = await TaskCardModel.findOne({ localeDate }).populate({
        path: 'tasks',
        populate: {
          path: 'checkboxes',
          model: 'Checkbox'
        }
      });

      if (!taskCard) {
        const createdTask = await createTask(task);

        const newTaskCard = new TaskCardModel({
          date: localeDate,
          tasks: [createdTask]
        });

        await newTaskCard.save();
        res.status(201).json(newTaskCard);
      } else {
        const existingTask = taskCard.tasks.find((item: any) => item.lessonId.toString() === task.lessonId);

        if (existingTask) {
          res.status(400).json({ message: 'Task for this lesson already exists for this date.' });
        } else {
          const createdTask = await createTask(task);

          taskCard.tasks.push(createdTask);
          await taskCard.save();
          res.status(201).json(createdTask);
        }
      }
    } catch (err: any) {
      handleErrorValidation(err, next);
    }
  },

  updateCardByLessonId: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const lessonId = req.params.lessonId;
      const updateFields = req.body;

      await updateTaskSchema.validate(updateFields, { abortEarly: false });
      await id.validate(lessonId, { abortEarly: false });

      const task = await TaskModel.findOne({ lessonId }).populate('checkboxes');

      if (!task) {
        res.status(404).json({ message: 'Task not found for the provided lessonId.' });
      } else {
        Object.assign(task, updateFields);

        await task.save();

        res.status(200).json(task);
      }
    } catch (err: any) {
      handleErrorValidation(err, next);
    }
  },

  createCheckbox: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { title, isDone, lessonId } = req.body;

      await createCheckboxSchema.validate(req.body, { abortEarly: false });

      const lessonObjectId = mongoose.Types.ObjectId.createFromHexString(lessonId);

      const task = await TaskModel.findOne({ lessonId: lessonObjectId }).populate('checkboxes');

      if (!task) {
        res.status(404).json({ message: 'Task not found for the provided lessonId.' });
      } else {
        const createdCheckbox = await CheckboxModel.create({
          title: title,
          isDone: isDone
        });

        task.checkboxes.push(createdCheckbox);

        await task.save();

        res.status(201).json(task);
      }
    } catch (err: any) {
      handleErrorValidation(err, next);
    }
  },

  updateCheckboxById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const checkboxId = req.params.checkboxId;
      const updateFields = req.body;

      await updateCheckboxSchema.validate(updateFields, { abortEarly: false });
      await id.validate(checkboxId, { abortEarly: false });

      const checkbox = await CheckboxModel.findById(checkboxId);

      if (!checkbox) {
        res.status(404).json({ message: 'Checkbox not found for the provided checkboxId.' });
      } else {
        Object.assign(checkbox, updateFields);

        await checkbox.save();

        res.status(200).json(checkbox);
      }
    } catch (err: any) {
      handleErrorValidation(err, next);
    }
  },

  deleteTask: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const lessonId = req.params.lessonId;
      const { date } = req.body;

      await id.validate(lessonId, { abortEarly: false });
      await deleteTaskCardByDateSchema.validate(date, { abortEarly: false })

      const lessonObjectId = mongoose.Types.ObjectId.createFromHexString(lessonId);
      const localeDate = new Date(date).toLocaleDateString('en')

      const deletedTask = await TaskModel.findOneAndDelete({ lessonId: lessonObjectId });

      if (!deletedTask) {
        res.status(404).json({ message: 'Task not found, try another lessonId' });
        return;
      }

      const deletedTaskId = (deletedTask as unknown as ITask & {_id: Types.ObjectId})._id;

      const deletedFromTaskCard = await TaskCardModel.updateOne(
        { date: localeDate },
        { $pull: { tasks: deletedTaskId } }
      );

      if (!deletedFromTaskCard) {
        res.status(404).json({ message: 'Task card not found, try another lessonId' });
        return;
      }

      const remainingTasks = await TaskCardModel.findOne({ date: localeDate });

      if (!remainingTasks) {
        res.status(404).json({ message: 'Task not found, try another date' });
        return;
      }

      if (remainingTasks.tasks.length === 0) {
        const deletedTaskCard = await TaskCardModel.findOneAndDelete({ date: localeDate });

        if (!deletedTaskCard) {
          res.status(404).json({ message: 'Task card not found, try another lessonId' });
          return;
        }
      }

      res.status(200).json({ message: 'Task deleted successfully', deletedTask });
    } catch (err: any) {
      handleErrorValidation(err, next);
    }
  },

  deleteCheckbox: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const checkboxId = req.params.checkboxId;

      await id.validate(checkboxId, { abortEarly: false });

      const deletedCheckbox = await CheckboxModel.findByIdAndDelete(checkboxId);

      if (!deletedCheckbox) {
        res.status(404).json({ message: 'Checkbox not found, try another checkboxId' });
      }

      res.status(200).json({ message: 'Checkbox deleted successfully', deletedCheckbox });
    } catch (err: any) {
      handleErrorValidation(err, next);
    }
  }
};

export default Controller;
