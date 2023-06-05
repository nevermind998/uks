import * as Yup from 'yup';

export const ISSUES_SCHEMA = Yup.object().shape({
  name:Yup.string().required('You need to provide name!'),
  color: Yup.string().required('You need to provide color!'),
});
