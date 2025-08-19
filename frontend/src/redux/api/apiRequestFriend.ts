import { getlistFriendFailure, getlistFriendStart, getlistFriendSuccess } from "../slice/friendSlice"
import axiosInstance from "../../axios/axios.interceptor";
export const getlistFriend = async (user_id: string,dispatch: any) => {
    dispatch(getlistFriendStart())
    try {
        const res = await axiosInstance.get(`/friend/list/`, {
            params: {
               user_id
            }
            }
        );
        console.log('datas', res.data)
        dispatch(getlistFriendSuccess(res.data));
    } catch (error) {
        console.error("Login failed:", error);

        dispatch(getlistFriendFailure())
    }
}