import { createAsyncThunk } from "@reduxjs/toolkit";
import { getBoardDetail } from "@/services/workspaceApi";
import { socket } from "@/socket";
export const fetchBoard = createAsyncThunk(
  "board/fetchBoard",
  async ({ boardId, router }, { getState }) => {
    try {
      const { data } = await getBoardDetail(boardId);
      socket.emit("visitBoard", data.id);
      return data;
    } catch (error) {
      const user = getState().user?.user;
      if (user?.workspace_id_active)
        router.push(`/w/${user.workspace_id_active}/home`);
    }
  }
);
