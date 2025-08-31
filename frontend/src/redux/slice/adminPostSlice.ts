import { createSlice } from "@reduxjs/toolkit";
import { u } from "framer-motion/client";


const adminPostSlice = createSlice({
  name: "adminPost",
  initialState: {
    getPostAwaitingCensorship: {
      data: [],
      isFetching: false,
      error: false,
      success: false,
    },
    getCenterPostById: {
      data: null,
      isFetching: false,
      error: false,
      success: false,
    },
    updatePostStatus: {    
        data: null,
        isFetching: false,
        error: false,
        success: false,
    },

  },
  reducers: {
    getPostAwaitingCensorshipStart: (state) => {
      state.getPostAwaitingCensorship.isFetching = true;
      state.getPostAwaitingCensorship.error = false;
      state.getPostAwaitingCensorship.success = false;
    },
    getPostAwaitingCensorshipSuccess: (state, action) => {
      state.getPostAwaitingCensorship.isFetching = false;
      state.getPostAwaitingCensorship.error = false;
      state.getPostAwaitingCensorship.success = true;
      state.getPostAwaitingCensorship.data = action.payload;
    },
    getPostAwaitingCensorshipFailure: (state) => {
      state.getPostAwaitingCensorship.isFetching = false;
      state.getPostAwaitingCensorship.error = true;
      state.getPostAwaitingCensorship.success = false;
    },
    getCenterPostByIdStart: (state) => {
      state.getCenterPostById.isFetching = true;
      state.getCenterPostById.error = false;
      state.getCenterPostById.success = false;
    },
    getCenterPostByIdSuccess: (state, action) => {
      state.getCenterPostById.isFetching = false;
      state.getCenterPostById.error = false;
      state.getCenterPostById.success = true;
      state.getCenterPostById.data = action.payload;
    },
    getCenterPostByIdFailure: (state) => {
      state.getCenterPostById.isFetching = false;
      state.getCenterPostById.error = true;
      state.getCenterPostById.success = false;
    },
    updatePostStatusStart: (state) => {
        state.updatePostStatus.isFetching = true;
        state.updatePostStatus.error = false;
        state.updatePostStatus.success = false;
      },
      updatePostStatusSuccess: (state, action) => {
        state.updatePostStatus.isFetching = false;
        state.updatePostStatus.error = false;
        state.updatePostStatus.success = true;
        state.updatePostStatus.data = action.payload;
      },
      updatePostStatusFailure: (state) => {
        state.updatePostStatus.isFetching = false;
        state.updatePostStatus.error = true;
        state.updatePostStatus.success = false;
      },
   
  },
});

export const {
  getPostAwaitingCensorshipStart,
  getPostAwaitingCensorshipSuccess,
  getPostAwaitingCensorshipFailure,
    getCenterPostByIdStart,
    getCenterPostByIdSuccess,
    getCenterPostByIdFailure,
    updatePostStatusStart,
    updatePostStatusSuccess,
    updatePostStatusFailure,
} = adminPostSlice.actions;
export default adminPostSlice.reducer;
