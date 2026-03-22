export default function LoadingSpinner({ message = "Loading your data..." }) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          {/* Outer track */}
          <div className="absolute inset-0 rounded-full border-2 border-gray-800" />
          {/* Spinning arc */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-400 border-r-blue-400 animate-spin" />
          {/* Inner glow dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_2px_rgba(96,165,250,0.6)]" />
          </div>
        </div>

        {/* Message */}
        <p className="text-gray-400 text-sm font-medium uppercase tracking-[0.2em]">
          {message}
        </p>
      </div>
    </div>
  );
}
