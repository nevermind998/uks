import { Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { SIGN_IN_SCHEMA } from './signInValidationSchema';
import { SignInDto } from '../../Types/user.types';
import { useMutation } from 'react-query';
import { signIn } from '../../api/userAuthentication';
import { useState } from 'react';
import Toast, { ToastOptions } from '../../Components/Common/Toast';
import { dispatch } from '../../Store';
import { addAuth } from '../../Store/slices/auth.slice';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [toastOptions, setToastOptions] = useState<ToastOptions>({ message: '', type: 'info' });
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation(signIn, {
    onSuccess: (res) => {
      localStorage.setItem('access_token', res.data.access_token);
      setToastOptions({ message: 'Successful login!', type: 'success' });
      setOpen(true);
      dispatch(addAuth(res.data.user));
      navigate('/');
    },
    onError: () => {
      setToastOptions({ message: 'Invalid credentials!', type: 'error' });
      setOpen(true);
    },
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: SIGN_IN_SCHEMA,
    onSubmit: (values) => {
      const body: SignInDto = {
        email: values.email,
        password: values.password,
      };

      mutate(body);
    },
  });

  return (
    <div className="sign-in">
      <Toast open={open} setOpen={setOpen} toastOptions={toastOptions} />
      <div className="sign-in__content-wrapper">
        <img src="/img/logo1.png" alt="" />
        <h3>Sign in to your account</h3>
        <form onSubmit={formik.handleSubmit} className="sign-in__form">
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            value={formik.values.email}
            onChange={formik.handleChange}
            name="email"
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.errors.email && formik.errors.email}
            required
            className="sign-in__form--field"
            size="small"
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
            helperText={formik.errors.password && formik.errors.password}
            className="sign-in__form--field"
            size="small"
          />

          <Button type="submit" className="sign-in__button" variant="contained">
            Log In
          </Button>
          <p>
            Don't have an account?{' '}
            <a className="sign-in__link" href="/sign-up">
              Create one here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
