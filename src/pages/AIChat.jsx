import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  FileText,
  FileImage,
  File,
  Send,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  Search,
  RotateCcw,
  Zap,
  Link2,
  Hash,
  BarChart2,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowUpRight,
  X,
} from 'lucide-react';

// ─── Mock document library ────────────────────────────────────────────────────
const DOCUMENTS = [
  {
    id: 1,
    name: 'Vendor_Agreement_Q3.pdf',
    type: 'PDF',
    pages: 12,
    size: '248 KB',
    chunks: 24,
    status: 'indexed',
    uploadedAt: '2026-06-24',
    sections: [
      { page: 1, title: 'Scope & Introduction' },
      { page: 2, title: 'Services & SLA' },
      { page: 3, title: 'Fee Schedule' },
      { page: 4, title: 'Payment Milestones' },
      { page: 5, title: 'Confidentiality' },
      { page: 6, title: 'Liability & Limits' },
      { page: 7, title: 'IP & Indemnities' },
      { page: 9, title: 'Termination Clauses' },
      { page: 11, title: 'Exhibit A – Services' },
      { page: 12, title: 'Exhibit B – Compensation' },
    ],
  },
  {
    id: 2,
    name: 'Financial_Statement_Final.pdf',
    type: 'PDF',
    pages: 38,
    size: '4.8 MB',
    chunks: 64,
    status: 'indexed',
    uploadedAt: '2026-06-23',
    sections: [
      { page: 1, title: 'Executive Summary' },
      { page: 4, title: 'Revenue Breakdown' },
      { page: 9, title: 'P&L Statement' },
      { page: 14, title: 'Balance Sheet' },
      { page: 20, title: 'Cash Flow Analysis' },
      { page: 28, title: 'Notes to Accounts' },
    ],
  },
  {
    id: 3,
    name: 'NDA_Consulting_Sarah.pdf',
    type: 'PDF',
    pages: 6,
    size: '185 KB',
    chunks: 18,
    status: 'indexed',
    uploadedAt: '2026-06-18',
    sections: [
      { page: 1, title: 'Parties & Recitals' },
      { page: 2, title: 'Confidential Information' },
      { page: 3, title: 'Obligations' },
      { page: 5, title: 'Remedies & Term' },
    ],
  },
  {
    id: 4,
    name: 'Invoice_Redacted_1.png',
    type: 'Image',
    pages: 1,
    size: '1.2 MB',
    chunks: 8,
    status: 'partial',
    uploadedAt: '2026-06-22',
    sections: [{ page: 1, title: 'Invoice Content' }],
  },
];

