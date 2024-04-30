import { createSlice } from "@reduxjs/toolkit";
import { fetchMission } from "../middleware/fetchMission";
const initialState = {
  missions: [],
  status: "idle",
};
export const missionSlice = createSlice({
  name: "mission",
  initialState,
  reducers: {
    updateMission: (state, action) => {
      state.missions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMission.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchMission.fulfilled, (state, action) => {
        if (action.payload) {
          state.missions = action.payload;
          state.status = "success";
        }
      })
      .addCase(fetchMission.rejected, (state) => {
        state.status = "error";
      });
  },
});
