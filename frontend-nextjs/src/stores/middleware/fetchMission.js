import { createAsyncThunk } from "@reduxjs/toolkit";
import { getMissionsApi } from "@/services/workspaceApi";
export const fetchMission = createAsyncThunk(
  "mission/fetchMission",
  async (body) => {
    try {
      const data = await getMissionsApi(body);
      if (data.status === 200) {
        return data.data;
      }
    } catch (error) {
      throw Error("Failed to fetch mission data");
    }
  }
);
