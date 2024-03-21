import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  devices: [],
  status: "idle",
};
export const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    updateDevice: (state, action) => {
      state.devices = action.payload;
    },
  },
});
