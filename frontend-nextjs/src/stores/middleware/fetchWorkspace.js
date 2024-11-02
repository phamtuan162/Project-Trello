import { createAsyncThunk } from "@reduxjs/toolkit";
import { getWorkspaceDetail } from "@/services/workspaceApi";
export const fetchWorkspace = createAsyncThunk(
  "workspace/fetchData",
  async (workspaceId) => {
    try {
      const { data, status } = await getWorkspaceDetail(workspaceId);
      if (200 <= status && status <= 299) {
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  }
);
