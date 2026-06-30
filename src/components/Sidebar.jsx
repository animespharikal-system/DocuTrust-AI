import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Files,
  MessageSquare,
  History,
  User,
  Zap,
  ChevronLeft,
  LogOut,
} from "lucide-react";

export default function Sidebar({
  isOpen,
  isCollapsed,
  closeSidebar,
  toggleCollapse,
  onLogout,
}) {
  const navigate = useNavigate();

  const navItems = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      shortcut: "D",
    },
    { to: "/upload", label: "Documents", icon: Files, shortcut: "U" },
    { to: "/chat", label: "AI Chat", icon: MessageSquare, shortcut: "C" },
    { to: "/history", label: "History", icon: History, shortcut: "H" },
    { to: "/profile", label: "Profile", icon: User, shortcut: "P" },
  ];

  const handleLogout = () => {
    closeSidebar();
    if (onLogout) onLogout();
    navigate("/");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-zinc-950/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`
        fixed bottom-0 top-16 left-0 z-40 border-r border-zinc-800 bg-[#09090b] transition-all duration-300 md:translate-x-0 flex flex-col justify-between
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        ${isCollapsed ? "w-16 px-2" : "w-64 px-4"}
      `}
      >
        {/* Toggle Collapse Button on Desktop */}
        {!isCollapsed && (
          <button
            onClick={toggleCollapse}
            className="hidden md:flex absolute top-4 -right-3.5 z-50 h-7 w-7 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all shadow-md group"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </button>
        )}

        <div className="flex flex-col h-full justify-between py-6">
          <div className="space-y-6">
            {/* Navigation Header */}
            {!isCollapsed ? (
              <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Workspace
              </span>
            ) : (
              <div className="h-4 border-b border-zinc-900 mb-2"></div>
            )}

            {/* Menu Links */}
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={closeSidebar}
                      title={isCollapsed ? item.label : undefined}
                      className={({ isActive }) => `
                        flex items-center rounded-lg text-xs font-semibold transition-all duration-150 group border border-transparent
                        ${
                          isCollapsed
                            ? "justify-center p-2.5 hover:bg-zinc-900 hover:text-zinc-200"
                            : "gap-3 px-3 py-2.5 hover:bg-zinc-900/60 hover:text-zinc-200"
                        }
                        ${
                          isActive
                            ? "bg-zinc-900 text-white border-zinc-800"
                            : "text-zinc-400 hover:text-zinc-200"
                        }
                      `}
                    >
                      <Icon
                        className={`h-4.5 w-4.5 shrink-0 transition-transform duration-200 group-hover:scale-[1.03] ${
                          isCollapsed ? "" : "mr-0.5"
                        }`}
                      />

                      {!isCollapsed && (
                        <div className="flex-1 flex items-center justify-between">
                          <span>{item.label}</span>
                          <kbd className="hidden group-hover:inline-block font-mono text-[9px] text-zinc-650 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-850">
                            {item.shortcut}
                          </kbd>
                        </div>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Sidebar Footer details */}
          {!isCollapsed && (
            <div className="space-y-4">
              {/* RAG Engine Status Widget */}
              <div className="rounded-xl border border-zinc-850 bg-zinc-900/20 p-3.5">
                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  RAG Database Status
                </div>
                <div className="mt-2.5 space-y-1.5 text-xs text-zinc-400 font-mono">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Embeddings Model</span>
                    <span
                      className="text-zinc-350 truncate max-w-[80px]"
                      title="text-embedding-3-small"
                    >
                      text-emb-3
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Vector Status</span>
                    <span className="text-emerald-400 font-medium">
                      99.9% Health
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Pro Indicator */}
              <div className="rounded-xl bg-gradient-to-br from-indigo-950/20 to-zinc-900/40 border border-indigo-500/10 p-3.5 relative overflow-hidden group">
                <div className="absolute -right-6 -bottom-6 h-16 w-16 rounded-full bg-indigo-500/5 blur-xl"></div>
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-indigo-300 uppercase tracking-widest">
                  <Zap className="h-3.5 w-3.5 fill-indigo-400/20 text-indigo-400" />
                  Premium Active
                </div>
                <p className="mt-1.5 text-[11px] text-zinc-400 leading-normal">
                  You are utilizing the Pro RAG Workspace.
                </p>
                <div className="mt-3.5 flex justify-between items-center text-[10px] font-medium border-t border-zinc-900 pt-2.5">
                  <span className="text-zinc-500">Renew: July 24</span>
                  <span className="text-indigo-400 font-semibold">
                    {localStorage.getItem("user_name")}
                  </span>
                </div>
              </div>

              {/* User identity + Logout row */}
              <div className="flex items-center gap-2 pt-1 border-t border-zinc-900">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-sm">
                    {localStorage.getItem("user_name")?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      {localStorage.getItem("user_name")}
                    </p>
                    <p className="text-[9px] text-zinc-500 truncate">
                      Pro Workspace
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1.5 rounded-lg text-zinc-500 hover:bg-rose-950/30 hover:text-rose-400 transition-colors shrink-0"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Collapsed state: logout icon only */}
          {isCollapsed && (
            <div className="flex flex-col items-center gap-3 border-t border-zinc-900 pt-4">
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2.5 rounded-lg text-zinc-500 hover:bg-rose-950/30 hover:text-rose-400 transition-colors"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
