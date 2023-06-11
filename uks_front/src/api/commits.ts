import { CommitDto } from '../Types/commit.types';
import { api } from './apiBase';

export const createCommit = async (body: CommitDto) => {
  try {
    const response = await api.post(`/versioning/add-new-commit`, body);
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

export const fetchCommitsPerBranch = async (branch: number) => {
  const commits = await api.get(`/versioning/commit/${branch}/branch`);
  return commits.data;
};

export const getBranchByNameAndRepository = async (name: string, repository: number) => {
  const branches = await api.get(`/versioning/branch/repository/${repository}?name=${encodeURIComponent(name)}`);
  return branches.data;
};

export const getCommitActivityForRepository = async (repository: number) => {
  const response = await api.get(`/versioning/commit-activity/${repository}`);
  return response.data;
};

export const getCommitCountForRepository = async (repository: number) => {
  const response = await api.get(`/versioning/commit-count/${repository}`);
  return response.data;
};
