import { Autocomplete, Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { SetStateAction, useEffect, useState } from 'react';
import Toast, { ToastOptions } from '../../../Components/Common/Toast';
import { useParams } from 'react-router-dom';
import { IssuesDto } from '../../../Types/user.types';
import { createIssue, fetchDropdownRepositoryOption } from '../../../api/projectManagement';
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
      created_at:new Date(),
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
        repository:repositoryId,
        author:1,
        assignees:values.assignees
      };

      mutate(body);
    },
  });


  //treba videti za autora, neki dropdown??
  //kako da handlamo label, repo, assignes
/*
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    // Add more options as needed
  ];
*/
  const [options, setOptions] = useState([]);

  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (event: any, selectedOption: any) => {
    setSelectedOption(selectedOption);
  };

  useEffect(() => {
    const fetchOptions = async () => {
      const options = await fetchDropdownRepositoryOption(repositoryId);
      const formattedOptions = options.map((o: { id: any; name: any; }) => ({
        value: o.id,
        label: o.name,
      }));
      setOptions(formattedOptions);
    };
  
    fetchOptions();
  }, []);
  
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
          <div>
          <Autocomplete
            value={selectedOption}
            onChange={handleOptionChange}
            options={options}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField {...params} 
              label="Select an author" 
              variant="outlined" 
              value='selectedOption.value'
              className="add-update-form__dropdown"
            />
            )}
          />
        </div>  
           
            <Button type="submit" className="add-update__button" variant="contained">
              Create issue
            </Button>
        </form>
      </div>
    </div>
  );
};

export default Issue;
