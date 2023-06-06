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

const configGET = {
  headers: {
    Authorization: `Bearer ${token}`,
  }
}

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

export const createIssue = async (body: IssuesDto) => {
  try {
    const response = await axios.post(`${BASE_URL}/project/new-issue`, body, config);
    return response.data;
  } catch (error) {
    console.error('Error creating milestone:', error);
    throw error;
  }
};


export const fetchDropdownRepositoryOption = async (repositoryId: number) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`, 
    };

    /*
    const params = {
      id: repositoryId,
    };
    */

    const response = await axios.get(`${BASE_URL}/versioning/repository/${repositoryId}`, { headers });

    if (response.data.visibility == 'PRIVATE'){
      //private -- colaborators
      //dodaj i ownera
      const users = await axios.get(`${BASE_URL}/versioning/repository/${repositoryId}/collaborators/`, { headers });
      console.log("kolaboratori"+users.data);
      return users.data;
    }else{
      //public -- al user
      const users = await axios.get(`${BASE_URL}/user/users/`, { headers });
      console.log("svi"+users.data);
      return users.data;
    }
    return response.data;

  } catch (error) {
    console.error('Error:', error);
  }
};


/*

export const fetchDropdownRepositoryOption = async (repositoryId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/project/repository/`,{
      params: {
        id: repositoryId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.visibility == 0){
      //get_all_users
      const users = await axios.get(`${BASE_URL}/project/repository/`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    }else{
      //get_all_collaborator and owner
      const users = await axios.get(`${BASE_URL}/versioning/repository/<int:repo_id>/collaborators/`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    return users;   
  } catch (error) {
    console.error('Error creating milestone:', error);
    throw error;
  }
  }

  */