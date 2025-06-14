"use client"

interface LoadingSpinnerProps {
  loadingText: string
}

export function LoadingSpinner({ loadingText }: LoadingSpinnerProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">{loadingText}</p>
      </div>
    </div>
  )
}
