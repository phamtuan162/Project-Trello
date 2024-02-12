import { configureStore } from "@reduxjs/toolkit";
import { taskSlice } from "./slices/taskSlice";
const rootReducer = {
  reducer: {
    task: taskSlice.reducer,
  },
};

export const store = configureStore(rootReducer);
