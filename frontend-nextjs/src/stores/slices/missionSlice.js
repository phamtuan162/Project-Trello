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
    updateMissionInMissions: (state, action) => {
      const incomingMission = action.payload;

      const mission = state.missions.find((m) => m.id === incomingMission.id);

      if (mission) {
        Object.entries(incomingMission).forEach(([key, value]) => {
          if (value !== undefined && key !== "id") mission[key] = value;
        });
      }
    },
    createMissionInMissions: (state, action) => {
      if (Array.isArray(state?.missions)) {
        state.missions.push(action.payload);
      } else {
        state.missions = [action.payload];
      }
    },
    deleteMissionInMissions: (state, action) => {
      state.missions = state.missions.filter((m) => m.id !== action.payload.id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMission.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchMission.fulfilled, (state, action) => {
        if (action.payload) {
          if (Array.isArray(action.payload)) {
            state.missions = action.payload;
          } else {
            state.missions = [action.payload];
          }
          state.status = "success";
        }
      })
      .addCase(fetchMission.rejected, (state) => {
        state.status = "error";
      });
  },
});
