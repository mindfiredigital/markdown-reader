//loading function
export function Loading(){
  return(
    <div role="status" aria-live="polite" className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 p-5 rounded-lg bg-surface border border-border-theme shadow-sm">
        <div aria-hidden="true" className="w-5 h-5 border-2 border-border-theme border-t-accent rounded-full animate-spin" />
        <p className="text-sm text-text-muted">Loading…</p>
      </div>
    </div>
  )
}