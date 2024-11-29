import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProfileApi } from "@/services/authApi";

export const fetchProfileUser = createAsyncThunk(
  "user/fetchProfileUser",
  async () => {
    try {
      const { data, status } = await getProfileApi();
      if (200 <= status && status <= 299) {
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  }
);
