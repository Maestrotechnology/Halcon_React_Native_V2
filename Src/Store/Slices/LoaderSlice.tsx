import {createSlice} from '@reduxjs/toolkit';

const LoaderSlice = createSlice({
  initialState: {
    loader: false,
  },
  name: 'LoaderSlice',
  reducers: {
    openLoader: (state, action) => {
      state.loader = action.payload;
    },
  },
});

export const {openLoader} = LoaderSlice.actions;
export default LoaderSlice.reducer;
