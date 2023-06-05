import axios from 'axios';
import { IssuesDto, LabelDto, MilestoneDto } from '../Types/user.types';

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


