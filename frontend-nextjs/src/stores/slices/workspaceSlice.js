import { createSlice } from "@reduxjs/toolkit";
import { fetchWorkspace } from "../middleware/fetchWorkspace";
import { socket } from "@/socket";
const initialState = {
  workspace: {},
  status: "idle",
};
export const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    selectWorkspace: (state, action) => {
      state.workspace = action.payload;
      socket.emit("changeWorkspace", {
        workspace_id_active: state.workspace.id,
      });
    },
    updateWorkspace: (state, action) => {
      if (action.payload) {
        Object.entries(action.payload).forEach(([key, value]) => {
          if (value !== undefined && key !== "id") state.workspace[key] = value;
        });
      }
    },
    updateBoardInWorkspace: (state, action) => {
      const incomingBoard = action.payload;

      const board = state.workspace.boards.find(
        (b) => b.id === incomingBoard.id
      );

      if (board) {
        Object.entries(incomingBoard).forEach(([key, value]) => {
          if (value !== undefined && key !== "id") board[key] = value;
        });
      }
    },
    deleteBoardInWorkspace: (state, action) => {
      if (action.payload) {
        state.workspace.boards = state.workspace.boards.filter(
          (b) => +b.id !== +action.payload
        );
      }
    },

    inviteUserInWorkspace: (state, action) => {
      if (Array.isArray(state.workspace.users)) {
        state.workspace.users.push(action.payload);
      } else {
        state.workspace.users = [action.payload];
      }

      state.workspace.total_user = state.workspace.users.length;
    },

    cancelUserInWorkspace: (state, action) => {
      const usersUpdate = state.workspace.users.filter(
        (user) => +user.id !== +action.payload.id
      );

      state.workspace.users = usersUpdate;

      state.workspace.total_user = state.workspace.users.length;
    },

    decentRoleUserInWorkspace: (state, action) => {
      const incomingUser = action.payload;

      const user = state.workspace.users.find(
        (user) => user.id === incomingUser.id
      );

      if (user) {
        user.role = incomingUser.role;
        socket.emit("updateWorkspace", {
          users: state.workspace.users,
        });
      }
    },

    updateActivitiesInWorkspace: (state, action) => {
      const activity = action.payload;

      if (Array.isArray(state.workspace?.activities)) {
        state.workspace.activities.push(activity);
      } else {
        state.workspace.activities = [activity];
      }

      socket.emit("updateWorkspace", {
        activities: state.workspace.activities,
      });
    },

    updateStatusUserInWorkspace: (state, action) => {
      const incomingUser = action.payload;

      const user = state.workspace.users.find(
        (user) => user.id === incomingUser.id
      );

      if (user) {
        user.isOnline = incomingUser.isOnline;
      }
    },

    createBoardInWorkspace: (state, action) => {
      const { board, activity } = action.payload;

      if (Array.isArray(state.workspace.boards)) {
        state.workspace.boards.push(board);
      } else {
        state.workspace.boards = [board];
      }

      if (Array.isArray(state.workspace.activities)) {
        state.workspace.activities.push(activity);
      } else {
        state.workspace.activities = [activity];
      }

      socket.emit("updateWorkspace", {
        boards: state.workspace.boards,
        activities: state.workspace.activities,
      });
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
