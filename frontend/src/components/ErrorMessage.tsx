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
      className="flex flex-col sm:flex-row items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4"
    >
      <Icon
        className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
        strokeWidth={1.75}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-red-800">
          {kind === 'network'
            ? 'Connection error'
            : kind === 'file'
            ? 'File error'
            : 'An error occurred'}
        </p>
        <p className="text-sm text-red-700 mt-1 leading-relaxed">{message}</p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 text-sm font-medium text-red-700 underline hover:no-underline transition-all"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
