import { Button, TextField, TextFieldProps } from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import Toast, { ToastOptions } from '../../../Components/Common/Toast';
import { useParams } from 'react-router-dom';
import { MILESTONE_SCHEMA } from './milestoneSchema';
import { createMilestone } from '../../../api/projectManagement';
import { useMutation } from 'react-query';
import { MilestoneDto } from '../../../Types/milestone.types';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'


const Milestone = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [toastOptions, setToastOptions] = useState<ToastOptions>({ message: '', type: 'info' });
  const [selectedDate, setSelectedDate] = useState(null);
  const { id } = useParams();
  const repositoryId = id ?  parseInt(id, 10) : 0;


  const handleDateChange = (date:any) => {
    formik.setFieldValue('due_date', date);
    setSelectedDate(date);
  };

  const { mutate, isLoading } = useMutation(createMilestone, {
    onSuccess: (res) => {
      setToastOptions({ message: 'Milestone successfully created', type: 'success'});
      setOpen(true);
    },
    onError: () => {
      setToastOptions({ message: 'Error creating milestone', type: 'error' });
      setOpen(true);
    },
  });

  const formik = useFormik({
    initialValues: {
      id: 0,
      title:'',
      due_date: null,
      description:'',
      status:'',
      repository:0
    },
    validationSchema: MILESTONE_SCHEMA,
    onSubmit: (values) => {
      const body: MilestoneDto = {
        id: 0,
        title:values.title,
        due_date: values.due_date,
        description:values.description,
        status:values.status,
        repository: repositoryId,
      };

      mutate(body);
    },
  });

  return (
    <div className="add-update-form">
      <Toast open={open} setOpen={setOpen} toastOptions={toastOptions} />
      <div className="add-update-form__content-wrapper">
        <h3>Create a new milestone</h3>
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

            <LocalizationProvider dateAdapter={AdapterDayjs} >
              <DatePicker 
                  label="Due date (optional)"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="add-update-form__form--field"
              />
            </LocalizationProvider>

            <TextField
              id="description"
              label="Description"
              variant="outlined"
              value={formik.values.description}
              onChange={formik.handleChange}
              name="description"
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.errors.description && formik.touched.description}
              required
              className="add-update-form__form--field"
              size="small"
            />
            <Button type="submit" className="add-update__button" variant="contained">
              Create milestone
            </Button>
        </form>
      </div>
    </div>
  );
};

export default Milestone;
