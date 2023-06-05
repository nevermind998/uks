import axios from 'axios';
import { BranchDto } from '../Types/branch.types';

export const BASE_URL = 'http://localhost:8000';

const token = localStorage.getItem('access_token');
const config = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`, // Include the token in the Authorization header
  },
};

export const createBranch = async (body: BranchDto) => {
  try {
    const response = await axios.post(`${BASE_URL}/versioning/new-branch`, body, config);
    return response.data;
  } catch (error) {
    console.error('Error creating milestone:', error);
    throw error;
  }
};
