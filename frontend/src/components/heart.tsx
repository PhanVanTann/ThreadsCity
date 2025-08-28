'use client';
import { motion } from 'framer-motion';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useState } from 'react';

type HeartButtonProps = {
  liked: boolean;
  count: number;
  onToggle: () => void;
  size?: string;
  disabled?: boolean;
};

export default function HeartButton({ liked, count, onToggle, size, disabled }: HeartButtonProps) {
  const [animate, setAnimate] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    onToggle();
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);
  };

  return (
    <div className="flex items-center gap-1">
      <motion.button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={`text-2xl ${liked ? 'text-red-500' : 'text-gray-300'} transition-colors disabled:opacity-50`}
        animate={animate ? { scale: [1, 1.4, 1] } : undefined}
        transition={{ duration: 0.3 }}
        aria-pressed={liked}
        aria-label={liked ? 'Unlike' : 'Like'}
      >
        {liked ? <AiFillHeart className={size} /> : <AiOutlineHeart className={size} />}
      </motion.button>
      <span className={`${size ?? ''} ${liked ? 'text-red-500' : 'text-gray-300'} transition-colors`}>
        {count}
      </span>
    </div>
  );
}
