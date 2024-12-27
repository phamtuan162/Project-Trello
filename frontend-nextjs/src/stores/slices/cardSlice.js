import { createSlice } from "@reduxjs/toolkit";
import { fetchCard } from "../middleware/fetchCard";
const initialState = {
  card: null,
  status: "idle",
  isShowModalActiveCard: false,
};

export const cardSlice = createSlice({
  name: "card",
  initialState,
  reducers: {
    selectCard: (state, action) => {
      if (action.payload) {
        state.card = action.payload;
      }
    },

    showModalActiveCard: (state, action) => {
      state.isShowModalActiveCard = true;
    },

    clearAndHideCard: (state, action) => {
      state.isShowModalActiveCard = false;
      state.card = null;
    },

    updateActivityInCard: (state, action) => {
      if (state.card?.activities?.length > 0) {
        state.card.activities.push(action.payload);
      } else {
        state.card.activities = [action.payload];
      }

      socket.emit("updateCard", {
        id: state.card.id,
        column_id: state.card.column_id,
        activities: state.card.activities,
      });
    },
    updateCard: (state, action) => {
      if (action.payload) {
        Object.entries(action.payload).forEach(([key, value]) => {
          if (value !== undefined && key !== "id") state.card[key] = value;
        });
      }
    },

    createCommentInCard: (state, action) => {
      if (state.card?.comments?.length > 0) {
        state.card.comments.push(action.payload);
      } else {
        state.card.comments = [action.payload];
      }

      socket.emit("updateCard", {
        id: state.card.id,
        column_id: state.card.column_id,
        comments: state.card.comments,
      });
    },

    createWorkInCard: (state, action) => {
      if (state.card?.works?.length > 0) {
        state.card.works.push(action.payload);
      } else {
        state.card.works = [action.payload];
      }

      socket.emit("updateCard", {
        id: state.card.id,
        column_id: state.card.column_id,
        works: state.card.works,
      });
    },
    updateWorkInCard: (state, action) => {
      const incomingWork = action.payload;

      const work = state.card.works.find((w) => w.id === incomingMission.id);

      if (work) {
        Object.entries(incomingWork).forEach(([key, value]) => {
          if (value !== undefined && key !== "id") work[key] = value;
        });

        socket.emit("updateCard", {
          id: state.card.id,
          column_id: state.card.column_id,
          works: state.card.works,
        });
      }
    },

    createMissionInCard: (state, action) => {
      const incomingMission = action.payload;

      const work = state.card.works.find(
        (w) => w.id === incomingMission.work_id
      );

      if (work) {
        if (Array.isArray(work.missions)) {
          work.missions.push(incomingMission);
        } else {
          work.missions = [incomingMission];
        }

        socket.emit("updateCard", {
          id: state.card.id,
          column_id: state.card.column_id,
          works: state.card.works,
        });
      }
    },
    updateMissionInCard: (state, action) => {
      const incomingMission = action.payload;

      const work = state.card.works.find(
        (w) => w.id === incomingMission.work_id
      );

      if (work) {
        const mission = work.missions.find((m) => m.id === incomingMission.id);

        if (mission) {
          Object.entries(incomingMission).forEach(([key, value]) => {
            if (value !== undefined && key !== "id") mission[key] = value;
          });

          socket.emit("updateCard", {
            id: state.card.id,
            column_id: state.card.column_id,
            works: state.card.works,
          });
        }
      }
    },

    attachmentFileInCard: (state, action) => {
      const incomingAttachment = action.payload;

      if (incomingAttachment) {
        if (Array.isArray(work.attachments)) {
          state.card.attachments.push(incomingAttachment);
        } else {
          state.card.attachments = [incomingAttachment];
        }

        socket.emit("updateCard", {
          id: state.card.id,
          column_id: state.card.column_id,
          attachments: state.card.attachments,
        });
      }
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
