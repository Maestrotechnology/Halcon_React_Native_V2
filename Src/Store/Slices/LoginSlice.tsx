import {createSlice} from '@reduxjs/toolkit';

const LoginSlice = createSlice({
  name: 'LoginSlice',
  initialState: {
    token: null,
    userDetails: null,
    rememberData: null,
    userProfileData: null,
    confirmationModal: false,
    location: null,
    selectedDrawerOption: 1,
  },
  reducers: {
    StoreToken: (state, action) => {
      state.token = action.payload;
    },
    StoreUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
    setConfirmationModal: (state, action) => {
      state.confirmationModal = action.payload;
    },
    storeLocation: (state, action) => {
      state.location = action.payload;
    },

    StoreUserProfileData: (state, action) => {
      state.userProfileData = action.payload;
    },
    setSelectedDrawerOption: (state, action) => {
      state.selectedDrawerOption = action.payload;
    },
    StoreRememberData: (state, action) => {
      state.rememberData = action.payload;
    },
  },
});

export const {
  StoreToken,
  StoreUserDetails,
  setConfirmationModal,
  storeLocation,
  StoreUserProfileData,
  setSelectedDrawerOption,
  StoreRememberData,
} = LoginSlice.actions;
export default LoginSlice.reducer;
