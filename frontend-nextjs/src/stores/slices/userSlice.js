import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  status: "idle",
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    restoreMyWorkspaces: (state, action) => {
      const oldWorkspaces = state.user.workspaces;
      state.user.workspaces = [
        ...oldWorkspaces,
        { ...action.payload, deleted_at: null },
      ];
    },
  },
});
