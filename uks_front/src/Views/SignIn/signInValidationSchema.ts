import * as Yup from "yup";

export const SIGN_IN_SCHEMA = Yup.object().shape({
  email: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
});
