import * as yup from 'yup';
import { checkboxSchema } from './common';

export const createTaskSchema = yup.object().shape({
  title: yup.string().required(),
  subject: yup.string().required(),
  teacher: yup.string().required(),
  isDone: yup.boolean().required(),
  deadline: yup.date().required(),
  description: yup.string().required(),
  checkboxes: yup.array().of(checkboxSchema).required()
});
