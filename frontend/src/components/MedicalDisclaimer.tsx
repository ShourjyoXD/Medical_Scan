import { AlertTriangle } from 'lucide-react';

interface Props {
  compact?: boolean;
}

export default function MedicalDisclaimer({ compact = false }: Props) {
  if (compact) {
    return (
      <p className="text-xs text-amber leading-relaxed flex items-center justify-center gap-1.5">
        <AlertTriangle className="inline w-3.5 h-3.5 flex-shrink-0" />
        <span>For academic use only. Not a medical diagnosis.</span>
      </p>
    );
  }

  return (
    <div
      role="note"
      aria-label="Medical disclaimer"
      className="rounded-xl border border-amber/25 bg-amber/subtle p-4 sm:p-5 shadow-sm"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-lg bg-surface-inner border border-amber/20 flex items-center justify-center flex-shrink-0">
          <AlertTriangle
            className="w-4.5 h-4.5 text-amber"
            strokeWidth={1.75}
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#EEF2F4] mb-1">
            Academic &amp; Educational Use Only
          </p>
          <p className="text-sm text-muted leading-relaxed">
            This application is developed for academic and educational purposes
            only. Its predictions are{' '}
            <strong className="text-[#EEF2F4] font-medium">not medical diagnoses</strong> and must not be used for
            treatment decisions. Always consult a qualified medical professional
            for any health concern.
          </p>
        </div>
      </div>
    </div>
  );
}
