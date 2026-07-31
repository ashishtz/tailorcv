export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50" role="status" aria-label="Loading">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-brand-600" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}
