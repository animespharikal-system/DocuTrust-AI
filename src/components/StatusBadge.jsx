import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Loader } from 'lucide-react';

export default function StatusBadge({ status }) {
  const normalized = status?.toLowerCase() || 'pending';

  const configs = {
    verified: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: <CheckCircle className="w-4 h-4 mr-1.5 shrink-0" />,
      text: 'Verified',
    },
    caution: {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: <AlertTriangle className="w-4 h-4 mr-1.5 shrink-0" />,
      text: 'Caution',
    },
    warning: {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: <AlertTriangle className="w-4 h-4 mr-1.5 shrink-0" />,
      text: 'Caution',
    },
    compromised: {
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      icon: <XCircle className="w-4 h-4 mr-1.5 shrink-0" />,
      text: 'Compromised',
    },
    failed: {
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      icon: <XCircle className="w-4 h-4 mr-1.5 shrink-0" />,
      text: 'Compromised',
    },
    pending: {
      bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      icon: <Loader className="w-4 h-4 mr-1.5 shrink-0 animate-spin" />,
      text: 'Analyzing',
    },
    processing: {
      bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      icon: <Loader className="w-4 h-4 mr-1.5 shrink-0 animate-spin" />,
      text: 'Analyzing',
    },
  };

  const config = configs[normalized] || configs.pending;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.bg}`}>
      {config.icon}
      {config.text}
    </span>
  );
}
