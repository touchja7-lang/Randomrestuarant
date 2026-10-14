import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-xs'
        : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-zinc-200/80">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-zinc-900 font-extrabold text-lg tracking-tight group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-150">
              <span className="text-lg">🎲</span>
            </div>
            <span className="flex items-baseline gap-1.5">
              <span>RandomEats</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            <NavLink to="/" end className={navLinkClass}>
              หน้าแรก
            </NavLink>
            <NavLink to="/random" className={navLinkClass}>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                สุ่มร้านอาหาร
              </span>
            </NavLink>
            <NavLink to="/restaurants" className={navLinkClass}>
              ร้านทั้งหมด
            </NavLink>
          </nav>
        </div>

        {/* Right Section: Add Restaurant CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/restaurants/new"
            className="btn-primary text-xs sm:text-sm py-2 px-2.5 sm:px-4 font-bold inline-flex items-center gap-1.5"
          >
            <span>＋</span>
            <span className="hidden sm:inline">เพิ่มร้านใหม่</span>
            <span className="sm:hidden">เพิ่มร้าน</span>
          </Link>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-xl text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 active:bg-zinc-200 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-100 bg-white/95 backdrop-blur-md px-3 py-3 space-y-1.5 animate-fade-in shadow-lg">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive ? 'bg-brand-50 text-brand-700 font-bold' : 'text-zinc-700 hover:bg-zinc-50'
              }`
            }
          >
            <span>🏠 หน้าแรก</span>
            <span className="text-xs text-zinc-400">→</span>
          </NavLink>
          <NavLink
            to="/random"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive ? 'bg-brand-50 text-brand-700 font-bold' : 'text-zinc-700 hover:bg-zinc-50'
              }`
            }
          >
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              🎰 สุ่มร้านอาหาร
            </span>
            <span className="text-xs text-zinc-400">→</span>
          </NavLink>
          <NavLink
            to="/restaurants"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive ? 'bg-brand-50 text-brand-700 font-bold' : 'text-zinc-700 hover:bg-zinc-50'
              }`
            }
          >
            <span>🍽️ ร้านทั้งหมด</span>
            <span className="text-xs text-zinc-400">→</span>
          </NavLink>
          <NavLink
            to="/restaurants/new"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive ? 'bg-brand-50 text-brand-700 font-bold' : 'text-zinc-700 hover:bg-zinc-50'
              }`
            }
          >
            <span>➕ เพิ่มร้านใหม่</span>
            <span className="text-xs text-zinc-400">→</span>
          </NavLink>
        </div>
      )}
    </header>
  );
};
