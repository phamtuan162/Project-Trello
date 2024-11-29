import { createAsyncThunk } from "@reduxjs/toolkit";
import { getBoardDetail } from "@/services/workspaceApi";
export const fetchBoard = createAsyncThunk(
  "board/fetchBoard",
  async ({ boardId, router }, { getState }) => {
    try {
      const { data, status } = await getBoardDetail(boardId);
      if (200 <= status && status <= 299) {
        return data;
      }
    } catch (error) {
      const user = getState().user.user;
      router.push(`/w/${user.workspace_id_active}/home`);
      console.log(error);
    }
  }
);
