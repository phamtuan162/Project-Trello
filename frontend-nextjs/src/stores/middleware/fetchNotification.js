import { createAsyncThunk } from "@reduxjs/toolkit";
import { getNotificationsApi } from "@/services/notifyApi";
export const fetchNotification = createAsyncThunk(
  "notification/fetchNotification",
  async (body) => {
    try {
      const { data, status } = await getNotificationsApi(body);
      if (200 <= status && status <= 299) {
        return data;
      }
    } catch (error) {
      throw Error("Failed to fetch notification data");
    }
  }
);
