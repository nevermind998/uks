import * as Yup from 'yup';

export const MILESTONE_SCHEMA = Yup.object().shape({
  title:Yup.string().required('You need to provide title!'),
  due_date: Yup.string().required('You need to provide date!'),
  description:Yup.string().required('You need to provide description!'),
});
