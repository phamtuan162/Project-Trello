import { createSlice } from "@reduxjs/toolkit";
import { fetchProfileUser } from "../middleware/fetchProfileUser";

const initialState = {
  user: {},
  status: "idle",
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserCurrent: (state, action) => {
      state.user = action.payload;
    },
    updateUser: (state, action) => {
      if (action.payload) {
        Object.entries(action.payload).forEach(([key, value]) => {
          if (value !== undefined && key !== "id") state.user[key] = value;
        });
      }
    },

    restoreWorkspaceInUser: (state, action) => {
      const incomingWorkspace = action.payload;

      const workspace = state.user.workspaces.find(
        (w) => w.id === incomingWorkspace.id
      );

      if (workspace) {
        workspace.deleted_at = null;
      }
    },

    createWorkspaceInUser: (state, action) => {
      if (Array.isArray(state.user.workspaces)) {
        state.user.workspaces.push(action.payload);
      } else {
        state.user.workspaces = [action.payload];
      }

      state.user.role = "owner";
    },

    updateWorkspaceInUser: (state, action) => {
      const incomingWorkspace = action.payload;

      const workspace = state.user.workspaces.find(
        (w) => w.id === incomingWorkspace.id
      );

      if (workspace) {
        Object.entries(incomingWorkspace).forEach(([key, value]) => {
          if (value !== undefined && key !== "id") workspace[key] = value;
        });
      }
    },
    deleteWorkspaceInUser: (state, action) => {
      const { user, workspace: incomingWorkspace } = action.payload;

      const workspace = state.user.workspaces.find(
        (w) => w.id === incomingWorkspace.id
      );

      if (workspace) {
        // Đánh dấu workspace xóa mềm bằng cách thiết lập thời gian xóa
        workspace.deleted_at = new Date().toISOString();

        // Cập nhật thông tin người dùng, bỏ qua 'id'
        Object.entries(user).forEach(([key, value]) => {
          if (value !== undefined && key !== "id") state.user[key] = value;
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileUser.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchProfileUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.status = "success";
        }
      })
      .addCase(fetchProfileUser.rejected, (state) => {
        state.status = "error";
      });
  },
});
