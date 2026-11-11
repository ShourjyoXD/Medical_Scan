import { FlaskConical } from 'lucide-react';

export default function MockModeBanner() {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-yellow-300 bg-yellow-50 px-4 py-3"
    >
      <FlaskConical
        className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5"
        strokeWidth={1.75}
      />
      <div>
        <p className="text-xs font-semibold text-yellow-800">
          Mock Mode Active
        </p>
        <p className="text-xs text-yellow-700 mt-0.5 leading-relaxed">
          These results are <strong>fabricated for development purposes only</strong> and
          have no medical meaning. Set{' '}
          <code className="font-mono bg-yellow-100 px-1 rounded">VITE_USE_MOCK_API=false</code>{' '}
          and restart the dev server to use the real backend.
        </p>
      </div>
    </div>
  );
}
