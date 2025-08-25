import { createSlice } from "@reduxjs/toolkit";
import { tr } from "framer-motion/client";

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

    },

})

export const {
    getUserByIdStart,
    getUserByIdSuccess,
    getUserByIdFailure,
    getListUserFailure,
    getListUserStart,
    getListUserSuccess
} = usersSlice.actions;
export default usersSlice.reducer;
