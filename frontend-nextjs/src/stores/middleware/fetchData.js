import { createAsyncThunk } from "@reduxjs/toolkit";
import { getWorkspace } from "@/services/workspaceApi";

export const fetchData = createAsyncThunk("workspace/fetchData", async () => {
  try {
    const workspaces = await getWorkspace();
    return workspaces;
  } catch (error) {
    throw Error("Failed to fetch workspace data");
  }
});
