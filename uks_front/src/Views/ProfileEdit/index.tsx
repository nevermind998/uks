import { TextField, TextareaAutosize, Button } from "@mui/material";
import { useState } from "react";
import Toast, { ToastOptions } from "../../Components/Common/Toast";
import { useSelector } from "react-redux";
import { addAuth, selectAuth } from "../../Store/slices/auth.slice";
import { useFormik } from "formik";
import { useMutation } from "react-query";
import { editProfile } from "../../api/userAuthentication";
import { dispatch } from "../../Store";

const EditProfile = ({ setEditProfile, refetch }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [toastOptions, setToastOptions] = useState<ToastOptions>({ message: "", type: "info" });

  const user = useSelector(selectAuth);

  const { mutate } = useMutation(editProfile, {
    onSuccess: res => {
      setToastOptions({ message: "Successfully edited profile!", type: "success" });
      setOpen(true);
      refetch();

      dispatch(addAuth(res.data))

      setTimeout(() => {
        setEditProfile(false);
      }, 300);
    },
    onError: () => {
      setToastOptions({ message: "An error happened while editing profile!", type: "error" });
      setOpen(true);
    },
  });

  const formik = useFormik({
    initialValues: {
      family_name: user.family_name,
      given_name: user.given_name,
      bio: user.bio,
      url: user.url,
    },
    onSubmit: (values) => {
      const body: any = {
        email: user.email,
        username: user.username,
        family_name: values.family_name,
        given_name: values.given_name,
        bio: values.bio,
        url: values.url,
      };

      mutate(body);
    },
  });

  return (
    <div className="edit-profile">
      <Toast open={open} setOpen={setOpen} toastOptions={toastOptions} />
      <div className="edit-profile__content-wrapper">
        <button onClick={() => setEditProfile(false)} className="create-repository__back-button">
          &#60; Back
        </button>
        <h3>Edit Profile</h3>
        <form onSubmit={formik.handleSubmit} className="create-repository__form">
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
            Edit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
