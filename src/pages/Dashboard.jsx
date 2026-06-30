import React from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Brain,
  AlertCircle,
  Cpu,
  ArrowUpRight,
  Plus,
  MessageSquare,
  FileSearch,
  ArrowRight,
  TrendingUp,
  Activity,
} from "lucide-react";
import StatusBadge from "../components/StatusBadge";

export default function Dashboard() {
  import { useEffect, useState } from "react";
  import { getDashboard } from "../services/dashboardService";

  const [dashboard, setDashboard] = useState(null);

  const token = localStorage.getItem("access_token");
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboard(token);
        setDashboard(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadDashboard();
  }, []);
  const stats = [
    {
      name: "Documents",
      value: dashboard?.total_documents || 0,
      change: "",
      type: "success",
      icon: FileText,
    },
    {
      name: "Analyses",
      value: dashboard?.total_analysis || 0,
      change: "",
      type: "success",
      icon: Brain,
    },
    {
      name: "Authentic",
      value: dashboard?.authentic || 0,
      change: "",
      type: "success",
      icon: Activity,
    },
    {
      name: "Average Confidence",
      value: `${dashboard?.average_confidence || 0}%`,
      change: "",
      type: "success",
      icon: TrendingUp,
    },
  ];
  if (!dashboard) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Dashboard...
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Workspace Dashboard
          </h1>
          <p className="text-zinc-400 text-xs mt-1">
            Welcome back, Alex. Here is your RAG vector indexing status for
            today.
          </p>
        </div>
        <Link
          to="/upload"
          className="inline-flex items-center justify-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-lg shadow-lg shadow-blue-500/10 transition-all hover:scale-[1.01] active:scale-[0.99] self-start tracking-wider uppercase"
        >
          <Plus className="w-4 h-4" />
          Index New Document
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="rounded-xl border border-zinc-800/85 bg-zinc-900/10 p-5 flex flex-col justify-between min-h-[110px] hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start justify-between w-full">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  {stat.name}
                </span>
                <div className="h-7 w-7 rounded-md bg-zinc-900 border border-zinc-850 flex items-center justify-center text-zinc-400 shrink-0">
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-xl font-bold text-white tracking-tight font-mono">
                  {stat.value}
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    stat.type === "danger"
                      ? "bg-rose-500/10 text-rose-400"
                      : "bg-emerald-500/10 text-emerald-400"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Analytics */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* SVG Sparkline chart panel */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-800/80 bg-zinc-900/10 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
            <div>
              <h3 className="font-bold text-white text-xs">
                Vector Query Latency Trend
              </h3>
              <p className="text-[10px] text-zinc-500 mt-0.5">
                Average RAG search retrieval times (ms) over the last 7 days
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold bg-emerald-500/5 border border-emerald-500/10 px-2 py-1 rounded">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="font-mono">-14ms avg</span>
            </div>
          </div>

          {/* Simple custom SVG Sparkline chart */}
          <div className="relative h-44 w-full mt-4 flex items-end">
            <svg
              className="w-full h-full"
              viewBox="0 0 600 200"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="dashboardChartGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line
                x1="0"
                y1="40"
                x2="600"
                y2="40"
                stroke="#1c1c1f"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="90"
                x2="600"
                y2="90"
                stroke="#1c1c1f"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="140"
                x2="600"
                y2="140"
                stroke="#1c1c1f"
                strokeDasharray="3 3"
                strokeWidth="1"
              />

              {/* Area path */}
              <path
                d="M0 160 Q 100 135 200 95 T 400 65 T 600 50 L 600 200 L 0 200 Z"
                fill="url(#dashboardChartGrad)"
              />
              {/* Line path */}
              <path
                d="M0 160 Q 100 135 200 95 T 400 65 T 600 50"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Dot Indicators */}
              <circle
                cx="200"
                cy="95"
                r="4.5"
                fill="#3b82f6"
                stroke="#09090b"
                strokeWidth="2"
              />
              <circle
                cx="400"
                cy="65"
                r="4.5"
                fill="#3b82f6"
                stroke="#09090b"
                strokeWidth="2"
              />
              <circle
                cx="600"
                cy="50"
                r="4.5"
                fill="#10b981"
                stroke="#09090b"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div className="flex justify-between text-[9px] text-zinc-500 font-mono mt-4 border-t border-zinc-900/80 pt-3">
            <span>June 18</span>
            <span>June 20</span>
            <span>June 22</span>
            <span>Today (June 24)</span>
          </div>
        </div>

        {/* Extraction Rules Panel */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/10 p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-white text-xs">
              Document Processing Rules
            </h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">
              Vector database parsing triggers active globally
            </p>

            <div className="space-y-2 mt-4 text-xs font-mono">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950 border border-zinc-850">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-[11px] text-zinc-300">
                    Semantic Chunking
                  </span>
                </div>
                <span className="text-[9px] text-zinc-550">Active</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950 border border-zinc-850">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-[11px] text-zinc-300">
                    Layout OCR extraction
                  </span>
                </div>
                <span className="text-[9px] text-zinc-550">Active</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950 border border-zinc-850">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  <span className="text-[11px] text-zinc-300">
                    Auto Entity Metadata
                  </span>
                </div>
                <span className="text-[9px] text-blue-500 font-semibold">
                  Beta
                </span>
              </div>
            </div>
          </div>

          <Link
            to="/profile"
            className="group flex items-center justify-between text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors pt-4 border-t border-zinc-900/80 mt-4"
          >
            Manage Pipeline Rules
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/10 p-5">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
          <div>
            <h3 className="font-bold text-white text-xs">
              Recent Indexed Files
            </h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">
              Most recently indexed vector database entries
            </p>
          </div>
          <Link
            to="/history"
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 group"
          >
            History log
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-400">
            <thead>
              <tr className="border-b border-zinc-900 text-zinc-500 font-medium uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Document Name</th>
                <th className="py-3 px-4 hidden sm:table-cell">Type</th>
                <th className="py-3 px-4">Indexed Date</th>
                <th className="py-3 px-4">Index Status</th>
                <th className="py-3 px-4 text-center">Chunks</th>
                <th className="py-3 px-4 text-center">Queries</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {dashboard.recent_activity.map((doc, index) => {
                // Map verified to "Indexed", caution to "Partial", compromised to "Parse Failure"
                const statusLabel =
                  doc.prediction === "Likely Authentic"
                    ? "indexed"
                    : "compromised";

                return (
                  <tr
                    key={index}
                    className="hover:bg-zinc-900/20 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-semibold text-white max-w-[150px] truncate sm:max-w-xs">
                      {doc.document_name}
                    </td>
                    <td className="py-3.5 px-4 hidden sm:table-cell text-zinc-550">
                      PDF
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-500">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      {statusLabel === "indexed" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border border-emerald-500/20 bg-emerald-500/5 text-emerald-400">
                          Indexed
                        </span>
                      )}
                      {statusLabel === "caution" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border border-amber-500/20 bg-amber-500/5 text-amber-400">
                          Partial Index
                        </span>
                      )}
                      {statusLabel === "compromised" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border border-rose-500/20 bg-rose-500/5 text-rose-400">
                          Parse Failure
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-zinc-300">
                      -
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-zinc-350">
                      {doc.confidence}%
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <Link
                          to="/chat"
                          className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-blue-400 transition-colors"
                          title="Chat AI"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Link>
                        <Link
                          to="/history"
                          className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                          title="Report Details"
                        >
                          <FileSearch className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
