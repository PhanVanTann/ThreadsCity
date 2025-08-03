import { useState, useRef,useEffect } from "react";
import EmojiPicker from "emoji-picker-react";

export default function EmojiPopup({ onEmojiClick }: { onEmojiClick: (emoji: any) => void }) {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [dragging, setDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      setPosition({
        x: e.clientX - dragStartPos.current.x,
        y: e.clientY - dragStartPos.current.y,
      });
    }
  };

  const handleMouseUp = () => setDragging(false);

  // Gắn sự kiện toàn cục
  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  return (
    <div
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        zIndex: 1000,
        cursor: dragging ? "grabbing" : "grab",
      }}
    >
      {/* Thanh kéo */}
      <div
        onMouseDown={handleMouseDown}
        className="bg-gray-300 dark:bg-gray-700 p-2 text-center text-sm font-bold text-black dark:text-white"
      >
        Kéo để di chuyển
      </div>

      {/* Emoji Picker */}
      <EmojiPicker
        onEmojiClick={onEmojiClick}
        theme="dark"
        width={400}
        height={300}
      />
    </div>
  );
}
