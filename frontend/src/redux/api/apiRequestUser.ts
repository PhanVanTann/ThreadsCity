import { getUserByIdFailure,
        getUserByIdStart,
        getUserByIdSuccess,
        getListUserFailure,
        getListUserStart,
        getListUserSuccess,
        getUserByCommentIdFailure, 
        getUserByCommentIdStart, 
        getUserByCommentIdSuccess,
        updateUserFailure,
        updateUserStart,
        updateUserSuccess
     } from "../slice/userSlice"
import axiosInstance from "../../axios/axios.interceptor";
export const getUserById = async (user_id: string,dispatch: any) => {
    dispatch(getUserByIdStart())
    try {
        const res = await axiosInstance.get(`/users/`, {
            params: {
               user_id
            }
            }
        );
        dispatch(getUserByIdSuccess(res.data));
        return res.data
    } catch (error) {
        console.error("Login failed:", error);

        dispatch(getUserByIdFailure())
    }
}
export const getListUser = async (user_id:string,dispatch: any) => {
    dispatch(getListUserStart())
    try {
        const res = await axiosInstance.get(`/users/listuser/`,{
            params:{
                user_id
            }
        });
        console.log('userData', res.data)
        dispatch(getListUserSuccess(res.data));
    } catch (error) {
        console.error("Login failed:", error);

        dispatch(getListUserFailure())
    }
}
export const getUserByCommentId = (userId: string, commentId: string) => {
  return async (dispatch: any, getState: any) => {
    // Cache check
    const cached = getState()?.user?.getUserByCommentId?.data?.[commentId];
    if (cached) return;

    dispatch(getUserByCommentIdStart());
    try {
      const res = await axiosInstance.get(`/users/`, { params: { user_id: userId } });
      // ✅ Bóc đúng user từ wrapper { success, data }
      const user = res?.data?.data ?? res?.data;
      if (!user?._id) throw new Error("Invalid user payload");

      dispatch(getUserByCommentIdSuccess({ commentId, user }));
    } catch (err) {
      console.error("getUserByCommentId failed:", err);
      dispatch(getUserByCommentIdFailure());
    }
  };
};
export const updateUser = async (user_id:string,data:FormData,dispatch: any) => {
    dispatch(updateUserStart())
    try {
        const res = await axiosInstance.patch(`/users/`,data,{
            headers: { 'Content-Type': 'multipart/form-data' },
            params:{
                user_id
            },
            
        });
      
        dispatch(updateUserSuccess(res.data));
        return res.data
    } catch (error) {
        console.error("failed:", error);

        dispatch(updateUserFailure())
    }
}