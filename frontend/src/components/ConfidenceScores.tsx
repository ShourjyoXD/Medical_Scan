import { formatClassName, formatConfidence, sortedScores } from '../utils/formatting';

interface Props {
  scores: Record<string, number>;
  predictedClass: string;
}

export default function ConfidenceScores({ scores, predictedClass }: Props) {
  const sorted = sortedScores(scores);

  return (
    <div className="rounded-2xl border border-border bg-white shadow-card p-5 sm:p-6">
      <h3 className="text-sm font-semibold text-primary mb-4">
        Class-wise Confidence Scores
      </h3>

      <div className="space-y-3">
        {sorted.map(([cls, score]) => {
          const isWinner = cls === predictedClass;
          const pct = Math.min(100, score * 100);

          return (
            <div key={cls}>
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-sm font-medium ${
                    isWinner ? 'text-primary' : 'text-muted'
                  }`}
                >
                  {formatClassName(cls)}
                </span>
                <span
                  className={`text-sm tabular-nums ${
                    isWinner ? 'font-semibold text-primary' : 'text-muted'
                  }`}
                >
                  {formatConfidence(score)}
                </span>
              </div>

              {/* Bar */}
              <div className="h-2 bg-border-light rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isWinner ? 'bg-primary-muted' : 'bg-muted/30'
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
