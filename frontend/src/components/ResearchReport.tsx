import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { BookOpen, Copy, Check, Loader2, Wand2 } from 'lucide-react';
import { fetchReport } from '../api/client';

export const ResearchReport: React.FC = () => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await fetchReport();
      setReport(data.report);
    } catch (err) {
      console.error(err);
      alert('Failed to generate report.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!report) return;
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass rounded-3xl shadow-soft overflow-hidden">
      <div className="p-8 border-b border-slate-100/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white rounded-xl shadow-sm border border-blue-100">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">AI Research Synthesis</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">Automated Intelligence Report</p>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />}
          {report ? 'Regenerate Analysis' : 'Generate Full Report'}
        </button>
      </div>

      <div className="p-8">
        {!report && !loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400 blur-2xl opacity-20 animate-pulse-soft" />
              <div className="relative bg-white p-6 rounded-3xl shadow-xl border border-blue-50">
                <BookOpen className="w-12 h-12 text-blue-500" />
              </div>
            </div>
            <div className="max-w-md flex flex-col gap-2">
              <p className="text-xl font-black text-slate-900">Synthesize Market Intelligence</p>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Connect to our neural engine to generate a multi-dimensional research report based on current market metrics, predictive scores, and author concentration.
              </p>
            </div>
          </div>
        ) : loading ? (
          <div className="py-28 flex flex-col items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" />
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">AI is synthesizing ecosystem data...</p>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={handleCopy}
              className="absolute -right-2 -top-2 p-3 text-slate-400 hover:text-blue-600 bg-white/50 backdrop-blur rounded-xl border border-slate-100 transition-all shadow-sm hover:shadow-md"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <article className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-slate-600 prose-strong:text-blue-700 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 prose-blockquote:py-2 prose-blockquote:rounded-r-xl">
              <ReactMarkdown>{report!}</ReactMarkdown>
            </article>
          </div>
        )}
      </div>
    </div>
  );
};
