import {combineReducers} from '@reduxjs/toolkit';
import UtilitySlice from '../Slices/UtilitySlice';
import LoginSlice from '../Slices/LoginSlice';
import LoaderSlice from '../Slices/LoaderSlice';
import AccessPermissionSlice from '../Slices/AccessPermissionSlice';

const RootReducer = combineReducers({
  login: LoginSlice,
  loader: LoaderSlice,
  utility: UtilitySlice,
  permission: AccessPermissionSlice,
});

export default RootReducer;
