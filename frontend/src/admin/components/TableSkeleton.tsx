export default function TableSkeleton({
  rows = 5,
  cols = 4,
}: { rows?: number; cols?: number }) {
  return (
    <tbody className="animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-[#3d3d3d]">
          {Array.from({ length: cols }).map((__, j) => (
            <td key={j} className="px-3 py-3">
              <div className="h-4 w-full bg-gray-300/60 rounded" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
