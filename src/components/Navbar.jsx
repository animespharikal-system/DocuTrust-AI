import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Bell, LogOut, User, Menu, X, Globe } from 'lucide-react';

export default function Navbar({ isAuthenticated, onLogout, toggleSidebar, isSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  const isLandingPage = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        
        {/* Left Side Logo */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={toggleSidebar}
              className="inline-flex items-center justify-center rounded-md p-2 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 focus:outline-none md:hidden"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
          
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Shield className="h-5 w-5" />
            </div>
            <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-base font-bold tracking-tight text-transparent">
              DocuTrust<span className="text-blue-500 font-medium">AI</span>
            </span>
          </Link>
        </div>

        {/* Right Side Navigation Actions */}
        <nav className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              {isLandingPage && (
                <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-zinc-400 tracking-wide uppercase">
                  <a href="#features" className="hover:text-white transition-colors">Features</a>
                  <a href="#demo" className="hover:text-white transition-colors">Integrity Demo</a>
                  <a href="#pricing" className="hover:text-white transition-colors">Pricing model</a>
                </div>
              )}
              {!isAuthPage && (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="text-xs font-semibold text-zinc-400 hover:text-white px-3 py-2 rounded-lg hover:bg-zinc-900/60 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg shadow-md shadow-blue-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Create Free Account
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-4">
              
              {/* Notification icon */}
              <button 
                onClick={() => alert('Notifications dashboard is clear')}
                className="relative rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 ring-2 ring-[#09090b]"></span>
              </button>

              <div className="h-4 w-px bg-zinc-800"></div>

              {/* User Avatar Action */}
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 group"
                >
                  <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 group-hover:border-zinc-700 transition-all overflow-hidden relative shadow-inner">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="hidden md:block text-xs font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors">
                    Alex Carter
                  </span>
                </Link>

                {/* Logout Action */}
                <button
                  onClick={() => {
                    onLogout();
                    navigate('/');
                  }}
                  className="rounded-lg p-1.5 text-zinc-500 hover:bg-rose-950/20 hover:text-rose-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
