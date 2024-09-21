import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  status: "idle",
};
export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    updateNotification: (state, action) => {
      state.notifications = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];
    },
  },
});
