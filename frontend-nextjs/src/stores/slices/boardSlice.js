import { createSlice } from "@reduxjs/toolkit";
import { fetchBoard } from "../middleware/fetchBoard";
import { mapOrder } from "@/utils/sorts";
import { isEmpty } from "lodash";
import { generatePlaceholderCard } from "@/utils/formatters";
const initialState = {
  board: {},
  status: "idle",
};
export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    updateBoard: (state, action) => {
      state.board = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoard.pending, (state) => {
        state.status = "pending";
      })
      .addCase(fetchBoard.fulfilled, (state, action) => {
        if (action.payload) {
          let board = action.payload;
          board.columns = mapOrder(board.columns, board.columnOrderIds, "id");

          board.columns.forEach((column) => {
            if (isEmpty(column.cards)) {
              column.cards = [generatePlaceholderCard(column)];
              column.cardOrderIds = [generatePlaceholderCard(column).id];
            } else {
              column.cards = mapOrder(column.cards, column.cardOrderIds, "id");
            }
          });
          state.board = board;
          state.status = "success";
        }
      })
      .addCase(fetchBoard.rejected, (state) => {
        state.status = "error";
      });
  },
});