// ─── RAG mock response bank keyed by document × topic ─────────────────────────
const RESPONSES = {
  1: {
    payment: {
      text: 'According to **Section 4.2 (Payment Milestones)**, the compensation schedule is structured in three tranches:\n\n1. **30% upfront deposit** ($15,000) — paid upon contract execution and countersignature.\n2. **50% milestone payment** ($25,000) — payable upon delivery and acceptance of Phase 1 code audit deliverables.\n3. **20% retention release** ($10,000) — disbursed 30 days after final production deployment sign-off.\n\nAll payments are due within **14 business days** of invoice issuance as per **Exhibit B**.',
      sources: [
        { id: 1, section: 'Section 4.2 — Fee Schedule', page: 4, confidence: 97 },
        { id: 2, section: 'Exhibit B — Compensation Schedule', page: 12, confidence: 94 },
        { id: 3, section: 'Section 3.1 — Invoice Terms', page: 3, confidence: 88 },
      ],
    },
    liability: {
      text: '**Section 8.1** establishes a mutual **Limitation of Liability** capped at the total aggregate fees paid under this Agreement ($50,005). Key carve-outs include:\n\n- **IP Indemnity claims** (Section 9.3) — uncapped and survive termination.\n- **Gross negligence or wilful misconduct** — excluded from liability cap.\n- **Confidentiality breaches** — subject to equitable relief without bond requirement.\n\nThis constitutes a **moderate-risk** liability profile. Recommend legal counsel review Section 9 before execution.',
      sources: [
        { id: 1, section: 'Section 8.1 — Limitation of Liability', page: 6, confidence: 99 },
        { id: 2, section: 'Section 9.3 — IP Indemnity Clause', page: 7, confidence: 96 },
        { id: 3, section: 'Section 8.3 — Carve-outs', page: 6, confidence: 91 },
      ],
    },
    termination: {
      text: '**Section 11** governs termination rights for both parties:\n\n- **Termination without cause**: Either party may terminate upon **30 days written notice**.\n- **Termination for cause**: Immediate termination if a material breach is not cured within **10 business days** of written notice.\n- **Insolvency trigger**: Automatic termination upon filing of bankruptcy or insolvency proceedings.\n\nPost-termination, the Vendor must return or destroy all Confidential Information within **5 business days** (Section 11.4).',
      sources: [
        { id: 1, section: 'Section 11.1 — Termination Without Cause', page: 9, confidence: 99 },
        { id: 2, section: 'Section 11.2 — Material Breach Cure', page: 9, confidence: 98 },
        { id: 3, section: 'Section 11.4 — Post-Termination Obligations', page: 10, confidence: 93 },
      ],
    },
    summary: {
      text: '**Vendor_Agreement_Q3.pdf** is a **Vendor Services Agreement** between:\n\n- **Client**: DocuTrust AI Technologies Inc.\n- **Vendor**: Sarah Jenkins Consulting LLC\n\n**Key terms at a glance:**\n- Effective date: July 1, 2026\n- Total contract value: **$50,000**\n- Term: 12 months with auto-renewal\n- Governing law: State of Texas\n- IP ownership: Client retains all work-product IP\n\nThe agreement covers audit review services, security integrations, and ongoing technical consultancy.',
      sources: [
        { id: 1, section: 'Summary Block — Cover Page', page: 1, confidence: 99 },
        { id: 2, section: 'Section 1 — Scope of Services', page: 2, confidence: 97 },
        { id: 3, section: 'Section 12 — General Provisions', page: 11, confidence: 89 },
      ],
    },
  },
  2: {
    revenue: {
      text: 'Per the **Revenue Breakdown (Page 4)**, total FY2026 revenue is **$4.82M**, up 23% YoY:\n\n- **SaaS subscriptions**: $3.1M (64%)\n- **Professional services**: $980K (20%)\n- **API licensing**: $740K (15%)\n- **Other income**: $48K (1%)\n\nMRR at period end: **$401K** with a net revenue retention of **118%**.',
      sources: [
        { id: 1, section: 'Revenue Breakdown — Page 4', page: 4, confidence: 98 },
        { id: 2, section: 'P&L Statement — Page 9', page: 9, confidence: 95 },
        { id: 3, section: 'Executive Summary — Page 1', page: 1, confidence: 91 },
      ],
    },
    summary: {
      text: 'The **Financial Statement Final** covers the fiscal year ending **March 31, 2026**. Key highlights:\n\n- **Total Revenue**: $4.82M (+23% YoY)\n- **Gross Margin**: 71%\n- **Operating Income**: $820K\n- **Cash & Equivalents**: $2.1M\n- **Total Liabilities**: $640K\n\nThe company is **profitable at operating level** with a healthy balance sheet and no long-term debt.',
      sources: [
        { id: 1, section: 'Executive Summary — Page 1', page: 1, confidence: 99 },
        { id: 2, section: 'Balance Sheet — Page 14', page: 14, confidence: 96 },
        { id: 3, section: 'Cash Flow Analysis — Page 20', page: 20, confidence: 90 },
      ],
    },
  },
  3: {
    summary: {
      text: 'The **NDA_Consulting_Sarah.pdf** is a mutual Non-Disclosure Agreement:\n\n- **Disclosing Party**: DocuTrust AI Technologies\n- **Receiving Party**: Sarah Jenkins Consulting LLC\n- **Term**: 2 years from execution date\n- **Confidentiality period**: Survives 3 years post-termination\n\nBoth parties are obligated to protect disclosed information with at least the same degree of care used for their own confidential information.',
      sources: [
        { id: 1, section: 'Parties & Recitals — Page 1', page: 1, confidence: 99 },
        { id: 2, section: 'Obligations — Page 3', page: 3, confidence: 96 },
        { id: 3, section: 'Remedies & Term — Page 5', page: 5, confidence: 93 },
      ],
    },
  },
};

