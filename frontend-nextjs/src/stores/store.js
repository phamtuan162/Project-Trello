import { configureStore } from "@reduxjs/toolkit";
import { workspaceSlice } from "./slices/workspaceSlice";
import { userSlice } from "./slices/userSlice";
export const store = configureStore({
  reducer: {
    workspace: workspaceSlice.reducer,
    user: userSlice.reducer,
  },
});
