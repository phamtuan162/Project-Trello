import { createSlice } from "@reduxjs/toolkit";
import { fetchCard } from "../middleware/fetchCard";
const initialState = {
  card: {},
  status: "idle",
};

export const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    updateCard: (state, action) => {
      state.card = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCard.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchCard.fulfilled, (state, action) => {
        if (action.payload) {
          state.card = action.payload;
          state.status = "success";
        }
      })
      .addCase(fetchCard.rejected, (state) => {
        state.status = "error";
      });
  },
});
