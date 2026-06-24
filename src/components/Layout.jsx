import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Layout({ children, isAuthenticated, onLogout }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('dt_sidebar_collapsed') === 'true';
  });

  const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);
  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

  const toggleDesktopSidebar = () => {
    const nextState = !isSidebarCollapsed;
    setIsSidebarCollapsed(nextState);
    localStorage.setItem('dt_sidebar_collapsed', String(nextState));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#09090b] text-[#f4f4f5] selection:bg-blue-600/30 selection:text-white antialiased">
      {/* Mesh Glow Backgrounds */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 mesh-glow-blue opacity-100"></div>
        <div className="absolute inset-0 mesh-glow-purple opacity-70"></div>
        <div className="absolute inset-0 grid-overlay opacity-80"></div>
      </div>

      <Navbar 
        isAuthenticated={isAuthenticated} 
        onLogout={onLogout} 
        toggleSidebar={toggleMobileSidebar}
        isSidebarOpen={isMobileSidebarOpen}
      />
      
      <div className="flex flex-1 relative min-h-0">
        {isAuthenticated && (
          <>
            {/* Sidebar Wrapper */}
            <Sidebar 
              isOpen={isMobileSidebarOpen} 
              isCollapsed={isSidebarCollapsed}
              closeSidebar={closeMobileSidebar} 
              toggleCollapse={toggleDesktopSidebar}
              onLogout={onLogout}
            />

            {/* Desktop Sidebar Collapse Toggle Tab (shows when collapsed) */}
            {isSidebarCollapsed && (
              <button
                onClick={toggleDesktopSidebar}
                className="hidden md:flex fixed top-20 left-4 z-40 h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all shadow-md group"
                title="Expand Sidebar"
              >
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            )}
          </>
        )}
        
        <main className={`
          flex-1 p-4 sm:p-6 md:p-8 transition-all duration-300 min-h-0 w-full
          ${isAuthenticated 
            ? (isSidebarCollapsed ? 'md:pl-16' : 'md:pl-72') 
            : 'w-full'
          }
        `}>
          <div className="mx-auto max-w-7xl animate-fade-in min-h-full flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
