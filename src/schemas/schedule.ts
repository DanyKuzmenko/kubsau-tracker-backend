import * as yup from 'yup';

export const scheduleSchema = yup.object().shape({
  title: yup.string().required(),
  subject: yup.string().required(),
  teacher: yup.string().required(),
  isDone: yup.boolean().required(),
  deadline: yup.date().required(),
  description: yup.string().required(),
});
