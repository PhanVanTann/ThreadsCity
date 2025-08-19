import React from "react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-black/80">
      <div className="relative flex items-center justify-center">
        {/* Vòng ngoài */}
        <div className="w-20 h-20 border-4 border-gray-500 border-t-blue-500 rounded-full animate-spin"></div>

        {/* Vòng trong nhịp nhấp nháy */}
        <div className="absolute w-10 h-10 bg-blue-500 rounded-full animate-ping opacity-75"></div>

        {/* Chấm ở giữa */}
        <div className="absolute w-6 h-6 bg-blue-400 rounded-full shadow-lg"></div>
      </div>
    </div>
  );
}
