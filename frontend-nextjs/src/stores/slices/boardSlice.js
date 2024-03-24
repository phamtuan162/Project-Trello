import { createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../middleware/fetchWorkspace";
const initialState = {
  boards: {},
  status: "idle",
};
export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        if (action.payload && action.payload.boards) {
          state.columns = action.payload.boards;
          state.status = "success";
        }
      })
      .addCase(fetchData.rejected, (state) => {
        state.status = "error";
      });
  },
});
