import { createSlice,type PayloadAction } from "@reduxjs/toolkit";

type User = {
  _id: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  // ...các field khác
};

const usersSlice = createSlice({
  name: "user",
  initialState: {
    getUserByCommentId: {
      data: {} as Record<string, User>,   // ✅ map { [commentId]: User }
      isFetching: false,
      error: false,
      success: false,
    },
    getUserById: {
      data: [],   // giữ nguyên cấu trúc cũ
      isFetching: false,
      error: false,
      success: false,
    },
  },
  reducers: {
    // --- getUserById (giữ nguyên) ---
    getUserByIdStart: (state) => {
      state.getUserById.data = [];
      state.getUserById.isFetching = true;
      state.getUserById.error = false;
      state.getUserById.success = false;
    },
    getUserByIdSuccess: (state, action) => {
      state.getUserById.data = action.payload;
      state.getUserById.isFetching = false;
      state.getUserById.error = false;
      state.getUserById.success = true;
    },
    getUserByIdFailure: (state) => {
      state.getUserById.data = [];
      state.getUserById.isFetching = false;
      state.getUserById.error = true;
      state.getUserById.success = false;
    },

    // --- getUserByCommentId (sửa lại) ---
    getUserByCommentIdStart: (state) => {
      state.getUserByCommentId.isFetching = true;
      state.getUserByCommentId.error = false;
      state.getUserByCommentId.success = false;
    },
    getUserByCommentIdSuccess: (
      state,
      action: PayloadAction<{ commentId: string; user: User }>
    ) => {
      const { commentId, user } = action.payload;
      state.getUserByCommentId.data[commentId] = user; // ✅ lưu theo commentId
      state.getUserByCommentId.isFetching = false;
      state.getUserByCommentId.error = false;
      state.getUserByCommentId.success = true;
    },
    getUserByCommentIdFailure: (state) => {
      state.getUserByCommentId.isFetching = false;
      state.getUserByCommentId.error = true;
      state.getUserByCommentId.success = false;
    },
  },
});

export const {
  getUserByIdStart,
  getUserByIdSuccess,
  getUserByIdFailure,
  getUserByCommentIdStart,
  getUserByCommentIdSuccess,
  getUserByCommentIdFailure,
} = usersSlice.actions;

export default usersSlice.reducer;
