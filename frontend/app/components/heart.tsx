'use client';
import { useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { motion } from "framer-motion";
import axios from "axios";

export default function HeartButton({ postId,size }: { postId: string,size:string }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [animate, setAnimate] = useState(false);

//   const toggleLike = async () => {
//     try {
//       if (!liked) {
//         await axios.post("/api/posts/like", { postId, userId });
//         setCount((prev) => prev + 1);
//       } else {
//         await axios.delete(`/api/posts/like?postId=${postId}&userId=${userId}`);
//         setCount((prev) => prev - 1);
//       }
//       setLiked(!liked);
//       setAnimate(true);
//       setTimeout(() => setAnimate(false), 300);
//     } catch (err) {
//       console.error("Error liking post:", err);
//     }
//   };
  const toggleLike = () => {
    if (!liked) {
      setCount((prev) => prev + 1);
    } else {
      setCount((prev) => prev - 1);
    }
    setLiked(!liked);

    // Gây hiệu ứng scale
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);
  };
  return (
    <div className="flex items-center gap-1">
      <motion.button
        onClick={toggleLike}
        className={`text-2xl ${liked ? "text-red-500" : "text-gray-300"} transition-colors`}
        animate={animate ? { scale: [1, 1.4, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
    {liked ? <AiFillHeart className={`${size}`} /> : <AiOutlineHeart className={`${size}`}/>}
      </motion.button>
      <span className={`${size} ${liked ? "text-red-500" : "text-gray-300"} transition-colors`}>{count}</span>
    </div>
  );
}
