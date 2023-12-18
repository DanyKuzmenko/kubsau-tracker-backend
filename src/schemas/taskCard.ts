import * as yup from 'yup';
import { createTaskSchema } from './task';


export const createTaskCardSchema = yup.object().shape({
  date: yup.string().required(),
  task: createTaskSchema.required(),
});
