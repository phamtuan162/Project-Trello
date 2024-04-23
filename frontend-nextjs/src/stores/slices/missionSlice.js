import { createSlice } from "@reduxjs/toolkit";

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
});
