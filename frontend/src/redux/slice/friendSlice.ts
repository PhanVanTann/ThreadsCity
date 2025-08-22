import { createSlice } from "@reduxjs/toolkit";
import { tr } from "framer-motion/client";

const friendSlice = createSlice({
    name:"friend",
    initialState:{
        getlistFriend:{
            data:[],
            isFetching: false,
            error: false,
            success: false,
        },
        getFollowsByUserId:{
            data:[],
            isFetching: false,
            error: false,
            success: false,
        }
    },
    reducers:{
        getlistFriendStart:(state) => {
            state.getlistFriend.data=[];
            state.getlistFriend.isFetching = true;
            state.getlistFriend.error= false;
            state.getlistFriend.success= false;
        },
        getlistFriendSuccess:(state,action) => {
            state.getlistFriend.data=action.payload;
            state.getlistFriend.isFetching = false;
            state.getlistFriend.error= false;
            state.getlistFriend.success= true;
        },
        getlistFriendFailure:(state) => {
            state.getlistFriend.data=[];
            state.getlistFriend.isFetching = false;
            state.getlistFriend.error= true;
            state.getlistFriend.success= false;
        },
         getFollowsByUserIdStart:(state) => {
            state.getFollowsByUserId.data=[];
            state.getFollowsByUserId.isFetching = true;
            state.getFollowsByUserId.error= false;
            state.getFollowsByUserId.success= false;
        },
        getFollowsByUserIdSuccess:(state,action) => {
            state.getFollowsByUserId.data=action.payload;
            state.getFollowsByUserId.isFetching = false;
            state.getFollowsByUserId.error= false;
            state.getFollowsByUserId.success= true;
        },
        getFollowsByUserIdFailure:(state) => {
            state.getFollowsByUserId.data=[];
            state.getFollowsByUserId.isFetching = false;
            state.getFollowsByUserId.error= true;
            state.getFollowsByUserId.success= false;
        },

    },

})

export const {
    getlistFriendStart,
    getlistFriendSuccess,
    getlistFriendFailure,
    getFollowsByUserIdFailure,
    getFollowsByUserIdStart,
    getFollowsByUserIdSuccess
} = friendSlice.actions;
export default friendSlice.reducer;