// ─── Suggestion chips per document ───────────────────────────────────────────
const SUGGESTIONS = {
  1: ['Summarize this document', 'What are the payment milestones?', 'Explain liability limits', 'When does this contract terminate?'],
  2: ['Give me a financial summary', 'Break down revenue streams', 'What is the gross margin?', 'Analyze cash flow'],
  3: ['Summarize this NDA', 'What is confidential under this NDA?', 'What are the obligations?', 'When does the NDA expire?'],
  4: ['Describe this invoice', 'Extract line items', 'What is the total amount?'],
};

// ─── Match user query to a response ──────────────────────────────────────────
function matchResponse(docId, text) {
  const q = text.toLowerCase();
  const bank = RESPONSES[docId];
  if (!bank) return null;

  if (q.includes('payment') || q.includes('milestone') || q.includes('fee') || q.includes('money') || q.includes('compensat')) return bank.payment;
  if (q.includes('liabilit') || q.includes('risk') || q.includes('indemnit') || q.includes('cap')) return bank.liability;
  if (q.includes('termin') || q.includes('cancel') || q.includes('end contract') || q.includes('notice period')) return bank.termination;
  if (q.includes('revenue') || q.includes('income') || q.includes('earn') || q.includes('sales')) return bank.revenue;
  return bank.summary;
}

// ─── Helper: file type icon ───────────────────────────────────────────────────
function DocIcon({ type, className = 'h-4 w-4' }) {
  if (type === 'PDF') return <FileText className={`${className} text-rose-400`} />;
  if (type === 'Image') return <FileImage className={`${className} text-violet-400`} />;
  return <File className={`${className} text-blue-400`} />;
}

