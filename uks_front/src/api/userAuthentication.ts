import axios from 'axios';
import { SignInDto, SignUpDto } from '../Types/user.types';

export const BASE_URL = 'http://localhost:8000';

export const signIn = async (body: SignInDto) => {
  return await axios.post(`${BASE_URL}/user/sign-in`, body);
};

export const signUp = async (body: SignUpDto) => {
  return await axios.post(`${BASE_URL}/user/register`, body);
};
