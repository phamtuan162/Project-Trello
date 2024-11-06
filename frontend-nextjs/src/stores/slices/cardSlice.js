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
    createComment: (state, action) => {
      state.card.comments = [action.payload, ...state.card.comments];
    },
    updateComment: (state, action) => {
      const { content, id } = action.payload;

      const commentsUpdate = state.card.comments.map((comment) => {
        if (+comment.id === +id) {
          return { ...comment, content: content, isEdit: true };
        }
        return comment;
      });

      state.card.comments = commentsUpdate;
    },
    deleteComment: (state, action) => {
      const commentsUpdate = state.card.comments.filter(
        (comment) => +comment.id !== +action.payload.id
      );

      state.card.comments = commentsUpdate;
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
