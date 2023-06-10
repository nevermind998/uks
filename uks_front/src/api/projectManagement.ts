import axios from 'axios';
import { IssuesDto, LabelDto, MilestoneDto } from '../Types/user.types';
import { PullRequestDto, ReviewStatusEnum, StatusEnum } from '../Types/pull_request.types';
import { api } from './apiBase';

export const BASE_URL = 'http://localhost:8000';

const token = localStorage.getItem('access_token');
const config = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`, // Include the token in the Authorization header
  },
};

export const createMilestone = async (body: MilestoneDto) => {
  body.status = "OPEN";
  try {
    const response = await axios.post(`${BASE_URL}/project/new-milestone`, body, config);
    return response.data;
  } catch (error) {
    console.error('Error creating milestone:', error);
    throw error;
  }
};

export const createLabel = async (body: LabelDto) => {
  try {
    const response = await axios.post(`${BASE_URL}/project/new-label`, body, config);
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
    const response = await axios.post(`${BASE_URL}/project/new-pull_request`, body, config);
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

export const fetchIssues = async () => {
  const issues = await api.get(`/project/issues/`);
  return issues.data;
};

export const fetchPullRequestsByAuthor = async (author:number) => {
  const pull_requests = await api.get(`/project/pull_requests/${author}/author`);
  return pull_requests.data;
};

export const fetchBranchesByRepo = async (id:number) => {
  const branches = await api.get(`/versioning/branches/repository/${id}`);
  return branches.data;
};

export const fetchOpenedPrs = async (status:StatusEnum, repository:number) => {
  const openedPrs = await api.get(`/project/pull_requests/${status}/repository/${repository}`);
  return openedPrs.data;
};

export const getPRbyId = async (id:number) => {
  const pr = await api.get(`/project/pull_request/${id}`);
  return pr.data;
};

export const getMilestoneById = async (id:number) => {
  const milestone = await api.get(`/project/milestone/${id}`);
  return milestone.data;
};

export const getIssuesIds = async (id:number) => {
  const issue = await api.get(`/project/issue/${id}`);
  return issue.data;
};

export const getLabelsById = async (id:number) => {
  const label = await api.get(`/project/label/${id}`);
  return label.data;
};

export const updatePullRequestReviewStatus = async (id:number) => {
  try {
    const response = await api.put(`/project/change-pr-status/${id}`, {
      review: ReviewStatusEnum.APPROVED,
    });
      return response.data;
  } catch (error) {
    console.error('Error opening pull request:', error);
    throw error;
  }
};

export const updatePullRequestStatus = async (id:number) => {
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

