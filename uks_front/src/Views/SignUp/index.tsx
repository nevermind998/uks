import { Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import Toast, { ToastOptions } from '../../Components/Common/Toast';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { signUp } from '../../api/userAuthentication';
import { SignUpDto } from '../../Types/user.types';
import { SIGN_UP_SCHEMA } from './signUpValidationSchema';

const SignUp = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [toastOptions, setToastOptions] = useState<ToastOptions>({ message: '', type: 'info' });
  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation(signUp, {
    onSuccess: (res) => {
      setToastOptions({ message: 'Successfully created account!', type: 'success' });
      setOpen(true);
      navigate('/sign-in')
    },
    onError: () => {
      setToastOptions({ message: 'Something went wrong!', type: 'error' });
      setOpen(true);
    },
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirm_password: '',
      family_name: '',
      given_name: '',
      bio: '',
      url: '',
    },
    validationSchema: SIGN_UP_SCHEMA,
    onSubmit: (values) => {
      const body: SignUpDto = {
        username: values.username,
        email: values.email,
        password: values.password,
        family_name: values.family_name,
        given_name: values.given_name,
        bio: values.bio,
        url: values.url,
      };

      mutate(body);
    },
  });

  return (
    <div className="sign-up">
      <img src="/img/background2.svg" alt="" />
      <Toast open={open} setOpen={setOpen} toastOptions={toastOptions} />
      <div className="sign-up__content-wrapper">
        <h3>Create a new account</h3>
        <form onSubmit={formik.handleSubmit} className="sign-up__form">
          <div className="sign-up__group">
            <TextField
              id="given_name"
              label="First Name"
              variant="outlined"
              value={formik.values.given_name}
              onChange={formik.handleChange}
              name="given_name"
              error={formik.touched.given_name && Boolean(formik.errors.given_name)}
              helperText={formik.errors.given_name && formik.touched.given_name}
              required
              className="sign-up__form--field"
              size="small"
            />
            <TextField
              id="lastName"
              label="Last Name"
              variant="outlined"
              value={formik.values.family_name}
              onChange={formik.handleChange}
              name="family_name"
              error={formik.touched.family_name && Boolean(formik.errors.family_name)}
              helperText={formik.errors.family_name && formik.touched.family_name}
              required
              className="sign-up__form--field"
              size="small"
            />
          </div>
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            value={formik.values.email}
            onChange={formik.handleChange}
            name="email"
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.errors.email && formik.touched.email}
            required
            className="sign-up__form--field"
            size="small"
          />
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            value={formik.values.username}
            onChange={formik.handleChange}
            name="username"
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.errors.username && formik.touched.username}
            required
            className="sign-up__form--field"
            size="small"
          />
          <div className="sign-up__group">
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
              helperText={formik.errors.password && formik.touched.password}
              className="sign-up__form--field"
              size="small"
            />
            <TextField
              id="confirm_password"
              label="Confirm Password"
              variant="outlined"
              value={formik.values.confirm_password}
              onChange={formik.handleChange}
              name="confirm_password"
              required
              type="password"
              error={formik.touched.confirm_password && Boolean(formik.errors.confirm_password)}
              helperText={formik.errors.confirm_password && formik.touched.confirm_password}
              className="sign-up__form--field"
              size="small"
            />
          </div>
          <TextField
            id="url"
            label="Url"
            variant="outlined"
            value={formik.values.url}
            onChange={formik.handleChange}
            name="url"
            className="sign-up__form--field"
            size="small"
          />
          <TextareaAutosize
            id="bio"
            placeholder="Bio"
            minRows={4}
            value={formik.values.bio}
            onChange={formik.handleChange}
            name="bio"
            className="sign-up__form--textarea"
          />
          <Button type="submit" className="sign-up__button" variant="contained">
            Sign Up
          </Button>
          <p>
            Already have an account?{' '}
            <a className="sign-in__link" href="/sign-in">
              Sign in here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
