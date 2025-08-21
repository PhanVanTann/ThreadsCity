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
    }
})

export const {
   getListPostFailure,
   getListPostStart,
   getListPostSuccess
} = postSlice.actions;
export default postSlice.reducer;
