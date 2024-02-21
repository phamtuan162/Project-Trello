import { configureStore } from "@reduxjs/toolkit";
import { workspaceSlice } from "./slices/workspaceSlice";

export const store = configureStore({
  reducer: {
    workspace: workspaceSlice.reducer,
  },
});
