import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  FileImage,
  File,
  Trash2,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  X,
  ChevronDown,
  Download,
  Eye,
  FolderOpen,
  ArrowUpRight,
  Clock,
  HardDrive,
  Layers,
  RefreshCw,
  FilePlus,
} from 'lucide-react';

// ─── Mock seed data ────────────────────────────────────────────────────────────
const SEED_DOCS = [
  {
    id: 1,
    name: 'Vendor_Agreement_Q3.pdf',
    type: 'PDF',
    size: '248 KB',
    pages: 12,
    chunks: 24,
    uploadedAt: '2026-06-24',
    status: 'indexed',
    score: 98,
    owner: 'Alex Carter',
  },
  {
    id: 2,
    name: 'Financial_Statement_Final.pdf',
    type: 'PDF',
    size: '4.8 MB',
    pages: 38,
    chunks: 64,
    uploadedAt: '2026-06-23',
    status: 'indexed',
    score: 99,
    owner: 'Alex Carter',
  },
  {
    id: 3,
    name: 'Invoice_Redacted_1.png',
    type: 'Image',
    size: '1.2 MB',
    pages: 1,
    chunks: 8,
    uploadedAt: '2026-06-22',
    status: 'partial',
    score: 68,
    owner: 'Sarah Jenkins',
  },
  {
    id: 4,
    name: 'Contract_Draft_v2.docx',
    type: 'DOCX',
    size: '320 KB',
    pages: 7,
    chunks: 0,
    uploadedAt: '2026-06-20',
    status: 'failed',
    score: 0,
    owner: 'Alex Carter',
  },
  {
    id: 5,
    name: 'NDA_Consulting_Sarah.pdf',
    type: 'PDF',
    size: '185 KB',
    pages: 6,
    chunks: 18,
    uploadedAt: '2026-06-18',
    status: 'indexed',
    score: 96,
    owner: 'Sarah Jenkins',
  },
  {
    id: 6,
    name: 'Identity_Proof_Sarah.jpeg',
    type: 'Image',
    size: '2.4 MB',
    pages: 1,
    chunks: 5,
    uploadedAt: '2026-06-18',
    status: 'indexed',
    score: 95,
    owner: 'Alex Carter',
  },
  {
    id: 7,
    name: 'Q2_Corporate_Lease.pdf',
    type: 'PDF',
    size: '8.1 MB',
    pages: 44,
    chunks: 11,
    uploadedAt: '2026-06-15',
    status: 'partial',
    score: 71,
    owner: 'Alex Carter',
  },
  {
    id: 8,
    name: 'Supplier_Contract_2026.pdf',
    type: 'PDF',
    size: '512 KB',
    pages: 21,
    chunks: 42,
    uploadedAt: '2026-06-12',
    status: 'indexed',
    score: 97,
    owner: 'Sarah Jenkins',
  },
];

// ─── Upload pipeline steps ─────────────────────────────────────────────────────
const PIPELINE_STEPS = [
  'Extracting layout & OCR structures',
  'Generating semantic text chunks',
  'Computing vector embeddings',
  'Indexing into vector database',
];

// ─── Helper: file-type icon + color ───────────────────────────────────────────
function FileTypeIcon({ type, size = 'md' }) {
  const sz = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  if (type === 'PDF')
    return (
      <div className={`flex items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/20 ${size === 'sm' ? 'h-7 w-7' : 'h-9 w-9'}`}>
        <FileText className={`${sz} text-rose-400`} />
      </div>
    );
  if (type === 'Image' || type === 'PNG' || type === 'JPEG' || type === 'JPG')
    return (
      <div className={`flex items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/20 ${size === 'sm' ? 'h-7 w-7' : 'h-9 w-9'}`}>
        <FileImage className={`${sz} text-violet-400`} />
      </div>
    );
  return (
    <div className={`flex items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 ${size === 'sm' ? 'h-7 w-7' : 'h-9 w-9'}`}>
      <File className={`${sz} text-blue-400`} />
    </div>
  );
}

// ─── Status pill ───────────────────────────────────────────────────────────────
function StatusPill({ status }) {
  if (status === 'indexed')
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border border-emerald-500/25 bg-emerald-500/8 text-emerald-400">
        <CheckCircle2 className="h-3 w-3" /> Indexed
      </span>
    );
  if (status === 'partial')
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border border-amber-500/25 bg-amber-500/8 text-amber-400">
        <AlertTriangle className="h-3 w-3" /> Partial Index
      </span>
    );
  if (status === 'failed')
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border border-rose-500/25 bg-rose-500/8 text-rose-400">
        <XCircle className="h-3 w-3" /> Parse Failed
      </span>
    );
  if (status === 'uploading')
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border border-blue-500/25 bg-blue-500/8 text-blue-400">
        <Loader2 className="h-3 w-3 animate-spin" /> Processing
      </span>
    );
  return null;
}

