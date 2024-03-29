import { createSlice } from "@reduxjs/toolkit";
import { fetchWorkspace } from "../middleware/fetchWorkspace";
const initialState = {
  workspace: {},
  status: "idle",
};
export const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    updateWorkspace: (state, action) => {
      state.workspace = action.payload;
    },
    inviteUser: (state, action) => {
      state.workspace = {
        ...state.workspace,
        users: [...state.workspace.users, action.payload],
      };
    },
    cancelUser: (state, action) => {
      state.workspace = {
        ...state.workspace,
        users: state.workspace.users.filter(
          (user) => +user.id !== action.payload.id
        ),
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspace.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchWorkspace.fulfilled, (state, action) => {
        if (action.payload) {
          state.workspace = action.payload;
          state.status = "success";
        }
      })
      .addCase(fetchWorkspace.rejected, (state) => {
        state.status = "error";
      });
  },
});
