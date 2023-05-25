import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import { SIGN_IN_SCHEMA } from "./signInValidationSchema";
import { SignInDto } from "../../Types/user.types";
import { useMutation } from "react-query";
import { signIn } from "../../api/userAuthentication";

const SignIn = () => {
  const { mutate, isLoading } = useMutation(signIn, {
    onSuccess: (data) => {
      localStorage.setItem("access-token", data.data.access);
      localStorage.setItem("refresh-token", data.data.refresh);
    },
    onError: () => {
      alert("there was an error");
    },
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: SIGN_IN_SCHEMA,
    onSubmit: (values) => {
      const body: SignInDto = {
        username: values.username,
        password: values.password,
      };

      mutate(body);
    },
  });

  return (
    <div className="sign-in">
      <div className="sign-in__content-wrapper">
        <img src="/img/logo.png" alt="" />

        <form onSubmit={formik.handleSubmit} className="sign-in__form">
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            value={formik.values.username}
            onChange={formik.handleChange}
            name="username"
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.errors.username}
            required
          />
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            value={formik.values.password}
            onChange={formik.handleChange}
            name="password"
            required
            type="password"
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.errors.password}
          />

          <Button type="submit" className="button" variant="contained">
            Log In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
