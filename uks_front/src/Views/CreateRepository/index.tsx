import { TextField, Button, TextareaAutosize, FormLabel, RadioGroup, FormControlLabel, Radio, FormControl } from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router';
import Toast, { ToastOptions } from '../../Components/Common/Toast';
import { CreateRepositoryDto, VisibilityEnum } from '../../Types/repository.types';
import { useSelector } from 'react-redux';
import { createNewRepository } from '../../api/repositories';
import { selectAuth } from '../../Store/slices/auth.slice';
import { CREATE_REPO_SCHEMA } from './createRepositorySchema';

const CreateRepository = ({ setCreateRepo }: any) => {
  const [open, setOpen] = useState<boolean>(false);
  const [toastOptions, setToastOptions] = useState<ToastOptions>({ message: '', type: 'info' });
  const navigate = useNavigate();

  const user = useSelector(selectAuth);

  const { mutate, isLoading } = useMutation(createNewRepository, {
    onSuccess: (res) => {
      setToastOptions({ message: 'Successfully created a new repository!', type: 'success' });
      setOpen(true);
      // setCreateRepo(false);
    },
    onError: () => {
      setToastOptions({ message: 'An error happened while creating a repository!', type: 'error' });
      setOpen(true);
    },
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      visibility: VisibilityEnum.PUBLIC,
      default_branch: 'main',
    },
    validationSchema: CREATE_REPO_SCHEMA,
    onSubmit: (values) => {
      const body: CreateRepositoryDto = {
        name: values.name,
        owner: user.id,
        description: values.description,
        visibility: values.visibility,
        default_branch: values.default_branch || 'main',
      };

      mutate(body);
    },
  });

  return (
    <div className="create-repository">
      <Toast open={open} setOpen={setOpen} toastOptions={toastOptions} />
      <div className="create-repository__content-wrapper">
        <button onClick={() => setCreateRepo(false)} className="create-repository__back-button">
          &#60; Back
        </button>
        <h3>Create New Repository</h3>
        <form onSubmit={formik.handleSubmit} className="create-repository__form">
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            value={formik.values.name}
            onChange={formik.handleChange}
            name="name"
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.errors.name && formik.errors.name}
            required
            className="create-repository__form--field"
            size="small"
          />
          <TextareaAutosize
            id="description"
            placeholder="Description"
            minRows={4}
            value={formik.values.description}
            onChange={formik.handleChange}
            name="description"
            className="sign-up__form--textarea"
          />
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Visibility</FormLabel>
            <RadioGroup
              className="create-repository__visibility"
              aria-labelledby="demo-radio-buttons-group-label"
              name="visibility"
              value={formik.values.visibility}
              onChange={formik.handleChange}
            >
              <FormControlLabel value={VisibilityEnum.PUBLIC} control={<Radio />} label="Public" />
              <FormControlLabel value={VisibilityEnum.PRIVATE} control={<Radio />} label="Private" />
            </RadioGroup>
          </FormControl>

          <TextField
            id="default_branch"
            label="Default branch"
            variant="outlined"
            value={formik.values.default_branch}
            onChange={formik.handleChange}
            name="default_branch"
            helperText="If not specified, main will be used as default branch"
            className="create-repository__form--field"
            size="small"
          />

          <div className="create-repository__button-wrapper">
            <Button type="submit" className="create-repository__button" variant="contained">
              Create Repository
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRepository;
