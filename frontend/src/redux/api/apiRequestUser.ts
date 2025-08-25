import { getUserByIdFailure,
        getUserByIdStart,
        getUserByIdSuccess,
        getListUserFailure,
        getListUserStart,
        getListUserSuccess
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
        console.log('userData', res.data)
        dispatch(getUserByIdSuccess(res.data));
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