export function ProfileSkeleton() {
  return (
    <div className="w-[700px] mt-5 flex flex-col border border-[#3d3d3d] rounded-[20px] bg-gray-100 dark:bg-black p-6 animate-pulse">
      {/* Header */}
      <div className=" flex gap-3  items-center mb-6">  
        <div className="flex-shrink-0 w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700" />
        <div className="flex flex-col gap-3 w-full">
          <div className="h-5 w-40 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-4 w-36 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-6 w-28 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="p-4 border border-[#3d3d3d] rounded-lg flex flex-col gap-3"
          >
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-72 w-full bg-gray-300 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
