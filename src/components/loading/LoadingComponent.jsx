
import { useSelector } from "react-redux"

const LoadingComponent = () => {
  const auth = useSelector((state) => state.auth)

  if (!auth.loading) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/95 backdrop-blur-md">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[rgba(16,21,64,0.03)] rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[rgba(16,21,64,0.02)] rounded-full blur-3xl animate-float animation-delay-500" />
      </div>

      {/* Main loading container */}
      <div className="relative flex flex-col items-center gap-6 sm:gap-8">
        {/* Logo/Brand */}
        <div className="relative group">
          <div className="absolute -inset-3 bg-[#101540] rounded-full opacity-20 blur-2xl animate-pulse" />
          <div className="relative h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 rounded-3xl bg-gradient-to-br from-[#101540] to-[#1a2060] flex items-center justify-center shadow-2xl shadow-[rgba(16,21,64,0.4)] animate-bounce-subtle">
            <span className="text-white font-bold text-2xl sm:text-3xl md:text-4xl">IS</span>
          </div>
        </div>

        {/* Spinner */}
        <div className="relative">
          {/* Outer ring */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 border-[rgba(16,21,64,0.1)]" />

          {/* Animated spinner ring */}
          <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 border-transparent border-t-[#101540] border-r-[#1a2060] animate-spin" />

          {/* Inner glow effect */}
          <div className="absolute inset-2 sm:inset-3 rounded-full bg-gradient-to-br from-[rgba(16,21,64,0.05)] to-transparent animate-pulse" />
        </div>

        {/* Loading text */}
        <div className="relative flex flex-col items-center gap-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#101540] via-[#1a2060] to-[#101540] bg-clip-text text-transparent bg-[length:200%_100%] animate-shimmer">
            Loading
          </h2>

          {/* Animated dots */}
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#101540] animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#101540] animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#101540] animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-48 sm:w-64 md:w-80 h-1.5 sm:h-2 bg-[rgba(16,21,64,0.1)] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#101540] via-[#1a2060] to-[#101540] bg-[length:200%_100%] animate-shimmer rounded-full" />
        </div>

        {/* Loading message */}
        <p className="text-sm sm:text-base text-gray-600 animate-pulse">Please wait while we load your content...</p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.05);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s linear infinite;
        }

        .animation-delay-500 {
          animation-delay: 500ms;
        }
      `}</style>
    </div>
  )
}

export default LoadingComponent
