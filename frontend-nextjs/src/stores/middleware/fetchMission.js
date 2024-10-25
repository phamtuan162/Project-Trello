import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMissionsApi } from "@/services/workspaceApi";
export const fetchMission = createAsyncThunk(
  "mission/fetchMission",
  async (body) => {
    try {
      const { data, status } = await getMissionsApi(body);
      if (200 <= status && status <= 299) {
        return data;
      }
    } catch (error) {
      throw Error("Failed to fetch mission data");
    }
  }
);
