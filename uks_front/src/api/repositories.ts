import { ActionDto } from '../Types/action.types';
import { CreateRepositoryDto } from '../Types/repository.types';
import { api } from './apiBase';

export const getRepositoriesForOwner = async (owner: number) => {
  const repos = await api.get(`/versioning/repository/owner/${owner}`);
  return repos.data;
};

export const createNewRepository = async (body: CreateRepositoryDto) => {
  const repos = await api.post(`/versioning/new-repository`, body);
  return repos.data;
};

export const getRepositoryById = async (repository: number) => {
  const repo = await api.get(`/versioning/repository/${repository}`);
  return repo.data;
};

export const getRepositoryStargazers = async (repository: number) => {
  const repo = await api.get(`/user-actions/repository/${repository}/stargazers`);
  return repo.data;
};

export const getRepositoryWatchers = async (repository: number) => {
  const repo = await api.get(`/user-actions/repository/${repository}/watchers`);
  return repo.data;
};

export const getRepositoryForks = async (repository: number) => {
  const repo = await api.get(`/user-actions/repository/${repository}/forked-repos`);
  return repo.data;
};

export const getStarActionForUser = async (repository: number, user: number) => {
  const repo = await api.get(`/user-actions/repository/${repository}/user/${user}/star`);
  return repo.data;
};

export const createNewRepositoryAction = async (body: ActionDto) => {
  const action = await api.post(`/user-actions/new-action`, body);
  return action.data;
};

export const deleteAction = async (action: number) => {
  const repo = await api.delete(`/user-actions/actions/${action}`);
  return repo.data;
};

export const getRepositoriesById = async (id: number) => {
    const repos = await api.get(`/versioning/get-repository/${id}`);
    return repos.data;
};


