import * as yup from 'yup';

export const objectIdRegExp = /^[0-9a-fA-F]{24}$/;
export const id = yup.string().matches(objectIdRegExp, 'Invalid ObjectId format').required()

export const checkboxSchema = yup.object().shape({
  title: yup.string().required(),
  isDone: yup.boolean().required(),
})

export const createCheckboxSchema = yup.object().shape({
  lessonId: id,
  title: yup.string().required(),
  isDone: yup.boolean().required(),
})

export const updateCheckboxSchema = yup.object().shape({
  title: yup.string(),
  isDone: yup.boolean(),
})
