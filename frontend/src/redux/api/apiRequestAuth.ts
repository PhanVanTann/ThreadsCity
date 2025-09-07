import { colgroup } from "framer-motion/client";
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
import toast from "react-hot-toast";


export const loginUser = async (user: any, dispatch: any, navigate: any) => {
  dispatch(loginStart());
  try {
    console.log('user',user)
    const p =  axiosInstance.post("/auth/login/", user);
    console.log('datas',p);
    toast.promise(p, {
      loading: "Đang đăng nhập...",
      success: "Đăng nhập thành công!",
      error: "Đăng nhập thất bại!",
    });
    const res = await p;
    dispatch(loginSuccess(res.data));
    if (res.data.role === "admin") {
      navigate("/moderation/pending");
    }else {
    navigate("/");}
  } catch (err: any) {
    console.error("Login failed:", err);
    dispatch(loginFailure());
    navigate("/login");
  }
};

export const logoutUser = async (dispatch: any, navigate: any) => {
  dispatch(logoutStart());
  try {
    const p=  axiosInstance.post("/auth/logout/");
     toast.promise(p, {
      loading: "Đang đăng xuất...",
      success: "Đăng xuất thành công!",
      error: "Đăng xuất thất bại!",
    });
 
    const res= await p;
    dispatch(logoutSuccess());
    console.log("logout res", res);
    navigate("/login");
  } catch (err: any) {
    console.error("Logout failed:", err);
    dispatch(logoutFailure());
  }
};

export const registerUser = async (user: any, dispatch: any, navigate: any) => {
  console.log(user)
  dispatch(registerStart());
  try {
    const d =  axiosInstance.post("/users/", user);
    
    toast.promise(d, {
      loading: "Đang đăng ký...",
      
      error: "Đăng ký thất bại!",
    });
    const res = await d
    if (!res.data.success)
    { 
      toast.error(res.data.error)
    }
    else
    {
      toast.success("Đăng kí thành công, vui lòng kiểm tra email để xác thực tài khoản!")
    }
    console.log("register res", res);
    dispatch(registerSuccess(res.data));
    navigate('/login')
  } catch (err: any) {
    console.error("Registration failed:", err);
    dispatch(registerFailure());
  }
};

export const loginByGoogle = async (
  idtoken: string,
  dispatch: any,
  navigate: any
) => {
  dispatch(loginStart());
  try {
    
    const res = axiosInstance.post("/auth/googleLogin/", {
      idtoken,
    });
    toast.promise(res, {
      loading: "Đang đăng nhập...",
      success: "Đăng nhập thành công!",
      error: "Đăng nhập thất bại!",
    });
    const result = await res
    dispatch(loginSuccess(result.data));
    console.log("login gg", result);
    if(result.data.role === "admin") {
      navigate("/moderation/pending");
    }

    else { 
      navigate("/")
    }
    
   
  } catch (err: any) {
    console.error("Google login failed:", err);
    dispatch(loginFailure());
    navigate("/login");
  }
};
