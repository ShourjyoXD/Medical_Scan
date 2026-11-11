import { AlertCircle, WifiOff, FileX } from 'lucide-react';

type ErrorKind = 'generic' | 'network' | 'file';

interface Props {
  message: string;
  kind?: ErrorKind;
  onRetry?: () => void;
}

const ICONS: Record<ErrorKind, typeof AlertCircle> = {
  generic: AlertCircle,
  network: WifiOff,
  file: FileX,
};

export default function ErrorMessage({
  message,
  kind = 'generic',
  onRetry,
}: Props) {
  const Icon = ICONS[kind];

  return (
    <div
      role="alert"
      className="flex flex-col sm:flex-row items-start gap-3 rounded-xl border border-crimson/30 bg-crimson/subtle px-4 py-4 shadow-sm"
    >
      <div className="w-8 h-8 rounded-lg bg-surface-inner border border-crimson/25 flex items-center justify-center flex-shrink-0">
        <Icon
          className="w-4.5 h-4.5 text-crimson"
          strokeWidth={1.75}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#EEF2F4]">
          {kind === 'network'
            ? 'Connection error'
            : kind === 'file'
            ? 'File error'
            : 'An error occurred'}
        </p>
        <p className="text-sm text-crimson mt-0.5 leading-relaxed">{message}</p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2.5 text-sm font-medium text-[#EEF2F4] hover:text-crimson underline transition-colors"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
