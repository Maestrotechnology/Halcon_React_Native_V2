import { createSlice } from "@reduxjs/toolkit";

const UtilitySlice = createSlice({
  initialState: {
    insets: {
      bottom: 0,
      top: 0,
      left: 0,
      right: 0,
    },
    deepLinkData: undefined,
  },
  name: "UtilitySlice",
  reducers: {
    storeInsets: (state, action) => {
      state.insets = action.payload;
    },
    setDeepLinkData: (state, action) => {
      state.deepLinkData = action.payload;
    },
  },
});

export const { storeInsets, setDeepLinkData } = UtilitySlice.actions;
export default UtilitySlice.reducer;
