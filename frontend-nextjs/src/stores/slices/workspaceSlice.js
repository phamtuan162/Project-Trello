import { createSlice } from "@reduxjs/toolkit";
import { fetchData } from "../middleware/fetchData";
const initialState = {
  workspaces: [],
  status: "idle",
};
export const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        if (action.payload && action.payload) {
          state.workspaces = action.payload.data;
          toast.success("success");
          state.status = "success";
        }
      })
      .addCase(fetchData.rejected, (state) => {
        state.status = "error";
      });
  },
});
