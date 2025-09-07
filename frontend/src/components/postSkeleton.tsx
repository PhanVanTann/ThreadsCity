import React from "react";

export default function PostSkeleton() {
  return (
    <div className="w-[700px] flex flex-col items-start mt-5 bg-gray-100 dark:bg-[#181818] gap-5 border border-[#3d3d3d] rounded-lg p-4 animate-pulse">
      {/* Header */}
      <div className="flex w-full items-center">
        <div className="w-[40px] h-[40px] rounded-full bg-gray-400 dark:bg-gray-600 mr-2"></div>
        <div className="flex  gap-2 flex-grow">
          <div className="w-32 h-4 bg-gray-400 dark:bg-gray-600 rounded"></div>
          <div className="w-20 h-3 bg-gray-500 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full space-y-2">
        <div className="w-full h-4 bg-gray-400 dark:bg-gray-600 rounded"></div>
        <div className="w-2/3 h-4 bg-gray-400 dark:bg-gray-600 rounded"></div>
      </div>

      {/* Media */}
      <div className="w-full h-[400px] bg-gray-500 dark:bg-gray-700 rounded-lg"></div>

      {/* Actions */}
      <div className="flex gap-5 mt-2">
        <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600"></div>
        <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600"></div>
      </div>
    </div>
  );
}
