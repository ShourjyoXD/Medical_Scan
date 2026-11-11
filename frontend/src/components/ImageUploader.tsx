import { useCallback, useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { validateImageFile, ACCEPTED_FORMATS_LABEL, MAX_SIZE_LABEL } from '../utils/fileValidation';

interface Props {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export default function ImageUploader({ onFileSelected, disabled = false }: Props) {
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      const result = validateImageFile(file);
      if (!result.valid) {
        setLocalError(result.error ?? 'Invalid file.');
        return;
      }
      setLocalError(null);
      onFileSelected(file);
    },
    [onFileSelected],
  );

  /* ── Drag events ─────────────────────────────────────────────────────── */

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setDragging(true);
  }, [disabled]);

  const onDragLeave = useCallback(() => setDragging(false), []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [disabled, processFile],
  );

  /* ── File input ──────────────────────────────────────────────────────── */

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      // reset input so the same file can be re-selected
      e.target.value = '';
    },
    [processFile],
  );

  /* ── Keyboard accessibility ──────────────────────────────────────────── */
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
        inputRef.current?.click();
      }
    },
    [disabled],
  );

  const borderClass = dragging
    ? 'border-brand bg-brand/subtle'
    : 'border-border-strong hover:border-brand/70 hover:bg-surface-elevated';

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload image. Click or drag a file here."
        aria-disabled={disabled}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={onKeyDown}
        className={`
          relative flex flex-col items-center justify-center gap-3.5
          border-2 border-dashed rounded-2xl p-10 sm:p-14 bg-surface-card
          transition-all duration-200 cursor-pointer select-none
          ${borderClass}
          ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
        `}
      >
        <div className="w-13 h-13 rounded-2xl bg-surface-inner border border-border flex items-center justify-center p-3">
          <UploadCloud
            className={`w-7 h-7 ${dragging ? 'text-brand' : 'text-brand/80'} transition-colors`}
            strokeWidth={1.75}
          />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-[#EEF2F4]">
            {dragging ? 'Drop the medical image here' : 'Drag & drop your medical scan here'}
          </p>
          <p className="text-xs text-muted mt-1">or click to browse files</p>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
          className="mt-1 px-5 py-2 bg-brand text-[#EEF2F4] text-sm font-medium rounded-xl
            hover:bg-brand-hover transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Browse files
        </button>

        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg,image/png,image/jpeg"
          className="hidden"
          onChange={onInputChange}
          disabled={disabled}
          aria-hidden="true"
        />
      </div>

      {/* Format / size guidance */}
      <p className="text-xs text-muted/75 text-center">
        Supported formats: <span className="text-[#EEF2F4]">{ACCEPTED_FORMATS_LABEL}</span> &nbsp;&middot;&nbsp; Max size: <span className="text-[#EEF2F4]">{MAX_SIZE_LABEL}</span>
      </p>

      {/* Validation error */}
      {localError && (
        <div role="alert" className="p-2.5 rounded-lg bg-crimson/subtle border border-crimson/30 text-xs text-crimson font-medium text-center">
          {localError}
        </div>
      )}
    </div>
  );
}
