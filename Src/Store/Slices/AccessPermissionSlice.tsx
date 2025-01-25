import {createSlice} from '@reduxjs/toolkit';

const AccessPermissionSlice = createSlice({
  initialState: {
    permissions: null,
  },
  name: 'AccessPermissionSlice',
  reducers: {
    handleStorePermissions: (state, action) => {
      state.permissions = action.payload;
    },
  },
});

export const {handleStorePermissions} = AccessPermissionSlice.actions;
export default AccessPermissionSlice.reducer;
