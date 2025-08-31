export default function BlockSkeleton({ rows = 6, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full max-w-[900px] animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-[#3d3d3d] py-3">
          {Array.from({ length: cols }).map((__, j) => (
            <div key={j} className="h-4 flex-1 bg-gray-300/60 rounded" />
          ))}
          <div className="h-8 w-32 bg-gray-300/60 rounded-full" />
        </div>
      ))}
    </div>
  );
}
