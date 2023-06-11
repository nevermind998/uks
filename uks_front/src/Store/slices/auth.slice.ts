import { createSlice } from '@reduxjs/toolkit';
import { UserProfileDto } from '../../Types/user.types';
import { RootState } from '..';

export interface AuthState {
    data: UserProfileDto;
}

const initialState: AuthState = {
    data: {
        id: 0,
        username: '',
        email: '',
        family_name: '',
        given_name: '',
        bio: '',
        url: '',
    },
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        addAuth: (state, action) => {
            state.data = action.payload;
        },
        clearUser: state => {
            state.data = initialState.data;
        },
    },
});

export const { addAuth, clearUser } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth.data;

export default authSlice.reducer;
