import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getBoardDetail } from "@/services/workspaceApi";
export const fetchBoard = createAsyncThunk(
  "board/fetchBoard",
  async ({ boardId, router }, { getState }) => {
    try {
      const { data, status, message } = await getBoardDetail(boardId);
      if (200 <= status && status <= 299) {
        return data;
      } else {
        toast.error(message);
        const user = getState().user.user;
        router.push(`/w/${user.workspace_id_active}/home`);
      }
    } catch (error) {
      throw Error("Failed to fetch workspace data");
    }
  }
);
