import { Button, Divider, TextField, TextareaAutosize } from '@mui/material';
import Toast, { ToastOptions } from '../../../Components/Common/Toast';
import { useState } from 'react';
import { useFormik } from 'formik';
import { ActionDto } from '../../../Types/action.types';
import { CREATE_REPO_SCHEMA } from '../../CreateRepository/createRepositorySchema';
import { CreateRepositoryDto } from '../../../Types/repository.types';
import { createNewRepository, createNewRepositoryAction } from '../../../api/repositories';

const NewFork = ({ repo, user }: any) => {
  const [toastOptions, setToastOptions] = useState<ToastOptions>({ message: '', type: 'info' });
  const [open, setOpen] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      name: repo.name,
      owner: repo.owner,
      description: repo.description,
      visibility: repo.visibility,
      default_branch: repo.default_branch,
    },
    validationSchema: CREATE_REPO_SCHEMA,
    onSubmit: async (values) => {
      try {
        const fork: CreateRepositoryDto = {
          name: values.name,
          owner: user.id,
          description: values.description,
          visibility: repo.visibility,
          default_branch: repo.default_branch,
        };
        const forkedRepo = await createNewRepository(fork);
        const body: ActionDto = {
          author: user.id,
          type: 'FORK',
          repository: repo.id,
          forked_repo: forkedRepo.id,
        };
        const forkAction = await createNewRepositoryAction(body);
        formik.values.name = '';
        formik.values.description = '';
        setToastOptions({ message: 'Successfully forked repository!', type: 'success' });
        setOpen(true);
      } catch (error) {
        setToastOptions({ message: 'An error happened while forking a repository!', type: 'error' });
        setOpen(true);
      }
    },
  });

  return (
    <div>
      <Toast open={open} setOpen={setOpen} toastOptions={toastOptions} />
      <h3 className="repository__heading">Create a new fork</h3>
      <p className="repository__list-item">
        A fork is a copy of a repository. Forking a repository allows you to freely experiment with changes without affecting the original project.
      </p>
      <Divider light />
      <form onSubmit={formik.handleSubmit}>
        <div className="repository__field">
          <TextField id="name" label={user.username} variant="outlined" name="name" disabled size="small" />

          <TextField
            id="name"
            label="Name"
            variant="outlined"
            value={formik.values.name}
            onChange={formik.handleChange}
            name="name"
            error={formik.touched.name && Boolean(formik.errors.name)}
            required
            size="small"
          />
        </div>
        <TextareaAutosize
          id="description"
          placeholder="Description"
          minRows={4}
          value={formik.values.description}
          onChange={formik.handleChange}
          name="description"
          className="repository__textarea"
        />
        <div className="repository__btn">
          <Button variant="outlined" type="submit">
            Create Fork
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewFork;
