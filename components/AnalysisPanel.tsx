import React from 'react';
import { Bot, MapPin, ExternalLink, Loader2 } from 'lucide-react';
import { AnalysisResult, AppStatus } from '../types';
import ReactMarkdown from 'react-markdown';

interface AnalysisPanelProps {
  status: AppStatus;
  result: AnalysisResult | null;
  onAnalyze: () => void;
  hasLocation: boolean;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ status, result, onAnalyze, hasLocation }) => {
  const isAnalyzing = status === AppStatus.ANALYZING;

  return (
    <div className="h-full flex flex-col bg-slate-900/50 border-l border-slate-800 w-full lg:w-96 backdrop-blur-md">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Bot className="text-purple-400" />
          Location Intelligence
        </h2>
        <p className="text-xs text-slate-500 mt-1">Powered by Gemini 2.5 Flash & Google Maps</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
        {!result && !isAnalyzing && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
            <MapPin size={48} className="text-slate-600" />
            <p className="text-sm text-slate-400 max-w-[200px]">
              Acquire GPS signal to analyze surroundings.
            </p>
          </div>
        )}

        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <Loader2 className="animate-spin text-cyan-400" size={32} />
            <p className="text-sm text-cyan-400 animate-pulse">Analyzing terrain and data...</p>
          </div>
        )}

        {result && !isAnalyzing && (
          <div className="space-y-6">
             <div className="text-xs font-mono text-slate-500 border-b border-slate-800 pb-2">
              REPORT GENERATED: {result.timestamp.toLocaleTimeString()}
            </div>
            
            <div className="prose prose-invert prose-sm max-w-none prose-p:text-slate-300 prose-headings:text-slate-100 prose-li:text-slate-300 prose-strong:text-white">
              <ReactMarkdown>{result.text}</ReactMarkdown>
            </div>

            {result.sources.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Citations & Places</h4>
                <div className="grid gap-2">
                  {result.sources.map((source, idx) => (
                    <a
                      key={idx}
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700 hover:border-slate-600 transition-all group"
                    >
                      <MapPin size={14} className="text-red-400 shrink-0" />
                      <span className="text-sm text-slate-300 truncate group-hover:text-white transition-colors">{source.title}</span>
                      <ExternalLink size={12} className="ml-auto text-slate-600 group-hover:text-slate-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-800">
        <button
          onClick={onAnalyze}
          disabled={!hasLocation || isAnalyzing}
          className={`
            w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold transition-all
            ${!hasLocation 
              ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
              : isAnalyzing 
                ? "bg-slate-800 text-slate-400 cursor-wait" 
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/25 active:scale-95"}
          `}
        >
          {isAnalyzing ? (
            <>Processing...</>
          ) : (
            <>
              <Bot size={18} />
              Analyze Surroundings
            </>
          )}
        </button>
      </div>
    </div>
  );
};