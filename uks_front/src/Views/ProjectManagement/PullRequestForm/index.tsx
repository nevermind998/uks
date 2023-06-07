import { Button, TextField, TextFieldProps } from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import Toast, { ToastOptions } from '../../../Components/Common/Toast';
import { useParams } from 'react-router-dom';
import { AssigneesDto, LabelDto, MilestoneDto, UserProfileDto } from '../../../Types/user.types';
import { createPullRequest, fetchIssues, fetchLabels, fetchMilestones } from '../../../api/projectManagement';
import { useMutation } from 'react-query';
import { PULL_REQUEST_SCHEMA } from './pullRequestValidationSchema';
import { PullRequestDto, ReviewStatusEnum, StatusEnum } from '../../../Types/pull_request.types';
import { useSelector } from "react-redux";
import { RootState } from '../../../Store';
import { AuthState } from '../../../Store/slices/auth.slice';
import {useQuery} from 'react-query'
import { fetchBranches } from '../../../api/commits';
import Autocomplete from '@mui/material/Autocomplete';
import { fetchAssignees } from '../../../api/userAuthentication';

const PullRequest = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [toastOptions, setToastOptions] = useState<ToastOptions>({ message: '', type: 'info' });
  const { id } = useParams();
  const repositoryId = id ?  parseInt(id, 10) : 0;
  const user = useSelector<RootState, AuthState>(state => state.auth);

  const { mutate, isLoading } = useMutation(createPullRequest, {
    onSuccess: (res) => {
      setToastOptions({ message: 'Pull request successfully opened', type: 'success'});
      setOpen(true);
    },
    onError: () => {
      setToastOptions({ message: 'Error opening pull request', type: 'error' });
      setOpen(true);
    },
  });

  const allMilestonesQuery = useQuery(['FETCH_MILESTONE'], async() => await fetchMilestones());
  const milestone = allMilestonesQuery.data  ? allMilestonesQuery.data[0] : null;

  const allBranchesQuery = useQuery(['FETCH_BRANCH'], async() => await fetchBranches());
  const firstBranch = allBranchesQuery.data && allBranchesQuery.data.length > 0 ? allBranchesQuery.data[0] : null;

  const assignees = useQuery(['FETCH_REPOSITORY'], async() => await fetchAssignees(repositoryId));
  const allLabelsQuery = useQuery(['FETCH_LABELS'], async() => await fetchLabels());
  const allIssuesQuery = useQuery(['FETCH_ISSUES'], async() => await fetchIssues());

  function isOptionEqualToValue(option: any, value: any) {
    if (value.value === '') return true;
    return option.value === value.value;
  }

  const formik = useFormik({
    initialValues: {
        author: 0,
        repository: 0,
        title: '',
        description: '',
        base_branch: firstBranch ? firstBranch.name : '',
        compare_branch: firstBranch ? firstBranch.name : '',
        milestone: milestone ? milestone.id : '',
        labels: [],
        assignees: [],
        issues: [], 
        status: StatusEnum.CLOSED,
        review: ReviewStatusEnum.CHANGES_REQUESTED,
        created_at: new Date(),
    },
    validationSchema: PULL_REQUEST_SCHEMA,
    onSubmit: (values:any) => {
      const body: PullRequestDto = {
        author: user.data.id,
        repository: repositoryId,
        title: values.title,
        description:values.description,
        base_branch: values.base_branch.value,
        compare_branch: values.compare_branch.value,
        assignees: values.assignees.map((a:any) => {return a.value}),
        milestone: values.milestone.value,
        labels: values.labels.map((lbl:any) => {return lbl.value}),
        issues: values.issues.map((issue:any) => {return issue.value}),
        status: StatusEnum.CLOSED,
        review: ReviewStatusEnum.CHANGES_REQUESTED,
        created_at: new Date(),
      };

      mutate(body);
    },
  });

  return (
    <div className="add-pull-request-form">
      <Toast open={open} setOpen={setOpen} toastOptions={toastOptions} />
      <div className="add-pull-request-form__content-wrapper">
        <h3>Open pull request</h3>
        <form onSubmit={formik.handleSubmit} className="add-pull-request-form__form">
            <div className="add-pull-request-form__form--autocomplete">
              <Autocomplete
                disablePortal
                id="base-branch"
                options={allBranchesQuery?.data?.map((b: any) => ({ value: b.id, label: b.name })) || []}
                isOptionEqualToValue={isOptionEqualToValue}
                getOptionLabel={(option: any) => option.label}
                onChange={(event, value: any) => formik.setFieldValue('base_branch', value)}
                sx={{ width: 490 }}
                renderInput={(params: any) => <TextField {...params} label="Base branch" />}
              />
              <img src="/img/comparing-branch.png" alt="User icon" style={{ width: '5%' }} />
              <Autocomplete
                disablePortal
                id="compare-branch"
                options={allBranchesQuery?.data?.map((b: any) => ({ value: b.id, label: b.name })) || []}
                isOptionEqualToValue={isOptionEqualToValue}
                getOptionLabel={(option: any) => option.label}
                onChange={(event, value: any) => formik.setFieldValue('compare_branch', value)}
                sx={{ width: 490 }}
                renderInput={(params: any) => <TextField {...params} label="Compare branch" />}
              />
            </div>
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
            <TextField
              id="description"
              label="Description"
              variant="outlined"
              value={formik.values.description}
              onChange={formik.handleChange}
              name="description"
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.errors.description && formik.touched.description}
              className="add-update-form__form--field"
              size="medium"
              multiline
              rows={4}
            />
            <div className="add-pull-request-form__form--autocomplete">
              <Autocomplete
                  disablePortal
                  multiple
                  id="issues"
                  options={allIssuesQuery.data?.map((i:any) => ({ value: i.id, label: i.title })) || []}
                  isOptionEqualToValue={isOptionEqualToValue}
                  getOptionLabel={(option: any) => option.label}
                  onChange={(event, value: any) => formik.setFieldValue('issues', value)}
                  sx={{ width: 495 }}
                  renderInput={(params: any) => <TextField {...params} label="Select issues" />}
                />
              <Autocomplete
                  disablePortal
                  multiple
                  id="assignees"
                  options={assignees.data?.map((b: any) => ({ value: b.id, label: b.given_name + " " + b.family_name })) || []}
                  isOptionEqualToValue={isOptionEqualToValue}
                  getOptionLabel={(option: any) => option.label}
                  onChange={(event, value: any) => formik.setFieldValue('assignees', value)}
                  sx={{ width: 490 }}
                  renderInput={(params: any) => <TextField {...params} label="Select assignees" />}
                />
            </div>
            <div className="add-pull-request-form__form--autocomplete">
              <Autocomplete
                      disablePortal
                      id="milestone"
                      options={allMilestonesQuery.data?.map((m:any) => ({ value: m.id, label: m.title })) || []}
                      isOptionEqualToValue={isOptionEqualToValue}
                      getOptionLabel={(option: any) => option.label}
                      onChange={(event,value:any) => formik.setFieldValue("milestone", value)}
                      sx={{ width: 495 }}
                      renderInput={(params:any) => <TextField {...params} label="Milestone" />}
                      />
              <Autocomplete
                      multiple
                      disablePortal
                      id="labels"
                      options={allLabelsQuery.data?.map((label:any) => ({ value: label.id, label: label.name })) || []}
                      isOptionEqualToValue={isOptionEqualToValue}
                      getOptionLabel={(option: any) => option.label} 
                      sx={{ width: 495 }}
                      onChange={(event,value) => formik.setFieldValue("labels", value)}
                      renderInput={(params) => (<TextField {...params} label="Labels"/>
                )}
              />
            </div>
            <Button type="submit" className="add-update__button" variant="contained">
              Create pull request
            </Button>
        </form>
      </div>
    </div>
  );
};

export default PullRequest;
