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
      // state.user = { ...state.user, ...action.payload };
      if (action.payload) {
        Object.keys(action.payload).forEach((key) => {
          state.user[key] = action.payload[key];
        });
      }
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
