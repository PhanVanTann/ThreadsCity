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
        },
        getFollowerByUserId:{
            data:[],
            isFetching: false,
            error: false,
            success: false,
        }
        ,
        createFollowUser:{
            data:null,
            isFetching: false,
            error: false,
            success: false,
        },
        isFriendUser:{
            data:null,
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
         getFollowerByUserIdStart:(state) => {
            state.getFollowerByUserId.data=[];
            state.getFollowerByUserId.isFetching = true;
            state.getFollowerByUserId.error= false;
            state.getFollowerByUserId.success= false;
        },
        getFollowerByUserIdSuccess:(state,action) => {
            state.getFollowerByUserId.data=action.payload;
            state.getFollowerByUserId.isFetching = false;
            state.getFollowerByUserId.error= false;
            state.getFollowerByUserId.success= true;
        },
        getFollowerByUserIdFailure:(state) => {
            state.getFollowerByUserId.data=[];
            state.getFollowerByUserId.isFetching = false;
            state.getFollowerByUserId.error= true;
            state.getFollowerByUserId.success= false;
        },
         createFollowUserStart:(state) => {
            state.createFollowUser.data=null;
            state.createFollowUser.isFetching = true;
            state.createFollowUser.error= false;
            state.createFollowUser.success= false;
        },
        createFollowUserSuccess:(state,action) => {
            state.createFollowUser.data=action.payload;
            state.createFollowUser.isFetching = false;
            state.createFollowUser.error= false;
            state.createFollowUser.success= true;
        },
        createFollowUserFailure:(state) => {
            state.createFollowUser.data=null;
            state.createFollowUser.isFetching = false;
            state.createFollowUser.error= true;
            state.createFollowUser.success= false;
        },

        isFriendUserStart:(state) => {
            state.isFriendUser.data=null;
            state.isFriendUser.isFetching = true;
            state.isFriendUser.error= false;
            state.isFriendUser.success= false;
        },
        isFriendUserSuccess:(state,action) => {
            state.isFriendUser.data=action.payload;
            state.isFriendUser.isFetching = false;
            state.isFriendUser.error= false;
            state.isFriendUser.success= true;
        },
        isFriendUserFailure:(state) => {
            state.isFriendUser.data=null;
            state.isFriendUser.isFetching = false;
            state.isFriendUser.error= true;
            state.isFriendUser.success= false;
        },
        

    },

})

export const {
    getlistFriendStart,
    getlistFriendSuccess,
    getlistFriendFailure,
    getFollowsByUserIdFailure,
    getFollowsByUserIdStart,
    getFollowsByUserIdSuccess,
    createFollowUserFailure,
    createFollowUserStart,
    createFollowUserSuccess,
    getFollowerByUserIdFailure,
    getFollowerByUserIdStart,
    getFollowerByUserIdSuccess,
    isFriendUserFailure,
    isFriendUserStart,
    isFriendUserSuccess
} = friendSlice.actions;
export default friendSlice.reducer;
