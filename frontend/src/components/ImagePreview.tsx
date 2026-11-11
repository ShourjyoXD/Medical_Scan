import { X, RefreshCw } from 'lucide-react';

interface Props {
  previewUrl: string;
  fileName: string;
  onRemove: () => void;
  onReplace: () => void;
  disabled?: boolean;
}

export default function ImagePreview({
  previewUrl,
  fileName,
  onRemove,
  onReplace,
  disabled = false,
}: Props) {
  return (
    <div className="rounded-2xl border border-border overflow-hidden bg-white shadow-card">
      {/* Image */}
      <div className="relative bg-gray-50 flex items-center justify-center min-h-48 max-h-80 overflow-hidden">
        <img
          src={previewUrl}
          alt={`Preview of ${fileName}`}
          className="max-h-80 max-w-full object-contain"
        />
      </div>

      {/* File info + actions */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-border-light">
        <div className="min-w-0">
          <p className="text-sm font-medium text-primary truncate">{fileName}</p>
          <p className="text-xs text-muted">Ready to analyse</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={onReplace}
            disabled={disabled}
            title="Replace image"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted
              border border-border rounded-lg hover:text-primary hover:border-primary-muted
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Replace
          </button>

          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            title="Remove image"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600
              border border-red-200 rounded-lg hover:bg-red-50
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-3.5 h-3.5" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
