
import { IssuesDto } from '../Types/issue.types';
import { LabelDto } from '../Types/label.types';
import { MilestoneDto } from '../Types/milestone.types';
import { PullRequestDto, ReviewStatusEnum, StatusEnum } from '../Types/pull_request.types';
import { api } from './apiBase';

export const createIssue = async (body: IssuesDto) => {
  body.status = StatusEnum.OPEN;
  const response = await api.post(`/project/new-issue`, body);
  return response.data;
};

export const fetchOptionsForAssigne = async (repositoryId: number) => {
  const repository = await api.get(`/versioning/repository/id/${repositoryId}`);
  if (repository.data.visibility === 'PRIVATE') {
    const users = await api.get(`/versioning/repository/${repositoryId}/collaborators`);
    users.data.push(repository.data.owner);
    return users.data;
  } else {
    const users = await api.get(`/user/users`);
    return users.data;
  }
};

export const createMilestone = async (body: MilestoneDto) => {
  body.status = 'OPEN';
  try {
    const response = await api.post(`/project/new-milestone`, body);
    return response.data;
  } catch (error) {
    console.error('Error creating milestone:', error);
    throw error;
  }
};

export const createLabel = async (body: LabelDto) => {
  try {
    const response = await api.post(`/project/new-label`, body);
    return response.data;
  } catch (error) {
    console.error('Error creating label:', error);
    throw error;
  }
};

export const createPullRequest = async (body: PullRequestDto) => {
  body.status = StatusEnum.OPEN;
  body.review = ReviewStatusEnum.CHANGES_REQUESTED;
  try {
    const response = await api.post(`/project/new-pull_request`, body);
    return response.data;
  } catch (error) {
    console.error('Error opening pull request:', error);
    throw error;
  }
};

export const fetchMilestones = async () => {
  const milestones = await api.get(`/project/milestones/`);
  return milestones.data;
};

export const fetchLabels = async () => {
  const labels = await api.get(`/project/labels/`);
  return labels.data;
};
export const fetchOptionsForLabel = async (repositoryId: number) => {
  const labels = await api.get(`/project/label/${repositoryId}/repository`);
  return labels.data;
};

export const fetchOptionsForMilestone = async (repositoryId: number) => {
  const labels = await api.get(`/project/milestone/${repositoryId}/repository`);
  return labels.data;
};

export const fetchIssues = async () => {
  const issues = await api.get(`/project/issues/`);
  return issues.data;
};

export const getPullRequestByBranch = async (id: number) => {
  const prs = await api.get(`/project/pull_requests/${id}/branch`);
  return prs.data;
};

export const getPullRequestsByRepo = async (id: number) => {
  const prs = await api.get(`/project/pull_requests/${id}/repository`);
  return prs.data;
};

export const fetchLabel = async (repositoryId: number) =>{
  const labels = await api.get(`/project/label/${repositoryId}/repository`);
  return labels.data;
}

export const fetchOpenedIssue = async (status:StatusEnum, repository:number) => {
  const openedIssue = await api.get(`/project/issues/${status}/status/${repository}/repository`);
  return openedIssue.data;
};

export const fetchOpenedMilestone = async (status:StatusEnum, repository:number) => {
  const openedMilestone = await api.get(`/project/milestone/${status}/status/${repository}/repository`);
  return openedMilestone.data;
};

export const fetchPullRequestsByAuthor = async (author:number) => {
  const pull_requests = await api.get(`/project/pull_requests/${author}/author`);
  return pull_requests.data;
};

export const fetchBranchesByRepo = async (id: number) => {
  const branches = await api.get(`/versioning/branches/repository/${id}`);
  return branches.data;
};

export const fetchOpenedPrs = async (status: StatusEnum, repository: number) => {
  const openedPrs = await api.get(`/project/pull_requests/${status}/repository/${repository}`);
  return openedPrs.data;
};

export const getPRbyId = async (id: number) => {
  const pr = await api.get(`/project/pull_request/${id}`);
  return pr.data;
};

export const getMilestoneById = async (id: number) => {
  const milestone = await api.get(`/project/milestone/${id}`);
  return milestone.data;
};

export const getIssuesById = async (id:number) => {
  const issue = await api.get(`/project/issue/${id}`);
  return issue.data;
};

export const getLabelsById = async (id:number) => {
  const label = await api.get(`/project/label/${id}`);
  return label.data;
};

export const updateIssue = async (body: IssuesDto) => {
  const issue = await api.put(`/project/update-issue/${body.id}`,body);
  return issue.data;
};

export const updateLabel = async (body: LabelDto) => {
  const issue = await api.put(`/project/update-label/${body.id}`,body);
  return issue.data;
};

export const updateMilestone = async (body: MilestoneDto) => {
  const issue = await api.put(`/project/update-milestone/${body.id}`,body);
  return issue.data;
};

export const updatePullRequestReviewStatus = async (id: number, status: ReviewStatusEnum) => {
  try {
    const response = await api.put(`/project/change-pr-status/${id}`, {
      review: status,
    });
    return response.data;
  } catch (error) {
    console.error('Error opening pull request:', error);
    throw error;
  }
};

export const updatePullRequestStatus = async (id: number) => {
  try {
    const response = await api.put(`/project/change-pr-status/${id}`, {
      status: StatusEnum.CLOSED,
    });
    return response.data;
  } catch (error) {
    console.error('Error opening pull request:', error);
    throw error;
  }
};
