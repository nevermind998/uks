import * as Yup from 'yup';

export const LABEL_SCHEMA = Yup.object().shape({
  name:Yup.string().required('You need to provide name!'),
  color: Yup.string().required('You need to provide color!'),
});
