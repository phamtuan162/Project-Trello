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
      if (action.payload) {
        Object.keys(action.payload).forEach((key) => {
          state.workspace[key] = action.payload[key];
        });
      }
    },

    inviteUser: (state, action) => {
      const { user, role } = action.payload;

      state.workspace.users.push({ ...user, role });
    },

    cancelUser: (state, action) => {
      const usersUpdate = state.workspace.users.filter(
        (user) => +user.id !== +action.payload.id
      );

      state.workspace.users = usersUpdate;
    },

    decentRoleUser: (state, action) => {
      const updatedUsers = state.workspace.users.map((item) =>
        item.id === action.payload.id
          ? { ...item, role: action.payload.role }
          : item
      );
      state.workspace.users = updatedUsers;
    },

    updateActivitiesInWorkspace: (state, action) => {
      state.workspace.activities.push(action.payload);
    },

    updateStatusUser: (state, action) => {
      const usersUpdate = state.workspace.users.map((user) => {
        if (user.id === action.payload.id) {
          return { ...user, isOnline: action.payload.isOnline };
        }
        return user;
      });
      state.workspace.users = usersUpdate;
    },
    createNewColumn: (state, action) => {
      state.workspace.columns = action.payload.columns;
      state.workspace.c;
    },

    createBoardInWorkspace: (state, action) => {
      state.workspace.boards.push(action.payload.board);
      state.workspace.activities.push(action.payload.activity);
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
