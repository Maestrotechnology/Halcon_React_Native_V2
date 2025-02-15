import {createSlice} from '@reduxjs/toolkit';
import {RolePermissionList} from '../../Utilities/AccessConstants';

const AccessPermissionSlice = createSlice({
  initialState: {
    permissions: null,
    userPermission: RolePermissionList,
  },
  name: 'AccessPermissionSlice',
  reducers: {
    handleStorePermissions: (state, action) => {
      state.permissions = action.payload;
    },
    handleSetPermissions: (state, action) => {
      state.userPermission = action.payload;
    },
  },
});

export const {handleStorePermissions, handleSetPermissions} =
  AccessPermissionSlice.actions;
export default AccessPermissionSlice.reducer;
