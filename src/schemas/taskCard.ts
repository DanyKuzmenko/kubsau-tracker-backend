import * as yup from 'yup';
import { createTaskSchema } from './task';

export const createTaskCardSchema = yup.object().shape({
  date: yup.date().required(),
  task: createTaskSchema.required(),
});

export const deleteTaskCardByDateSchema = yup.date().required()
