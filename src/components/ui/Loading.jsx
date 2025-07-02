const Loading = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-700 text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
