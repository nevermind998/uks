import * as Yup from 'yup';

export const COMMIT_SCHEMA = Yup.object().shape({
  message: Yup.string().required('Message required'),
});
