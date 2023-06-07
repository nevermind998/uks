import { createSlice } from '@reduxjs/toolkit';
import { ExamplePost } from '../../Types/ExamplePost';

export interface ExampleState {
    data: ExamplePost[];
}

const initialState: ExampleState = {
    data: [],
};

export const exampleSlice = createSlice({
    name: 'example',
    initialState,
    reducers: {
        addExample: (state, action) => {
            state.data.push(action.payload);
        }
    },
});

export const { addExample } = exampleSlice.actions;
export default exampleSlice.reducer;
