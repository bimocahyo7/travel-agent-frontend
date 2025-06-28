function Loading() {
  return (
    <div
      id="loading-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-60"
    >
      <div className="relative inline-flex items-center gap-2">
        <div className="w-8 h-8 border-4 border-cyan-700 border-b-cyan-400 rounded-full animate-spin"></div>
        <span className="text-3xl font-semibold text-cyan-700">Loading...</span>
      </div>
    </div>
  );
}

export default Loading;
