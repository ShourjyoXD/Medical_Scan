import { Link } from 'react-router-dom';
import { Home, Scan, Brain } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <p className="text-7xl font-bold text-border-strong tracking-wider mb-6">404</p>
          <h1 className="text-2xl font-bold text-[#EEF2F4] mb-2">
            Page not found
          </h1>
          <p className="text-sm text-muted leading-relaxed mb-8">
            The page you are looking for does not exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand text-[#EEF2F4]
                text-sm font-medium rounded-xl hover:bg-brand-hover transition-colors shadow-sm"
            >
              <Home className="w-4 h-4" />
              Go to home
            </Link>
            <Link
              to="/upload/xray"
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-surface-card text-[#EEF2F4]
                text-sm font-medium rounded-xl border border-border hover:border-brand
                hover:bg-surface-elevated transition-colors shadow-sm"
            >
              <Scan className="w-4 h-4 text-brand" />
              X-ray Analysis
            </Link>
            <Link
              to="/upload/mri"
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-surface-card text-[#EEF2F4]
                text-sm font-medium rounded-xl border border-border hover:border-brand
                hover:bg-surface-elevated transition-colors shadow-sm"
            >
              <Brain className="w-4 h-4 text-brand" />
              MRI Analysis
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
