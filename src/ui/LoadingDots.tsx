export default function LoadingDots() {
  return (
    <span role="status" aria-live="polite" className="inline-flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-bounce" />
    </span>
  )
}