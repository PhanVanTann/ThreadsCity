import { createSlice } from "@reduxjs/toolkit";
type Post = any;

const postSlice = createSlice({
    name:"post",
    initialState:{
        getListPost:{
            data:[] as Post[],
            nextCursor: null,
            isFetching: false,
            error: false,
            success: false,
            done: false, 
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
        },
        getPostById:{
            data:null,
            isFetching: false,
            error: false,
            success: false,
        },
    },
    reducers:{
        getListPostStart:(state) => {
            state.getListPost.isFetching = true;
            state.getListPost.error= false;
            state.getListPost.success= false;
        },
        resetListPost: (state) => {
            state.getListPost.data = [];
            state.getListPost.nextCursor = null;
            state.getListPost.done = false;
            state.getListPost.isFetching = false;
            state.getListPost.error = false;
            state.getListPost.success = false;
            },
        getListPostSuccess: (state, action) => {
            const incoming = Array.isArray(action.payload?.data) ? action.payload.data : [];
            const list = state.getListPost.data;
            const ids = new Set(list.map((x:any)=>x._id));
            for (const it of incoming) if (!ids.has(it._id)) list.push(it);
            let next = action.payload?.nextCursor ?? null;

            if (!next && incoming.length > 0) {
                const last = incoming[incoming.length - 1];
                next = last?.created_at
                ? new Date(last.created_at).toISOString()
                : (last?._id ?? null);
            }
            if (next === state.getListPost.nextCursor) {
                state.getListPost.done = true;
            }

            state.getListPost.nextCursor = next;
            state.getListPost.isFetching = false;
            state.getListPost.error = false;
            state.getListPost.success = true;

            // Hết dữ liệu nếu batch rỗng hoặc next null
            if (incoming.length === 0 || next == null) state.getListPost.done = true;
            },
        getListPostFailure:(state) => {
            state.getListPost.data=[];
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
        getPostByIdStart:(state) => {
            state.getPostById.data=null;
            state.getPostById.isFetching = true;
            state.getPostById.error= false;
            state.getPostById.success= false;
        },
        getPostByIdSuccess:(state,action) => {
            state.getPostById.data=action.payload;
            state.getPostById.isFetching = false;
            state.getPostById.error= false;
            state.getPostById.success= true;
        },
        getPostByIdFailure:(state) => {
            state.getPostById.data=null;
            state.getPostById.isFetching = false;
            state.getPostById.error= true;
            state.getPostById.success= false;   
        }
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
    getPostByIdFailure,
    getPostByIdStart,
    getPostByIdSuccess,
    resetListPost
} = postSlice.actions;
export default postSlice.reducer;
