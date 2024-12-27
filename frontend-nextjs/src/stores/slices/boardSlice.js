import { createSlice } from "@reduxjs/toolkit";
import { fetchBoard } from "../middleware/fetchBoard";
import { mapOrder } from "@/utils/sorts";
import { isEmpty } from "lodash";
import { generatePlaceholderCard } from "@/utils/formatters";
import { socket } from "@/socket";
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
    clearBoard: (state, action) => {
      socket.emit("outBoard", state.board.id);
      state.board = null;
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

        socket.emit("updateBoard", state.board);
      }
    },

    deleteCardInBoard: (state, action) => {
      const incomingCard = action.payload;

      const column = state.board.columns.find(
        (c) => c.id === incomingCard.column_id
      );

      if (column) {
        column.cards = column.cards.filter((c) => c.id !== incomingCard.id);

        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)];
        }

        column.cardOrderIds = column.cards.map((c) => c.id);
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

    updateActivitiesOfCardInBoard: (state, action) => {
      const { card_id, column_id, activity } = action.payload;

      const column = state.board.columns.find((c) => c.id === column_id);

      if (column) {
        const card = column.cards.find((c) => c.id === card_id);

        if (card) {
          if (Array.isArray(card.activities)) {
            card.activities.push(activity);
          } else {
            card.activities = [activity];
          }
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

        socket.emit("updateBoard", state.board);
      }
    },

    createColumnInBoard: (state, action) => {
      const incomingColumn = action.payload;
      const placeholderCard = generatePlaceholderCard(incomingColumn);

      incomingColumn.cards = [placeholderCard];
      incomingColumn.cardOrderIds = [placeholderCard.id];

      if (Array.isArray(state.board.columns)) {
        state.board.columns.push(incomingColumn);
      } else {
        state.board.columns = [incomingColumn];
      }

      state.board.columnOrderIds = state.board.columns.map((c) => c.id);

      socket.emit("updateBoard", state.board);
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

      socket.emit("updateBoard", state.board);
    },
    deleteColumnInBoard: (state, action) => {
      if (action.payload) {
        state.board.columns = state.board.columns.filter(
          (c) => +c.id !== +action.payload
        );
        state.board.columnOrderIds = state.board.columns.map((c) => c.id);
        socket.emit("updateBoard", state.board);
      }
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
              const placeholderCard = generatePlaceholderCard(column);
              column.cards = [placeholderCard];
              column.cardOrderIds = [placeholderCard.id];
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
