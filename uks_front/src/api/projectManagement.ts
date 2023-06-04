import axios from 'axios';
import { MilestoneDto } from '../Types/user.types';

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
