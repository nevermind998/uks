import * as Yup from 'yup';

export const PULL_REQUEST_SCHEMA = Yup.object().shape({
  title:Yup.string().required('You need to provide title!'),
  description:Yup.string().required('You need to provide description!')
});
