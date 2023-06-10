import * as Yup from 'yup';

export const BRANCH_SCHEMA = Yup.object().shape({
  name:Yup.string().required('You need to provide name!'),
});
