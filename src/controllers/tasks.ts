import { NextFunction, Request, Response } from 'express';
import TaskModel, { ITask } from '../models/tasks';
import { createTaskSchema } from '../schemas/task';
import { handleErrorValidation } from './utils/errorFunctions';
import CheckboxModel from '../models/common';
import TaskCardModel from '../models/taskCard';
import { createTaskCardSchema } from '../schemas/taskCard';

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

  createTaskCard: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await createTaskCardSchema.validate(req.body, { abortEarly: false });

      const { date, tasks } = req.body;

      const createdTasks = await Promise.all(
        tasks.map(async (card: ITask) => {
          await createTaskSchema.validate(card, { abortEarly: false });

          const checkboxes = card.checkboxes;

          const createdCheckboxes = await Promise.all(
            checkboxes.map(async (checkbox: { title: string; isDone: boolean }) => {
              return await CheckboxModel.create(checkbox);
            })
          );

          return await TaskModel.create({
            title: card.title,
            subject: card.subject,
            teacher: card.teacher,
            isDone: card.isDone,
            deadline: card.deadline,
            description: card.description,
            checkboxes: createdCheckboxes
          });
        })
      );

      const newTaskCard = new TaskCardModel({
        date: date,
        tasks: createdTasks
      });

      await newTaskCard.save();

      res.status(201).json(newTaskCard);
    } catch (err: any) {
      handleErrorValidation(err, next);
    }
  },

  getTasks: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tasks = await TaskModel.find().populate('checkboxes');
      res.status(200).json(tasks);
    } catch (err: any) {
      handleErrorValidation(err, next);
    }
  },

  createTask: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await createTaskSchema.validate(req.body, { abortEarly: false });

      const { title, subject, teacher, isDone, deadline, description, checkboxes } = req.body;

      const createdCheckboxes = await Promise.all(
        checkboxes.map(async (checkbox: { title: string; isDone: boolean }) => {
          return await CheckboxModel.create(checkbox);
        })
      );

      const newTask = new TaskModel({
        title,
        subject,
        teacher,
        isDone,
        deadline,
        description,
        checkboxes: createdCheckboxes
      });

      await newTask.save();

      res.status(201).json(newTask);
    } catch (err: any) {
      handleErrorValidation(err, next);
    }
  }
};

export default Controller;
