import * as Yup from 'yup';

export const SIGN_IN_SCHEMA = Yup.object().shape({
  email: Yup.string().required('Email required'),
  password: Yup.string().required('Password required'),
});
