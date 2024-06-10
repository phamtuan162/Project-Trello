import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  my_workspaces: [],
  status: "idle",
};
export const myWorkspacesSlice = createSlice({
  name: "my_workspaces",
  initialState,
  reducers: {
    updateMyWorkspaces: (state, action) => {
      state.my_workspaces = action.payload;
    },
  },
});
