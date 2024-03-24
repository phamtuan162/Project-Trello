import { createAsyncThunk } from "@reduxjs/toolkit";
import { getWorkspaceDetail } from "@/services/workspaceApi";

export const fetchWorkspace = createAsyncThunk(
  "workspace/fetchData",
  async (workspaceId) => {
    try {
      const workspace = await getWorkspaceDetail(workspaceId);
      return workspace;
    } catch (error) {
      throw Error("Failed to fetch workspace data");
    }
  }
);
