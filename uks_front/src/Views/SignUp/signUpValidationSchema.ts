import * as Yup from 'yup';

export const SIGN_UP_SCHEMA = Yup.object().shape({
  email: Yup.string().required('You need to provide your email!'),
  username: Yup.string().required('You need to provide your username!'),
  password: Yup.string().required('You need to provide your password!'),
  given_name: Yup.string().required('You need to provide your first name!'),
  family_name: Yup.string().required('You need to provide your last name!'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('You need to confirm your password!'),
});
