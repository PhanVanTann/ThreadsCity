import Post from "./post"; // Component con
import {poststest} from "../datatest.ts"; // Dữ liệu mẫu

export const mergeMediaToPosts = (rawPosts: any[]) => {
  return rawPosts.map((post) => ({
    ...post,
    media: [...(post.image || []), ...(post.video || [])].filter((url) => url !== ""),
  }));
};
const postsWithMedia = mergeMediaToPosts(poststest);

export default function PostList() {
  return (
    <div className="flex flex-col items-center">
      {postsWithMedia.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}
