import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Home, RefreshCw } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ResultCard from '../components/ResultCard';
import ConfidenceScores from '../components/ConfidenceScores';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import MockModeBanner from '../components/MockModeBanner';
import type { AnalysisResult, Modality } from '../types';
import { MODALITY_LABELS } from '../types';

interface LocationState {
  result: AnalysisResult;
  previewUrl: string;
  modality: Modality;
}

function isValidState(state: unknown): state is LocationState {
  if (!state || typeof state !== 'object') return false;
  const s = state as Record<string, unknown>;
  return (
    typeof s.result === 'object' &&
    s.result !== null &&
    typeof s.previewUrl === 'string' &&
    (s.modality === 'xray' || s.modality === 'mri')
  );
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as unknown;

  /* ── Guard: redirect home if state is missing or malformed ──────────── */
  useEffect(() => {
    if (!isValidState(state)) {
      navigate('/', { replace: true });
    }
  }, [state, navigate]);

  if (!isValidState(state)) return null;

  const { result, previewUrl, modality } = state;
  const isMock = Boolean(result._isMock);

  /* ── Grad-CAM: only shown when backend explicitly provides it ────────── */
  const showGradCam =
    result.explanation?.available === true &&
    typeof result.explanation?.heatmap_url === 'string' &&
    result.explanation.heatmap_url.trim() !== '';

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">
        {/* Back link */}
        <Link
          to={`/upload/${modality}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to upload
        </Link>

        {/* Page title */}
        <div className="mb-7">
          <h1 className="text-xl font-bold text-primary">Analysis Results</h1>
          <p className="text-sm text-muted mt-0.5">
            {MODALITY_LABELS[modality]}
          </p>
        </div>

        <div className="space-y-5">
          {/* Mock warning */}
          {isMock && <MockModeBanner />}

          {/* Uploaded image */}
          <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border-light">
              <h2 className="text-sm font-semibold text-primary">
                Uploaded Image
              </h2>
            </div>
            <div className="bg-gray-50 flex items-center justify-center min-h-48 max-h-72 overflow-hidden p-4">
              <img
                src={previewUrl}
                alt="Uploaded scan"
                className="max-h-64 max-w-full object-contain"
              />
            </div>
          </div>

          {/* Result card */}
          <ResultCard result={result} />

          {/* Confidence scores */}
          <ConfidenceScores
            scores={result.scores}
            predictedClass={result.predicted_class}
          />

          {/* Grad-CAM – only rendered when backend provides a real heatmap URL */}
          {showGradCam && (
            <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
              <div className="px-5 py-4 border-b border-border-light">
                <h2 className="text-sm font-semibold text-primary">
                  Grad-CAM Explanation
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Highlighted regions indicate areas that most influenced the
                  model's prediction.
                </p>
              </div>
              <div className="bg-gray-50 flex items-center justify-center min-h-48 max-h-72 overflow-hidden p-4">
                <img
                  src={result.explanation!.heatmap_url}
                  alt="Grad-CAM heatmap"
                  className="max-h-64 max-w-full object-contain"
                />
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <MedicalDisclaimer />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to={`/upload/${modality}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-white
                text-sm font-semibold rounded-xl hover:bg-primary-light transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Analyse another image
            </Link>
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-primary
                text-sm font-semibold rounded-xl border border-border hover:border-primary-muted
                hover:bg-surface transition-colors shadow-sm"
            >
              <Home className="w-4 h-4" />
              Back to home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
