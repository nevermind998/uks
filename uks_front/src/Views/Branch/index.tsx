import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation } from 'react-query';
import Toast, { ToastOptions } from '../../Components/Common/Toast';
import { createBranch } from '../../api/branches';
import { BRANCH_SCHEMA } from './branchValidationSchema';
import { BranchDto } from '../../Types/branch.types';

const Branch = (props:any) => {
  console.log();
  const [toastOptions, setToastOptions] = useState<ToastOptions>({ message: '', type: 'info' });
  const {id} = useParams();
  const repositoryId = id ? parseInt(id, 10) : 0;
  const [open, setOpen] = useState(props.open);
  console.log(props);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const { mutate, isLoading } = useMutation(createBranch, {
    onSuccess: (res) => {
      setToastOptions({ message: 'Branch successfully created', type: 'success'});
      handleClose();
    },
    onError: () => {
      setToastOptions({ message: 'Error creating branch', type: 'error' });
      handleClose();
    },
  });

  const formik = useFormik({
    initialValues: {
      name:'',
      repository:0
    },
    validationSchema: BRANCH_SCHEMA,
    onSubmit: (values) => {
      const body: BranchDto = {
        name:values.name,
        repository: repositoryId,
      };

      mutate(body);
    },
  });
  const handleFormSubmit = () => {
    formik.handleSubmit();
  };

  return (
    <div>
      { open && (<div><Toast open={props.open} setOpen={props.handleClose} toastOptions={toastOptions} />
      <Dialog open={props.open} onClose={props.handleClose}>
        <DialogTitle>Create branch</DialogTitle>
        <DialogContent>
        <TextField
              id="name"
              label="Name"
              variant="outlined"
              value={formik.values.name}
              onChange={formik.handleChange}
              name="name"
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.errors.name && formik.touched.name}
              required
              className="add-update-form__form--field"
              size="small"
            />
        </DialogContent>
        <DialogActions>
            <Button type="submit" className="add-update__button" variant="contained">
              Create branch
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
      </div>
      )}
    </div>
  );
};

export default Branch;
