import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  socket: null,
  status: "idle",
};
export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    updateSocket: (state, action) => {
      state.socket = action.payload;
    },
  },
});
