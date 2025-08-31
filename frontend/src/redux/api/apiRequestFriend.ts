import { getlistFriendFailure, 
    getlistFriendStart,
     getlistFriendSuccess ,
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
    } from "../slice/friendSlice"
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
export const getFollowerByUserId = async (data: any,dispatch: any) => {
    dispatch(getFollowerByUserIdStart())
    try {
        console.log("myid",data.my_id)
        const res = await axiosInstance.get(`/friend/`, {
            params: {
               "user_id":data.user_id,
               "follower":data.follower,
               "my_id":data.my_id
            }
            }
        );
        console.log('datafolowers', res.data)
        dispatch(getFollowerByUserIdSuccess(res.data));
    } catch (error) {
        console.error("Login failed:", error);

        dispatch(getFollowerByUserIdFailure())
    }
}
export const getFollowsByUserId = async (user_id: string,my_id:string,dispatch: any) => {
    console.log("myid",my_id)
    dispatch(getFollowsByUserIdStart())
    try {
        const res = await axiosInstance.get(`/friend/`, {
            params: {
               user_id,
               my_id
            }
            }
        );
    
        dispatch(getFollowsByUserIdSuccess(res.data));
    } catch (error) {
        console.error("Login failed:", error);

        dispatch(getFollowsByUserIdFailure())
    }
}
export const createFollowUser = async (data: any,dispatch: any) => {
    dispatch(createFollowUserStart())
    try {
        const res = await axiosInstance.post(`/friend/`, data);
        dispatch(createFollowUserSuccess(res.data));
    } catch (error) {
        console.error("Login failed:", error);

        dispatch(createFollowUserFailure())
    }
}
export const isFriendUser = async (data: any,dispatch: any) => {
    dispatch(isFriendUserStart())
    try {
        console.log("ssss",data)
        const res = await axiosInstance.get(`/friend/isfriend/`, {
            params:{
                "user_id":data.user_id,
                "follower_id":data.follower_id
            }
        });
        dispatch(isFriendUserSuccess(res.data));
        
    } catch (error) {
        console.error("Login failed:", error);

        dispatch(isFriendUserFailure())
    }
}