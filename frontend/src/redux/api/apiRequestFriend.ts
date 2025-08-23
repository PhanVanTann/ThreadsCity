import { getlistFriendFailure, getlistFriendStart, getlistFriendSuccess ,getFollowsByUserIdFailure,getFollowsByUserIdStart,getFollowsByUserIdSuccess} from "../slice/friendSlice"
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
export const getFollowsByUserId = async (user_id: string,dispatch: any) => {
    dispatch(getFollowsByUserIdStart())
    try {
        const res = await axiosInstance.get(`/friend/`, {
            params: {
               user_id
            }
            }
        );
        console.log('datafolowers', res.data)
        dispatch(getFollowsByUserIdSuccess(res.data));
    } catch (error) {
        console.error("Login failed:", error);

        dispatch(getFollowsByUserIdFailure())
    }
}