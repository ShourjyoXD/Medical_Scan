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
    ? 'border-primary-muted bg-primary/5'
    : 'border-border hover:border-primary-muted hover:bg-surface';

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
          relative flex flex-col items-center justify-center gap-3
          border-2 border-dashed rounded-2xl p-10 sm:p-14
          transition-colors duration-150 cursor-pointer select-none
          ${borderClass}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <UploadCloud
          className={`w-10 h-10 ${dragging ? 'text-primary-muted' : 'text-muted/50'} transition-colors`}
          strokeWidth={1.5}
        />
        <div className="text-center">
          <p className="text-sm font-medium text-primary">
            {dragging ? 'Drop the image here' : 'Drag & drop your image here'}
          </p>
          <p className="text-xs text-muted mt-1">or</p>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
          className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg
            hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
      <p className="text-xs text-muted text-center">
        Supported formats: {ACCEPTED_FORMATS_LABEL} &nbsp;&middot;&nbsp; Max size: {MAX_SIZE_LABEL}
      </p>

      {/* Validation error */}
      {localError && (
        <p role="alert" className="text-xs text-red-600 font-medium text-center">
          {localError}
        </p>
      )}
    </div>
  );
}
