import { FlaskConical } from 'lucide-react';

export default function MockModeBanner() {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-amber/25 bg-amber/subtle px-4 py-3 shadow-sm"
    >
      <div className="w-7 h-7 rounded-lg bg-surface-inner border border-amber/20 flex items-center justify-center flex-shrink-0">
        <FlaskConical
          className="w-3.5 h-3.5 text-amber"
          strokeWidth={1.75}
        />
      </div>
      <div>
        <p className="text-xs font-semibold text-[#EEF2F4]">
          Mock Mode Active
        </p>
        <p className="text-xs text-muted mt-0.5 leading-relaxed">
          These results are <strong className="text-[#EEF2F4] font-medium">fabricated for development purposes only</strong> and
          have no medical meaning. Set{' '}
          <code className="font-mono bg-surface-inner border border-border text-amber px-1.5 py-0.5 rounded text-[11px]">VITE_USE_MOCK_API=false</code>{' '}
          and restart the dev server to use the real backend.
        </p>
      </div>
    </div>
  );
}
