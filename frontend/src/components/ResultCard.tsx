import { CheckCircle2, AlertCircle } from 'lucide-react';
import type { AnalysisResult } from '../types';
import { MODALITY_LABELS } from '../types';
import { formatClassName, formatConfidence } from '../utils/formatting';

interface Props {
  result: AnalysisResult;
}

export default function ResultCard({ result }: Props) {
  const topScore = result.scores[result.predicted_class] ?? 0;
  const isHighConfidence = topScore >= 0.75;

  return (
    <div className="rounded-2xl border border-border bg-white shadow-card overflow-hidden">
      {/* Header band */}
      <div className="bg-primary px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-primary-muted/70 uppercase tracking-wider mb-1">
              Modality
            </p>
            <p className="text-white font-semibold">
              {MODALITY_LABELS[result.modality]}
            </p>
          </div>
          {result.model_name && (
            <span className="text-xs text-primary-muted/80 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              {result.model_name}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5 space-y-5">
        {/* Predicted class */}
        <div>
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-2">
            Predicted Class
          </p>
          <div className="flex items-center gap-3">
            {isHighConfidence ? (
              <CheckCircle2 className="w-6 h-6 text-primary-muted flex-shrink-0" strokeWidth={1.75} />
            ) : (
              <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0" strokeWidth={1.75} />
            )}
            <span className="text-2xl font-bold text-primary">
              {formatClassName(result.predicted_class)}
            </span>
          </div>
        </div>

        {/* Confidence */}
        <div>
          <p className="text-xs font-medium text-muted uppercase tracking-wider mb-2">
            Confidence
          </p>
          <div className="flex items-center gap-3">
            <span
              className={`text-3xl font-bold ${
                isHighConfidence ? 'text-primary' : 'text-amber-600'
              }`}
            >
              {formatConfidence(topScore)}
            </span>
            {!isHighConfidence && (
              <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded">
                Low confidence – interpret with caution
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
