import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  columns: [],
  status: "idle",
};
export const columnSlice = createSlice({
  name: "column",
  initialState,
  reducers: {
    updateColumns: (state, action) => {
      state.columns = action.payload;
    },
    updateColumnInColumns: (state, action) => {
      const incomingColumn = action.payload;

      const column = state.columns.find((c) => c.id === incomingColumn.id);
      if (column) {
        Object.entries(action.payload).forEach(([key, value]) => {
          if (value !== undefined && key !== "id") column[key] = value;
        });
      }
    },
    createColumnInColumns: (state, action) => {
      state.columns.push(action.payload);
    },
    createCardInColumns: (state, action) => {
      const incomingCard = action.payload;

      const column = state.columns.find((c) => c.id === incomingCard.column_id);

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
    updateCardInColumns: (state, action) => {
      const incomingCard = action.payload;

      const column = state.columns.find((c) => c.id === incomingCard.column_id);

      if (column) {
        const card = column.cards.find((c) => c.id === incomingCard.id);

        if (card) {
          Object.entries(incomingCard).forEach(([key, value]) => {
            if (value !== undefined && key !== "id") card[key] = value;
          });
        }
      }
    },
  },
});
