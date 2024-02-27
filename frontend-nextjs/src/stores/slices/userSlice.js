import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  status: "idle",
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.user = action.payload;
    },
  },
  //   extraReducers: (builder) => {
  //     builder
  //       .addCase(fetchData.pending, (state) => {
  //         state.status = "pending";
  //       })
  //       .addCase(fetchData.fulfilled, (state, action) => {
  //         if (action.payload) {
  //           state.workspaces = action.payload;
  //           state.status = "success";
  //         }
  //       })
  //       .addCase(fetchData.rejected, (state) => {
  //         state.status = "error";
  //       });
  //   },
});
