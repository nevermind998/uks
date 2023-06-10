import { Autocomplete, Button, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import Toast, { ToastOptions } from '../../../Components/Common/Toast';
import { useParams } from 'react-router-dom';
import { createIssue, fetchOptionsForAssigne, fetchOptionsForLabel, fetchOptionsForMilestone } from '../../../api/projectManagement';
import { useMutation, useQuery } from 'react-query';
import { ISSUES_SCHEMA } from './issuesSchema';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Store';
import { AuthState } from '../../../Store/slices/auth.slice';
import { IssuesDto } from '../../../Types/issue.types';

const Issue = ( {setCreateIssue}: any ) => {
  const [open, setOpen] = useState<boolean>(false);
  const [toastOptions, setToastOptions] = useState<ToastOptions>({ message: '', type: 'info' });
  const { id } = useParams();
  const repositoryId = id ? parseInt(id, 10) : 0;

  const authorUser = useSelector<RootState, AuthState>((state) => state.auth);

  const allMilestonesQuery = useQuery(['FETCH_MILESTONE'], async () => await fetchOptionsForMilestone(repositoryId));
  const allLabelsQuery = useQuery(['FETCH_LABELS'], async () => await fetchOptionsForLabel(repositoryId));
  const assignees = useQuery(['FETCH_ASSIGNE_USERS'], async () => await fetchOptionsForAssigne(repositoryId));
  const milestone = allMilestonesQuery.data ? allMilestonesQuery.data[0] : null;

  const { mutate } = useMutation(createIssue, {
    onSuccess: (res) => {
      setToastOptions({ message: 'Issue successfully created', type: 'success' });
      setOpen(true);
    },
    onError: () => {
      setToastOptions({ message: 'Error creating issue', type: 'error' });
      setOpen(true);
    },
  });

  const formik = useFormik({
    initialValues: {
      id:0,
      title:'',
      created_at:new Date(),
      status:'',
      milestone:0,
      labels:[],
      repository:0,
      author:0,
      assignees:[]
    },
    validationSchema: ISSUES_SCHEMA,
    onSubmit: (values) => {
      const body: IssuesDto = {
        title:values.title,
        created_at:values.created_at,
        status:values.status,
        milestone: milestone ? milestone.id : '',
        labels: values.labels?.map((a: any) => {
          return a.value;
        }),
        repository: repositoryId,
        author: authorUser.data.id,
        assignees: values.assignees?.map((a: any) => {
          return a.value;
        }),
      };
      mutate(body);
    },
  });

  function isOptionEqualToValue(option: any, value: any) {
    if (value.value === '') return true;
    return option.value === value.value;
  }

  return (
    <div className="add-update-form">
      <Toast open={open} setOpen={setOpen} toastOptions={toastOptions} />
      <div className="add-update-form__content-wrapper">
        <h3>Create a new issue</h3>
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

          <Autocomplete
            disablePortal
            multiple
            id="assignees"
            options={assignees.data?.map((b: any) => ({ value: b.id, label: b.given_name + ' ' + b.family_name })) || []}
            isOptionEqualToValue={isOptionEqualToValue}
            getOptionLabel={(option: any) => option.label}
            onChange={(event, value: any) => formik.setFieldValue('assignees', value)}
            sx={{ width: 490 }}
            renderInput={(params: any) => <TextField {...params} label="Select assignees" />}
          />

          <Autocomplete
            multiple
            disablePortal
            id="labels"
            options={allLabelsQuery.data?.map((label: any) => ({ value: label.id, label: label.name })) || []}
            value={formik.values.labels}
            sx={{ width: 495 }}
            onChange={(event, value) => formik.setFieldValue('labels', value)}
            renderInput={(params) => <TextField {...params} label="Labels" placeholder="Select labels" />}
          />

          <Autocomplete
            disablePortal
            id="milestone"
            options={allMilestonesQuery.data?.map((m: any) => ({ value: m.id, label: m.title })) || []}
            value={formik.values.milestone}
            onChange={(event, value: any) => formik.setFieldValue('milestone', value)}
            sx={{ width: 495 }}
            renderInput={(params: any) => <TextField {...params} label="Milestone" />}
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
