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
        },
        getPostValidById:{
             data:null,
            isFetching: false,
            error: false,
            success: false,
        },
        deletePostByUser:{
            data:null,
            isFetching: false,
            error: false,
            success: false,
        },
        getHeartbyPostId:{
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
        //get post valid by id
         getPostValidByIdStart:(state) => {
            state.getPostValidById.data=null;
            state.getPostValidById.isFetching = true;
            state.getPostValidById.error= false;
            state.getPostValidById.success= false;
        },
        getPostValidByIdSuccess:(state,action) => {
            state.getPostValidById.data=action.payload;
            state.getPostValidById.isFetching = false;
            state.getPostValidById.error= false;
            state.getPostValidById.success= true;
        },
        getPostValidByIdFailure:(state) => {
            state.getPostValidById.data=null;
            state.getPostValidById.isFetching = false;
            state.getPostValidById.error= true;
            state.getPostValidById.success= false;
        },
        //delete ppost
          deletePostByUserStart:(state) => {
            state.deletePostByUser.data=null;
            state.deletePostByUser.isFetching = true;
            state.deletePostByUser.error= false;
            state.deletePostByUser.success= false;
        },
        deletePostByUserSuccess:(state,action) => {
            state.deletePostByUser.data=action.payload;
            state.deletePostByUser.isFetching = false;
            state.deletePostByUser.error= false;
            state.deletePostByUser.success= true;
        },
        deletePostByUserFailure:(state) => {
            state.deletePostByUser.data=null;
            state.deletePostByUser.isFetching = false;
            state.deletePostByUser.error= true;
            state.deletePostByUser.success= false;
        },
        getHeartbyPostIdStart:(state) => {
            state.getHeartbyPostId.data=null;
            state.getHeartbyPostId.isFetching = true;
            state.getHeartbyPostId.error= false;
            state.getHeartbyPostId.success= false;
        },
        getHeartbyPostIdSuccess:(state,action) => {
            state.getHeartbyPostId.data=action.payload;
            state.getHeartbyPostId.isFetching = false;
            state.getHeartbyPostId.error= false;
            state.getHeartbyPostId.success= true;
        },
        getHeartbyPostIdFailure:(state) => {
            state.getHeartbyPostId.data=null;
            state.getHeartbyPostId.isFetching = false;
            state.getHeartbyPostId.error= true;
            state.getHeartbyPostId.success= false;
        },
    }
})

export const {
   getListPostFailure,
   getListPostStart,
   getListPostSuccess,
   createPostFailure,
   createPostStart,
   createPostSuccess,
   getPostValidByIdFailure,
   getPostValidByIdStart,
   getPostValidByIdSuccess,
   deletePostByUserFailure,
   deletePostByUserStart,
   deletePostByUserSuccess,
   getHeartbyPostIdFailure,
   getHeartbyPostIdStart,
   getHeartbyPostIdSuccess,
} = postSlice.actions;
export default postSlice.reducer;
