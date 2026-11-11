import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2 text-primary">
            <Activity className="w-5 h-5 text-primary-muted" strokeWidth={1.75} />
            <span className="font-semibold text-sm">
              Medical Image Diagnosis Assistant
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-5 text-sm text-muted">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/upload/xray" className="hover:text-primary transition-colors">
              Chest X-ray
            </Link>
            <Link to="/upload/mri" className="hover:text-primary transition-colors">
              Brain MRI
            </Link>
          </nav>
        </div>

        {/* Disclaimer + copyright */}
        <div className="mt-6 pt-6 border-t border-border-light">
          <p className="text-xs text-muted leading-relaxed max-w-2xl">
            This application is developed for{' '}
            <strong>academic and educational purposes only</strong>. Its
            predictions are not medical diagnoses and must not be used for
            treatment decisions. Consult a qualified medical professional for
            any health concern.
          </p>
          <p className="mt-3 text-xs text-muted">
            &copy; {year} Medical Image Diagnosis Assistant &mdash; Academic Project
          </p>
        </div>
      </div>
    </footer>
  );
}
