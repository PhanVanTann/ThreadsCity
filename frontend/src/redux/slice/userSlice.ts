import { createSlice,type PayloadAction } from "@reduxjs/toolkit";

type User = {
  _id: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  // ...các field khác
};

const usersSlice = createSlice({
    name:"user",
    initialState:{
        getUserById:{
            data:[],
            isFetching: false,
            error: false,
            success: false,
        },
        getListUser:{
            data:[],
            isFetching: false,
            error: false,
            success: false,
        },
          getUserByCommentId: {
            data: {} as Record<string, User>,  
            isFetching: false,
            error: false,
            success: false,
        
    },
        updateUser:{
            data:null,
            isFetching: false,
            error: false,
            success: false,
        }
    },
    reducers:{
        getUserByIdStart:(state) => {
            state.getUserById.data=[];
            state.getUserById.isFetching = true;
            state.getUserById.error= false;
            state.getUserById.success= false;
        },
        getUserByIdSuccess:(state,action) => {
            state.getUserById.data=action.payload;
            state.getUserById.isFetching = false;
            state.getUserById.error= false;
            state.getUserById.success= true;
        },
        getUserByIdFailure:(state) => {
            state.getUserById.data=[];
            state.getUserById.isFetching = false;
            state.getUserById.error= true;
            state.getUserById.success= false;
        },
        getListUserStart:(state) => {
            state.getListUser.data=[];
            state.getListUser.isFetching = true;
            state.getListUser.error= false;
            state.getListUser.success= false;
        },
        getListUserSuccess:(state,action) => {
            state.getListUser.data=action.payload;
            state.getListUser.isFetching = false;
            state.getListUser.error= false;
            state.getListUser.success= true;
        },
        getListUserFailure:(state) => {
            state.getListUser.data=[];
            state.getListUser.isFetching = false;
            state.getListUser.error= true;
            state.getListUser.success= false;
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

        updateUserStart:(state) => {
            state.updateUser.data=null;
            state.updateUser.isFetching = true;
            state.updateUser.error= false;
            state.updateUser.success= false;
        },
        updateUserSuccess:(state,action) => {
            state.updateUser.data=action.payload;
            state.updateUser.isFetching = false;
            state.updateUser.error= false;
            state.updateUser.success= true;
        },
        updateUserFailure:(state) => {
            state.updateUser.data=null;
            state.updateUser.isFetching = false;
            state.updateUser.error= true;
            state.updateUser.success= false;
        },
  },
});

export const {
    getUserByIdStart,
    getUserByIdSuccess,
    getUserByIdFailure,
    getListUserFailure,
    getListUserStart,
    getListUserSuccess,
    getUserByCommentIdStart,
    getUserByCommentIdSuccess,
    getUserByCommentIdFailure,
    updateUserFailure,
    updateUserStart,
    updateUserSuccess
} = usersSlice.actions;

export default usersSlice.reducer;
