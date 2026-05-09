"use client";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="p-10 text-red-500">
      <h2 className="text-2xl font-bold">Something went wrong in Ventas!</h2>
      <pre className="whitespace-pre-wrap mt-4 p-4 bg-red-50 border border-red-200">{error.message}</pre>
      {error.stack && <pre className="whitespace-pre-wrap mt-4 p-4 bg-red-50 border border-red-200 text-xs">{error.stack}</pre>}
      {error.digest && <p className="mt-2 text-sm text-gray-500">Digest: {error.digest}</p>}
      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  )
}
