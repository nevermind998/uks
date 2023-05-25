import * as Yup from "yup";

export const SIGN_IN_SCHEMA = Yup.object().shape({
  username: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
});
