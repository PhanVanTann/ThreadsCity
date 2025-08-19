import axiosInstance from "../../axios/axios.interceptor";
import {
  loginFailure,
  loginStart,
  loginSuccess,
  logoutFailure,
  logoutStart,
  logoutSuccess,
  registerFailure,
  registerStart,
  registerSuccess,
} from "../slice/authSlice";

export const loginUser = async (user: any, dispatch: any, navigate: any) => {
  dispatch(loginStart());
  try {
    const res = await axiosInstance.post("/auth/login/", user);
    dispatch(loginSuccess(res.data));
    navigate("/home");
  } catch (err: any) {
    console.error("Login failed:", err);
    dispatch(loginFailure());
    navigate("/login");
  }
};

export const logoutUser = async (dispatch: any, navigate: any) => {
  dispatch(logoutStart());
  try {
    await axiosInstance.post("/auth/logout/");
    dispatch(logoutSuccess());
    navigate("/login");
  } catch (err: any) {
    console.error("Logout failed:", err);
    dispatch(logoutFailure());
  }
};

export const registerUser = async (user: any, dispatch: any, navigate: any) => {
  dispatch(registerStart());
  try {
    const res = await axiosInstance.post("/users/", user);
    dispatch(registerSuccess(res.data));
  } catch (err: any) {
    console.error("Registration failed:", err);
    dispatch(registerFailure());
  }
};

export const loginByGoogle = async (
  access_token: string,
  dispatch: any,
  navigate: any
) => {
  dispatch(loginStart());
  try {
    const res = await axiosInstance.post("/auth/googleLogin/", {
      access_token,
    });
    dispatch(loginSuccess(res.data));
    navigate("/home");
  } catch (err: any) {
    console.error("Google login failed:", err);
    dispatch(loginFailure());
    navigate("/login");
  }
};
