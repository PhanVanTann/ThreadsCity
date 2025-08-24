// redux/slice/commentSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type OnePostComments = {
  data: any | null;          // response từ BE (ví dụ: { success, data: [...] })
  isFetching: boolean;
  error: boolean;
  success: boolean;
  lastFetched?: number;
};

type State = {
  byPost: Record<string, OnePostComments>;
  // giữ lại block "comment" nếu bạn cần cho create comment
  comment: {
    data: any | null;
    isFetching: boolean;
    error: boolean;
    success: boolean;
  };
};

const initialOne: OnePostComments = {
  data: null,
  isFetching: false,
  error: false,
  success: false,
};

const initialState: State = {
  byPost: {},
  comment: { data: null, isFetching: false, error: false, success: false },
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    // GET comments theo post
    getCommentsStart: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      state.byPost[postId] = state.byPost[postId] || { ...initialOne };
      state.byPost[postId].isFetching = true;
      state.byPost[postId].error = false;
      state.byPost[postId].success = false;
    },
    getCommentsSuccess: (
      state,
      action: PayloadAction<{ postId: string; data: any }>
    ) => {
      const { postId, data } = action.payload;
      state.byPost[postId] = state.byPost[postId] || { ...initialOne };
      state.byPost[postId].isFetching = false;
      state.byPost[postId].error = false;
      state.byPost[postId].success = true;
      state.byPost[postId].data = data;
      state.byPost[postId].lastFetched = Date.now();
    },
    getCommentsFailure: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      state.byPost[postId] = state.byPost[postId] || { ...initialOne };
      state.byPost[postId].isFetching = false;
      state.byPost[postId].error = true;
      state.byPost[postId].success = false;
    },

    // OPTIONAL: khi tạo comment xong, thêm ngay vào cache post đó
    appendOneComment: (
      state,
      action: PayloadAction<{ postId: string; comment: any }>
    ) => {
      const { postId, comment } = action.payload;
      const slot = state.byPost[postId];
      if (!slot?.data) return;
      // tuỳ cấu trúc BE: nếu slot.data = { success, data: [...] }
      const arr = Array.isArray(slot.data.data) ? slot.data.data : [];
      slot.data = { ...slot.data, data: [...arr, comment] };
    },

    // block create comment cũ (giữ nếu bạn cần)
    commentStart: (state) => {
      state.comment.isFetching = true;
      state.comment.error = false;
      state.comment.success = false;
    },
    commentSuccess: (state, action) => {
      state.comment.isFetching = false;
      state.comment.error = false;
      state.comment.success = true;
      state.comment.data = action.payload;
    },
    commentFailure: (state) => {
      state.comment.isFetching = false;
      state.comment.error = true;
      state.comment.success = false;
    },
  },
});

export const {
  getCommentsStart,
  getCommentsSuccess,
  getCommentsFailure,
  appendOneComment,
  commentStart,
  commentSuccess,
  commentFailure,
} = commentSlice.actions;

export default commentSlice.reducer;
