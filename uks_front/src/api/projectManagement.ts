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
  const milestones = await api.get(`${BASE_URL}/project/milestones/`);
  return milestones.data;
};

export const fetchLabels = async () => {
  const labels = await api.get(`${BASE_URL}/project/labels/`);
  return labels.data;
};

export const fetchIssues = async () => {
  const issues = await api.get(`${BASE_URL}/project/issues/`);
  return issues.data;
};
