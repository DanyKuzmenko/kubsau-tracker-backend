import * as yup from 'yup';

const cardSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  date: yup.date().required('Date is required').default(() => new Date()),
  description: yup.string(),
  checkboxes: yup.array().of(
    yup.object().shape({
      title: yup.string().required('Checkbox title is required'),
      isActive: yup.boolean().required('Checkbox isActive is required'),
    })
  ),
  kubsauInfo: yup.object().shape({
    id: yup.string().required('KubsauInfo id is required'),
    subject: yup.string().required('KubsauInfo subject is required'),
    group: yup.string().required('KubsauInfo group is required'),
    auditorium: yup.string().required('KubsauInfo auditorium is required'),
    teacher: yup.string().required('KubsauInfo teacher is required'),
  }),
});

export default cardSchema;
