export function ProfileSkeleton() {
  return (
    <div
      className="w-[700px] mt-5 flex flex-col border border-[#3d3d3d] rounded-[20px] bg-gray-100 dark:bg-[#000]"
      role="status"
      aria-live="polite"
    >
      {/* Header (mô phỏng block nền đen + avatar + nút) */}
      <div className="flex rounded-[20px] bg-black justify-between w-full items-start p-4">
        {/* Avatar + tên + bio ngắn */}
        <div className="flex gap-4 items-start">
          <div className="w-[100px] h-[100px] rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
          <div className="flex flex-col gap-3">
            <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
            <div className="flex gap-4 text-gray-300 text-sm">
              <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-64 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-52 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Nút bên phải */}
        <div className="flex items-start">
          <div className="h-10 w-28 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Tabs sticky (giống thanh tab thật) */}
      <div className="flex sticky top-0 bg-black z-30">
        <div className="w-1/3 p-4 border-b border-[#3d3d3d]">
          <div className="h-5 w-24 bg-gray-300 dark:bg-gray-700 rounded mx-auto animate-pulse" />
        </div>
        <div className="w-1/3 p-4 border-b border-[#3d3d3d]">
          <div className="h-5 w-28 bg-gray-300 dark:bg-gray-700 rounded mx-auto animate-pulse" />
        </div>
        <div className="w-1/3 p-4 border-b border-[#3d3d3d]">
          <div className="h-5 w-28 bg-gray-300 dark:bg-gray-700 rounded mx-auto animate-pulse" />
        </div>
      </div>

      {/* Danh sách post skeleton */}
      <div className="p-4 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="border border-[#3d3d3d] rounded-[20px] bg-gray-100 dark:bg-[#181818] p-4"
          >
            {/* Header post */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
              <div className="flex-1">
                <div className="h-4 w-40 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-3 w-24 bg-gray-300 dark:bg-gray-700 rounded mt-2 animate-pulse" />
              </div>
              <div className="h-6 w-6 rounded bg-gray-300 dark:bg-gray-700 animate-pulse" />
            </div>

            {/* Nội dung text ngắn */}
            <div className="space-y-2 mb-3">
              <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
            </div>

            {/* Media khối lớn (giống video/image 400px) */}
            <div className="h-[280px] sm:h-[320px] md:h-[360px] lg:h-[400px] w-full bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse" />

            {/* Actions */}
            <div className="flex gap-5 mt-4">
              <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-6 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* SR-only text for a11y */}
      <span className="sr-only">Đang tải hồ sơ người dùng…</span>
    </div>
  );
}
