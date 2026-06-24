import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Send, 
  Sparkles, 
  HelpCircle, 
  ChevronRight, 
  UploadCloud, 
  Terminal, 
  BookOpen, 
  Globe, 
  ArrowRight,
  Brain,
  Search,
  Check,
  Zap
} from 'lucide-react';

export default function LandingPage() {
  const [demoState, setDemoState] = useState('idle'); // idle -> uploading -> indexed -> asking -> answering -> done
  const [logs, setLogs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const startDemoSim = () => {
    setDemoState('uploading');
    const stepLogs = [
      { text: 'Parsing PDF structures and layouts...', status: 'loading' },
      { text: 'Generating semantic document chunks...', status: 'pending' },
      { text: 'Calculating vector embeddings via API...', status: 'pending' },
      { text: 'Indexing chunks into vector database...', status: 'pending' }
    ];
    setLogs(stepLogs);

    // sequential step ticking
    setTimeout(() => {
      setLogs(prev => {
        const next = [...prev];
        next[0].status = 'success';
        next[1].status = 'loading';
        return next;
      });

      setTimeout(() => {
        setLogs(prev => {
          const next = [...prev];
          next[1].status = 'success';
          next[2].status = 'loading';
          return next;
        });

        setTimeout(() => {
          setLogs(prev => {
            const next = [...prev];
            next[2].status = 'success';
            next[3].status = 'loading';
            return next;
          });

          setTimeout(() => {
            setLogs(prev => {
              const next = [...prev];
              next[3].status = 'success';
              return next;
            });
            setDemoState('indexed');
          }, 800);
        }, 800);
      }, 800);
    }, 800);
  };

  const triggerQuestionSim = () => {
    setDemoState('asking');
    const userMsg = {
      sender: 'user',
      text: 'How many annual leave days are employees entitled to?'
    };
    setMessages([userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setDemoState('answering');
      const aiMsg = {
        sender: 'ai',
        text: 'Employees are entitled to 18 annual leave days. [1]',
        citations: [
          { id: 1, docName: 'Employee Handbook.pdf', page: 7, snippet: 'Section 4.1 - Annual Leave Entitlements: Permanent full-time staff members are entitled to 18 working days of annual leave per calendar year.' }
        ]
      };
      setMessages(prev => [...prev, aiMsg]);
      setDemoState('done');
    }, 1500);
  };

  const resetDemo = () => {
    setDemoState('idle');
    setLogs([]);
    setMessages([]);
    setIsTyping(false);
  };

  return (
    <div className="relative overflow-hidden w-full">
      
      {/* Decorative Glows */}
      <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none -z-10 animate-pulse-glow"></div>
      <div className="absolute top-[30%] right-[5%] w-[400px] h-[400px] rounded-full bg-indigo-600/5 blur-[100px] pointer-events-none -z-10 animate-pulse-glow" style={{ animationDelay: '2s' }}></div>

      {/* Hero Section */}
      <section className="pt-24 pb-16 text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-semibold mb-6">
          <Brain className="w-3.5 h-3.5" />
          RAG Document Intelligence Suite
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.12]">
          Enterprise AI <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            Document Intelligence
          </span>
        </h1>
        
        <p className="text-base text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          Upload documents, ask questions, and get trusted AI answers with citations.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg shadow-lg shadow-blue-500/10 transition-all hover:scale-[1.01] active:scale-[0.99] tracking-wider uppercase"
          >
            Upload Documents
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#demo"
            className="w-full sm:w-auto inline-flex items-center justify-center text-xs font-bold text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-6 py-3 rounded-lg transition-all tracking-wider uppercase"
          >
            Try Demo
          </a>
        </div>
      </section>

      {/* Interactive Demo Playground (PDF upload left, AI Chat right) */}
      <section id="demo" className="py-20 bg-zinc-950/40 border-y border-zinc-900 px-4 scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest font-mono">Interactive Sandbox</span>
            <h2 className="text-2xl font-bold text-white mt-2 mb-3">RAG Retrieval Playground</h2>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">See how DocuTrust AI parses layout structures, builds chunks, and yields citation answers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[400px]">
            
            {/* Left Side: PDF Upload Interface */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/10 p-5 flex flex-col justify-between overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                    <span className="text-[10px] text-zinc-500 font-mono tracking-wider">PDF INDEX MANAGER</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">Sandbox</span>
                </div>

                {demoState === 'idle' && (
                  <div 
                    onClick={startDemoSim}
                    className="border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[220px]"
                  >
                    <UploadCloud className="w-8 h-8 text-zinc-550 mb-3" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Select Sample PDF</span>
                    <p className="text-[10px] text-zinc-500 mt-2 max-w-[200px]">
                      Click to load <span className="text-blue-400 font-bold">Employee Handbook.pdf</span> (2.4 MB)
                    </p>
                  </div>
                )}

                {demoState === 'uploading' && (
                  <div className="space-y-4 min-h-[220px] flex flex-col justify-center">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-zinc-400">Vector Index Log</span>
                      <span className="text-blue-400 animate-pulse">Processing...</span>
                    </div>
                    <div className="space-y-2 rounded-lg bg-zinc-950 border border-zinc-900 p-3.5 font-mono text-[10px]">
                      {logs.map((log, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          {log.status === 'success' && <span className="text-emerald-500">[✓]</span>}
                          {log.status === 'loading' && <span className="text-blue-500 animate-spin">[-]</span>}
                          {log.status === 'pending' && <span className="text-zinc-700">[ ]</span>}
                          <span className={`${
                            log.status === 'success' ? 'text-zinc-350' :
                            log.status === 'loading' ? 'text-white console-cursor' : 'text-zinc-650'
                          }`}>{log.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(demoState === 'indexed' || demoState === 'asking' || demoState === 'answering' || demoState === 'done') && (
                  <div className="rounded-xl bg-zinc-950 border border-zinc-900 p-4 space-y-4 min-h-[220px]">
                    <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
                      <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-850 flex items-center justify-center text-zinc-400 shrink-0">
                        <FileText className="w-4.5 h-4.5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">Employee Handbook.pdf</h4>
                        <p className="text-[9px] text-zinc-550">14 Pages • 2.4 MB • Indexed</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 font-mono text-[9px] text-zinc-400">
                      <div className="flex justify-between">
                        <span className="text-zinc-600">Total Chunks</span>
                        <span className="text-zinc-300">42 extracted chunks</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-600">Embeddings</span>
                        <span className="text-zinc-350">text-embedding-3-small</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-600">Index Status</span>
                        <span className="text-emerald-400 font-semibold">Active & Queriable</span>
                      </div>
                    </div>

                    {demoState === 'indexed' && (
                      <button
                        onClick={triggerQuestionSim}
                        className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 py-2 rounded-lg transition-colors uppercase tracking-wider"
                      >
                        Ask Question
                      </button>
                    )}
                  </div>
                )}
              </div>

              {demoState === 'done' && (
                <div className="flex justify-end pt-3">
                  <button onClick={resetDemo} className="text-[10px] text-zinc-500 hover:text-white font-mono">
                    Reset Sandbox
                  </button>
                </div>
              )}
            </div>

            {/* Right Side: AI Chat Interface */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/10 flex flex-col justify-between overflow-hidden">
              <div className="bg-zinc-950/50 px-4 py-3 border-b border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">AI Citation Agent</span>
                </div>
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-zinc-600 font-mono text-[10px]">
                    {demoState === 'idle' ? 'Upload handbook on left to activate chat.' : 
                     demoState === 'uploading' ? 'Waiting for vector index compilation...' : 'Click "Ask Question" on left.'}
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`flex flex-col max-w-[90%] ${
                        msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${
                        msg.sender === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-zinc-950 border border-zinc-850 text-zinc-200 rounded-tl-none shadow-sm'
                      }`}>
                        <p className="leading-normal">{msg.text}</p>
                        
                        {msg.citations && (
                          <div className="mt-3 border-t border-zinc-900/80 pt-2 space-y-1.5 font-mono text-[9px]">
                            <span className="text-zinc-550 font-bold uppercase tracking-widest text-[8px]">Source Citation</span>
                            {msg.citations.map((cite, i) => (
                              <div key={i} className="space-y-1 text-zinc-400 bg-zinc-900/20 p-2 rounded border border-zinc-900">
                                <div className="flex justify-between text-blue-400 font-semibold">
                                  <span>[{cite.id}] {cite.docName}</span>
                                  <span>Page {cite.page}</span>
                                </div>
                                <p className="text-[8px] text-zinc-550 leading-relaxed italic">"{cite.snippet}"</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}

                {isTyping && (
                  <div className="mr-auto items-start max-w-[85%]">
                    <div className="bg-zinc-950 border border-zinc-850 text-zinc-350 p-2.5 rounded-xl rounded-tl-none flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="h-1.5 w-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="h-1.5 w-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Placeholder */}
              <div className="p-3.5 border-t border-zinc-800 bg-[#09090b]/40 flex gap-2">
                <input
                  type="text"
                  disabled
                  placeholder={demoState === 'done' ? 'Audit complete' : 'Waiting for prompt...'}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-[11px] text-zinc-500 placeholder-zinc-650 outline-none"
                />
                <button
                  type="button"
                  disabled
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-850 text-zinc-500 shrink-0"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 border-t border-zinc-900 max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Core Capabilities</span>
          <h2 className="text-2xl font-bold text-white mt-2 mb-3">AI RAG Search Infrastructure</h2>
          <p className="text-zinc-400 text-sm max-w-md mx-auto">High-performance vector search engine designed for rapid document intelligence lookup.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/10 p-6 hover:border-zinc-700 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">Multi-Format Parsing</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Accepts PDF, DOCX, and images. Performs deep layout structure extraction, OCR text isolation, and cataloging.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/10 p-6 hover:border-zinc-700 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">Semantic Vector Indexing</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Splits text into overlapping chunks, generates high-dimension vector embeddings, and stores index maps in a low-latency database.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/10 p-6 hover:border-zinc-700 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">Citation Answering</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Retrieves target document chunks, constructs conversational AI responses, and returns exact page and section citations.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-10 mt-10 text-center text-xs text-zinc-500 max-w-5xl mx-auto px-4">
        <p>© 2026 DocuTrust AI Technologies Inc. All rights reserved. Powered by RAG Document Intelligence.</p>
      </footer>

    </div>
  );
}
