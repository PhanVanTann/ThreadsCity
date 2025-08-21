import { getListPostFailure, getListPostStart, getListPostSuccess } from "../slice/postSlice"
import axiosInstance from "../../axios/axios.interceptor";
export const getlistPost = async (dispatch:any) => {
    dispatch(getListPostStart())
    try {
        const res = await axiosInstance.get(`/post/`);
        console.log('datapost', res.data)
        dispatch(getListPostSuccess(res.data));
    } catch (error) {
        console.error("failed:", error);

        dispatch(getListPostFailure())
    }
}