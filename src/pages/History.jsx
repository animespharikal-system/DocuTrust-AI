import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Trash2, 
  MessageSquare, 
  Download, 
  ChevronDown,
  Clock,
  HardDrive,
  FileSpreadsheet,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';

export default function History() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [historyItems, setHistoryItems] = useState([
    { id: 1, name: 'Vendor_Agreement_Q3.pdf', hash: '2E91FFD02319A9', category: 'PDF', date: '2026-06-24', status: 'verified', score: 98, size: '248 KB' },
    { id: 2, name: 'Financial_Statement_Final.pdf', hash: '8BCA02C937EA90', category: 'PDF', date: '2026-06-23', status: 'verified', score: 99, size: '4.8 MB' },
    { id: 3, name: 'Invoice_Redacted_1.png', hash: 'AA82BC9D810AEF', category: 'Image', date: '2026-06-22', status: 'caution', score: 68, size: '1.2 MB' },
    { id: 4, name: 'Contract_Draft_v2.docx', hash: 'EEFA01A29DFF09', category: 'Word', date: '2026-06-20', status: 'compromised', score: 12, size: '320 KB' },
    { id: 5, name: 'NDA_Consulting_Sarah.pdf', hash: '5B10CE28C91A0F', category: 'PDF', date: '2026-06-18', status: 'verified', score: 96, size: '185 KB' },
    { id: 6, name: 'Identity_Proof_Sarah.jpeg', hash: '9A2BC3C9D010FA', category: 'Image', date: '2026-06-18', status: 'verified', score: 95, size: '2.4 MB' },
    { id: 7, name: 'Q2_Corporate_Lease.pdf', hash: '883C901AF20E18', category: 'PDF', date: '2026-06-15', status: 'caution', score: 71, size: '8.1 MB' },
    { id: 8, name: 'Fake_Receipt_Refund.png', hash: 'FC991DA029CC1E', category: 'Image', date: '2026-06-12', status: 'compromised', score: 8, size: '940 KB' },
  ]);

  const handleDelete = (id) => {
    setHistoryItems(prev => prev.filter(item => item.id !== id));
  };

  const filteredItems = historyItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.hash.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-zinc-900 pb-5">
        <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">Audit History Logs</h1>
        <p className="text-zinc-400 text-xs mt-1">Locate and filter all historical document verifications, download certificate hashes, or audit via AI chat.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch">
        
        {/* Search Input (Notion Command style) */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search documents by title or blockchain hash index..."
            className="w-full bg-zinc-900/60 border border-zinc-800 focus:border-zinc-700 rounded-lg py-2 pl-9 pr-12 text-xs text-white placeholder-zinc-500 outline-none transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-[9px] font-mono text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-850">
            <span>Ctrl</span>
            <span>K</span>
          </div>
        </div>

        {/* Category Tabs / Filters */}
        <div className="flex flex-wrap gap-2.5 items-center">
          
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-[11px] font-semibold">
            {['All', 'PDF', 'Word', 'Image'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  categoryFilter === cat 
                    ? 'bg-zinc-850 text-white' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs rounded-lg py-2 pl-9 pr-8 outline-none focus:border-zinc-750 appearance-none cursor-pointer font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="verified">Verified</option>
              <option value="caution">Caution</option>
              <option value="compromised">Compromised</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
          </div>

        </div>

      </div>

      {/* History Database View */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/10 p-5 overflow-hidden">
        
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 text-zinc-500 space-y-4">
            <div className="h-12 w-12 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center mx-auto text-zinc-650">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-white text-xs uppercase tracking-wider">No audit logs found</p>
              <p className="text-[11px] text-zinc-550 max-w-xs mx-auto leading-relaxed">
                We could not locate any reports matching your current query filters. Click 'Reset filters' to clear search fields.
              </p>
            </div>
            <button 
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('All');
                setStatusFilter('All');
              }}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-400">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Document Name</th>
                  <th className="py-3 px-4 hidden md:table-cell">Cryptographic Hash</th>
                  <th className="py-3 px-4 hidden sm:table-cell">File Size</th>
                  <th className="py-3 px-4">Audit Date</th>
                  <th className="py-3 px-4">Trust Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 font-medium">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-900/30 transition-colors">
                    
                    <td className="py-3.5 px-4 font-semibold text-white max-w-[150px] truncate sm:max-w-xs">
                      {item.name}
                    </td>
                    
                    <td className="py-3.5 px-4 hidden md:table-cell font-mono text-[10px] text-zinc-500">
                      {item.hash}
                    </td>

                    <td className="py-3.5 px-4 hidden sm:table-cell text-zinc-500">
                      {item.size}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-zinc-500">
                      {item.date}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-semibold text-zinc-200">
                      {item.score}%
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Link
                          to="/chat"
                          className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-blue-400 transition-colors"
                          title="Audit Chat"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                          title="Download Security Certificate"
                          onClick={() => alert(`Downloading cryptographic certificate receipt for ${item.name}`)}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded hover:bg-rose-950/20 text-zinc-550 hover:text-rose-400 transition-colors"
                          title="Delete Log"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}
