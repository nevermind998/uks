import { IssuesDto } from '../Types/issue.types';
import { LabelDto } from '../Types/label.types';
import { MilestoneDto } from '../Types/milestone.types';
import { PullRequestDto, ReviewStatusEnum, StatusEnum } from '../Types/pull_request.types';
import { api } from './apiBase';

export const BASE_URL = 'http://localhost:8000';

export const createMilestone = async (body: MilestoneDto) => {
  body.status = StatusEnum.OPEN;
  const response = await api.post(`${BASE_URL}/project/new-milestone`, body);
  return response.data;
};

export const createLabel = async (body: LabelDto) => {
  const response = await api.post(`${BASE_URL}/project/new-label`, body);
  return response.data;
};

export const createIssue = async (body: IssuesDto) => {
  body.status =  StatusEnum.OPEN;
  const response = await api.post(`${BASE_URL}/project/new-issue`, body);
  return response.data;
};

export const fetchOptionsForAssigne = async (repositoryId: number) => {
  const repository = await api.get(`${BASE_URL}/versioning/repository/id/${repositoryId}`);
  if (repository.data.visibility == 'PRIVATE'){
      const users = await api.get(`${BASE_URL}/versioning/repository/${repositoryId}/collaborators`);
      users.data.push(repository.data.owner);
      return users.data;
    }else{
      const users = await api.get(`${BASE_URL}/user/users`);
      return users.data;
    }
};

export const createPullRequest = async (body: PullRequestDto) => {
  body.status = StatusEnum.OPEN;
  body.review = ReviewStatusEnum.CHANGES_REQUESTED;
  const response = await api.post(`${BASE_URL}/project/new-pull_request`, body);
  return response.data;
};

export const fetchMilestones = async () => {
  const milestones = await api.get(`${BASE_URL}/project/milestones/`);
  return milestones.data;
};

export const fetchLabels = async () => {
  const labels = await api.get(`${BASE_URL}/project/labels/`);
  return labels.data;
};
export const fetchOptionsForLabel = async (repositoryId: number) => {
  const labels = await api.get(`${BASE_URL}/project/label/${repositoryId}/repository`);
  return labels.data;
};

export const fetchOptionsForMilestone = async (repositoryId: number) =>{
  const labels = await api.get(`${BASE_URL}/project/milestone/${repositoryId}/repository`);
  return labels.data;
}

export const fetchIssues = async (issuesId: number) => {
  const labels = await api.get(`${BASE_URL}/project/issue/${issuesId}`);
  return labels.data;
}
