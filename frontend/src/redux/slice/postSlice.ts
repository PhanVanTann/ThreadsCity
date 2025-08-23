import { createSlice } from "@reduxjs/toolkit";
import { tr } from "framer-motion/client";

const postSlice = createSlice({
    name:"post",
    initialState:{
        getListPost:{
            data:null,
            isFetching: false,
            error: false,
            success: false,
        },
        createPost:
        {
            data:null,
            isFetching: false,
            error: false,
            success: false,
        }
    },
    reducers:{
        getListPostStart:(state) => {
            state.getListPost.data=null;
            state.getListPost.isFetching = true;
            state.getListPost.error= false;
            state.getListPost.success= false;
        },
        getListPostSuccess:(state,action) => {
            state.getListPost.data=action.payload;
            state.getListPost.isFetching = false;
            state.getListPost.error= false;
            state.getListPost.success= true;
        },
        getListPostFailure:(state) => {
            state.getListPost.data=null;
            state.getListPost.isFetching = false;
            state.getListPost.error= true;
            state.getListPost.success= false;
        },
        // create post
        createPostStart:(state) => {
            state.createPost.data=null;
            state.createPost.isFetching = true;
            state.createPost.error= false;
            state.createPost.success= false;
        },
        createPostSuccess:(state,action) => {
            state.createPost.data=action.payload;
            state.createPost.isFetching = false;
            state.createPost.error= false;
            state.createPost.success= true;
        },
        createPostFailure:(state) => {
            state.createPost.data=null;
            state.createPost.isFetching = false;
            state.createPost.error= true;
            state.createPost.success= false;
        },
    }
})

export const {
   getListPostFailure,
   getListPostStart,
   getListPostSuccess,
   createPostFailure,
   createPostStart,
   createPostSuccess
} = postSlice.actions;
export default postSlice.reducer;
