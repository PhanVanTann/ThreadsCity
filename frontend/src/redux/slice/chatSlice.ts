import { createSlice } from "@reduxjs/toolkit";
import { tr } from "framer-motion/client";

const chatSlice = createSlice({
    name:"chat",
    initialState:{
        createRoomChat:{
            data:null,
            isFetching: false,
            error: false,
            success: false,
        },
        getHistoryChatUser:{
            data:null,
            isFetching: false,
            error: false,
            success: false,
        },
        getHistoryChatReceiver:{
            data:null,
            isFetching: false,
            error: false,
            success: false,
        },
        createMessage:{
            data:null,
            isFetching: false,
            error: false,
            success: false,
        }
    },
    reducers:{
        createRoomChatStart:(state) => {
            state.createRoomChat.data=null;
            state.createRoomChat.isFetching = true;
            state.createRoomChat.error= false;
            state.createRoomChat.success= false;
        },
        createRoomChatSuccess:(state,action) => {
            state.createRoomChat.data=action.payload;
            state.createRoomChat.isFetching = false;
            state.createRoomChat.error= false;
            state.createRoomChat.success= true;
        },
        createRoomChatFailure:(state) => {
            state.createRoomChat.data=null;
            state.createRoomChat.isFetching = false;
            state.createRoomChat.error= true;
            state.createRoomChat.success= false;
        },
        //history chat user
         getHistoryChatUserStart:(state) => {
            state.getHistoryChatUser.data=null;
            state.getHistoryChatUser.isFetching = true;
            state.getHistoryChatUser.error= false;
            state.getHistoryChatUser.success= false;
        },
        getHistoryChatUserSuccess:(state,action) => {
            state.getHistoryChatUser.data=action.payload;
            state.getHistoryChatUser.isFetching = false;
            state.getHistoryChatUser.error= false;
            state.getHistoryChatUser.success= true;
        },
        getHistoryChatUserFailure:(state) => {
            state.getHistoryChatUser.data=null;
            state.getHistoryChatUser.isFetching = false;
            state.getHistoryChatUser.error= true;
            state.getHistoryChatUser.success= false;
        },
        //history chat receiver
        getHistoryChatReceiverStart:(state) => {
            state.getHistoryChatReceiver.data=null;
            state.getHistoryChatReceiver.isFetching = true;
            state.getHistoryChatReceiver.error= false;
            state.getHistoryChatReceiver.success= false;
        },
        getHistoryChatReceiverSuccess:(state,action) => {
            state.getHistoryChatReceiver.data=action.payload;
            state.getHistoryChatReceiver.isFetching = false;
            state.getHistoryChatReceiver.error= false;
            state.getHistoryChatReceiver.success= true;
        },
        getHistoryChatReceiverFailure:(state) => {
            state.getHistoryChatReceiver.data=null;
            state.getHistoryChatReceiver.isFetching = false;
            state.getHistoryChatReceiver.error= true;
            state.getHistoryChatReceiver.success= false;
        },
        //create messs
        createMessageStart:(state) => {
            state.createMessage.data=null;
            state.createMessage.isFetching = true;
            state.createMessage.error= false;
            state.createMessage.success= false;
        },
        createMessageSuccess:(state,action) => {
            state.createMessage.data=action.payload;
            state.createMessage.isFetching = false;
            state.createMessage.error= false;
            state.createMessage.success= true;
        },
        createMessageFailure:(state) => {
            state.createMessage.data=null;
            state.createMessage.isFetching = false;
            state.createMessage.error= true;
            state.createMessage.success= false;
        },
    },

})

export const {
    createRoomChatStart,
    createRoomChatSuccess,
    createRoomChatFailure,
    getHistoryChatUserStart,
    getHistoryChatUserSuccess,
    getHistoryChatUserFailure,
    getHistoryChatReceiverFailure,
    getHistoryChatReceiverStart,
    getHistoryChatReceiverSuccess,
    createMessageFailure,
    createMessageStart,
    createMessageSuccess
} = chatSlice.actions;
export default chatSlice.reducer;
