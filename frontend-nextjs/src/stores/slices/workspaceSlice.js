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
      const { userUpdate, role } = action.payload;

      state.workspace.users.push({ ...userUpdate, role });
    },
    cancelUser: (state, action) => {
      const usersUpdate = state.workspace.users.filter(
        (user) => +user.id !== +action.payload.id
      );

      state.workspace.users = usersUpdate;
    },
    decentRoleUser: (state, action) => {
      const usersUpdate = state.workspace.users.map((user) => {
        if (+user.id === +action.payload.id) {
          return { ...user, role: action.payload.role };
        }
        return user;
      });
      state.workspace.users = usersUpdate;
    },
    updateActivities: (state, action) => {
      const activitiesUpdate = state.workspace.activities.map((activity) => {
        if (+activity.id === +action.payload.id) {
          return action.payload;
        }
        return activity;
      });
      state.workspace.activities = activitiesUpdate;
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
