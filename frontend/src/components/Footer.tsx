import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-subtle border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2 text-[#EEF2F4]">
            <Activity className="w-4.5 h-4.5 text-brand" strokeWidth={1.75} />
            <span className="font-semibold text-sm tracking-tight">
              Medical Image Diagnosis Assistant
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-5 text-sm text-muted">
            <Link to="/" className="hover:text-[#EEF2F4] transition-colors">
              Home
            </Link>
            <Link to="/upload/xray" className="hover:text-[#EEF2F4] transition-colors">
              Chest X-ray
            </Link>
            <Link to="/upload/mri" className="hover:text-[#EEF2F4] transition-colors">
              Brain MRI
            </Link>
          </nav>
        </div>

        {/* Disclaimer + copyright */}
        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-xs text-muted leading-relaxed max-w-2xl">
            This application is developed for{' '}
            <strong className="text-[#EEF2F4] font-medium">academic and educational purposes only</strong>. Its
            predictions are not medical diagnoses and must not be used for
            treatment decisions. Consult a qualified medical professional for
            any health concern.
          </p>
          <p className="mt-3 text-xs text-muted/80">
            &copy; {year} Medical Image Diagnosis Assistant &mdash; Academic Project
          </p>
        </div>
      </div>
    </footer>
  );
}
