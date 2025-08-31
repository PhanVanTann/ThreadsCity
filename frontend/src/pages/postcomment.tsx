import Post from "src/components/post";
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect} from 'react';
import { getPostById } from "src/redux/api/apiRequestPost";
import { useParams } from "react-router-dom";
export default function PostComment() {
  const dispatch = useDispatch();
  const { data, isFetching, error } = useSelector((state: any) => state.post.getPostById);
  const { post_id } = useParams<{ post_id: string }>();
  const post = data?.data;
  console.log(post_id,"post_id");
  useEffect(() => {
    getPostById(post_id as string ,dispatch);
  }, [dispatch]);

  
  if (isFetching) return <p className="text-white">Đang tải...</p>;
  if (error) return <p className="text-red-500">Lỗi tải bài viết</p>;
  if (!data) return null;
  console.log(data.data,"data");


  return (
    <div className="w-[700px] mt-5 flex flex-col border border-[#3d3d3d] rounded-[20px] h-full bg-gray-100 dark:bg-[#181818] gap-5">

                <Post key={post._id} post={post} />
    </div>
  )
}