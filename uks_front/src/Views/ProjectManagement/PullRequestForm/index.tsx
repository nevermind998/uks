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
import { fetchBranches, getBranchById, getBranchByName } from '../../../api/commits';
import Autocomplete from '@mui/material/Autocomplete';
import { RepositoryDto } from '../../../Types/repository.types';
import { getRepositoriesById, getRepositoriesForOwner } from '../../../api/repositories';
import { getUserById } from '../../../api/userAuthentication';

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

  const repositoryQuery = useQuery({
    queryFn: async () => {
        const repo: RepositoryDto = await getRepositoriesById(repositoryId);
        return repo;
    },
  });

  let coll: AssigneesDto[] = [];
  if (repositoryQuery.data && Array.isArray(repositoryQuery.data) && repositoryQuery.data.length > 0) {
      repositoryQuery.data.forEach(async (item) => {
        for (const collaborator of item.collaborators) {
          const users = await getUserById(collaborator);
          for(const u of users)
            coll.push(u);
          }
      });
  }
  const allLabelsQuery = useQuery(['FETCH_LABELS'], async() => await fetchLabels());
  const allIssuesQuery = useQuery(['FETCH_ISSUES'], async() => await fetchIssues());

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
                    options={allBranchesQuery.data ? allBranchesQuery.data.map((b:any) => ({ value: b.id, label: b.name })) : 0}
                    value={ formik.values.base_branch}
                    onChange={(event, value:any) => formik.setFieldValue("base_branch", value)}
                    sx={{ width: 490 }}
                    renderInput={(params:any) => <TextField {...params} label="Base branch" />}
                    />
                  <img src="/img/comparing-branch.png" alt="User icon" style={{width:"5%"}}/>
                <Autocomplete
                    disablePortal
                    id="compare-branch"
                    options={allBranchesQuery.data?.map((c:any) => ({ value: c.id, label: c.name })) || []}
                    value={formik.values.compare_branch}
                    onChange={(event, value:any) => formik.setFieldValue("compare_branch", value)}
                    sx={{ width: 490 }}
                    renderInput={(params:any) => <TextField {...params} label="Compare branch" />}
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
                multiple
                disablePortal
                id="issues"
                options={allIssuesQuery.data?.map((i:any) => ({ value: i.id, label: i.title })) || []}
                value={formik.values.issues}
                onChange={(event,value) => formik.setFieldValue("issues", value)}
                sx={{ width: 495 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Issues"
                    placeholder="Select issues"
                  />
                )}
              />
                 <Autocomplete
                multiple
                disablePortal
                id="assignees"
                options={coll.map((a:any) => ({ value: a.id, label: a.username })) || []}
                value={formik.values.assignees}
                onChange={(event,value) => formik.setFieldValue("assignees", value)}
                sx={{ width: 495 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assignees"
                    placeholder="Select assignees"
                  />
                )}
              />
            </div>
            <div className="add-pull-request-form__form--autocomplete">
              <Autocomplete
                      disablePortal
                      id="milestone"
                      options={allMilestonesQuery.data?.map((m:any) => ({ value: m.id, label: m.title })) || []}
                      value={formik.values.milestone}
                      onChange={(event,value:any) => formik.setFieldValue("milestone", value)}
                      sx={{ width: 495 }}
                      renderInput={(params:any) => <TextField {...params} label="Milestone" />}
                      />
              <Autocomplete
                      multiple
                      disablePortal
                      id="labels"
                      options={allLabelsQuery.data?.map((label:any) => ({ value: label.id, label: label.name })) || []}
                      value={formik.values.labels}
                      sx={{ width: 495 }}
                      onChange={(event,value) => formik.setFieldValue("labels", value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Labels"
                          placeholder="Select labels"
                        />
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
