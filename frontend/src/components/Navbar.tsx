import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const isHome = pathname === '/';

  return (
    <header className="bg-surface-card border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-[#EEF2F4] hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-[#151A1D] border border-border flex items-center justify-center">
              <Activity className="w-4.5 h-4.5 text-brand" strokeWidth={2} />
            </div>
            <span className="font-semibold text-sm sm:text-base leading-tight tracking-tight">
              Medical Image{' '}
              <span className="text-brand font-medium">Diagnosis Assistant</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
            {!isHome && (
              <Link
                to="/"
                className="text-muted hover:text-[#EEF2F4] transition-colors"
              >
                Home
              </Link>
            )}
            <span className="text-xs text-muted bg-[#121619] px-2.5 py-1 rounded-md border border-border font-normal">
              Academic Project
            </span>
          </nav>

          {/* Mobile menu button */}
          <button
            className="sm:hidden p-2 rounded-lg text-muted hover:text-[#EEF2F4] hover:bg-surface-elevated transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden border-t border-border bg-surface-card px-4 py-3 space-y-2">
          {!isHome && (
            <Link
              to="/"
              className="block text-sm font-medium text-muted hover:text-[#EEF2F4] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
          )}
          <p className="text-xs text-muted">Academic Project &ndash; not for clinical use</p>
        </div>
      )}
    </header>
  );
}
