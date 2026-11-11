import { AlertTriangle } from 'lucide-react';

interface Props {
  compact?: boolean;
}

export default function MedicalDisclaimer({ compact = false }: Props) {
  if (compact) {
    return (
      <p className="text-xs text-accent-amber leading-relaxed">
        <AlertTriangle className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
        For academic use only. Not a medical diagnosis.
      </p>
    );
  }

  return (
    <div
      role="note"
      aria-label="Medical disclaimer"
      className="rounded-xl border border-accent-amber-border bg-accent-amber-bg p-4 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className="w-5 h-5 text-accent-amber flex-shrink-0 mt-0.5"
          strokeWidth={1.75}
        />
        <div>
          <p className="text-sm font-semibold text-accent-amber mb-1">
            Academic & Educational Use Only
          </p>
          <p className="text-sm text-amber-700 leading-relaxed">
            This application is developed for academic and educational purposes
            only. Its predictions are{' '}
            <strong>not medical diagnoses</strong> and must not be used for
            treatment decisions. Always consult a qualified medical professional
            for any health concern.
          </p>
        </div>
      </div>
    </div>
  );
}
