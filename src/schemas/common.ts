import * as yup from 'yup';

export const checkboxSchema = yup.object().shape({
  title: yup.string().required(),
  isDone: yup.boolean().required(),
})
