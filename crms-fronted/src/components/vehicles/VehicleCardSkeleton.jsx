function VehicleCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-video bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-6 w-3/4 rounded bg-gray-300" />
        <div className="h-6 w-1/2 rounded bg-gray-200" />
        <div className="h-10 w-full rounded bg-gray-200" />
        <div className="h-6 w-2/5 rounded bg-gray-300" />
      </div>
    </div>
  );
}

export default VehicleCardSkeleton;
