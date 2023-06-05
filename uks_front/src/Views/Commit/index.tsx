import { Button, TextField } from '@mui/material';
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
import { useParams } from 'react-router-dom';
import {useQuery} from 'react-query'

const Commit = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [toastOptions, setToastOptions] = useState<ToastOptions>({ message: '', type: 'info' });
  let branchName;
  const user = useSelector<RootState, AuthState>(state => state.auth);

  const data = useQuery({
    queryKey: ['FETCH_COMMITS'],
    queryFn: async () => {
        const data: BranchDto = await getBranchById(1);
        return data;
    },
  });

  if (data.data && Array.isArray(data.data) && data.data.length > 0) {
    data.data.forEach((item) => {
      branchName = item.name;
    });
  }

  const { mutate, isLoading } = useMutation(createCommit, {
    onSuccess: (res) => {
      setToastOptions({ message: 'Commit successfully created', type: 'success'});
      setOpen(true);
    },
    onError: () => {
      setToastOptions({ message: 'Error creating commit', type: 'error' });
      setOpen(true);
    },
  });

  const formik = useFormik({
    initialValues: {
      author: 0,
      hash: '',
      message:'',
      created_at:'',
      branch:0
    },
    validationSchema: COMMIT_SCHEMA,
    onSubmit: (values) => {
      const body: CommitDto = {
        author: user.data.id,
        hash: 'ggg',
        message:values.message,
        created_at:new Date(),
        branch: 1,
      };
      mutate(body);
    },
  });

  return (
    <div className="add-update-form" >
      <Toast open={open} setOpen={setOpen} toastOptions={toastOptions} />
      <div className="add-update-form__content-wrapper">
        <h3>Create a new commit</h3>
        <form onSubmit={formik.handleSubmit} className="add-update-form__form">
           <div style={{ display: 'flex', flexDirection:"row", width:"100%"}}>
           <img src="/img/woman.png" alt="User icon" style={{width:"5%"}}/>
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
              className="add-update-form__form--field"
              size="small"
            />
            </div>
            <Button type="submit" className="add-update__button" variant="contained"  style={{width:"100%"}}>
              Commit to {branchName}
            </Button>
        </form>
      </div>
    </div>
  );
};
export default Commit;


