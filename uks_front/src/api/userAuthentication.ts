import { SignInDto, SignUpDto } from '../Types/user.types';
import { api } from './apiBase';

export const signIn = async (body: SignInDto) => {
    return await api.post(`/user/sign-in`, body);
};

export const signUp = async (body: SignUpDto) => {
    return await api.post(`/user/register`, body);
};

export const getUserById = async (id: number) => {
    const user = await api.get(`/user/get-user/${id}`);
    return user.data;
};

