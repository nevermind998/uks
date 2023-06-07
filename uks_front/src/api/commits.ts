import axios from 'axios';
import { CommitDto } from '../Types/commit.types';
import { api } from './apiBase';

export const BASE_URL = 'http://localhost:8000';

const token = localStorage.getItem('access_token');
const config = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`, // Include the token in the Authorization header
  },
};

export const createCommit = async (body: CommitDto) => {
  try {
    const response = await axios.post(`${BASE_URL}/versioning/add-new-commit`, body, config);
    return response.data;
  } catch (error) {
    console.error('Error creating commit:', error);
    throw error;
  }
};

export const getBranchById = async (id: number) => {
    const branch = await api.get(`/versioning/get-branch/${id}`);
    return branch.data;
};

export const getBranchByName = async (name: string) => {
  const branches = await api.get(`/versioning/branch/${name}`);
  return branches.data;
};

export const fetchBranches = async () => {
  const response = await api.get(`/versioning/branches/`);
  const branches = response.data;
  return branches;
};