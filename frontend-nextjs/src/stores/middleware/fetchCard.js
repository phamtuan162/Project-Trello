import { createAsyncThunk } from "@reduxjs/toolkit";
import { getCardDetail } from "@/services/workspaceApi";
export const fetchCard = createAsyncThunk("card/fetchCard", async (cardId) => {
  try {
    const { data, status } = await getCardDetail(cardId);
    if (200 <= status && status <= 299) {
      return data;
    }
  } catch (error) {
    throw Error("Failed to fetch workspace data");
  }
});
