import { createAsyncThunk } from "@reduxjs/toolkit";
import { getWorkspaceDetail } from "@/services/workspaceApi";
import { toast } from "react-toastify";
export const fetchWorkspace = createAsyncThunk(
  "workspace/fetchData",
  async (workspaceId) => {
    try {
      const data = await getWorkspaceDetail(workspaceId);
      if (data.status === 200) {
        return data.data;
      }
    } catch (error) {
      throw Error("Failed to fetch workspace data");
    }
  }
);
