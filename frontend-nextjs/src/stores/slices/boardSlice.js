import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  board: {},
  status: "idle",
};
export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    updateBoard: (state, action) => {
      state.board = action.payload;
    },
  },
});
