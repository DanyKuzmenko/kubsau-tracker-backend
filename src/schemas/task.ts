import * as yup from 'yup';
import { checkboxSchema, objectIdRegExp } from './common';

export const teachersSchema = yup
  .object()
  .shape({
    id: yup.string().required('id is required field'),
    name: yup.string().required('name is required field'),
    link: yup.string(),
    isOnline: yup.boolean().required('isOnline is required field'),
    room: yup.string().required('room is required field'),
    online: yup.string(),
  })
  .required();

export const createTaskSchema = yup.object().shape({
  title: yup.string().required(),
  subject: yup.string().required(),
  teachers: yup
    .array()
    .of(teachersSchema)
    .required('teachers is required array'),
  isDone: yup.boolean().required(),
  deadline: yup.date().required(),
  description: yup.string().required(),
  checkboxes: yup.array().of(checkboxSchema).required(),
  lessonId: yup
    .string()
    .matches(objectIdRegExp, 'Invalid ObjectId format')
    .required(),
});

export const updateTaskSchema = yup.object().shape({
  title: yup.string(),
  subject: yup.string(),
  teachers: yup.array().of(teachersSchema).required(),
  isDone: yup.boolean(),
  deadline: yup.date(),
  description: yup.string(),
  checkboxes: yup
    .array()
    .test(
      'no-checkboxes',
      'Checkboxes cannot be updated using this route',
      function (value) {
        if (value !== undefined) {
          throw new yup.ValidationError(
            'Checkboxes cannot be updated using this route',
            value,
            this.path ?? 'checkboxes',
          );
        }
        return true;
      },
    ),
  lessonId: yup.string().matches(objectIdRegExp, 'Invalid ObjectId format'),
});
