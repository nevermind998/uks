import { Button, Divider, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useMutation } from 'react-query';
import Toast, { ToastOptions } from '../../Components/Common/Toast';
import { createCommit, getBranchById } from '../../api/commits';
import { COMMIT_SCHEMA } from './commitValidationSchema';
import { BranchDto, CommitDto } from '../../Types/commit.types';
import { RootState } from '../../Store';
import { AuthState } from '../../Store/slices/auth.slice';
import { useSelector } from "react-redux";
import {useQuery} from 'react-query'
import CommitIcon from '@mui/icons-material/Commit';

const Commit = ({branch, refetch}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [toastOptions, setToastOptions] = useState<ToastOptions>({ message: '', type: 'info' });
  const user = useSelector<RootState, AuthState>(state => state.auth);

  const { mutate, isLoading } = useMutation(createCommit, {
    onSuccess: (res) => {
      setToastOptions({ message: 'Commit successfully created', type: 'success'});
      setOpen(true);
      refetch();
      formik.resetForm()
    },
    onError: () => {
      setToastOptions({ message: 'Error creating commit', type: 'error' });
      setOpen(true);
    },
  });

  const formik = useFormik({
    initialValues: {
      author: 0,
      message:'',
      created_at:'',
      branch: 0
    },
    validationSchema: COMMIT_SCHEMA,
    onSubmit: (values) => {
      const body: CommitDto = {
        author: user.data.id,
        message:values.message,
        created_at: new Date(),
        branch: branch.id,
      };
      mutate(body);
    },
  });

  return (
    <div className='commit'>
      <Toast open={open} setOpen={setOpen} toastOptions={toastOptions} />
      <div>
        <Divider variant='fullWidth' style={{margin: '47px 0 30px'}}/>
        <h4>Create a new commit</h4>
        <form onSubmit={formik.handleSubmit} className="commit__form">
           <div className='commit__form--wrapper'>
           <img src="/img/woman.png" alt="User icon"/>
            <TextField
              id="message"
              label="Summary (required)"
              variant="outlined"
              value={formik.values.message}
              onChange={formik.handleChange}
              name="message"
              error={formik.touched.message && Boolean(formik.errors.message)}
              helperText={formik.errors.message && formik.touched.message}
              required
              className="commit__form--field"
              size="small"
            />
            <Button type="submit" className="commit__button" variant="text" startIcon={<CommitIcon/>}>
              Create Commit
            </Button>
            </div>
        </form>
      </div>
      <Divider variant='fullWidth' style={{margin: '30px 0'}}/>
    </div>
  );
};
export default Commit;
