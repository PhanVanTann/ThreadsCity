// src/components/SearchSkeleton.tsx
export default function SearchSkeleton() {
  return (
    <div className="w-[700px] mt-5 flex flex-col border border-[#3d3d3d] rounded-[20px] h-full bg-gray-100 dark:bg-[#181818] gap-5 animate-pulse">
      {/* Ô search */}
      <div className="w-full h-[60px] p-5">
        <div className="relative w-full">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-sm bg-gray-300/70 dark:bg-gray-700/70" />
          <div className="w-full pl-10 pr-3 py-2 border border-[#3d3d3d] rounded-[20px] bg-transparent">
            <div className="h-4 w-1/3 bg-gray-300/70 dark:bg-gray-700/70 rounded"></div>
          </div>
        </div>
      </div>

      {/* Title “Gợi ý theo dõi” */}
      <div className="ml-5 h-4 w-32 bg-gray-300/70 dark:bg-gray-700/70 rounded"></div>

      {/* Items giả */}
      <div className="flex flex-col">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center p-5 border-b border-[#3d3d3d]">
            <div className="w-[40px] h-[40px] rounded-full bg-gray-300/70 dark:bg-gray-700/70 mr-2" />
            <div className="w-[530px]">
              <div className="h-4 w-40 bg-gray-300/70 dark:bg-gray-700/70 rounded mb-2" />
              <div className="h-3 w-28 bg-gray-300/60 dark:bg-gray-700/60 rounded" />
            </div>
            <div className="h-8 w-[120px] rounded-full border border-[#3d3d3d] flex items-center justify-center">
              <div className="h-3 w-16 bg-gray-300/70 dark:bg-gray-700/70 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}