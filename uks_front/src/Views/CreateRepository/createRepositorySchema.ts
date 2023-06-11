import * as Yup from 'yup';

export const CREATE_REPO_SCHEMA = Yup.object().shape({
  name: Yup.string().required('You need to provide repository name!').matches(/^\S+$/, "Name shouldn't contain spaces!"),
});
