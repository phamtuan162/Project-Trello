import { createAsyncThunk } from "@reduxjs/toolkit";
import { getWorkspace } from "@/apis";
export const fetchData = createAsyncThunk("fetchData", async () => {
  const data = await getWorkspace();
  return data;
});
