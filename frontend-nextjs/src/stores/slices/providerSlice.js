import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  providers: [],
  status: "idle",
};
export const providerSlice = createSlice({
  name: "provider",
  initialState,
  reducers: {
    updateProvider: (state, action) => {
      state.providers = [action.payload];
    },
  },
});
