import { Link } from 'react-router-dom';
import { Home, Scan, Brain } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-sm">
          <p className="text-7xl font-bold text-border mb-6">404</p>
          <h1 className="text-xl font-semibold text-primary mb-2">
            Page not found
          </h1>
          <p className="text-sm text-muted leading-relaxed mb-8">
            The page you are looking for does not exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white
                text-sm font-medium rounded-lg hover:bg-primary-light transition-colors"
            >
              <Home className="w-4 h-4" />
              Go to home
            </Link>
            <Link
              to="/upload/xray"
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-primary
                text-sm font-medium rounded-lg border border-border hover:border-primary-muted
                hover:bg-surface transition-colors"
            >
              <Scan className="w-4 h-4" />
              X-ray Analysis
            </Link>
            <Link
              to="/upload/mri"
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-primary
                text-sm font-medium rounded-lg border border-border hover:border-primary-muted
                hover:bg-surface transition-colors"
            >
              <Brain className="w-4 h-4" />
              MRI Analysis
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
