interface Props {
  message?: string;
}

export default function LoadingState({
  message = 'Analysing your image…',
}: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message}
      className="flex flex-col items-center justify-center gap-5 py-12 px-6 rounded-2xl bg-surface-card border border-border shadow-card"
    >
      {/* Refined subtle spinner */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-border-strong" />
        <div className="absolute inset-0 rounded-full border-2 border-brand border-t-transparent animate-spin" />
      </div>

      {/* Message */}
      <div className="text-center">
        <p className="text-sm font-medium text-[#EEF2F4]">{message}</p>
        <p className="text-xs text-muted mt-1">
          This may take a few seconds. Please wait.
        </p>
      </div>
    </div>
  );
}
