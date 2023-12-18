import * as yup from 'yup';
import { checkboxSchema, objectIdRegExp } from './common';

export const createTaskSchema = yup.object().shape({
  title: yup.string().required(),
  subject: yup.string().required(),
  teacher: yup.string().required(),
  isDone: yup.boolean().required(),
  deadline: yup.date().required(),
  description: yup.string().required(),
  checkboxes: yup.array().of(checkboxSchema).required(),
  lessonId: yup.string().matches(objectIdRegExp, 'Invalid ObjectId format').required()
});

export const updateTaskSchema = yup.object().shape({
  title: yup.string(),
  subject: yup.string(),
  teacher: yup.string(),
  isDone: yup.boolean(),
  deadline: yup.date(),
  description: yup.string(),
  checkboxes: yup
    .array()
    .test('no-checkboxes', 'Checkboxes cannot be updated using this route', function (value) {
      if (value !== undefined) {
        throw new yup.ValidationError('Checkboxes cannot be updated using this route', value, this.path ?? 'checkboxes');
      }
      return true;
    }),
  lessonId: yup.string().matches(objectIdRegExp, 'Invalid ObjectId format')
});
