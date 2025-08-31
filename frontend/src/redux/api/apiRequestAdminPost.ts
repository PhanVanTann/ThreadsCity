import axiosInstance from "../../axios/axios.interceptor";
import {
  getPostAwaitingCensorshipFailure,
  getPostAwaitingCensorshipStart,
  getPostAwaitingCensorshipSuccess,
    getCenterPostByIdFailure,
    getCenterPostByIdStart,
    getCenterPostByIdSuccess,
    updatePostStatusFailure,
    updatePostStatusStart,
    updatePostStatusSuccess,

} from "../slice/adminPostSlice";
import toast from "react-hot-toast";

export const getPostAwaitingCensorship = async (dispatch:any) => {
    dispatch(getPostAwaitingCensorshipStart())
    try {
        const res = await axiosInstance.get(`/post/getpostawaitingcensorship/`);
        console.log("postdata",res.data)
        dispatch(getPostAwaitingCensorshipSuccess(res.data));
    } catch (error) {
        console.error("failed:", error);

        dispatch(getPostAwaitingCensorshipFailure())
    }
}
export const getCenterPostById = async (post_id:string,dispatch:any) => {
  dispatch(getCenterPostByIdStart())
  try {
      const res = await axiosInstance.get(`/post/getcensorshipbypostid/`,{
          params:{
              post_id
          }
      });
      console.log("postdata",res.data)
      dispatch(getCenterPostByIdSuccess(res.data));
  } catch (error) {
      console.error("failed:", error);

      dispatch(getCenterPostByIdFailure())
  }}
export const updatePostStatus = async (
  payload: { post_id: string; status: string},
  dispatch: any
) => {
  dispatch(updatePostStatusStart())
  try {
    const res = await axiosInstance.patch('/post/getcensorshipbypostid/', payload)
    console.log(res, 'ressssss')
    dispatch(updatePostStatusSuccess(res.data))
    
    return res.data
  } catch (err) {
    console.error(err)
    dispatch(updatePostStatusFailure())
    throw err
  }
}