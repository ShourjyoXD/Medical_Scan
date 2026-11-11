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
    <div className="rounded-2xl border border-border overflow-hidden bg-surface-card shadow-card">
      {/* Image Viewport (Radiology Dark Frame) */}
      <div className="relative bg-surface-inner flex items-center justify-center min-h-56 max-h-80 overflow-hidden p-4">
        <img
          src={previewUrl}
          alt={`Preview of ${fileName}`}
          className="max-h-76 max-w-full object-contain rounded"
        />
      </div>

      {/* File info + actions */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-surface-card border-t border-border">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#EEF2F4] truncate">{fileName}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
            <span className="text-xs text-mint font-medium">Ready to analyse</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={onReplace}
            disabled={disabled}
            title="Replace image"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted
              bg-surface-elevated border border-border rounded-lg hover:text-[#EEF2F4] hover:border-brand
              transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Replace
          </button>

          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            title="Remove image"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-crimson
              bg-crimson/subtle border border-crimson/30 rounded-lg hover:bg-crimson/20
              transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <X className="w-3.5 h-3.5" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
