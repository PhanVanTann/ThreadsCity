import Post from "src/components/post";

export default function PostComment(post : any,userId :string) {





  return (
    <div className="w-[700px] mt-5 flex flex-col border border-[#3d3d3d] rounded-[20px] h-full bg-gray-100 dark:bg-[#181818] gap-5">

                <Post key={post._id} post={post} />
    </div>
  )
}