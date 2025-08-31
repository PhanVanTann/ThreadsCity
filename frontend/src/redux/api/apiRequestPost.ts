import { getListPostFailure, 
    getListPostStart, 
    getListPostSuccess,
    createPostFailure,
    createPostStart,
    createPostSuccess ,
    getPostValidByIdFailure,
    getPostValidByIdStart,
    getPostValidByIdSuccess,
    deletePostByUserFailure,
    deletePostByUserStart,
    deletePostByUserSuccess,
    getHeartbyPostIdStart,
    getHeartbyPostIdSuccess,
    getHeartbyPostIdFailure
} from "../slice/postSlice"
import axiosInstance from "../../axios/axios.interceptor";
import toast from "react-hot-toast";


export const getlistPost = async (dispatch:any) => {
    dispatch(getListPostStart())
    try {
        const res = await axiosInstance.get(`/post/`);
        dispatch(getListPostSuccess(res.data));
    } catch (error) {
        console.error("failed:", error);

        dispatch(getListPostFailure())
    }
}

export const createPost = async (
  payload: { user_id: string; text: string; file?: File | null },
  dispatch: any,
  navigate: any
) => {
  dispatch(createPostStart())
  try {
    const fd = new FormData()
    fd.append('user_id', payload.user_id)
    fd.append('text', payload.text ?? '')
    if (payload.file) fd.append('media', payload.file)

    const res = await axiosInstance.post('/post/', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    console.log(res, 'ressssss')
    dispatch(createPostSuccess(res.data))
    
    return res.data
  } catch (err) {
    console.error(err)
    dispatch(createPostFailure())
    throw err
  }
}
export const getPostValidById = async (user_id:string,dispatch:any) => {
    dispatch(getPostValidByIdStart())
    try {
        const res = await axiosInstance.get(`/post/mypostvalid/`,{
            params:{
                user_id
            }
        });
        console.log("posstdata",res.data)
        dispatch(getPostValidByIdSuccess(res.data));
    } catch (error) {
        console.error("failed:", error);

        dispatch(getPostValidByIdFailure())
    }
}
export const deletePostByUser = async (data:any,dispatch:any) => {
    dispatch(deletePostByUserStart())
    try {
        const p =  axiosInstance.delete(`/post/`,{
            params:{
                "user_id":data.user_id,
                "post_id":data.post_id
            }
        });
        toast.promise(p, {
          loading: "Đang xoá...",
          success: "xoá bài thành công",
          error: "xoá thất bại thất bại!",
        });
        const res = await p
        dispatch(deletePostByUserSuccess(res.data));
        return res.data
    } catch (error) {
        console.error("failed:", error);

        dispatch(deletePostByUserFailure())
    }
}
export const getHeartbyPostId = async (data:any ,dispatch:any) => {
    dispatch(getHeartbyPostIdStart())
    try {
        const res = await axiosInstance.post(`/post/heart/`
        ,data
        )
        console.log("heartdata",res.data)
        dispatch(getHeartbyPostIdSuccess(res.data));
    } catch (error) {
        console.error("failed:", error);

        dispatch(getHeartbyPostIdFailure())
    }
}