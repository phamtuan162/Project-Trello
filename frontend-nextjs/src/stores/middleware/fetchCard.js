import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getCardDetail } from "@/services/workspaceApi";
export const fetchCard = createAsyncThunk(
  "workspace/fetchCard",
  async (cardId) => {
    try {
      const data = await getCardDetail(cardId);
      if (data.status === 200) {
        return data.data;
      }
    } catch (error) {
      throw Error("Failed to fetch workspace data");
    }
  }
);
