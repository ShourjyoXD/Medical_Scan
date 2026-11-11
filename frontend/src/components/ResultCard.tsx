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
    <div className="rounded-2xl border border-border bg-surface-card shadow-card overflow-hidden">
      {/* Header band */}
      <div className="bg-surface-inner border-b border-border px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-muted uppercase tracking-wider mb-0.5">
              Modality
            </p>
            <p className="text-[#EEF2F4] font-semibold text-base">
              {MODALITY_LABELS[result.modality]}
            </p>
          </div>
          {result.model_name && (
            <span className="text-xs text-brand bg-brand/subtle px-3 py-1 rounded-full border border-brand/30 font-medium font-mono">
              {result.model_name}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5 space-y-5">
        {/* Predicted class */}
        <div>
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
            Predicted Class
          </p>
          <div className="flex items-center gap-3">
            {isHighConfidence ? (
              <CheckCircle2 className="w-6 h-6 text-mint flex-shrink-0" strokeWidth={2} />
            ) : (
              <AlertCircle className="w-6 h-6 text-crimson flex-shrink-0" strokeWidth={2} />
            )}
            <span className="text-2xl font-bold text-[#EEF2F4] tracking-tight">
              {formatClassName(result.predicted_class)}
            </span>
          </div>
        </div>

        {/* Confidence */}
        <div>
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
            Confidence
          </p>
          <div className="flex items-center gap-3">
            <span
              className={`text-3xl font-bold tracking-tight ${
                isHighConfidence ? 'text-mint' : 'text-crimson'
              }`}
            >
              {formatConfidence(topScore)}
            </span>
            {!isHighConfidence && (
              <span className="text-xs text-crimson bg-crimson/subtle border border-crimson/30 px-2.5 py-1 rounded-md font-medium">
                Low confidence &ndash; interpret with caution
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
