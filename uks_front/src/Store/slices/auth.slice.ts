import { createSlice } from '@reduxjs/toolkit';
import { UserProfileDto } from '../../Types/user.types';

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
      }
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        addAuth: (state, action) => {
            state.data = action.payload;
        }
    },
});

export const { addAuth } = authSlice.actions;
export default authSlice.reducer;
