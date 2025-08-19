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

    },

})

export const {
    getlistFriendStart,
    getlistFriendSuccess,
    getlistFriendFailure
} = friendSlice.actions;
export default friendSlice.reducer;
