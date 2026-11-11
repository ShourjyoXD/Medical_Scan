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
      className="flex flex-col items-center justify-center gap-5 py-14"
    >
      {/* Spinner */}
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-border" />
        <div className="absolute inset-0 rounded-full border-4 border-primary-muted border-t-transparent animate-spin" />
      </div>

      {/* Message */}
      <div className="text-center">
        <p className="text-sm font-medium text-primary">{message}</p>
        <p className="text-xs text-muted mt-1">
          This may take a few seconds. Please wait.
        </p>
      </div>
    </div>
  );
}
