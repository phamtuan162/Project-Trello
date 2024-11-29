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
    setBoardCurrent: (state, action) => {
      state.board = action.payload;
    },
    updateBoard: (state, action) => {
      // state.board = action.payload;
      if (action.payload) {
        Object.entries(action.payload).forEach(([key, value]) => {
          if (value !== undefined && key !== "id") state.board[key] = value;
        });
      }
    },
    createCardInBoard: (state, action) => {
      const incomingCard = action.payload;

      const column = state.board.columns.find(
        (c) => c.id === incomingCard.column_id
      );

      if (column) {
        const isPlaceholderExist = column.cards.some(
          (card) => card.FE_PlaceholderCard
        );

        if (isPlaceholderExist) {
          column.cards = [incomingCard];
          column.cardOrderIds = [incomingCard.id];
        } else {
          column.cards.push(incomingCard);
          column.cardOrderIds.push(incomingCard.id);
        }
      }
    },

    deleteCardInBoard: (state, action) => {
      const incomingCard = action.payload;

      const column = state.board.columns.find(
        (c) => c.id === incomingCard.column_id
      );

      if (column) {
        column.cards = column.cards.filter((c) => c.id !== incomingCard.id);
        column.cardOrderIds = column.cardOrderIds.filter(
          (c) => c !== incomingCard.id
        );
      }
    },

    updateCardInBoard: (state, action) => {
      const incomingCard = action.payload;

      const column = state.board.columns.find(
        (c) => c.id === incomingCard.column_id
      );

      if (column) {
        const card = column.cards.find((c) => c.id === incomingCard.id);

        if (card) {
          Object.entries(incomingCard).forEach(([key, value]) => {
            if (value !== undefined && key !== "id") card[key] = value;
          });
        }
      }
    },

    updateColumnInBoard: (state, action) => {
      const incomingColumn = action.payload;

      const column = state.board.columns.find(
        (c) => c.id === incomingColumn.id
      );

      if (column) {
        Object.entries(incomingColumn).forEach(([key, value]) => {
          if (value !== undefined && key !== "id") column[key] = value;
        });
      }
    },

    createColumnInBoard: (state, action) => {
      const incomingColumn = action.payload;
      const placeholderCard = generatePlaceholderCard(incomingColumn);

      incomingColumn.cards = [placeholderCard];
      incomingColumn.cardOrderIds = [placeholderCard.id];

      if (
        Array.isArray(state.board.columns) &&
        Array.isArray(state.board.columnOrderIds)
      ) {
        state.board.columns.push(incomingColumn);
        state.board.columnOrderIds.push(incomingColumn.id);
      } else {
        state.board.columns = [incomingColumn];
        state.board.columnOrderIds = [incomingColumn.id];
      }
    },

    copyColumnInBoard: (state, action) => {
      const incomingColumn = action.payload;

      incomingColumn.cards = mapOrder(
        incomingColumn.cards,
        incomingColumn.cardOrderIds,
        "id"
      );

      state.board.columns.push(incomingColumn);
      state.board.columnOrderIds.push(incomingColumn.id);
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
