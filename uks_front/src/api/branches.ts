import { BranchDto } from '../Types/branch.types';
import { api } from './apiBase';

export const createBranch = async (body: BranchDto) => {
    try {
        const response = await api.post(`/versioning/new-branch`, body);
        return response.data;
    } catch (error) {
        console.error('Error creating branch', error);
        throw error;
    }
};

export const renameBranch = async (body: any) => {
    try {
        const response = await api.put(`/versioning/branch/${body.id}/edit`, body);
        return response.data;
    } catch (error) {
        console.error('Error renaming branch', error);
        throw error;
    }
};

export const deleteBranch = async (id: number) => {
    await api.delete(`/versioning/branch/${id}`);
};
