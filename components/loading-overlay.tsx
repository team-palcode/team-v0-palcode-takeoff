import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface LoadingOverlayProps {
  message?: string
}

export function LoadingOverlay({ message = "Loading..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center">
        <LoadingSpinner size={40} className="text-blue-600 mb-4" />
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  )
}
