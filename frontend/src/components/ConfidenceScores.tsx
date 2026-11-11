import { formatClassName, formatConfidence, sortedScores } from '../utils/formatting';

interface Props {
  scores: Record<string, number>;
  predictedClass: string;
}

export default function ConfidenceScores({ scores, predictedClass }: Props) {
  const sorted = sortedScores(scores);

  return (
    <div className="rounded-2xl border border-border bg-surface-card shadow-card p-5 sm:p-6">
      <h3 className="text-sm font-semibold text-[#EEF2F4] mb-4">
        Class-wise Confidence Scores
      </h3>

      <div className="space-y-3.5">
        {sorted.map(([cls, score]) => {
          const isWinner = cls === predictedClass;
          const pct = Math.min(100, score * 100);

          return (
            <div key={cls}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {isWinner && (
                    <span className="w-1.5 h-1.5 rounded-full bg-mint" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      isWinner ? 'text-[#EEF2F4]' : 'text-muted'
                    }`}
                  >
                    {formatClassName(cls)}
                  </span>
                </div>
                <span
                  className={`text-sm tabular-nums ${
                    isWinner ? 'font-semibold text-mint' : 'text-muted'
                  }`}
                >
                  {formatConfidence(score)}
                </span>
              </div>

              {/* Bar track */}
              <div className="h-2 bg-surface-inner border border-border/60 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isWinner ? 'bg-mint' : 'bg-[#2E3A43]'
                  }`}
                  style={{ width: `${pct}%` }}
                  role="progressbar"
                  aria-valuenow={Math.round(pct)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${formatClassName(cls)}: ${formatConfidence(score)}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
