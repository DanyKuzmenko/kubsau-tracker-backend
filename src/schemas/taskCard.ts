import * as yup from 'yup';
import { createTaskSchema } from './task';

export const createTaskCardSchema = yup.object().shape({
  date: yup.date().required(),
  tasks: yup.array().of(createTaskSchema).required()
});
