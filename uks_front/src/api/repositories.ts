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
