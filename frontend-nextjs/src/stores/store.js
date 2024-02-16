import { configureStore } from "@reduxjs/toolkit";
import { workspaceSlice } from "./slices/workspaceSlice";
const rootReducer = {
  reducer: {
    workspace: workspaceSlice.reducer,
  },
};

export const store = configureStore(rootReducer);
