import { createSlice } from "@reduxjs/toolkit";
import { fetchNotification } from "../middleware/fetchNotification";

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
    createNotification: (state, action) => {
      if (Array.isArray(state.notifications)) {
        state.notifications.unshift(action.payload);
      } else {
        state.notifications = [action.payload];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotification.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchNotification.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.notifications = action.payload;
        } else {
          state.notifications = [action.payload];
        }
      })
      .addCase(fetchNotification.rejected, (state) => {
        state.status = "error";
      });
  },
});
