// redux/api/apiRequestComment.ts
import axiosInstance from "../../axios/axios.interceptor";
import {
  getCommentsStart,
  getCommentsSuccess,
  getCommentsFailure,
  commentStart,
  commentSuccess,
  commentFailure,
  appendOneComment,
} from "../slice/commentSlice";

// GET comments (cache theo postId)
export const GetComments = async (postId: string, dispatch: any) => {
  dispatch(getCommentsStart(postId));
  try {
    const res = await axiosInstance.get(`/comment/`, { params: { postId } });
    dispatch(getCommentsSuccess({ postId, data: res.data }));
    return res.data;
  } catch (err) {
    dispatch(getCommentsFailure(postId));
    throw err;
  }
};

// CREATE comment (và append vào cache của post)
export const CreateComments = async (payload: any, dispatch: any) => {
  dispatch(commentStart());
  try {
    const res = await axiosInstance.post("/comment/", payload);
    dispatch(commentSuccess(res.data));
    // Nếu BE trả { success, data: { _id, user_id, ... } }
    const created = res.data?.data;
    if (created?.post_id) {
      const postId = created.post_id; // đảm bảo BE trả string id
      dispatch(appendOneComment({ postId, comment: created }));
    }
    return res.data;
  } catch (err) {
    dispatch(commentFailure());
    throw err;
  }
};
