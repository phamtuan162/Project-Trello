import { createAsyncThunk } from "@reduxjs/toolkit";
import { getWorkspace } from "@/apis";

export const fetchData = createAsyncThunk("workspace/fetchData", async () => {
  try {
    const data = await getWorkspace();
    return data.data;
  } catch (error) {
    throw Error("Failed to fetch workspace data");
  }
});