// ─── Score bar ─────────────────────────────────────────────────────────────────
function ScoreBar({ score }) {
  const color =
    score >= 90 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-[10px] font-mono text-zinc-400">{score}%</span>
    </div>
  );
}

// ─── Delete confirmation modal ─────────────────────────────────────────────────
function DeleteModal({ doc, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <Trash2 className="h-5 w-5 text-rose-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Delete Document</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed mb-5">
          Are you sure you want to permanently delete{' '}
          <span className="font-semibold text-white">{doc.name}</span>? All vector
          embeddings and index entries will be removed.
        </p>
        <div className="flex gap-2.5">
          <button
            onClick={onCancel}
            className="flex-1 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 py-2.5 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 py-2.5 rounded-xl transition-colors shadow-lg shadow-rose-500/10"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Upload progress toast ─────────────────────────────────────────────────────
function UploadToast({ upload, onDismiss }) {
  const isDone = upload.step >= PIPELINE_STEPS.length;
  const isFailed = upload.failed;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/40 animate-fade-in overflow-hidden">
      {/* Progress fill bar across top */}
      {!isDone && !isFailed && (
        <div className="h-0.5 bg-zinc-800">
          <div
            className="h-full bg-blue-500 transition-all duration-700"
            style={{ width: `${(upload.step / PIPELINE_STEPS.length) * 100}%` }}
          />
        </div>
      )}
      {isDone && <div className="h-0.5 bg-emerald-500" />}
      {isFailed && <div className="h-0.5 bg-rose-500" />}

      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <FileTypeIcon type={upload.type} size="sm" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{upload.name}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">{upload.size}</p>
            </div>
          </div>
          {(isDone || isFailed) && (
            <button
              onClick={onDismiss}
              className="text-zinc-500 hover:text-zinc-300 transition-colors shrink-0 mt-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Steps */}
        <div className="space-y-1.5">
          {PIPELINE_STEPS.map((step, i) => {
            const done = i < upload.step;
            const active = i === upload.step && !isDone && !isFailed;
            return (
              <div key={i} className="flex items-center gap-2 text-[10px] font-mono">
                {done && <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />}
                {active && <Loader2 className="h-3 w-3 text-blue-400 animate-spin shrink-0" />}
                {!done && !active && <div className="h-3 w-3 rounded-full border border-zinc-700 shrink-0" />}
                <span className={done ? 'text-zinc-400' : active ? 'text-white' : 'text-zinc-600'}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {/* Result message */}
        {isDone && (
          <div className="flex items-center gap-2 pt-1 border-t border-zinc-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-[11px] font-semibold text-emerald-400">
              Successfully indexed — {upload.chunks} chunks created
            </span>
          </div>
        )}
        {isFailed && (
          <div className="flex items-center gap-2 pt-1 border-t border-zinc-800">
            <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
            <span className="text-[11px] font-semibold text-rose-400">
              Parse failed — corrupt file structure
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main page component ───────────────────────────────────────────────────────
export default function DocumentUpload() {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [documents, setDocuments] = useState(SEED_DOCS);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [activeUpload, setActiveUpload] = useState(null);

  // ── Drag handlers ────────────────────────────────────────────────────────────
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) triggerUploadSim(file);
  }, []);

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) triggerUploadSim(file);
    e.target.value = '';
  };

  // ── Upload simulation ────────────────────────────────────────────────────────
  const triggerUploadSim = (file) => {
    const ext = file.name.split('.').pop().toUpperCase();
    const typeMap = { PDF: 'PDF', PNG: 'Image', JPG: 'Image', JPEG: 'Image', DOCX: 'DOCX' };
    const type = typeMap[ext] || 'DOCX';
    const sizeMB = (file.size / 1024 / 1024).toFixed(2);
    const sizeLabel = sizeMB < 0.1 ? `${Math.round(file.size / 1024)} KB` : `${sizeMB} MB`;

    const nameLower = file.name.toLowerCase();
    const willFail = nameLower.includes('fake') || nameLower.includes('hack') || nameLower.includes('compromised');
    const isPartial = nameLower.includes('warning') || nameLower.includes('edit') || nameLower.includes('caution');

    const uploadEntry = {
      id: Date.now(),
      name: file.name,
      size: sizeLabel,
      type,
      step: 0,
      failed: false,
    };

    setActiveUpload(uploadEntry);

    // Step through pipeline
    let step = 0;
    const advance = () => {
      step += 1;
      if (willFail && step === 2) {
        setActiveUpload((prev) => ({ ...prev, step, failed: true }));
        // Add failed doc to table
        const failedDoc = {
          id: Date.now(),
          name: file.name,
          type,
          size: sizeLabel,
          pages: 0,
          chunks: 0,
          uploadedAt: new Date().toISOString().split('T')[0],
          status: 'failed',
          score: 0,
          owner: 'Alex Carter',
        };
        setDocuments((prev) => [failedDoc, ...prev]);
        return;
      }
      setActiveUpload((prev) => ({ ...prev, step }));
      if (step < PIPELINE_STEPS.length) {
        setTimeout(advance, 900 + Math.random() * 400);
      } else {
        // Done — add to documents
        const chunks = isPartial ? 8 : Math.floor(Math.random() * 30) + 18;
        const score = isPartial ? 67 : Math.floor(Math.random() * 5) + 94;
        const status = isPartial ? 'partial' : 'indexed';
        const newDoc = {
          id: Date.now(),
          name: file.name,
          type,
          size: sizeLabel,
          pages: Math.floor(Math.random() * 20) + 4,
          chunks,
          uploadedAt: new Date().toISOString().split('T')[0],
          status,
          score,
          owner: 'Alex Carter',
        };
        setActiveUpload((prev) => ({ ...prev, step, chunks }));
        setDocuments((prev) => [newDoc, ...prev]);
      }
    };

    setTimeout(advance, 800);
  };

  // ── Delete ────────────────────────────────────────────────────────────────────
  const confirmDelete = () => {
    setDocuments((prev) => prev.filter((d) => d.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  // ── Filtering ─────────────────────────────────────────────────────────────────
  const filtered = documents.filter((doc) => {
    const matchSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.owner.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || doc.type === typeFilter;
    const matchStatus = statusFilter === 'All' || doc.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  // ── Stats ─────────────────────────────────────────────────────────────────────
  const totalDocs = documents.length;
  const indexedCount = documents.filter((d) => d.status === 'indexed').length;
  const partialCount = documents.filter((d) => d.status === 'partial').length;
  const failedCount = documents.filter((d) => d.status === 'failed').length;
  const totalChunks = documents.reduce((acc, d) => acc + d.chunks, 0);

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-900 pb-5">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Documents
          </h1>
          <p className="text-zinc-400 text-xs mt-1">
            Upload, manage, and search all your indexed documents in one place.
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center justify-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-lg shadow-lg shadow-blue-500/10 transition-all hover:scale-[1.01] active:scale-[0.99] self-start tracking-wider uppercase"
        >
          <FilePlus className="h-4 w-4" />
          Upload Document
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.docx"
          className="hidden"
          onChange={handleFileInput}
        />
      </div>

      {/* ── Summary stats ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Documents', value: totalDocs, icon: HardDrive, color: 'text-blue-400', bg: 'bg-blue-500/8 border-blue-500/20' },
          { label: 'Indexed', value: indexedCount, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/8 border-emerald-500/20' },
          { label: 'Partial Index', value: partialCount, icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/8 border-amber-500/20' },
          { label: 'Vector Chunks', value: totalChunks.toLocaleString(), icon: Layers, color: 'text-violet-400', bg: 'bg-violet-500/8 border-violet-500/20' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="rounded-xl border border-zinc-800/80 bg-zinc-900/10 p-4 flex items-center gap-3 hover:border-zinc-700 transition-colors">
            <div className={`h-9 w-9 rounded-lg border ${bg} flex items-center justify-center shrink-0`}>
              <Icon className={`h-4.5 w-4.5 ${color}`} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{label}</p>
              <p className="text-lg font-bold text-white font-mono leading-tight">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Drag-and-drop zone ───────────────────────────────────────────────── */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 p-8 flex flex-col items-center justify-center gap-3 group
          ${dragActive
            ? 'border-blue-500 bg-blue-950/12 scale-[1.005]'
            : 'border-zinc-800 bg-zinc-900/8 hover:border-zinc-700 hover:bg-zinc-900/15'
          }`}
      >
        {/* Animated glow ring on drag */}
        {dragActive && (
          <div className="absolute inset-0 rounded-2xl border-2 border-blue-500/40 animate-pulse pointer-events-none" />
        )}

        <div className={`h-14 w-14 rounded-2xl border flex items-center justify-center transition-all duration-200
          ${dragActive
            ? 'border-blue-500/40 bg-blue-500/15 text-blue-400'
            : 'border-zinc-800 bg-zinc-900 text-zinc-500 group-hover:border-zinc-700 group-hover:text-zinc-400'
          }`}
        >
          <UploadCloud className="h-6 w-6" />
        </div>

        <div className="text-center">
          <p className="text-sm font-bold text-white">
            {dragActive ? 'Release to upload' : 'Drag & drop your document here'}
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            Supports PDF, DOCX, PNG, JPG — up to 50 MB per file
          </p>
        </div>

        <div className="flex items-center gap-3 mt-1">
          <div className="h-px w-12 bg-zinc-800" />
          <span className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest">or</span>
          <div className="h-px w-12 bg-zinc-800" />
        </div>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
          className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg shadow-md shadow-blue-500/15 transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wider"
        >
          Browse Files
        </button>

        <p className="text-[10px] text-zinc-600 mt-1">
          Accepted: PDF · DOCX · PNG · JPG · JPEG
        </p>
      </div>

      {/* ── Search + filter bar ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents by name or owner…"
            className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-zinc-700 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 outline-none transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Type filter pills */}
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-[11px] font-semibold shrink-0">
          {['All', 'PDF', 'DOCX', 'Image'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                typeFilter === t ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="relative shrink-0">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs rounded-xl py-2.5 pl-9 pr-8 outline-none focus:border-zinc-700 cursor-pointer font-semibold"
          >
            <option value="All">All Statuses</option>
            <option value="indexed">Indexed</option>
            <option value="partial">Partial</option>
            <option value="failed">Failed</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
        </div>
      </div>

      {/* ── Document table ───────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/8 overflow-hidden">
        {filtered.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="h-14 w-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
              <FolderOpen className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">No documents found</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                {search || typeFilter !== 'All' || statusFilter !== 'All'
                  ? 'Try adjusting your search or filters to find what you\'re looking for.'
                  : 'Upload your first document using the drop zone above.'}
              </p>
            </div>
            {(search || typeFilter !== 'All' || statusFilter !== 'All') && (
              <button
                onClick={() => { setSearch(''); setTypeFilter('All'); setStatusFilter('All'); }}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/8 hover:bg-blue-500/12 border border-blue-500/15 px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Reset filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              {/* thead */}
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-5">Document</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Type</th>
                  <th className="py-3 px-4 hidden md:table-cell">Pages</th>
                  <th className="py-3 px-4 hidden lg:table-cell">Uploaded</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 hidden md:table-cell">Accuracy</th>
                  <th className="py-3 px-4 hidden sm:table-cell text-center">Chunks</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>

              {/* tbody */}
              <tbody className="divide-y divide-zinc-900">
                {filtered.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-zinc-900/25 transition-colors group"
                  >
                    {/* Name + icon */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <FileTypeIcon type={doc.type} size="sm" />
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate max-w-[160px] sm:max-w-[200px]">
                            {doc.name}
                          </p>
                          <p className="text-[10px] text-zinc-500 mt-0.5">{doc.size}</p>
                        </div>
                      </div>
                    </td>

                    {/* Type badge */}
                    <td className="py-3.5 px-4 hidden sm:table-cell">
                      <span className="font-mono text-[10px] font-semibold text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                        {doc.type}
                      </span>
                    </td>

                    {/* Pages */}
                    <td className="py-3.5 px-4 hidden md:table-cell text-zinc-400 font-mono">
                      {doc.pages > 0 ? `${doc.pages}p` : '—'}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 hidden lg:table-cell font-mono text-zinc-500">
                      {doc.uploadedAt}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusPill status={doc.status} />
                    </td>

                    {/* Accuracy bar */}
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      {doc.status !== 'failed' ? (
                        <ScoreBar score={doc.score} />
                      ) : (
                        <span className="text-[10px] text-zinc-600 font-mono">—</span>
                      )}
                    </td>

                    {/* Chunks */}
                    <td className="py-3.5 px-4 hidden sm:table-cell text-center font-mono text-zinc-300">
                      {doc.chunks > 0 ? doc.chunks : <span className="text-zinc-600">—</span>}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to="/chat"
                          className="p-1.5 rounded-lg hover:bg-zinc-900 text-zinc-500 hover:text-blue-400 transition-colors"
                          title="Chat with document"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          onClick={() => alert(`Downloading integrity certificate for ${doc.name}`)}
                          className="p-1.5 rounded-lg hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300 transition-colors"
                          title="Download certificate"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(doc)}
                          className="p-1.5 rounded-lg hover:bg-rose-950/25 text-zinc-500 hover:text-rose-400 transition-colors"
                          title="Delete document"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Table footer row count */}
            <div className="px-5 py-3 border-t border-zinc-900 flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 font-medium">
                Showing{' '}
                <span className="text-zinc-300 font-semibold">{filtered.length}</span> of{' '}
                <span className="text-zinc-300 font-semibold">{documents.length}</span> documents
              </span>
              <Link
                to="/history"
                className="text-[10px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 group/link transition-colors"
              >
                Full audit log
                <ArrowUpRight className="h-3 w-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ── Upload progress toast ────────────────────────────────────────────── */}
      {activeUpload && (
        <UploadToast
          upload={activeUpload}
          onDismiss={() => setActiveUpload(null)}
        />
      )}

      {/* ── Delete confirmation modal ────────────────────────────────────────── */}
      {deleteTarget && (
        <DeleteModal
          doc={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
