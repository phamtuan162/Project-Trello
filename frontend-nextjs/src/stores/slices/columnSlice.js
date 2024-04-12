import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  columns: [],
  status: "idle",
};
export const columnSlice = createSlice({
  name: "column",
  initialState,
  reducers: {
    updateColumn: (state, action) => {
      state.columns = action.payload;
    },
  },
});
