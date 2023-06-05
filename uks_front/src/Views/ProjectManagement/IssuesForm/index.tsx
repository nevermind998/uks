import { Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import Toast, { ToastOptions } from '../../../Components/Common/Toast';
import { useParams } from 'react-router-dom';
import { IssuesDto } from '../../../Types/user.types';
import { createIssue } from '../../../api/projectManagement';
import { useMutation } from 'react-query';
import { ISSUES_SCHEMA } from './issuesSchema';

const Issue = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [toastOptions, setToastOptions] = useState<ToastOptions>({ message: '', type: 'info' });
  const [selectedDate, setSelectedDate] = useState(null);
  const { id } = useParams();
  const repositoryId = id ?  parseInt(id, 10) : 0;

  const { mutate, isLoading } = useMutation(createIssue, {
    onSuccess: (res) => {
      setToastOptions({ message: 'Label successfully created', type: 'success'});
      setOpen(true);
    },
    onError: () => {
      setToastOptions({ message: 'Error creating label', type: 'error' });
      setOpen(true);
    },
  });

  const formik = useFormik({
    initialValues: {
      title:'',
      created_at:new Date(),//NA BEKU HANDLAJ!!
      status:'',
      milestone:0,
      labels:0,
      repository:0,
      author:0,
      assignees:[0]
    },
    validationSchema: ISSUES_SCHEMA,
    onSubmit: (values) => {
      const body: IssuesDto = {
        title:values.title,
        created_at:values.created_at,
        status:values.status,
        milestone:1, //FORGINE KEY,SEE HOW FIX IT
        labels:1,
        repository:1,
        author:1,
        assignees:values.assignees
      };

      mutate(body);
    },
  });


  //treba videti za autora, neki dropdown??
  //kako da handlamo label, repo, assignes

  return (
    <div className="add-update-form">
      <Toast open={open} setOpen={setOpen} toastOptions={toastOptions} />
      <div className="add-update-form__content-wrapper">
        <h3>Create a new issues</h3>
        <form onSubmit={formik.handleSubmit} className="add-update-form__form">
            <TextField
              id="title"
              label="Title"
              variant="outlined"
              value={formik.values.title}
              onChange={formik.handleChange}
              name="title"
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.errors.title && formik.touched.title}
              required
              className="add-update-form__form--field"
              size="small"
            />
     
           
            <Button type="submit" className="add-update__button" variant="contained">
              Create issue
            </Button>
        </form>
      </div>
    </div>
  );
};

export default Issue;