// ─── Confidence score badge ───────────────────────────────────────────────────
function ConfidenceBadge({ score }) {
  const color = score >= 95 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    : score >= 80 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    : 'text-rose-400 bg-rose-500/10 border-rose-500/20';
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border ${color} font-mono`}>
      <BarChart2 className="h-2.5 w-2.5" />
      {score}%
    </span>
  );
}

// ─── Source citation card ─────────────────────────────────────────────────────
function SourceCard({ source, index }) {
  return (
    <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-colors group">
      <span className="h-5 w-5 rounded-md bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-[9px] font-bold text-blue-400 shrink-0 mt-0.5">
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-zinc-200 leading-snug truncate">{source.section}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="inline-flex items-center gap-1 text-[10px] text-zinc-500 font-mono">
            <Hash className="h-2.5 w-2.5" /> Page {source.page}
          </span>
          <span className="h-3 w-px bg-zinc-800" />
          <ConfidenceBadge score={source.confidence} />
        </div>
      </div>
      <ArrowUpRight className="h-3 w-3 text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0 mt-1" />
    </div>
  );
}

// ─── Renders inline citation markers [1] in text ──────────────────────────────
function RichText({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[\d+\])/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (/^\*\*[^*]+\*\*$/.test(part)) {
          return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
        }
        if (/^\[\d+\]$/.test(part)) {
          return (
            <sup key={i} className="text-blue-400 font-bold text-[9px] ml-0.5 cursor-pointer hover:text-blue-300">
              {part}
            </sup>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

// ─── AI message bubble ────────────────────────────────────────────────────────
function AIMessage({ msg, onCopy, copiedId }) {
  const [showSources, setShowSources] = useState(true);
  const paragraphs = msg.text.split('\n\n');

  return (
    <div className="flex gap-3 group animate-fade-in">
      {/* Avatar */}
      <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-600 to-blue-700 flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-violet-500/20">
        <Sparkles className="h-4 w-4 text-white" />
      </div>

      <div className="flex-1 min-w-0 space-y-3">
        {/* Answer card */}
        <div className="rounded-2xl rounded-tl-sm bg-zinc-900/60 border border-zinc-800 px-5 py-4 space-y-3">
          {/* Label */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Answer</span>
            <div className="h-px flex-1 bg-zinc-800/80" />
            <span className="text-[9px] text-zinc-600 font-mono">{msg.timestamp}</span>
          </div>

          {/* Answer text */}
          <div className="text-sm text-zinc-300 leading-relaxed space-y-2">
            {paragraphs.map((para, i) => {
              if (para.startsWith('- ') || para.includes('\n- ')) {
                const items = para.split('\n').filter(Boolean);
                return (
                  <ul key={i} className="space-y-1.5 ml-1">
                    {items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-600 mt-2 shrink-0" />
                        <span className="text-zinc-300"><RichText text={item.replace(/^- /, '')} /></span>
                      </li>
                    ))}
                  </ul>
                );
              }
              if (/^\d+\.\s/.test(para) || para.includes('\n1.') || para.includes('\n2.')) {
                const items = para.split('\n').filter(Boolean);
                return (
                  <ol key={i} className="space-y-2 ml-1">
                    {items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-zinc-300">
                        <span className="h-5 w-5 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-[9px] font-bold text-blue-400 shrink-0 mt-0.5">
                          {j + 1}
                        </span>
                        <span><RichText text={item.replace(/^\d+\.\s/, '')} /></span>
                      </li>
                    ))}
                  </ol>
                );
              }
              return (
                <p key={i} className="text-zinc-300">
                  <RichText text={para} />
                </p>
              );
            })}
          </div>

          {/* Sources section */}
          {msg.sources && msg.sources.length > 0 && (
            <div className="mt-1 pt-3 border-t border-zinc-800/80">
              <button
                onClick={() => setShowSources(!showSources)}
                className="flex items-center gap-2 mb-2.5 group/btn"
              >
                <Link2 className="h-3 w-3 text-zinc-500" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover/btn:text-zinc-300 transition-colors">
                  Sources ({msg.sources.length})
                </span>
                <ChevronRight className={`h-3 w-3 text-zinc-600 transition-transform ${showSources ? 'rotate-90' : ''}`} />
              </button>

              {showSources && (
                <div className="grid gap-1.5">
                  {msg.sources.map((src, i) => (
                    <SourceCard key={src.id} source={src} index={i} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action toolbar */}
        <div className="flex items-center gap-3 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onCopy(msg.id, msg.text)}
            className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            {copiedId === msg.id
              ? <><Check className="h-3.5 w-3.5 text-emerald-400" /><span className="text-emerald-400">Copied</span></>
              : <><Copy className="h-3.5 w-3.5" />Copy</>
            }
          </button>
          <span className="h-3 w-px bg-zinc-800" />
          <button
            onClick={() => alert('Feedback recorded — thank you!')}
            className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-emerald-400 transition-colors"
          >
            <ThumbsUp className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => alert('Feedback recorded — thank you!')}
            className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-rose-400 transition-colors"
          >
            <ThumbsDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── User message bubble ──────────────────────────────────────────────────────
function UserMessage({ msg }) {
  return (
    <div className="flex gap-3 justify-end animate-fade-in">
      <div className="max-w-[78%]">
        <div className="rounded-2xl rounded-tr-sm bg-blue-600 px-4 py-3">
          <p className="text-sm text-white leading-relaxed font-medium">{msg.text}</p>
        </div>
        <p className="text-[9px] text-zinc-600 font-mono mt-1.5 text-right px-1">{msg.timestamp}</p>
      </div>
      {/* User avatar */}
      <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shrink-0 mt-0.5 shadow-md shadow-blue-500/20">
        <span className="text-[10px] font-bold text-white">AC</span>
      </div>
    </div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-600 to-blue-700 flex items-center justify-center shrink-0 shadow-md shadow-violet-500/20">
        <Sparkles className="h-4 w-4 text-white" />
      </div>
      <div className="rounded-2xl rounded-tl-sm bg-zinc-900/60 border border-zinc-800 px-5 py-4 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '160ms' }} />
        <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '320ms' }} />
      </div>
    </div>
  );
}

// ─── Empty / welcome state ────────────────────────────────────────────────────
function WelcomeState({ activeDoc, onSuggestion }) {
  const chips = SUGGESTIONS[activeDoc?.id] || ['Ask me anything about this document…'];

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-4 py-10">
      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-700 flex items-center justify-center shadow-2xl shadow-violet-500/20">
        <Sparkles className="h-8 w-8 text-white" />
      </div>

      <div className="text-center space-y-2 max-w-sm">
        <h2 className="text-lg font-bold text-white tracking-tight">
          {activeDoc ? `Ask about ${activeDoc.name.split('.')[0]}` : 'Select a document'}
        </h2>
        <p className="text-sm text-zinc-500 leading-relaxed">
          {activeDoc
            ? `I've indexed ${activeDoc.chunks} semantic chunks across ${activeDoc.pages} pages. Ask me anything.`
            : 'Choose a document from the left panel to start your AI-powered analysis session.'}
        </p>
      </div>

      {activeDoc && (
        <div className="flex flex-wrap justify-center gap-2 max-w-md">
          {chips.map((chip, i) => (
            <button
              key={i}
              onClick={() => onSuggestion(chip)}
              className="text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 px-3.5 py-2 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {chip}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AIChat() {
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [activeDocId, setActiveDocId] = useState(1);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [docSearch, setDocSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activeDoc = DOCUMENTS.find((d) => d.id === activeDocId);
  const suggestions = SUGGESTIONS[activeDocId] || [];

  // Filtered doc list
  const filteredDocs = DOCUMENTS.filter((d) =>
    d.name.toLowerCase().includes(docSearch.toLowerCase())
  );

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when doc changes
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeDocId]);

  // Switch document — clear conversation
  const switchDoc = (doc) => {
    if (doc.status !== 'indexed') return;
    setActiveDocId(doc.id);
    setMessages([]);
    setInput('');
  };

  // Copy message
  const handleCopy = useCallback((id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  }, []);

  // Submit message
  const submitMessage = useCallback((text) => {
    if (!text.trim() || !activeDoc || isTyping) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setInput('');

    const delay = 1200 + Math.random() * 800;
    setTimeout(() => {
      const match = matchResponse(activeDoc.id, text);
      const fallback = {
        text: "I couldn't find a specific answer to that query within the indexed document chunks. Try rephrasing, or select one of the suggested topics below.",
        sources: [],
      };
      const resp = match || fallback;

      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        text: resp.text,
        sources: resp.sources || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setIsTyping(false);
      setMessages((prev) => [...prev, aiMsg]);
    }, delay);
  }, [activeDoc, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMessage(input);
  };

  return (
    <div className="flex h-[calc(100svh-5rem)] min-h-[560px] gap-0 -m-4 sm:-m-6 md:-m-8 overflow-hidden rounded-none md:rounded-none">

      {/* ── LEFT PANEL: Document Library ──────────────────────────────────── */}
      <aside
        className={`
          flex flex-col border-r border-zinc-800 bg-[#0a0a0d] transition-all duration-300 shrink-0
          ${sidebarOpen ? 'w-72 opacity-100' : 'w-0 opacity-0 overflow-hidden'}
        `}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-zinc-500" />
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Documents</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-600 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
            {DOCUMENTS.filter(d => d.status === 'indexed').length} ready
          </span>
        </div>

        {/* Doc search */}
        <div className="px-3 pt-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
            <input
              type="text"
              value={docSearch}
              onChange={(e) => setDocSearch(e.target.value)}
              placeholder="Search documents…"
              className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-zinc-700 transition-colors"
            />
          </div>
        </div>

        {/* Document list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {filteredDocs.map((doc) => {
            const isActive = doc.id === activeDocId;
            const isDisabled = doc.status !== 'indexed';

            return (
              <button
                key={doc.id}
                onClick={() => switchDoc(doc)}
                disabled={isDisabled}
                className={`w-full text-left rounded-xl p-3 transition-all duration-150 border group
                  ${isActive
                    ? 'bg-blue-600/12 border-blue-500/30 shadow-sm'
                    : isDisabled
                      ? 'border-transparent opacity-50 cursor-not-allowed'
                      : 'border-transparent hover:bg-zinc-900/60 hover:border-zinc-800'
                  }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border
                    ${isActive ? 'bg-blue-500/15 border-blue-500/30' : 'bg-zinc-900 border-zinc-800 group-hover:border-zinc-700'}`}>
                    <DocIcon type={doc.type} className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate leading-snug ${isActive ? 'text-white' : 'text-zinc-300'}`}>
                      {doc.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-zinc-500 font-mono">{doc.pages}p · {doc.size}</span>
                    </div>
                  </div>
                </div>

                {/* Indexed stats */}
                {doc.status === 'indexed' && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.min(100, (doc.chunks / 70) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-zinc-500 font-mono shrink-0">{doc.chunks} chunks</span>
                  </div>
                )}

                {doc.status === 'partial' && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <AlertTriangle className="h-3 w-3 text-amber-400" />
                    <span className="text-[10px] text-amber-400 font-semibold">Partial index</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Active doc details */}
        {activeDoc && (
          <div className="px-3 pb-4 border-t border-zinc-800 pt-3 space-y-2">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-1">Active Document</p>
            <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-3 space-y-2">
              <p className="text-[11px] font-semibold text-white truncate">{activeDoc.name}</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Pages', value: activeDoc.pages },
                  { label: 'Chunks', value: activeDoc.chunks },
                  { label: 'Chats', value: messages.filter(m => m.role === 'user').length },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg bg-zinc-950/60 border border-zinc-800 py-1.5">
                    <p className="text-xs font-bold text-white font-mono">{value}</p>
                    <p className="text-[9px] text-zinc-600">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* ── RIGHT PANEL: Chat Interface ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-[#09090b] min-w-0">

        {/* Chat header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            {/* Sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
              title={sidebarOpen ? 'Hide documents' : 'Show documents'}
            >
              {sidebarOpen
                ? <PanelLeftClose className="h-4 w-4" />
                : <PanelLeftOpen className="h-4 w-4" />
              }
            </button>

            <div className="h-4 w-px bg-zinc-800" />

            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-600 to-blue-700 flex items-center justify-center shadow-sm shadow-violet-500/20">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white leading-none">DocuTrust AI</h1>
                <p className="text-[10px] text-zinc-500 mt-0.5 leading-none">
                  {activeDoc ? `Analyzing ${activeDoc.name}` : 'Select a document to begin'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Status */}
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              RAG Active
            </div>

            {/* Clear chat */}
            {messages.length > 0 && (
              <button
                onClick={() => setMessages([])}
                className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500 hover:text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-2.5 py-1.5 rounded-lg transition-colors"
                title="Clear conversation"
              >
                <RotateCcw className="h-3 w-3" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-10 lg:px-16 py-6 space-y-6">
          {messages.length === 0 ? (
            <WelcomeState activeDoc={activeDoc} onSuggestion={submitMessage} />
          ) : (
            <>
              {messages.map((msg) =>
                msg.role === 'user' ? (
                  <UserMessage key={msg.id} msg={msg} />
                ) : (
                  <AIMessage key={msg.id} msg={msg} onCopy={handleCopy} copiedId={copiedId} />
                )
              )}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* ── Input area ──────────────────────────────────────────────────── */}
        <div className="shrink-0 border-t border-zinc-800 bg-[#09090b]/80 backdrop-blur-md px-4 sm:px-6 md:px-10 lg:px-16 py-4 space-y-3">

          {/* Suggestion chips — shown when there are messages */}
          {messages.length > 0 && !isTyping && activeDoc && (
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {suggestions.slice(0, 3).map((chip, i) => (
                <button
                  key={i}
                  onClick={() => submitMessage(chip)}
                  className="text-[11px] font-medium text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-xl transition-all shrink-0 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input form */}
          <form onSubmit={handleSubmit}>
            <div className={`flex items-end gap-3 bg-zinc-900/80 border rounded-2xl px-4 py-3 transition-all duration-200
              ${activeDoc ? 'border-zinc-700 focus-within:border-zinc-600 focus-within:shadow-lg focus-within:shadow-black/20' : 'border-zinc-800 opacity-60'}
            `}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    submitMessage(input);
                  }
                }}
                placeholder={
                  activeDoc
                    ? `Ask anything about ${activeDoc.name.split('.')[0]}… (Enter to send)`
                    : 'Select a document to start chatting…'
                }
                disabled={!activeDoc || isTyping}
                rows={1}
                className="flex-1 bg-transparent text-sm text-white placeholder-zinc-600 outline-none resize-none leading-relaxed max-h-[120px] overflow-y-auto"
              />

              <button
                type="submit"
                disabled={!input.trim() || !activeDoc || isTyping}
                className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all shrink-0 mb-0.5
                  ${input.trim() && activeDoc && !isTyping
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95'
                    : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                  }`}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>

            <p className="text-[10px] text-zinc-700 text-center mt-2">
              DocuTrust AI · Semantic RAG · Responses grounded in indexed document chunks
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
