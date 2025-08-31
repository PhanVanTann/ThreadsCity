import { colgroup } from "framer-motion/client";
import axiosInstance from "../../axios/axios.interceptor";
import {
  getListNotificationFailure,
  getListNotificationStart,
  getListNotificationSuccess,
  markAsReadNotificationFailure,
  markAsReadNotificationStart,
  markAsReadNotificationSuccess,    
} from "../slice/notificationSlice";
import toast from "react-hot-toast";


export const getListNotification = async (user_id: string, dispatch: any) => {
  dispatch(getListNotificationStart());
  try {
 
    const p =  axiosInstance.get("/notifications/", {
        params:{
            user_id
        }
    });
    const res = await p;
    dispatch(getListNotificationSuccess(res.data.data));
  } catch (err: any) {
    console.error("failed:", err);
    dispatch(getListNotificationFailure());
  }
};
export const markAsReadNotification = async (data: any, dispatch: any) => {
  dispatch(markAsReadNotificationStart());
  try {
 
    const p =  axiosInstance.patch(`/notifications/`,data);
    const res = await p;
    dispatch(markAsReadNotificationSuccess(res.data));
  } catch (err: any) {
    console.error("failed:", err);
    dispatch(markAsReadNotificationFailure());
  }
};