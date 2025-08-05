// tách hàm xử lý media riêng nếu muốn
import Post from "./post"; // Component con

const poststest = [
  {
    id: "64e3d61a8b7c5e3f20a1b101",
    user_id: "64e3d54e8b7c5e3f20a1b001",
    text: "Hôm nay trời đẹp quá, đi dạo quanh thành phố 😍",
    image: "https://picsum.photos/600/400?random=1",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    flag: false,
    total_love: 123,
    total_comment: 8,
    created_at: "2025-08-04T09:30:00Z",
  },
  {
    id: "64e3d61a8b7c5e3f20a1b102",
    user_id: "64e3d54e8b7c5e3f20a1b001",
    text: "Video vui nhộn hôm nay 😂",
    image: "",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    flag: false,
    total_love: 30,
    total_comment: 3,
    created_at: "2025-08-04T10:00:00Z",
  },
];
export const mergeMediaToPosts = (rawPosts: any[]) => {
  return rawPosts.map((post) => ({
    ...post,
    media: [post.image, post.video].filter((url) => url !== ""),
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
