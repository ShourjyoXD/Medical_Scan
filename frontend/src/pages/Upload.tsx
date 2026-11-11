import { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Scan, Brain, ChevronLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ImageUploader from '../components/ImageUploader';
import ImagePreview from '../components/ImagePreview';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import { useAnalysis } from '../hooks/useAnalysis';
import type { Modality } from '../types';
import { MODALITY_LABELS } from '../types';

const VALID_MODALITIES: Modality[] = ['xray', 'mri'];

function isValidModality(value: string | undefined): value is Modality {
  return VALID_MODALITIES.includes(value as Modality);
}

const MODALITY_ICONS: Record<Modality, typeof Scan> = {
  xray: Scan,
  mri: Brain,
};

export default function Upload() {
  const { modality: modalityParam } = useParams<{ modality: string }>();
  const navigate = useNavigate();

  /* ── Redirect if modality param is invalid ───────────────────────────── */
  useEffect(() => {
    if (!isValidModality(modalityParam)) {
      navigate('/', { replace: true });
    }
  }, [modalityParam, navigate]);

  const modality = modalityParam as Modality;

  /* ── Analysis hook (must be before handleRemove) ─────────────────────── */
  const analysis = useAnalysis();
  const isAnalysing = analysis.status === 'analysing';

  /* ── Upload state ────────────────────────────────────────────────────── */
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = useCallback((selectedFile: File) => {
    // Revoke any previous object URL to avoid memory leaks
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(selectedFile);
    });
    setFile(selectedFile);
  }, []);

  const handleRemove = useCallback(() => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setFile(null);
    analysis.reset();
  }, [analysis]);

  const handleReplace = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleAnalyse = useCallback(async () => {
    if (!file || isAnalysing) return;
    const result = await analysis.analyse(modality, file);
    if (result) {
      navigate('/results', {
        state: {
          result,
          previewUrl,
          modality,
        },
      });
    }
  }, [file, isAnalysing, analysis, modality, previewUrl, navigate]);

  /* ── Cleanup object URL on unmount ──────────────────────────────────── */
  useEffect(() => {
    return () => {
      // We capture the value at the time the effect runs (mount) intentionally
      // We only want to run this cleanup on unmount
    };
  }, []);

  if (!isValidModality(modalityParam)) return null;

  const Icon = MODALITY_ICONS[modality];
  const label = MODALITY_LABELS[modality];

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-10">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Page header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary-muted" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary">{label}</h1>
            <p className="text-xs text-muted mt-0.5">
              Upload an image to begin analysis
            </p>
          </div>
        </div>

        {/* Hidden file input for "Replace" action */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,image/png,image/jpeg"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFileSelected(f);
            e.target.value = '';
          }}
          aria-hidden="true"
        />

        <div className="space-y-5">
          {/* Upload or preview */}
          {!file || !previewUrl ? (
            <ImageUploader
              onFileSelected={handleFileSelected}
              disabled={isAnalysing}
            />
          ) : (
            <ImagePreview
              previewUrl={previewUrl}
              fileName={file.name}
              onRemove={handleRemove}
              onReplace={handleReplace}
              disabled={isAnalysing}
            />
          )}

          {/* Loading */}
          {isAnalysing && <LoadingState />}

          {/* Error */}
          {analysis.status === 'error' && analysis.error && !isAnalysing && (
            <ErrorMessage
              message={analysis.error}
              kind={
                analysis.error.toLowerCase().includes('reach')
                  ? 'network'
                  : 'generic'
              }
              onRetry={() => analysis.reset()}
            />
          )}

          {/* Analyse button */}
          {!isAnalysing && (
            <button
              type="button"
              onClick={handleAnalyse}
              disabled={!file || isAnalysing}
              className="w-full py-3 bg-primary text-white text-sm font-semibold rounded-xl
                hover:bg-primary-light transition-colors
                disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              {file ? `Analyse ${label}` : 'Upload an image first'}
            </button>
          )}

          {/* Disclaimer */}
          <MedicalDisclaimer compact />
        </div>
      </main>

      <Footer />
    </div>
  );
}
