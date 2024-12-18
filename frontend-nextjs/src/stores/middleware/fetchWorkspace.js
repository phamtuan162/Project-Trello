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
      if (error?.response?.status === 404 && error?.response?.workspace_id) {
        window.location.href = `/w/${error.response.workspace_id}/home`;
      }
      console.log(error);
    }
  }
);
