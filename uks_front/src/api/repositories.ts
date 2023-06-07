import { api } from './apiBase';

export const getRepositoriesForOwner = async (owner: number) => {
    const repos = await api.get(`/versioning/repository/owner/${owner}`);
    return repos.data;
};

export const getRepositoriesById = async (id: number) => {
    const repos = await api.get(`/versioning/get-repository/${id}`);
    return repos.data;
};


