import * as Yup from 'yup';

export const ISSUES_SCHEMA = Yup.object().shape({
  title:Yup.string().required('You need to provide title!')
});
