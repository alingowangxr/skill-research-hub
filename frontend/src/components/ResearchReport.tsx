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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">AI Research Insights</h2>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all shadow-md shadow-blue-100 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
          {report ? 'Regenerate Analysis' : 'Generate Full Report'}
        </button>
      </div>

      <div className="p-6">
        {!report && !loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center gap-4">
            <div className="bg-blue-50 p-4 rounded-full">
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
            <div className="max-w-xs">
              <p className="text-gray-600 font-medium">Ready to analyze the market?</p>
              <p className="text-gray-400 text-sm mt-1">Click the button above to generate a professional AI-powered research report.</p>
            </div>
          </div>
        ) : loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-blue-600">
            <Loader2 className="w-10 h-10 animate-spin" />
            <p className="font-medium animate-pulse">AI is synthesizing data and writing report...</p>
          </div>
        ) : (
          <div className="relative group">
            <button
              onClick={handleCopy}
              className="absolute right-0 top-0 p-2 text-gray-400 hover:text-blue-600 bg-gray-50 rounded-md transition-colors"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <article className="prose prose-blue prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-strong:text-blue-700 prose-li:text-gray-600">
              <ReactMarkdown>{report!}</ReactMarkdown>
            </article>
          </div>
        )}
      </div>
    </div>
  );
};
