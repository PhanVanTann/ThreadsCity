import { createSlice } from "@reduxjs/toolkit";
import { register } from "module";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    // Login state
    login: {
      currentUser: null as { isVerified?: boolean } | null,
      isFetching: false,
      error: false,
      success: false,
    },
    // Logout state
    logout: {
      isFetching: false,
      error: false,
      success: false,
    },
    // register state
    register: {
      isFetching: false,
      error: false,
      success: false,
    },
  },
  reducers: {
    // Login actions
    loginStart: (state) => {
      state.login.isFetching = true;
      state.login.error = false;
      state.login.success = false;
    },
    loginSuccess: (state, action) => {
      state.login.isFetching = false;
      state.login.error = false;
      state.login.success = true;
      state.login.currentUser = action.payload;
    },
    loginFailure: (state) => {
      state.login.isFetching = false;
      state.login.error = true;
      state.login.success = false;
    },
    // Logout actions
    logoutStart: (state) => {
      state.logout.isFetching = true;
      state.logout.error = false;
      state.logout.success = false;
    },
    logoutSuccess: (state) => {
      state.logout.isFetching = false;
      state.logout.error = false;
      state.logout.success = true;
    },
    logoutFailure: (state) => {
      state.logout.isFetching = false;
      state.logout.error = true;
      state.logout.success = false;
    },
    // register actions
    registerStart: (state) => {
      state.register.isFetching = true;
      state.register.error = false;
      state.register.success = false;
    },
    registerSuccess: (state) => {
      state.register.isFetching = false;
      state.register.error = false;
      state.register.success = true;
    },
    registerFailure: (state) => {
      state.register.isFetching = false;
      state.register.error = true;
      state.register.success = false;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutStart,
  logoutSuccess,
  logoutFailure,
  registerStart,
  registerSuccess,
  registerFailure,
} = authSlice.actions;
export default authSlice.reducer;
