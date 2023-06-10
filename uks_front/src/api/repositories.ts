import { ActionDto } from "../Types/action.types";
import { CreateRepositoryDto, RepositoryDto } from "../Types/repository.types";
import { api } from "./apiBase";

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

export const getWatchActionForUser = async (repository: number, user: number) => {
  const repo = await api.get(`/user-actions/repository/${repository}/user/${user}/watch`);
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

export const getRepositoryBranches = async (id: number) => {
  const response = await api.get(`/versioning/branch/${id}/repository`);
  return response.data;
};

export const editRepo = async (body: RepositoryDto) => {
  const response = await api.put(`/versioning/repository/${body.id}`, body);
  return response.data;
};

export const getCollaborators = async (repository: number, id: number) => {
  const users = await api.get(`/versioning/role/${id}/repository/${repository}`);
  return users.data;
};

export const updateRoles = async (body: any) => {
  const roles = await api.put(`/versioning/edit-role/${body.user}/repository/${body.repository}`, body);
  return roles.data;
};

export const deleteRepo = async (id: number) => {
  await api.delete(`/versioning/repository/${id}`);
};

export const deleteCollaborator = async (params: any) => {
  await api.delete(`/versioning/delete-collaborator/${params.id}/repository/${params.repository}`);
};
