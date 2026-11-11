import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const isHome = pathname === '/';

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-primary hover:opacity-80 transition-opacity"
          >
            <Activity className="w-6 h-6 text-primary-muted" strokeWidth={1.75} />
            <span className="font-semibold text-sm sm:text-base leading-tight">
              Medical Image{' '}
              <span className="text-primary-muted">Diagnosis Assistant</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
            {!isHome && (
              <Link
                to="/"
                className="text-muted hover:text-primary transition-colors"
              >
                Home
              </Link>
            )}
            <span className="text-xs text-muted bg-surface px-2 py-1 rounded border border-border">
              Academic Project
            </span>
          </nav>

          {/* Mobile menu button */}
          <button
            className="sm:hidden p-2 rounded-md text-muted hover:text-primary hover:bg-surface transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden border-t border-border bg-white px-4 py-3 space-y-2">
          {!isHome && (
            <Link
              to="/"
              className="block text-sm font-medium text-muted hover:text-primary transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          )}
          <p className="text-xs text-muted">Academic Project – not for clinical use</p>
        </div>
      )}
    </header>
  );
}
